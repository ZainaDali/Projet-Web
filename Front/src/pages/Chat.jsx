import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_MESSAGES, GET_ME } from '../graphql/queries';
import { ENQUEUE_MESSAGE } from '../graphql/mutations';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import socket from '../socket';

export default function Chat() {
  const { conversationId } = useParams();
  const { data: meData, loading: meLoading } = useQuery(GET_ME);
  const userId = meData?.me?.id;
  const [messageContent, setMessageContent] = useState('');

  const { loading, error, data, refetch } = useQuery(GET_MESSAGES, {
    variables: { conversationId },
  });

  useEffect(() => {
    socket.on('connect', () => {
      console.log('✅ WebSocket connecté');
    });

    socket.on('messageReceived', (message) => {
      console.log('📨 Nouveau message via WebSocket :', message);
      refetch(); // recharge les messages
    });

    return () => {
      socket.off('messageReceived');
      socket.off('connect');
    };
  }, []);

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

  return (
    <div className="chat-container">
      <h2>Conversation</h2>
      <div className="messages">
        {data?.getMessages?.map((msg, index) => (
          <Card key={index} className="message-card">
            <p>{msg.content}</p>
            <p className="timestamp">
              {new Date(msg.createdAt).toLocaleString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </p>

          </Card>
        ))}
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
  );
}
