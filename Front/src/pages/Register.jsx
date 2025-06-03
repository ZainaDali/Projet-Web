import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { REGISTER_USER } from '../graphql/mutations';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Card } from 'primereact/card';
import { Link } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [registerUser, { loading }] = useMutation(REGISTER_USER);
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
      const { data } = await registerUser({ variables: formData });
      setSuccess("Inscription réussie !");
      setError(null);
      localStorage.setItem("token", data.register.token);
    } catch (err) {
      setError(err.message);
      setSuccess(null);
    }
  };

  return (
    <div className="flex justify-content-center align-items-center min-h-screen bg-gray-100 p-4">
      <Card title="Créer un compte" style={{ width: '100%', maxWidth: '400px' }}>
        <form onSubmit={handleSubmit} className="p-fluid">
          <div className="field">
            <label htmlFor="username">Nom d'utilisateur</label>
            <InputText id="username" name="username" value={formData.username} onChange={handleChange} required />
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <InputText id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="field">
            <label htmlFor="password">Mot de passe</label>
            <Password id="password" name="password" value={formData.password} onChange={handleChange} toggleMask required />
          </div>

          <Button type="submit" label="S'inscrire" className="mt-3" loading={loading} />

          {success && <Message severity="success" text={success} className="mt-3" />}
          {error && <Message severity="error" text={error} className="mt-3" />}
        </form>
      <div className="mt-3 text-center">
        <span>Déjà un compte ? </span>
        <a href="/login" className="text-blue-600 hover:underline">Se connecter ici</a>
      </div>

      </Card>
    </div>
  );
}
