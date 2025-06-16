import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_MESSAGES, GET_ME } from '../graphql/queries';
import { ENQUEUE_MESSAGE } from '../graphql/mutations';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import socket from '../socket';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function Chat() {
  const { conversationId } = useParams();
  const { data: meData, loading: meLoading } = useQuery(GET_ME);
  const userId = meData?.me?.id;
  const [messageContent, setMessageContent] = useState('');

  const { loading, error, data, refetch } = useQuery(GET_MESSAGES, {
    variables: { conversationId },
  });
  
  const { id } = useParams(); // /chat/:id
  const location = useLocation();
  const { ID, otherUsername } = location.state || {};


  useEffect(() => {
  const handleMessage = (message) => {
    console.log("📨 Nouveau message :", message);

    if (message.conversationId === conversationId) {
      refetch(); // recharge uniquement si c’est le bon salon
    }
  };

  socket.on('messageReceived', handleMessage);

  return () => {
    socket.off('messageReceived', handleMessage);
  };
}, [conversationId, refetch]);


  const [enqueueMessage] = useMutation(ENQUEUE_MESSAGE);


  const handleSendMessage = async () => {
    if (!messageContent.trim()) return;

    try {
      await enqueueMessage({
      variables: {
        data: {
          content: messageContent,
          senderId: userId,
          conversationId,
        },
      },
    });
      setMessageContent('');
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message :', error);
    }
  };

  if (loading || meLoading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error.message}</p>;
  console.log('Messages:', data, userId);
  return (
     <div className="flex">
          <div className="sidebar">
            <Sidebar />
          </div>
    <div className="chat-container">
      <h2>Conversation {otherUsername}</h2>
      <div className="messages">
        {data?.getMessages?.map((msg, index) => {
        const isMe = msg.senderId === userId;

        return (
          <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
             <div key={index} className={`message ${isMe ? 'me' : 'other'}`}>
              <p className="text-sm">{msg.content}</p>
              <p className="text-xs text-right mt-1 opacity-70">
                {new Date(msg.createdAt).toLocaleString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit',
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
        );
        })}

      </div>
      <div className="input-container">
        <InputText
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          placeholder="Écrire un message..."
        />
        <Button label="Envoyer" onClick={handleSendMessage} />
      </div>
    </div>
    </div>
  );
}
