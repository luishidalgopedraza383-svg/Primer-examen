const Producto = require('../models/Producto');
const { Op } = require('sequelize');

exports.obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.findAll();
    return res.status(200).json(productos);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al obtener los productos', error: error.message });
  }
};

exports.buscarProductos = async (req, res) => {
  try {
    const { nombre } = req.query;
    if (!nombre) {
      const productos = await Producto.findAll();
      return res.status(200).json(productos);
    }

    const productos = await Producto.findAll({
      where: {
        nombre: {
          [Op.like]: `%${nombre}%`
        }
      }
    });

    return res.status(200).json(productos);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al buscar productos', error: error.message });
  }
};

exports.obtenerProductoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    return res.status(200).json(producto);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al consultar el producto', error: error.message });
  }
};

exports.crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, estado } = req.body;

    // Validaciones
    if (!nombre || nombre.trim() === '') {
      return res.status(400).json({ mensaje: 'El campo nombre es obligatorio' });
    }
    if (precio === undefined || isNaN(precio) || parseFloat(precio) <= 0) {
      return res.status(400).json({ mensaje: 'El precio es obligatorio y debe ser mayor a 0' });
    }
    if (stock === undefined || isNaN(stock) || parseInt(stock) < 0) {
      return res.status(400).json({ mensaje: 'El stock es obligatorio y debe ser no negativo' });
    }

    const nuevoProducto = await Producto.create({
      nombre: nombre.trim(),
      descripcion,
      precio: parseFloat(precio),
      stock: parseInt(stock),
      estado: estado !== undefined ? estado : true
    });

    return res.status(201).json(nuevoProducto);
  } catch (error) {
    return res.status(400).json({ mensaje: 'Error al registrar el producto', error: error.message });
  }
};

exports.actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock, estado } = req.body;

    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    // Validaciones
    if (!nombre || nombre.trim() === '') {
      return res.status(400).json({ mensaje: 'El campo nombre es obligatorio' });
    }
    if (precio === undefined || isNaN(precio) || parseFloat(precio) <= 0) {
      return res.status(400).json({ mensaje: 'El precio es obligatorio y debe ser mayor a 0' });
    }
    if (stock === undefined || isNaN(stock) || parseInt(stock) < 0) {
      return res.status(400).json({ mensaje: 'El stock es obligatorio y debe ser no negativo' });
    }

    await producto.update({
      nombre: nombre.trim(),
      descripcion,
      precio: parseFloat(precio),
      stock: parseInt(stock),
      estado: estado !== undefined ? estado : producto.estado
    });

    return res.status(200).json(producto);
  } catch (error) {
    return res.status(400).json({ mensaje: 'Error al actualizar el producto', error: error.message });
  }
};

exports.eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    await producto.destroy();
    return res.status(200).json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al eliminar el producto', error: error.message });
  }
};