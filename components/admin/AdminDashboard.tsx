import React from 'react';
import { User, ApiKey, LogEntry } from '../../types.ts';
import { UsersIcon, ShieldIcon, ClipboardListIcon } from './icons.tsx';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

interface AdminDashboardProps {
  users: User[];
  apiKeys: ApiKey[];
  logs: LogEntry[];
}

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string | number; description: string }> = ({ icon, title, value, description }) => (
    <div className="bg-[var(--bg-tertiary)] p-6 rounded-2xl flex items-center gap-6">
        <div className="p-4 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl text-white">
            {icon}
        </div>
        <div>
            <p className="text-sm text-[var(--text-muted)]">{title}</p>
            <p className="text-3xl font-bold text-[var(--text-primary)]">{value}</p>
            <p className="text-xs text-[var(--text-muted)]">{description}</p>
        </div>
    </div>
);

const COLORS = ['#A855F7', '#3B82F6', '#10B981', '#F59E0B'];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ users, apiKeys, logs }) => {
    // Data processing for charts
    const userRoleData = [
        { name: 'Admins', value: users.filter(u => u.role === 'admin').length },
        { name: 'Users', value: users.filter(u => u.role === 'user').length },
    ];

    const apiKeyUsageData = apiKeys.reduce((acc, key) => {
        const provider = acc.find(p => p.name === key.provider);
        if (provider) {
            provider.requests += key.requestCount;
        } else {
            acc.push({ name: key.provider, requests: key.requestCount });
        }
        return acc;
    }, [] as { name: string; requests: number }[]);

    const recentLogs = logs.slice(0, 5);
    const formatDate = (dateString: string) => new Date(dateString).toLocaleString();


    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard icon={<UsersIcon />} title="Total Users" value={users.length} description={`${userRoleData[0].value} Admins, ${userRoleData[1].value} Users`} />
                <StatCard icon={<ShieldIcon />} title="API Keys" value={apiKeys.length} description={`${apiKeys.filter(k => k.status === 'active').length} Active Keys`} />
                <StatCard icon={<ClipboardListIcon />} title="Log Entries" value={logs.length} description={`${recentLogs.length} recent entries`} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-2 bg-[var(--bg-tertiary)] p-6 rounded-2xl">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">User Roles</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie data={userRoleData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                {userRoleData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="lg:col-span-3 bg-[var(--bg-tertiary)] p-6 rounded-2xl">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">API Key Usage</h3>
                     <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={apiKeyUsageData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
                            <YAxis stroke="var(--text-muted)" fontSize={12} />
                            <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }} cursor={{ fill: 'var(--bg-interactive)' }} />
                            <Bar dataKey="requests" fill="#A855F7" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
             <div className="bg-[var(--bg-tertiary)] p-6 rounded-2xl">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Recent Activity</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-[var(--text-muted)]">
                        <tbody>
                            {recentLogs.map(log => (
                                <tr key={log.id} className="border-b border-[var(--border-primary)] last:border-b-0">
                                    <td className="py-3 pr-4 font-mono text-xs">{formatDate(log.timestamp)}</td>
                                    <td className="py-3 px-4 font-medium text-[var(--text-primary)]">{log.user}</td>
                                    <td className="py-3 px-4">{log.action}</td>
                                    <td className="py-3 pl-4 text-xs truncate max-w-xs">{log.details ? JSON.stringify(log.details) : ''}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};