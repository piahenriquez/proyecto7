#  Proyecto eCommerce: Cerámicas Felices

Una moderna aplicación de comercio electrónico para la venta de macetas y piezas de cerámica artesanales. Desarrollada con **React** y **Material UI** para el *frontend*, y utilizando **Stripe** para gestionar las pasarelas de pago.

##  Características Principales

###  Frontend
- **Framework**: React.js con Vite
- **UI Library**: Material-UI (MUI)
- **Estado Global**: Context API + useReducer
- **Ruteo**: React Router DOM
- **HTTP Client**: Axios

###  Backend
- **Plataforma**: Node.js con Express
- **Base de datos**: MongoDB con Mongoose
- **Autenticación**: JWT (JSON Web Tokens)
- **Pasarela de pago**: Stripe Integration


###  Funcionalidades de Seguridad
- Autenticación JWT con refresh tokens
- Validación de formularios
- Protección de rutas privadas


## 🛠️ Tecnologías Utilizadas

### Frontend
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.8.0",
  "@mui/material": "^5.11.0",
  "axios": "^1.3.0",
  "context": "Estado global personalizado"
}
``` 

### Backend
```json
{
  "express": "^4.18.0",
  "mongoose": "^6.8.0",
  "jsonwebtoken": "^9.0.0",
  "stripe": "^11.0.0",
  "bcryptjs": "^2.4.3",
  "cors": "^2.8.5"
}
```
##  Probar el proyecto

Sigue estos pasos para levantar el proyecto en tu entorno local.

### 1. Clonar el Repositorio

```bash
git clone 
cd 
```
# Instala las dependencias del backend y del front end 
```bash
npm install
```
# Configurar variables de entorno importante 
# Backend
```bash
PORT=3005
MONGODB_URI=
SECRET=
STRIPE_SECRET_KEY=
STRIPE_SUCCESS_URL=
STRIPE_CANCEL_URL=
```
# Frontend
```bash
VITE_BACKEND_URL=
```
# Ejecutar 
```bash
npm run dev
```
