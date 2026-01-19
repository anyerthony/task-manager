import { useState, useEffect } from 'react';
import Login from './Login';

function App() {
  const [tasks, setTasks] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('tokenTest'));

  const fetchTasks = async () => {
    const token = localStorage.getItem('tokenTest');
    try {
      const response = await fetch('http://localhost:3000/api/tasks', {
        headers: { 
          'Authorization': `Bearer ${token}` // <--- ENVIAMOS EL TOKEN
        }
      });
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else if (response.status === 401) {
        handleLogout(); // Token expirado o inválido
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const [newTaskTitle, setNewTaskTitle] = useState('');

  const deleteTask = async(id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/tasks/${id}`,{
        method: 'DELETE'
      })
      fetchTasks();
    } catch (error) {
      console.error("Error al eliminar la tarea",error);
    }
  }

  

  const completarTask = async(id,estado) => {
    try {
      const response = await fetch(`http://localhost:3000/api/tasks/${id}`,{
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ completed: estado })
      })
      alert(`se ha fijado el estado de la tarea con id ${id} en ${estado}`)
      fetchTasks();
    } catch (error) {
      console.error("Error al modificar la tarea",error);
    }
  }

  const addTask = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('tokenTest');
    
    try {
      const response = await fetch('http://localhost:3000/api/tasks', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ title: newTaskTitle })
      });

      if (response.ok) {
        setNewTaskTitle(''); // Limpiamos el input
        fetchTasks(); // Recargamos la lista para ver la nueva tarea
      } else if (response.status == 401) {
        handleLogout();
      }
    } catch (error) {
      console.error("Error al añadir tarea:", error);
    }
};

  useEffect(() => {
    if (isLoggedIn) fetchTasks();
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('tokenTest');
    setIsLoggedIn(false);
    setTasks([]);
  };

  if (!isLoggedIn) {
    return <Login onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Mis Tareas ✅</h1>
      <button onClick={handleLogout}>Cerrar Sesión</button>
      
      <form onSubmit={addTask} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
      <input 
        type="text" 
        value={newTaskTitle} 
        onChange={(e) => setNewTaskTitle(e.target.value)}
        placeholder="¿Qué hay que hacer?"
        required
        style={{ flex: 1, padding: '8px' }}
      />
      <button type="submit" style={{ background: '#28a745', color: 'white', border: 'none', padding: '8px 15px' }}>
        Añadir
      </button>
    </form>

      <ul>
        {tasks.map(
          task => <li key={task._id}>{task.title} 
            <button onClick={() => completarTask(task._id,!task.completed)} >{task.completed ? 'Deshacer':'Completar'}</button>  - 
            <button onClick={() => deleteTask(task._id)} >Del</button> </li>)}
      </ul>
    </div>
  );
}

export default App;