import React, { useState, useMemo } from 'react';
import { LogEntry } from '../../types.ts';
import { TrashIcon, ChevronDownIcon, ChevronUpIcon } from './icons.tsx';

interface ActivityLogProps {
  logs: LogEntry[];
  onClearLogs: () => void;
}

type SortKey = keyof LogEntry;
type SortOrder = 'asc' | 'desc';

const getActionColor = (action: string) => {
    const lowerAction = action.toLowerCase();
    if (lowerAction.includes('create') || lowerAction.includes('add') || lowerAction.includes('connect')) return 'bg-green-500/20 text-green-300';
    if (lowerAction.includes('delete') || lowerAction.includes('remove') || lowerAction.includes('clear')) return 'bg-red-500/20 text-red-300';
    if (lowerAction.includes('update') || lowerAction.includes('edit') || lowerAction.includes('rename')) return 'bg-blue-500/20 text-blue-300';
    if (lowerAction.includes('move')) return 'bg-yellow-500/20 text-yellow-300';
    if (lowerAction.includes('login') || lowerAction.includes('logout')) return 'bg-purple-500/20 text-purple-300';
    return 'bg-gray-500/20 text-gray-300';
};

export const ActivityLog: React.FC<ActivityLogProps> = ({ logs, onClearLogs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; order: SortOrder }>({ key: 'timestamp', order: 'desc' });

  const filteredLogs = useMemo(() => {
    return logs.filter(log =>
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.details && Object.values(log.details).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase())))
    );
  }, [logs, searchTerm]);

  const sortedLogs = useMemo(() => {
    let sortableLogs = [...filteredLogs];
    if (sortConfig !== null) {
      sortableLogs.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.order === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.order === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableLogs;
  }, [filteredLogs, sortConfig]);

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

  const formatDate = (dateString: string) => new Date(dateString).toLocaleString();
  
  const formatDetails = (details: Record<string, any> | undefined) => {
    if (!details) return 'N/A';
    return Object.entries(details)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
  };

  return (
    <div className="bg-[var(--bg-tertiary)] p-6 rounded-2xl">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Activity Log</h3>
          <p className="text-sm text-[var(--text-muted)]">An audit trail of all actions within the application.</p>
        </div>
        <button
          onClick={() => { if (confirm('Are you sure you want to clear the entire activity log? This cannot be undone.')) onClearLogs(); }}
          className="flex items-center gap-2 bg-red-600/80 text-white font-medium py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
        >
          <TrashIcon />
          Clear Log
        </button>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search logs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[var(--bg-interactive)] border border-[var(--border-primary)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-purple-500 transition-colors"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-[var(--text-muted)]">
          <thead className="text-xs text-[var(--text-primary)] uppercase bg-[var(--bg-interactive)]">
            <tr>
              {['timestamp', 'user', 'action', 'details'].map((key) => (
                <th key={key} scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort(key as SortKey)}>
                  <div className="flex items-center gap-1">
                    {key}
                    {getSortIcon(key as SortKey)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedLogs.map(log => (
              <tr key={log.id} className="border-b border-[var(--border-primary)] hover:bg-[var(--bg-interactive-hover)]">
                <td className="px-6 py-4 whitespace-nowrap">{formatDate(log.timestamp)}</td>
                <td className="px-6 py-4 font-medium text-[var(--text-primary)]">{log.user}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getActionColor(log.action)}`}>
                    {log.action}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs max-w-sm truncate" title={formatDetails(log.details)}>{formatDetails(log.details)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       {sortedLogs.length === 0 && (
            <div className="text-center py-8 text-[var(--text-muted)]">
                No logs found.
            </div>
        )}
    </div>
  );
};