import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_MESSAGES, GET_ME } from '../graphql/queries';
import { SEND_MESSAGE } from '../graphql/mutations';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

export default function Chat() {
  const { conversationId } = useParams();
   const { data: meData, loading: meLoading } = useQuery(GET_ME);
  const userId = meData?.me?.id;
  const [messageContent, setMessageContent] = useState('');

  const { loading, error, data, refetch } = useQuery(GET_MESSAGES, {
    variables: { conversationId },
    pollInterval: 3000, // rafraîchit toutes les 3 secondes
  });

  const [sendMessage] = useMutation(SEND_MESSAGE);

  const handleSendMessage = async () => {
    if (!messageContent.trim()) return;

    try {
      await sendMessage({
        variables: {
          data: {
            content: messageContent,
            senderId: userId,
            conversationId: conversationId,
          },
        },
      });
      setMessageContent('');
      refetch(); // recharge les messages
    } catch (err) {
      console.error("Erreur lors de l'envoi :", err.message);
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur de chargement des messages.</p>;

  return (
    <div className="p-4">
      <h2>Conversation</h2>

      <div className="my-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {data.getMessages.map((msg) => (
          <Card
            key={msg.id}
            className={`mb-2 ${msg.senderId === userId ? 'bg-primary text-white' : 'bg-light'}`}
            style={{
              textAlign: msg.senderId === userId ? 'right' : 'left',
              marginLeft: msg.senderId === userId ? 'auto' : '0',
              maxWidth: '60%',
            }}
          >
            {msg.content}
            <div className="text-xs text-gray-600 mt-1">{new Date(msg.createdAt).toLocaleTimeString()}</div>
          </Card>
        ))}
      </div>

      <div className="flex gap-2 mt-4">
        <InputText
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          placeholder="Écrire un message..."
          className="flex-1"
        />
        <Button label="Envoyer" onClick={handleSendMessage} />
      </div>
    </div>
  );
}
