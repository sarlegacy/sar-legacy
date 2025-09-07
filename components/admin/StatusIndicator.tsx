import React from 'react';

type Status = 'online' | 'degraded' | 'offline' | 'checking';

interface StatusIndicatorProps {
  status: Status;
  tooltipText: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, tooltipText }) => {
  const statusConfig = {
    online: { text: 'Online', color: 'bg-green-500', pulse: false },
    degraded: { text: 'Degraded', color: 'bg-yellow-500', pulse: false },
    offline: { text: 'Offline', color: 'bg-red-500', pulse: false },
    checking: { text: 'Checking', color: 'bg-blue-500', pulse: true },
  };

  const { text, color, pulse } = statusConfig[status];

  return (
    <div className="flex items-center gap-2" title={tooltipText}>
      <span className="relative flex h-2.5 w-2.5">
        {pulse && <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${color} opacity-75`}></span>}
        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${color}`}></span>
      </span>
      <span className="text-xs font-medium text-[var(--text-muted)]">{text}</span>
    </div>
  );
};
