import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../graphql/mutations';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Card } from 'primereact/card';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loginUser, { loading }] = useMutation(LOGIN_USER);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await loginUser({
        variables: {
          data: {
            username: formData.username,
            password: formData.password
          }
        }
      });

      localStorage.setItem('token', data.login); // login retourne un token
      setSuccess('Connexion réussie !');
      setError(null);
      navigate('/Profile'); // ou autre page
    } catch (err) {
      setError(err.message);
      setSuccess(null);
    }
  };

  return (
    <div className="flex justify-content-center align-items-center min-h-screen bg-gray-100 p-4">
      <Card title="Connexion" style={{ width: '100%', maxWidth: '400px' }}>
        <form onSubmit={handleSubmit} className="p-fluid">
          <div className="field">
            <label htmlFor="username">Nom d'utilisateur</label>
            <InputText id="username" name="username" value={formData.username} onChange={handleChange} required />
          </div>

          <div className="field">
            <label htmlFor="password">Mot de passe</label>
            <Password id="password" name="password" value={formData.password} onChange={handleChange} toggleMask required />
          </div>

          <Button type="submit" label="Se connecter" className="mt-3" loading={loading} />

          {success && <Message severity="success" text={success} className="mt-3" />}
          {error && <Message severity="error" text={error} className="mt-3" />}
        </form>
        <div className="mt-3 text-center">
          <span>Pas encore de compte ? </span>
          <a href="/register" className="text-blue-600 hover:underline">S'inscrire ici</a>
        </div>
      </Card>
    </div>
  );
}
