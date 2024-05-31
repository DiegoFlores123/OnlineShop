const db = require('../database/db');

const getAllProducts = callback => {
    db.query('SELECT * FROM productos', callback);
};

const searchProductsByName = (name, callback) => {
    const query = 'SELECT * FROM productos WHERE nombre LIKE ?';
    db.query(query, [`%${name}%`], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};

const updateProductsStock = (stockMap, callback) => {
    const queries = [];
    for (const [id, cantidad] of Object.entries(stockMap)) {
        queries.push(`UPDATE productos SET cantidad = ${cantidad} WHERE id = ${id}`);
    }
    db.query(queries.join('; '), callback);
};

module.exports = { getAllProducts, updateProductsStock, searchProductsByName };
