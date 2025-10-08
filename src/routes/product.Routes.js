const express = require("express");
const router = express.Router();

//importar las funciones del controlador
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/product.Controller");

//rutas de productos
router.get("/", getProducts); //obtener todos los productos

//obtener un producto por id
router.get("/:id", getProductById);

//crear un nuevo producto
router.post("/", createProduct);

//actualizar un producto
router.put('/:id', updateProduct);

//eliminar un producto
router.delete('/:id', deleteProduct);

module.exports = router;