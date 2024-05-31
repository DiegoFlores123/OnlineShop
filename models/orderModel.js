const db = require('../database/db');

const getUserOrders = (userId, callback) => {
    db.query('SELECT * FROM facturas WHERE clienteId = (SELECT id FROM clientes WHERE usuarioId = ?)', [userId], callback);
};

const createOrder = (clienteId, total, productos, callback) => {
    db.query('INSERT INTO facturas (fecha, total, clienteId) VALUES (NOW(), ?, ?)', [total, clienteId], (err, results) => {
        if (err) return callback(err);

        const facturaId = results.insertId;
        productos.forEach(producto => {
            db.query('INSERT INTO productos_factura (facturaId, productoId, cantidad) VALUES (?, ?, ?)', [facturaId, producto.id, producto.cantidad]);
        });

        callback(null, results);
    });
};

module.exports = { getUserOrders, createOrder };