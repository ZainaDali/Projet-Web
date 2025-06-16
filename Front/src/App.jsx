import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import CreateConversation from './pages/CreateConversation';
import Chat from './pages/Chat';
import Conversations from './pages/Conversations';
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/Profile" element={<Profile />} />
      <Route path="/createconversation" element={<CreateConversation />} />
      <Route path="/chat/:conversationId" element={<Chat />} />
      <Route path="Conversations" element={<Conversations />} />
    </Routes> 
  );
}
