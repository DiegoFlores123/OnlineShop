const db = require('../database/db');

const registerUser = (email, hashedPassword, tipo, nombre, direccion, callback) => {
    db.query('CALL registrar_usuario(?, ?, ?, ?, ?)', [email, hashedPassword, tipo, nombre, direccion], callback);
};

const findUserByEmail = (email, callback) => {
    db.query('SELECT * FROM usuarios WHERE email = ?', [email], callback);
};

module.exports = { registerUser, findUserByEmail };