import { useState } from 'react';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Guardamos el token en el localStorage (memoria del navegador)
        localStorage.setItem('tokenTest', data.token);
        onLoginSuccess(); // Avisamos a App.jsx que ya estamos dentro
      } else {
        setError(data.message || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor');
    }
  };

  return (
    <div style={{ maxWidth: '300px', margin: 'auto', textAlign: 'center' }}>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="email" placeholder="Email" 
          onChange={(e) => setEmail(e.target.value)} required 
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
        />
        <input 
          type="password" placeholder="Password" 
          onChange={(e) => setPassword(e.target.value)} required 
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
        />
        <button type="submit" style={{ width: '100%', padding: '10px', background: '#007bff', color: 'white', border: 'none' }}>
          Entrar
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Login;