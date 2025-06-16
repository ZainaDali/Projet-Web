import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_ME, GET_MY_CONVERSATIONS } from '../graphql/queries';

export default function Conversations() {
  const { data: meData } = useQuery(GET_ME);
  const { data, loading, error } = useQuery(GET_MY_CONVERSATIONS, {
    context: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    },
  });

  if (loading) return <p>Chargement des conversations...</p>;
  if (error) return <p>Erreur : {error.message}</p>;

  const conversations = data?.myConversations || [];

  return (
    <div>
      <h2>Mes conversations</h2>
      {conversations.length === 0 ? (
        <p>Aucune conversation trouvée.</p>
      ) : (
        <ul>
          {conversations.map((conv) => (
            <li key={conv.id} style={{ marginBottom: '1em' }}>
              <strong>{conv.title || '(Sans titre)'}</strong>
              <br />
              Participants : {
                conv.participants
                  .filter(p => p.username !== meData?.me?.username)
                  .map(p => p.username)
                  .join(', ')
              }<br />
              Dernier message : {conv.messages[0]?.content || 'Aucun message'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
