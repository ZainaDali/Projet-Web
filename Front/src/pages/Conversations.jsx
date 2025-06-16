import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_ME, GET_MY_CONVERSATIONS } from '../graphql/queries';
import Sidebar from '../components/Sidebar';
import { Link, useNavigate } from 'react-router-dom';

export default function Conversations() {
  const navigate = useNavigate();

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
  console.log('Conversations:', conversations);
  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="sidebar">
        <Sidebar />
      </div>

      {/* Contenu principal */}
      <div className="flex-1 p-8 ml-64">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Mes conversations</h2>
          
        </div>

        {conversations.length === 0 ? (
          <p>Aucune conversation trouvée.</p>
        ) : (
          <ul className="space-y-6">
            {conversations.map((conv) => {
              const otherParticipant = conv.participants.find(
                (p) => p.username !== meData?.me?.username
              );

              return (
                <li key={conv.id} className="border p-4 rounded shadow">
                  <strong className="text-lg">{conv.title || '(Sans titre)'}</strong>
                  <p className="text-sm text-gray-400">
                    Participants : {
                      conv.participants
                        .filter(p => p.username !== meData?.me?.username)
                        .map(p => p.username)
                        .join(', ')
                    }
                  </p>
                  <p>Dernier message : {conv.messages[0]?.content || 'Aucun message'}</p>
                  <button
                    onClick={() => navigate(`/chat/${conv.id}`, {
                      state: {
                        conversationId: conv.id,
                        otherUsername: otherParticipant?.username,
                      }
                    })}

                    className="mt-3 inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                  >
                    Ouvrir la conversation
                  </button>
                </li>
              );
            })}

          </ul>
        )}
      </div>
    </div>
  );
}
