// controllers/orderController.js
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function createOrder(req, res) {
    const productos = req.body.productos;

    // Verificar si los productos están en el formato adecuado
    if (!Array.isArray(productos)) {
        return res.status(400).json({ error: "Items must be an array" });
    }

    let connection;

    try {
        // Verificar el token de autorización y extraer el id del cliente
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const clienteId = decoded.id;

        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        await connection.beginTransaction();

        // Verificar que el cliente exista
        const [clienteRows] = await connection.execute('SELECT id FROM clientes WHERE id = ?', [clienteId]);
        if (clienteRows.length === 0) {
            throw new Error(`Cliente con id ${clienteId} no encontrado`);
        }

        let total = 0;

        for (const producto of productos) {
            const productId = producto.id;
            const cantidad = producto.cantidad;

            // Obtener el precio del producto
            const [rows] = await connection.execute('SELECT precio FROM productos WHERE id = ?', [productId]);
            if (rows.length === 0) {
                throw new Error(`Producto con id ${productId} no encontrado`);
            }

            const precio = rows[0].precio;
            total += precio * cantidad;

            await connection.query('UPDATE productos SET cantidad = cantidad - ? WHERE id = ?', [cantidad, productId]);
        }

        // Insertar una nueva factura en la tabla de facturas
        console.log('Insertando factura:', { clienteId, total });
        await connection.execute('INSERT INTO facturas (clienteId, fecha, total) VALUES (?, NOW(), ?)', [clienteId, total]);

        await connection.commit();
        await connection.end();

        res.status(200).json({ message: 'La orden se hizo exitosamente y la factura se creó.' });

    } catch (error) {
        console.error('Error:', error);
        if (connection) {
            await connection.rollback();
            await connection.end();
        }
        res.status(500).json({ error: 'Ocurrió un error al hacer la orden.' });
    }
}

module.exports = { createOrder };
