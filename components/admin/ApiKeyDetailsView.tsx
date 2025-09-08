import React, { useState, useEffect } from 'react';
import { ApiKey } from '../../types.ts';
import { CloseIcon, SparkleIcon, SarLogoIcon, RefreshCwIcon, ShieldCheckIcon, AlertTriangleIcon, CheckCircleIcon } from './icons.tsx';

interface ApiKeyDetailsViewProps {
    apiKey: ApiKey;
    onClose: () => void;
    onRunHealthCheck: (keyId: string) => Promise<void>;
    onRunUsageAnalysis: (keyId: string) => Promise<void>;
    onUpdateApiKey: (key: ApiKey) => void;
}

const HealthStatus: React.FC<{ status: ApiKey['healthCheckStatus'] }> = ({ status }) => {
    if (!status) return null;
    const config = {
        'valid': { icon: <CheckCircleIcon className="text-green-400" />, text: 'Valid & Secure', color: 'text-green-300' },
        'invalid': { icon: <AlertTriangleIcon className="text-red-400" />, text: 'Invalid Key', color: 'text-red-300' },
        'checking': { icon: <SarLogoIcon className="animate-spin text-blue-400" />, text: 'Checking...', color: 'text-blue-300' },
    };
    const { icon, text, color } = config[status] || { icon: null, text: 'Unknown', color: 'text-gray-400'};
    return <div className={`flex items-center gap-2 text-sm font-medium ${color}`}>{icon}{text}</div>;
};

export const ApiKeyDetailsView: React.FC<ApiKeyDetailsViewProps> = ({ apiKey, onClose, onRunHealthCheck, onRunUsageAnalysis, onUpdateApiKey }) => {
    const [isHealthCheckRunning, setIsHealthCheckRunning] = useState(false);
    const [isAnalysisRunning, setIsAnalysisRunning] = useState(false);
    const [tokenLimit, setTokenLimit] = useState<string>(apiKey.tokenLimit?.toString() || '');

    useEffect(() => {
        setTokenLimit(apiKey.tokenLimit?.toString() || '');
    }, [apiKey.tokenLimit]);

    const handleHealthCheck = async () => {
        setIsHealthCheckRunning(true);
        await onRunHealthCheck(apiKey.id);
        setIsHealthCheckRunning(false);
    };

    const handleUsageAnalysis = async () => {
        setIsAnalysisRunning(true);
        await onRunUsageAnalysis(apiKey.id);
        setIsAnalysisRunning(false);
    };

    const handleSaveTokenLimit = () => {
        const newLimit = tokenLimit === '' ? undefined : parseInt(tokenLimit, 10);
        if (newLimit !== undefined && isNaN(newLimit)) {
            alert("Please enter a valid number for the token limit.");
            return;
        }
        onUpdateApiKey({ ...apiKey, tokenLimit: newLimit });
        alert("Token limit updated.");
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Never';
        try {
          return new Date(dateString).toLocaleString();
        } catch (e) {
            return 'Invalid Date';
        }
    };

    const tokenUsagePercentage = apiKey.tokenLimit ? Math.min((apiKey.tokenUsage / apiKey.tokenLimit) * 100, 100) : 0;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl shadow-2xl w-full max-w-3xl animate-fade-in-down flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
                role="dialog" aria-modal="true" aria-labelledby="key-details-title"
            >
                <header className="flex items-center justify-between p-6 border-b border-[var(--border-primary)] flex-shrink-0">
                    <div>
                        <h2 id="key-details-title" className="text-xl font-bold text-[var(--text-primary)]">{apiKey.name}</h2>
                        <p className="text-sm text-[var(--text-muted)]">{apiKey.provider} API Key</p>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-[var(--bg-interactive-hover)]" aria-label="Close modal">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </header>

                <main className="flex-1 overflow-y-auto custom-scrollbar p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Key Details</h3>
                            <div className="text-sm space-y-2 text-[var(--text-muted)]">
                                <p><strong className="text-[var(--text-primary)]">Status:</strong> <span className={apiKey.status === 'active' ? 'text-green-400' : 'text-red-400'}>{apiKey.status}</span></p>
                                <p><strong className="text-[var(--text-primary)]">Created:</strong> {formatDate(apiKey.createdAt)}</p>
                                <p><strong className="text-[var(--text-primary)]">Last Used:</strong> {formatDate(apiKey.lastUsed)}</p>
                            </div>
                        </div>
                        <div className="bg-[var(--bg-tertiary)] p-4 rounded-lg">
                            <h3 className="font-semibold text-[var(--text-primary)] mb-3">Health Check</h3>
                            <div className="flex items-center justify-between">
                                <HealthStatus status={apiKey.healthCheckStatus} />
                                <button onClick={handleHealthCheck} disabled={isHealthCheckRunning} className="flex items-center gap-2 text-sm text-[var(--text-primary)] bg-[var(--bg-interactive)] hover:bg-[var(--bg-interactive-hover)] px-3 py-1.5 rounded-md disabled:opacity-50">
                                    {isHealthCheckRunning ? <SarLogoIcon className="w-4 h-4 animate-spin"/> : <RefreshCwIcon className="w-4 h-4" />}
                                    Run Check
                                </button>
                            </div>
                             {apiKey.healthCheckReport && <div className="mt-4 pt-4 border-t border-[var(--border-primary)]"><p className="text-xs whitespace-pre-wrap text-[var(--text-muted)]">{apiKey.healthCheckReport}</p></div>}
                        </div>
                        <div className="bg-[var(--bg-tertiary)] p-4 rounded-lg">
                            <h3 className="font-semibold text-[var(--text-primary)] mb-3">Token Usage Limit</h3>
                             <p className="text-xs text-[var(--text-muted)] mb-3">Set a soft limit to monitor token usage. Leave blank for no limit.</p>
                            <div className="flex items-center gap-3">
                                <input type="number" placeholder="e.g., 1000000" value={tokenLimit} onChange={(e) => setTokenLimit(e.target.value)} className="w-full bg-[var(--bg-interactive)] border border-[var(--border-primary)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-purple-500 transition-colors" />
                                <button onClick={handleSaveTokenLimit} className="text-sm font-medium bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">Save</button>
                            </div>
                            {apiKey.tokenLimit && (
                                <div className="mt-4">
                                    <div className="flex justify-between text-xs text-[var(--text-muted)] mb-1">
                                        <span>{apiKey.tokenUsage.toLocaleString()} tokens used</span>
                                        <span>{apiKey.tokenLimit.toLocaleString()} token limit</span>
                                    </div>
                                    <div className="w-full bg-[var(--bg-interactive)] rounded-full h-2.5">
                                        <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${tokenUsagePercentage}%` }}></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="bg-[var(--bg-tertiary)] p-4 rounded-lg flex flex-col">
                         <h3 className="font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                            <SparkleIcon className="text-purple-400" /> AI-Powered Usage Analysis
                        </h3>
                         <div className="flex-1 text-sm text-[var(--text-muted)] space-y-4">
                            {apiKey.usageAnalysis ? (
                                <p className="whitespace-pre-wrap">{apiKey.usageAnalysis}</p>
                            ) : (
                                <p>Get insights on your key's usage, costs, and security from SAR LEGACY AI.</p>
                            )}
                         </div>
                        <button onClick={handleUsageAnalysis} disabled={isAnalysisRunning} className="w-full mt-4 flex items-center justify-center gap-2 text-sm text-[var(--text-primary)] bg-purple-600 hover:bg-purple-700 font-medium px-3 py-2 rounded-md disabled:opacity-50">
                             {isAnalysisRunning ? <SarLogoIcon className="w-4 h-4 animate-spin"/> : <SparkleIcon className="w-4 h-4" />}
                             {isAnalysisRunning ? 'Analyzing...' : 'Request Analysis'}
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
};