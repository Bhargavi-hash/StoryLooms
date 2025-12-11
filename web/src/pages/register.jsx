import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import { API_BASE } from '../config';
import RegisterForm from '../components/RegisterForm';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    if (response.ok) {
      alert('Registration successful');
      navigate('/login');
    } else {
      alert('Registration failed');
    }
  };

  return (
    <RegisterForm
      username={username}
      setUsername={setUsername}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
}

export default Register;
