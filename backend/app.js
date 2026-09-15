const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const productoRoutes = require('./routes/productoRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/productos', productoRoutes);

// Conexión a la base de datos e inicio del servidor
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Conexión exitosa a SQL Server vía Sequelize.');
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error al conectar con la base de datos:', err);
  });