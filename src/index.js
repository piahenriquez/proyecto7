// Cargar variables de entorno
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const productRoutes = require("./routes/product.Routes");

// Inicializar la app
const app = express();
const PORT = process.env.PORT || 3005;

// Conectar a la base de datos
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
    res.json({ 
        message: "API de Cerámicas Felices funcionando!",
        version: "1.0.0"
    });
});

// rutas de productos
app.use("/api/products", productRoutes);


// Iniciar el servidor
app.listen(PORT, () => {
    console.log(` Servidor corriendo en http://localhost:${PORT}`);
});