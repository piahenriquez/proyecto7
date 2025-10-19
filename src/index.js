// Cargar variables de entorno
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

// Importar rutas
const userRoutes = require("./routes/users.Routes");
const productRoutes = require("./routes/product.Routes");
const cartRoutes = require("./routes/cart.Routes");
const favoritesRoutes = require('./routes/favorites.Routes');
const commentRoutes = require('./routes/comment.Routes');

const PORT = process.env.PORT || 3005;

const app = express();

// Conectar a la base de datos
connectDB();

// Configuración CORS 
const allowedOrigins = [
    'http://localhost:5173',
];

// Middlewares
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("No permitido por CORS"));
        }
    },
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Ruta de prueba
app.get("/", (req, res) => {
    res.json({ 
        message: "API de Cerámicas Felices funcionando!",
        version: "1.0.0"
    });
});

// Rutas
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/comments", commentRoutes);

app.use("/api/carts", cartRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(` Servidor corriendo en http://localhost:${PORT}`);
});