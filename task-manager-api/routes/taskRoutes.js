const express = require('express');
const router = express.Router();
const Task = require('../models/Tasks'); // Fíjate en los dos puntos (..) para subir de nivel
const auth = require('../middleware/auth'); // Importar el portero

// Obtener todas las tareas
router.get('/' ,auth , async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Crear una tarea
router.post('/',auth , async (req, res) => {
    const task = new Task({
        title: req.body.title,
        user: req.user.id // El ID que el portero sacó del Token
    });
    try {
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// Actualizar una tarea (marcar como completada o cambiar título)
router.put('/:id', async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true } // Esto devuelve la tarea ya actualizada, no la vieja
        );
        if (!updatedTask) return res.status(404).json({ message: 'Tarea no encontrada' });
        res.json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// Eliminar una tarea de la base de datos
router.delete('/:id', async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (!deletedTask) return res.status(404).json({ message: 'Tarea no encontrada' });
        res.json({ message: 'Tarea eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;








