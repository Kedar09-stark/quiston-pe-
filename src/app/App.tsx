import React, { useState, useCallback, useMemo } from 'react';
import { InvoiceProvider, useInvoiceContext } from '@/app/context/InvoiceContext';
import SummaryCards from '@/app/components/SummaryCards';
import FilterBar from '@/app/components/FilterBar';
import InvoiceTable from '@/app/components/InvoiceTable';
import AddInvoiceModal from '@/app/components/AddInvoiceModal';
import { Plus, FileText, Moon, Sun, Download, BarChart3 } from 'lucide-react';
import { calculateStatus } from '@/app/utils/invoiceUtils';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

function Dashboard() {
  const { invoices } = useInvoiceContext();
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showChart, setShowChart] = useState(false);
  
  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);
  const toggleDarkMode = useCallback(() => setDarkMode(prev => !prev), []);
  const toggleChart = useCallback(() => setShowChart(prev => !prev), []);
  
  // Calculate filtered invoices for summary cards
  const filteredInvoices = useMemo(() => {
    let result = [...invoices];
    
    if (statusFilter !== 'All') {
      result = result.filter(inv => calculateStatus(inv) === statusFilter);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(inv =>
        inv.id.toLowerCase().includes(query) ||
        inv.customerName.toLowerCase().includes(query)
      );
    }
    
    return result;
  }, [invoices, statusFilter, searchQuery]);

  // Chart data
  const chartData = useMemo(() => {
    const paid = invoices.filter(inv => calculateStatus(inv) === 'Paid').length;
    const pending = invoices.filter(inv => calculateStatus(inv) === 'Pending').length;
    const overdue = invoices.filter(inv => calculateStatus(inv) === 'Overdue').length;
    
    return [
      { name: 'Paid', value: paid, color: '#10b981' },
      { name: 'Pending', value: pending, color: '#3b82f6' },
      { name: 'Overdue', value: overdue, color: '#ef4444' }
    ];
  }, [invoices]);

  // Export to CSV function
  const exportToCSV = useCallback(() => {
    const headers = ['Invoice #', 'Customer Name', 'Amount', 'Invoice Date', 'Due Date', 'Payment Date', 'Status', 'Payment Terms'];
    const rows = filteredInvoices.map(inv => [
      inv.id,
      inv.customerName,
      inv.amount,
      inv.invoiceDate,
      inv.dueDate,
      inv.paymentDate || 'N/A',
      calculateStatus(inv),
      `${inv.paymentTerms} days`
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `invoices_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [filteredInvoices]);
  
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <h1 className={`text-xl sm:text-2xl lg:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Invoice Management</h1>
                <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>QistonPe MSME Dashboard</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={toggleChart}
                className={`flex items-center gap-2 px-3 py-2 text-sm ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'} rounded-lg transition-colors font-medium`}
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">{showChart ? 'Hide' : 'Show'} Chart</span>
                <span className="sm:hidden">Chart</span>
              </button>
              <button
                onClick={exportToCSV}
                className={`flex items-center gap-2 px-3 py-2 text-sm ${darkMode ? 'bg-green-700 hover:bg-green-600' : 'bg-green-600 hover:bg-green-700'} text-white rounded-lg transition-colors font-medium`}
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export CSV</span>
                <span className="sm:hidden">CSV</span>
              </button>
              <button
                onClick={toggleDarkMode}
                className={`p-2 sm:p-3 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} rounded-lg transition-colors`}
              >
                {darkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />}
              </button>
              <button
                onClick={openModal}
                className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md font-medium"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Add Invoice</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Chart Section */}
        {showChart && (
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-4 sm:p-6 mb-6 sm:mb-8`}>
            <h2 className={`text-lg sm:text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Invoice Status Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Summary Cards */}
        <SummaryCards filteredInvoices={filteredInvoices} darkMode={darkMode} />
        
        {/* Filters */}
        <FilterBar
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
          darkMode={darkMode}
        />
        
        {/* Invoice Table */}
        <InvoiceTable
          invoices={invoices}
          statusFilter={statusFilter}
          searchQuery={searchQuery}
          sortBy={sortBy}
          darkMode={darkMode}
        />
      </main>
      
      {/* Add Invoice Modal */}
      <AddInvoiceModal isOpen={isModalOpen} onClose={closeModal} darkMode={darkMode} />
    </div>
  );
}

export default function App() {
  return (
    <InvoiceProvider>
      <Dashboard />
    </InvoiceProvider>
  );
}