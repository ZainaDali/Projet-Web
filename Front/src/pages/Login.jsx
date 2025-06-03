import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../graphql/mutations';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Card } from 'primereact/card';
import { Link } from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loginUser, { loading }] = useMutation(LOGIN_USER);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await loginUser({ variables: formData });
      setSuccess("Connexion réussie !");
      setError(null);
      localStorage.setItem("token", data.login.token);
      window.location.href = "/home";
    } catch (err) {
      setError(err.message);
      setSuccess(null);
    }
  };

  return (
    <div className="flex justify-content-center align-items-center min-h-screen bg-gray-100">
      <Card
        title="Se connecter"
        className="p-4 shadow-3"
        
      >
        <form onSubmit={handleSubmit} className="p-fluid">
          <div className="field mb-4">
            <label htmlFor="email" className="block mb-2">Email</label>
            <InputText id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="field mb-4">
            <label htmlFor="password" className="block mb-2">Mot de passe</label>
            <Password id="password" name="password" value={formData.password} onChange={handleChange} toggleMask required />
          </div>

          <div className="mb-3">
            <Button type="submit" label="Connexion" loading={loading} className="w-full" />
          </div>

          {success && <Message severity="success" text={success} className="mb-3" />}
          {error && <Message severity="error" text={error} className="mb-3" />}
        </form>

        <div className="text-center mt-3">
          <small>Pas de compte ? <Link to="/register" className="text-blue-500">S’inscrire ici</Link></small>
        </div>
      </Card>
    </div>
  );
}
