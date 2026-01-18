import React from 'react';

const SummaryCard = ({ title, value, subtitle, icon, trend, darkMode }) => {
  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md p-6 border`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>{title}</p>
          <p className={`text-3xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            {value}
          </p>
          {subtitle && (
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-lg ${trend === 'danger' ? 'bg-red-100' : trend === 'success' ? 'bg-green-100' : 'bg-blue-100'}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;