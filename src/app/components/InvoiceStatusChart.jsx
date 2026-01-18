import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { calculateStatus } from '@/app/utils/invoiceUtils';

const COLORS = {
  paid: '#10b981',
  pending: '#3b82f6',
  overdue: '#ef4444'
};

export default function InvoiceStatusChart({ invoices }) {
  const chartData = useMemo(() => {
    const statusCounts = {
      paid: 0,
      pending: 0,
      overdue: 0
    };
    
    const statusAmounts = {
      paid: 0,
      pending: 0,
      overdue: 0
    };
    
    invoices.forEach(invoice => {
      const status = calculateStatus(invoice);
      statusCounts[status]++;
      statusAmounts[status] += invoice.amount;
    });
    
    return [
      { name: 'Paid', value: statusCounts.paid, amount: statusAmounts.paid },
      { name: 'Pending', value: statusCounts.pending, amount: statusAmounts.pending },
      { name: 'Overdue', value: statusCounts.overdue, amount: statusAmounts.overdue }
    ].filter(item => item.value > 0);
  }, [invoices]);
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-gray-900 dark:text-gray-100">{payload[0].name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Count: {payload[0].value}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Amount: {formatCurrency(payload[0].payload.amount)}</p>
        </div>
      );
    }
    return null;
  };
  
  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        No data to display
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Invoice Status Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name.toLowerCase()]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 grid grid-cols-3 gap-4">
        {chartData.map(item => (
          <div key={item.name} className="text-center">
            <div 
              className="w-4 h-4 rounded-full mx-auto mb-2" 
              style={{ backgroundColor: COLORS[item.name.toLowerCase()] }}
            />
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.name}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">{item.value} invoices</p>
            <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(item.amount)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
