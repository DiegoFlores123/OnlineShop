const express = require('express');
const productController = require('../controllers/productController');
const authenticateJWT = require('../middleware/authenticateJWT');

const router = express.Router();

router.get("/", authenticateJWT.isLoggedIn, (req, res, next) => {
    productController.getProducts(req, res);
});

router.get('/search/:name', authenticateJWT.isLoggedIn, (req, res, next) => {
    productController.searchProducts(req, res);
});

module.exports = router;
