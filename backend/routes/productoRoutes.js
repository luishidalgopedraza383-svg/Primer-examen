const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');

// La ruta /buscar debe ir antes de /:id para evitar choques de parámetros
router.get('/buscar', productoController.buscarProductos);
router.get('/', productoController.obtenerProductos);
router.get('/:id', productoController.obtenerProductoPorId);
router.post('/', productoController.crearProducto);
router.put('/:id', productoController.actualizarProducto);
router.delete('/:id', productoController.eliminarProducto);

module.exports = router;