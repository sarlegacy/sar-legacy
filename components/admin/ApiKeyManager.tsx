import React, { useState } from 'react';
import { ApiKey } from '../../types.ts';
import { ApiKeyTable } from './ApiKeyTable.tsx';
import { ApiKeyModal } from './ApiKeyModal.tsx';

interface ApiKeyManagerProps {
  keys: ApiKey[];
  onAddKey: (key: Omit<ApiKey, 'id' | 'requestCount' | 'tokenUsage' | 'lastUsed'>) => void;
  onUpdateKey: (key: ApiKey) => void;
  onDeleteKey: (keyId: string) => void;
  // Fix: Add missing onDeleteApiKeys prop to satisfy ApiKeyTable's requirements.
  onDeleteApiKeys: (keyIds: string[]) => void;
}

export const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ keys, onAddKey, onUpdateKey, onDeleteKey, onDeleteApiKeys }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null);

  const handleOpenAddModal = () => {
    setEditingKey(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (key: ApiKey) => {
    setEditingKey(key);
    setIsModalOpen(true);
  };

  const handleSaveKey = (keyData: Omit<ApiKey, 'id' | 'requestCount' | 'tokenUsage' | 'lastUsed'> | ApiKey) => {
    if ('id' in keyData) {
      onUpdateKey(keyData);
    } else {
      onAddKey(keyData);
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <ApiKeyTable
        keys={keys}
        onAddKey={handleOpenAddModal}
        // Fix: Renamed 'onEditKey' to 'onManageKey' to match the ApiKeyTableProps interface.
        onManageKey={handleOpenEditModal}
        onDeleteKey={onDeleteKey}
        onDeleteApiKeys={onDeleteApiKeys}
        onUpdateKeyStatus={(key, status) => onUpdateKey({ ...key, status })}
      />
      {isModalOpen && (
        <ApiKeyModal
          apiKey={editingKey}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveKey}
        />
      )}
    </>
  );
};
