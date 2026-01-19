const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTRO
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        
        res.status(201).json({ message: "Usuario creado con éxito" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        console.log(req.body)
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Usuario no encontrado" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Contraseña incorrecta" });

        // Crear el Token (el "ticket" de acceso)
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        res.json({ token, user: { id: user._id, username: user.username } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;