// Cargar variables de entorno
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const Product = require('./models/Product');

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

// Ruta de prueba para productos
app.get("/api/test", (req, res) => {
    res.json({ 
        message: " Ruta de productos funcionando",
        data: []
    });
});


// Iniciar el servidor
app.listen(PORT, () => {
    console.log(` Servidor corriendo en http://localhost:${PORT}`);
});