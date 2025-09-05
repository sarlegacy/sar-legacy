
import React, { useState, useMemo } from 'react';
import { User } from '../../types';
import { TrashIcon, EditIcon, UserPlusIcon, ChevronDownIcon, ChevronUpIcon } from '../icons';

interface UserManagementTableProps {
  users: User[];
  onAddUser: () => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
}

type SortKey = keyof User;
type SortOrder = 'asc' | 'desc';

export const UserManagementTable: React.FC<UserManagementTableProps> = ({ users, onAddUser, onEditUser, onDeleteUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; order: SortOrder } | null>(null);

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const sortedUsers = useMemo(() => {
    let sortableUsers = [...filteredUsers];
    if (sortConfig !== null) {
      sortableUsers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.order === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.order === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableUsers;
  }, [filteredUsers, sortConfig]);

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

  const formatDate = (dateString: string) => {
      try {
        return new Date(dateString).toLocaleString();
      } catch (e) {
          return 'Invalid Date';
      }
  };

  return (
    <div className="bg-[var(--bg-tertiary)] p-6 rounded-2xl">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">User Management</h3>
          <p className="text-sm text-[var(--text-muted)]">Manage all registered users in the system.</p>
        </div>
        <button onClick={onAddUser} className="flex items-center gap-2 bg-purple-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
            <UserPlusIcon />
            Add User
        </button>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[var(--bg-interactive)] border border-[var(--border-primary)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-purple-500 transition-colors"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-[var(--text-muted)]">
          <thead className="text-xs text-[var(--text-primary)] uppercase bg-[var(--bg-interactive)]">
            <tr>
              {['name', 'email', 'role', 'status', 'lastLogin'].map((key) => (
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
            {sortedUsers.map(user => (
              <tr key={user.id} className="border-b border-[var(--border-primary)] hover:bg-[var(--bg-interactive-hover)]">
                <td className="px-6 py-4 font-medium text-[var(--text-primary)]">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.role === 'admin' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4">{formatDate(user.lastLogin)}</td>
                <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-4">
                        <button onClick={() => onEditUser(user)} className="text-blue-400 hover:text-blue-300" aria-label={`Edit ${user.name}`}>
                            <EditIcon />
                        </button>
                        <button onClick={() => { if(confirm(`Are you sure you want to delete ${user.name}?`)) onDeleteUser(user.id) }} className="text-red-400 hover:text-red-300" aria-label={`Delete ${user.name}`}>
                            <TrashIcon />
                        </button>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       {sortedUsers.length === 0 && (
            <div className="text-center py-8 text-[var(--text-muted)]">
                No users found.
            </div>
        )}
    </div>
  );
};
