import React from 'react';
import { Search, Filter } from 'lucide-react';

const FilterBar = ({ 
  statusFilter, 
  setStatusFilter, 
  searchQuery, 
  setSearchQuery,
  sortBy,
  setSortBy,
  darkMode
}) => {
  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md p-4 mb-6 border`}>
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'} w-5 h-5`} />
          <input
            type="text"
            placeholder="Search by invoice number or customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          />
        </div>
        
        {/* Status Filter */}
        <div className="flex gap-2">
          <div className={`flex items-center gap-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg px-2`}>
            <Filter className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`${darkMode ? 'bg-gray-700 text-white' : 'bg-transparent'} py-2 pr-8 border-none focus:ring-0 cursor-pointer`}
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
          
          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50'} py-2 px-4 pr-8 rounded-lg border-none focus:ring-2 focus:ring-blue-500 cursor-pointer`}
          >
            <option value="">Sort By</option>
            <option value="amount-desc">Amount (High to Low)</option>
            <option value="amount-asc">Amount (Low to High)</option>
            <option value="date-desc">Invoice Date (Newest)</option>
            <option value="date-asc">Invoice Date (Oldest)</option>
            <option value="due-desc">Due Date (Latest)</option>
            <option value="due-asc">Due Date (Earliest)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;