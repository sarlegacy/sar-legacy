import React from 'react';
import { Connector } from '../../types.ts';
import { CloseIcon, SarLogoIcon } from './icons.tsx';

interface ConnectorCardProps {
  connector: Connector;
  isConnected: boolean;
  isConnecting: boolean;
  onToggle: (id: string) => void;
}

const ConnectorCard: React.FC<ConnectorCardProps> = ({ connector, isConnected, isConnecting, onToggle }) => {
  const isGoogleDrive = connector.id === 'google-drive';
  const showSpinner = isGoogleDrive && isConnecting;

  return (
    <div className="bg-[var(--bg-interactive)] border border-transparent hover:border-[var(--border-primary)] rounded-2xl p-6 flex flex-col items-start text-left transition-all duration-200 hover:-translate-y-1">
      <div className="flex items-start justify-between w-full">
        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-3 rounded-xl mb-4 text-white">
          {connector.icon}
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${isConnected ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-400'}`}>
          {isConnected ? 'Connected' : 'Not Connected'}
        </span>
      </div>
      <h3 className="text-lg font-bold text-[var(--text-primary)]">{connector.name}</h3>
      <p className="text-sm text-[var(--text-muted)] flex-1 mt-1 mb-4">{connector.description}</p>
      <button
        onClick={() => onToggle(connector.id)}
        disabled={showSpinner}
        className={`w-full font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 ${
            showSpinner 
                ? 'bg-gray-500/20 text-gray-400 cursor-wait' 
                : isConnected 
                    ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30' 
                    : 'bg-purple-600 text-white hover:bg-purple-700'
        }`}
      >
        {showSpinner && <SarLogoIcon className="w-4 h-4 animate-spin" />}
        {showSpinner ? 'Connecting...' : (isConnected ? 'Disconnect' : 'Connect')}
      </button>
    </div>
  );
};

interface ConnectorsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  connectors: Connector[];
  connectedConnectorIds: string[];
  onToggleConnector: (id: string) => void;
  isConnecting: boolean;
}

export const ConnectorsPanel: React.FC<ConnectorsPanelProps> = ({
  isOpen,
  onClose,
  connectors,
  connectedConnectorIds,
  onToggleConnector,
  isConnecting,
}) => {
  if (!isOpen) return null;

  return (
    <div className="flex flex-col h-full animate-fade-in-down">
      <header className="flex items-center justify-between pb-4 border-b border-[var(--border-primary)] mb-6 flex-shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Connectors</h2>
          <p className="text-[var(--text-muted)]">Integrate with your favorite apps and services.</p>
        </div>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-[var(--bg-interactive-hover)] ml-4" aria-label="Close connectors">
          <CloseIcon className="w-6 h-6" />
        </button>
      </header>
      <div className="flex-1 overflow-y-auto custom-scrollbar -mr-4 pr-4 mt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {connectors.map(connector => (
            <ConnectorCard
              key={connector.id}
              connector={connector}
              isConnected={connectedConnectorIds.includes(connector.id)}
              isConnecting={isConnecting}
              onToggle={onToggleConnector}
            />
          ))}
        </div>
      </div>
    </div>
  );
};