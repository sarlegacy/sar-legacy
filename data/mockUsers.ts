

import { User } from '../types.ts';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Admin User',
    email: 'admin@sarlegacy.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-07-28T10:00:00Z',
  },
  {
    id: 'user-2',
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    role: 'user',
    status: 'active',
    lastLogin: '2024-07-28T12:30:00Z',
  },
  {
    id: 'user-3',
    name: 'John Smith',
    email: 'john.smith@example.com',
    role: 'user',
    status: 'inactive',
    lastLogin: '2024-06-15T08:00:00Z',
  },
  {
    id: 'user-4',
    name: 'Emily White',
    email: 'emily.white@example.com',
    role: 'user',
    status: 'active',
    lastLogin: '2024-07-27T18:45:00Z',
  },
    {
    id: 'user-5',
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    role: 'user',
    status: 'active',
    lastLogin: '2024-07-28T09:15:00Z',
  },
];