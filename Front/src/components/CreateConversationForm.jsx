import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_CONVERSATION } from '../graphql/mutations';

export default function CreateConversationForm({ onCreated }) {
  const [participant, setParticipant] = useState('');
  const [participants, setParticipants] = useState([]);
  const [userId, setUserId] = useState('');

  const [createConversation] = useMutation(CREATE_CONVERSATION, {
    onCompleted: (data) => {
      setParticipant('');
      setParticipants([]);
      onCreated?.(data.createConversation.id); // callback pour actualiser la vue
    }
  });

  useEffect(() => {
    const id = localStorage.getItem('userId');
    if (id) setUserId(id);
  }, []);

  const handleAdd = () => {
    if (participant && !participants.includes(participant) && participant !== userId) {
      setParticipants([...participants, participant]);
      setParticipant('');
    }
  };

  const handleCreate = () => {
    const fullList = [...participants, userId]; // inclut le user actuel
    createConversation({ variables: { input: { participants: fullList } } });
  };

  return (
    <div className="border p-3 rounded mb-4 bg-gray-50">
      <h3 className="font-bold mb-2">Créer une conversation</h3>
      <div className="flex gap-2 mb-2">
        <input
          className="border p-1 flex-1 rounded"
          placeholder="Ajouter un utilisateur"
          value={participant}
          onChange={(e) => setParticipant(e.target.value)}
        />
        <button onClick={handleAdd} className="bg-gray-200 px-2 rounded">+</button>
      </div>
      <div className="text-sm mb-2 text-gray-600">
        Participants : {participants.join(', ')}
      </div>
      <button
        onClick={handleCreate}
        className="bg-green-500 text-white px-4 py-1 rounded"
        disabled={participants.length === 0}
      >
        Créer
      </button>
    </div>
  );
}
