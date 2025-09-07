import React from 'react';
import { Connector } from '../types.ts';
import { GoogleDriveIcon, NotionIcon, SlackIcon } from '../components/admin/icons.tsx';

export const mockConnectors: Connector[] = [
  {
    id: 'google-drive',
    name: 'Google Drive',
    description: 'Access your files and documents from Google Drive.',
    category: 'Cloud Storage',
    icon: React.createElement(GoogleDriveIcon),
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Connect your notes, tasks, and wikis from Notion.',
    category: 'Productivity',
    icon: React.createElement(NotionIcon),
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Integrate with your team\'s communication on Slack.',
    category: 'Communication',
    icon: React.createElement(SlackIcon),
  },
];
