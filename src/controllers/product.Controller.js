const product = require("../models/Product");

//obtener todos los productos
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find(); //encontrar todos los productos
        return res.json({
            message: "Lista de productos obtenida correctamente",
            data: products
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener los productos",
            error: error.message
        });
    }
};

//obtener un producto por id
exports.getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                message: "Producto no encontrado"
            });
        }
        return res.json({
            message: "Producto obtenido correctamente",
            data: product
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener el producto",
            error: error.message
        });
    }
};

//crear un nuevo producto
exports.createProduct = async (req, res) => {
    const { name, description, price, category, stock, image, featured } = req.body;
try {
    const newProduct = await Product.create({
        name,
        description,
        price,
        category,
        stock,
        image,
        featured
    });
    return res.status(201).json({
        message: "Producto creado correctamente",
        data: newProduct
    });
} catch (error) {
    return res.status(500).json({
        message: "Error al crear el producto", 
        error: error.message
    });
}
};

//actualizar un producto por id 
exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            req.body,
            {new: true} //para retornar el documento actualizado
        );

        if (!updatedProduct) {
            return res.status(404).json({
                message: "Producto no encontrado"
            });
        }
        return res.json({
            message: "Producto actualizado correctamente",
            data: updatedProduct
        });
    
    } catch (error) {
        return res.status(500).json({
            message: "Error al actualizar el producto",
            error: error.message
        });
    }
};
//eliminar un producto por id
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    
    if (!deletedProduct) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    return res.json({ 
      message: "Producto eliminado correctamente", 
      data: deletedProduct 
    });
  } catch (error) {
    return res.status(500).json({ 
      message: "Hubo un error al eliminar el producto", 
      error: error.message 
    });
  }
};