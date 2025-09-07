

import React, { useState, useMemo } from 'react';
import { ApiKey } from '../../types.ts';
import { TrashIcon, EditIcon, UserPlusIcon, ChevronDownIcon, ChevronUpIcon } from './icons.tsx';

interface ApiKeyTableProps {
  keys: ApiKey[];
  onAddKey: () => void;
  onEditKey: (key: ApiKey) => void;
  onDeleteKey: (keyId: string) => void;
  onUpdateKeyStatus: (key: ApiKey, status: 'active' | 'inactive') => void;
}

type SortKey = keyof ApiKey;
type SortOrder = 'asc' | 'desc';

const ToggleSwitch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; }> = ({ checked, onChange }) => (
    <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${checked ? 'bg-green-600' : 'bg-[var(--bg-interactive-hover)]'}`}
    >
        <span
            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`}
        />
    </button>
);


export const ApiKeyTable: React.FC<ApiKeyTableProps> = ({ keys, onAddKey, onEditKey, onDeleteKey, onUpdateKeyStatus }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; order: SortOrder } | null>(null);

  const filteredKeys = useMemo(() => {
    return keys.filter(key =>
      key.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      key.provider.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [keys, searchTerm]);

  const sortedKeys = useMemo(() => {
    let sortableKeys = [...filteredKeys];
    if (sortConfig !== null) {
      sortableKeys.sort((a, b) => {
        const valA = a[sortConfig.key] || 0;
        const valB = b[sortConfig.key] || 0;
        if (valA < valB) {
          return sortConfig.order === 'asc' ? -1 : 1;
        }
        if (valA > valB) {
          return sortConfig.order === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableKeys;
  }, [filteredKeys, sortConfig]);

  const requestSort = (key: SortKey) => {
    let order: SortOrder = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.order === 'asc') {
      order = 'desc';
    }
    setSortConfig({ key, order });
  };
  
  const getSortIcon = (key: SortKey) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ChevronDownIcon className="w-4 h-4 opacity-30" />;
    }
    return sortConfig.order === 'asc' ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />;
  };

  const formatDate = (dateString: string | null) => {
      if (!dateString) return 'Never';
      try {
        return new Date(dateString).toLocaleString();
      } catch (e) {
          return 'Invalid Date';
      }
  };

  const maskApiKey = (key: string) => {
      if (key.length <= 8) return '••••••••';
      return `${key.slice(0, 4)}••••••••${key.slice(-4)}`;
  }

  return (
    <div className="bg-[var(--bg-tertiary)] p-6 rounded-2xl">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">API Key Management</h3>
          <p className="text-sm text-[var(--text-muted)]">Manage third-party API keys for custom models.</p>
        </div>
        <button onClick={onAddKey} className="flex items-center gap-2 bg-purple-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
            <UserPlusIcon />
            Add API Key
        </button>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or provider..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[var(--bg-interactive)] border border-[var(--border-primary)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-purple-500 transition-colors"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-[var(--text-muted)]">
          <thead className="text-xs text-[var(--text-primary)] uppercase bg-[var(--bg-interactive)]">
            <tr>
              {['name', 'provider', 'key', 'status', 'requestCount', 'tokenUsage', 'lastUsed'].map((key) => (
                <th key={key} scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort(key as SortKey)}>
                  <div className="flex items-center gap-1">
                    {key.replace(/([A-Z])/g, ' $1')}
                    {getSortIcon(key as SortKey)}
                  </div>
                </th>
              ))}
              <th scope="col" className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedKeys.map(apiKey => (
              <tr key={apiKey.id} className="border-b border-[var(--border-primary)] hover:bg-[var(--bg-interactive-hover)]">
                <td className="px-6 py-4 font-medium text-[var(--text-primary)]">{apiKey.name}</td>
                <td className="px-6 py-4">{apiKey.provider}</td>
                <td className="px-6 py-4 font-mono">{maskApiKey(apiKey.key)}</td>
                <td className="px-6 py-4">
                  <ToggleSwitch checked={apiKey.status === 'active'} onChange={(checked) => onUpdateKeyStatus(apiKey, checked ? 'active' : 'inactive')} />
                </td>
                <td className="px-6 py-4">{apiKey.requestCount}</td>
                <td className="px-6 py-4">{apiKey.tokenUsage.toLocaleString()}</td>
                <td className="px-6 py-4">{formatDate(apiKey.lastUsed)}</td>
                <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-4">
                        <button onClick={() => onEditKey(apiKey)} className="text-blue-400 hover:text-blue-300" aria-label={`Edit ${apiKey.name}`}>
                            <EditIcon />
                        </button>
                        <button onClick={() => { if(confirm(`Are you sure you want to delete the key "${apiKey.name}"?`)) onDeleteKey(apiKey.id) }} className="text-red-400 hover:text-red-300" aria-label={`Delete ${apiKey.name}`}>
                            <TrashIcon />
                        </button>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       {sortedKeys.length === 0 && (
            <div className="text-center py-8 text-[var(--text-muted)]">
                No API keys found.
            </div>
        )}
    </div>
  );
};