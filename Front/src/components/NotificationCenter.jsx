import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import socket from '../socket';

export default function NotificationCenter() {
  const location = useLocation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  // ID de conversation actuelle (s'il y en a une)
  const currentConversationId = location.pathname.includes('/chat/')
    ? location.pathname.split('/chat/')[1]
    : null;

  useEffect(() => {
    const handleMessage = (message) => {
      console.log("🔔 NotificationCenter - Message reçu :", message);

      // Si ce n’est pas la conversation affichée, on notifie
      if (message.conversationId !== currentConversationId) {
        const notif = {
          id: Date.now(),
          content: `${message.senderName || 'Quelqu’un'} : ${message.content}`,
          conversationId: message.conversationId,
        };

        setNotifications((prev) => [...prev, notif]);

        // Supprimer après 5 secondes
        setTimeout(() => {
          setNotifications((prev) => prev.filter((n) => n.id !== notif.id));
        }, 5000);
      }
    };

    socket.on('messageReceived', handleMessage);

    return () => {
      socket.off('messageReceived', handleMessage);
    };
  }, [currentConversationId]);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      {notifications.map((n) => (
        <div
          key={n.id}
          onClick={() => navigate(`/chat/${n.conversationId}`)}
          className="cursor-pointer bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-all"
        >
          <p className="font-semibold">💬 Nouveau message</p>
          <p className="text-sm">{n.content}</p>
        </div>
      ))}
    </div>
  );
}
