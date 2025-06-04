import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import Sidebar from '../components/Sidebar'; 
export default function Profile() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Redirige si non connecté
    } else {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.username);
      } catch (err) {
        console.error('Erreur de décodage du token:', err);
        navigate('/login');
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="flex">
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="content">
        <Card title="Bienvenue sur votre profil">
          <div className="flex items-center space-x-4">
            <i className="pi pi-user text-4xl"></i>
            <span className="text-xl font-semibold">{username}</span>
          </div>
          <Button label="Déconnexion" className="p-button-danger mt-4" onClick={handleLogout} />
        </Card>
      </div>
    </div>

  );
}
