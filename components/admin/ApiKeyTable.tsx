import React, { useState, useMemo, useCallback } from 'react';
import { ApiKey } from '../../types.ts';
import { TrashIcon, UserPlusIcon, ChevronDownIcon, ChevronUpIcon, CheckCircleIcon, AlertTriangleIcon } from './icons.tsx';

interface ApiKeyTableProps {
  keys: ApiKey[];
  onAddKey: () => void;
  onManageKey: (key: ApiKey) => void;
  onDeleteKey: (keyId: string) => void;
  onDeleteApiKeys: (keyIds: string[]) => void;
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

const HealthStatus: React.FC<{ status: ApiKey['healthCheckStatus'] }> = ({ status }) => {
    if (!status || status === 'checking') return <span className="text-xs text-blue-400">Checking...</span>;
    if (status === 'valid') return <div className="flex items-center gap-1 text-xs text-green-400"><CheckCircleIcon className="w-4 h-4" /> Valid</div>;
    if (status === 'invalid') return <div className="flex items-center gap-1 text-xs text-red-400"><AlertTriangleIcon className="w-4 h-4" /> Invalid</div>;
    return <span className="text-xs text-gray-400">Not checked</span>;
};


export const ApiKeyTable: React.FC<ApiKeyTableProps> = ({ keys, onAddKey, onManageKey, onDeleteKey, onDeleteApiKeys, onUpdateKeyStatus }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; order: SortOrder }>({ key: 'createdAt', order: 'desc' });
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

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
  
  const handleSelectAll = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
        setSelectedKeys(sortedKeys.map(k => k.id));
    } else {
        setSelectedKeys([]);
    }
  }, [sortedKeys]);

  const handleSelectOne = useCallback((keyId: string) => {
      setSelectedKeys(prev => prev.includes(keyId) ? prev.filter(id => id !== keyId) : [...prev, keyId]);
  }, []);

  const handleBulkDelete = () => {
      if (confirm(`Are you sure you want to delete ${selectedKeys.length} selected keys?`)) {
          onDeleteApiKeys(selectedKeys);
          setSelectedKeys([]);
      }
  };
  
  const isAllSelected = sortedKeys.length > 0 && selectedKeys.length === sortedKeys.length;

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
        {selectedKeys.length > 0 && (
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl p-2 flex items-center justify-between mb-4 animate-fade-in-down">
                <span className="text-sm font-medium px-2">{selectedKeys.length} item(s) selected</span>
                <div className="flex items-center gap-2">
                    <button onClick={handleBulkDelete} className="flex items-center gap-2 hover:bg-[var(--bg-interactive-hover)] text-sm font-medium py-1 px-3 rounded-lg transition-colors text-red-400">
                        <TrashIcon />Delete Selected
                    </button>
                </div>
            </div>
        )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-[var(--text-muted)]">
          <thead className="text-xs text-[var(--text-primary)] uppercase bg-[var(--bg-interactive)]">
            <tr>
              <th scope="col" className="p-4">
                <input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-600 ring-offset-gray-800 focus:ring-2" />
              </th>
              {['name', 'provider', 'key', 'status', 'createdAt', 'lastUsed'].map((key) => (
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
            {sortedKeys.map(apiKey => {
              const createdAt = new Date(apiKey.createdAt);
              const isOld = (Date.now() - createdAt.getTime()) > 90 * 24 * 60 * 60 * 1000;
              return (
              <tr key={apiKey.id} className={`border-b border-[var(--border-primary)] ${selectedKeys.includes(apiKey.id) ? 'bg-purple-900/50' : 'hover:bg-[var(--bg-interactive-hover)]'}`}>
                <td className="p-4">
                    <input type="checkbox" checked={selectedKeys.includes(apiKey.id)} onChange={() => handleSelectOne(apiKey.id)} className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-600 ring-offset-gray-800 focus:ring-2" />
                </td>
                <td className="px-6 py-4 font-medium text-[var(--text-primary)]">{apiKey.name}</td>
                <td className="px-6 py-4">{apiKey.provider}</td>
                <td className="px-6 py-4 font-mono">{maskApiKey(apiKey.key)}</td>
                <td className="px-6 py-4">
                  <ToggleSwitch checked={apiKey.status === 'active'} onChange={(checked) => onUpdateKeyStatus(apiKey, checked ? 'active' : 'inactive')} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span>{formatDate(apiKey.createdAt)}</span>
                    {/* Fix: Wrap icon in a span with a title attribute to resolve TS error and provide a tooltip. */}
                    {isOld && <span title="This key is over 90 days old. Consider rotating it for security."><AlertTriangleIcon className="w-4 h-4 text-yellow-400 cursor-help" /></span>}
                  </div>
                </td>
                <td className="px-6 py-4">{formatDate(apiKey.lastUsed)}</td>
                <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-4">
                        <button onClick={() => onManageKey(apiKey)} className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                            Manage
                        </button>
                        <button onClick={() => { if(confirm(`Are you sure you want to delete the key "${apiKey.name}"?`)) onDeleteKey(apiKey.id) }} className="text-red-400 hover:text-red-300" aria-label={`Delete ${apiKey.name}`}>
                            <TrashIcon />
                        </button>
                    </div>
                </td>
              </tr>
            )})}
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