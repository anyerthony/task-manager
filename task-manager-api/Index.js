
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const taskRoutes = require('./routes/taskRoutes'); // Importamos las rutas
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');


const app = express();

// Middlewares
app.use(cors())
app.use(express.json());

// Conexión a DB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Co  nectado a MongoDB'))
    .catch(err => console.error('❌ Error:', err));

// Rutas
app.use('/api/tasks', taskRoutes); // <-- Aquí ocurre la magia
app.use('/api/auth', authRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT}`));