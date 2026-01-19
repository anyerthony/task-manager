import { useState, useEffect } from 'react';
import Login from './Login';
import Register from './Register';
import './index.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [searchTerm, setSearchTerm] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  // 1. Efecto para cargar tareas automáticamente al loguear
  useEffect(() => {
    if (isLoggedIn) {
      fetchTasks();
    } else {
      setTasks([]); // Limpiar tareas al cerrar sesión
    }
  }, [isLoggedIn]);

  const fetchTasks = async () => {
    const token = localStorage.getItem('token');
    if (!token) return; 
    try {
      const response = await fetch('http://localhost:3000/api/tasks', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3000/api/tasks', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ title: newTaskTitle })
    });
    if (response.ok) {
      setNewTaskTitle('');
      fetchTasks();
    }
  };

  const completarTask = async (id, estado) => {
    try {
      await fetch(`http://localhost:3000/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !estado })
      });
      fetchTasks();
    } catch (error) {
      console.error("Error", error);
    }
  };

  const deleteTask = async (id) => {
    await fetch(`http://localhost:3000/api/tasks/${id}`, { method: 'DELETE' });
    fetchTasks();
  };

 const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setIsRegistering(false); // Resetear por si acaso
  };

  // Filtrado de tareas
  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 2. RENDERIZADO CONDICIONAL ÚNICO
  // Si NO está logueado, decidimos entre Login o Register
  if (!isLoggedIn) {
    return isRegistering ? (
      <Register 
        onRegisterSuccess={() => setIsRegistering(false)} 
        onSwitchToLogin={() => setIsRegistering(false)} 
      />
    ) : (
      <Login 
        onLoginSuccess={() => setIsLoggedIn(true)} 
        onSwitchToRegister={() => setIsRegistering(true)} 
      />
    );
  }

  // 3. Si SÍ está logueado, mostramos el Dashboard
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestor de Tareas</h1>
          <button 
            onClick={handleLogout}
            className="text-sm font-medium text-red-600 hover:text-red-800 transition"
          >
            Cerrar Sesión
          </button>
        </div>

        <p className="text-gray-500 text-sm mb-6">
          Tienes <span className="font-bold text-blue-600">{tasks.filter(t => !t.completed).length}</span> tareas pendientes de {tasks.length} en total.
        </p>

        {/* Formulario */}
        <form onSubmit={addTask} className="flex gap-2 mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <input 
            type="text" 
            value={newTaskTitle} 
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="¿Qué tienes pendiente?"
            className="flex-1 bg-transparent border-none focus:ring-0 text-gray-700 placeholder-gray-400"
            required
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition shadow-md">
            Añadir
          </button>
        </form>

        {/* Buscador */}
        <div className="mb-6">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input 
              type="text" 
              placeholder="Filtrar tareas..." 
              className="pl-10 w-full p-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Lista de Tareas */}
        <div className="space-y-3">
          {filteredTasks.map(task => (
            <div key={task._id} className={`flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border-l-4 transition-all ${task.completed ? 'border-green-400 opacity-75' : 'border-blue-500'}`}>
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  checked={task.completed} 
                  onChange={() => completarTask(task._id, task.completed)}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className={`text-gray-800 font-medium ${task.completed ? 'line-through text-gray-400' : ''}`}>
                  {task.title}
                </span>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => deleteTask(task._id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition"
                  title="Eliminar"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;