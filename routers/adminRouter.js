const express = require('express');
const adminController = require('../controllers/adminController');
const authenticateJWT = require('../middleware/authenticateJWT');

const router = express.Router();

router.get('/customers', authenticateJWT.isLoggedIn, adminController.getAllCustomers);
router.get('/products', authenticateJWT.isLoggedIn, adminController.getAllProducts);
router.put('/products/:id', authenticateJWT.isLoggedIn, adminController.updateProduct);
router.post('/products', authenticateJWT.isLoggedIn, adminController.addProduct);

module.exports = router;
