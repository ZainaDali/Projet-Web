import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_USERS } from '../graphql/queries';
import { CREATE_CONVERSATION } from '../graphql/mutations';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { useNavigate } from 'react-router-dom';
import { GET_ME } from '../graphql/queries';

export default function CreateConversation() {
  const navigate = useNavigate();
  const { data: meData, loading: meLoading } = useQuery(GET_ME);
  const myId = meData?.me?.id;
  console.log("Mon ID :", myId);
  const { loading, error, data } = useQuery(GET_ALL_USERS);
  const [createConversation] = useMutation(CREATE_CONVERSATION, {
  context: {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  },
});

  const [success, setSuccess] = useState(null);

  const handleCreateConversation = async (otherUserId) => {
    try {
      const response = await createConversation({
        variables: {
          data: {
            title: "Nouvelle conversation",
            participantIds: [myId, otherUserId],
          },
        },
      });

      const conversationId = response.data.createConversation.id;
      setSuccess("Conversation créée !");
      navigate(`/chat/${conversationId}`);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur lors du chargement des utilisateurs</p>;

  return (
    <div className="p-4">
      <h2>Créer une nouvelle conversation</h2>
      {success && <Message severity="success" text={success} className="my-3" />}
      {data.findAll
        .filter((user) => user.id !== myId)
        .map((user) => (
          <Card key={user.id} title={user.username} className="my-2">
            <Button
              label="Démarrer la conversation"
              icon="pi pi-comments"
              onClick={() => handleCreateConversation(user.id)}
            />
          </Card>
        ))}
    </div>
  );
}
