import React from 'react';
import {
  ResponsiveContainer, BarChart, LineChart, PieChart, CartesianGrid,
  XAxis, YAxis, Tooltip, Legend, Bar, Line, Pie, Cell
} from 'recharts';
import { ChartData } from '../types';

interface ChartRendererProps {
  chartData: ChartData;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

export const ChartRenderer: React.FC<ChartRendererProps> = ({ chartData }) => {
  const { chartType, data, dataKey, nameKey, title } = chartData;

  if (!data || data.length === 0) {
    return <div className="text-center text-gray-400 p-4">No data available to display chart.</div>;
  }
  
  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis dataKey={nameKey} stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(30, 28, 49, 0.9)',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '0.5rem',
              }}
              cursor={{ fill: 'rgba(168, 85, 247, 0.1)' }}
            />
            <Legend wrapperStyle={{fontSize: "12px"}} />
            <Bar dataKey={dataKey} fill="#A855F7" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis dataKey={nameKey} stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(30, 28, 49, 0.9)',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '0.5rem',
              }}
               cursor={{ stroke: '#A855F7', strokeWidth: 1, strokeDasharray: '3 3' }}
            />
            <Legend wrapperStyle={{fontSize: "12px"}}/>
            <Line type="monotone" dataKey={dataKey} stroke="#A855F7" strokeWidth={2} activeDot={{ r: 8 }} />
          </LineChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey={dataKey}
              nameKey={nameKey}
              label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                const radius = innerRadius + (outerRadius - innerRadius) * 1.1;
                const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                return (
                  <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12}>
                    {`${(percent * 100).toFixed(0)}%`}
                  </text>
                );
              }}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(30, 28, 49, 0.9)',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '0.5rem',
              }}
            />
            <Legend wrapperStyle={{fontSize: "12px"}}/>
          </PieChart>
        );
      default:
        return <div className="text-center text-red-400 p-4">Unsupported chart type: {chartType}</div>;
    }
  };

  return (
    <div className="my-2">
       {title && <h3 className="text-md font-semibold text-white mb-3 text-center">{title}</h3>}
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
