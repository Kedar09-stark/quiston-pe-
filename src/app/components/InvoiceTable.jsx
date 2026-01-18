import React, { useMemo, useState, useCallback } from 'react';
import InvoiceRow from '@/app/components/InvoiceRow';
import MobileInvoiceCard from '@/app/components/MobileInvoiceCard';
import Pagination from '@/app/components/Pagination';
import { calculateStatus } from '@/app/utils/invoiceUtils';
import { FileText, CheckSquare, Square } from 'lucide-react';
import { useInvoiceContext } from '@/app/context/InvoiceContext';

const ITEMS_PER_PAGE = 15;

const InvoiceTable = ({ invoices, statusFilter, searchQuery, sortBy, darkMode }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const { bulkMarkAsPaid } = useInvoiceContext();
  
  // Filter and sort logic with useMemo for performance
  const filteredAndSortedInvoices = useMemo(() => {
    let result = [...invoices];
    
    // Filter by status
    if (statusFilter !== 'All') {
      result = result.filter(inv => calculateStatus(inv) === statusFilter);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(inv =>
        inv.id.toLowerCase().includes(query) ||
        inv.customerName.toLowerCase().includes(query)
      );
    }
    
    // Sort
    if (sortBy) {
      result.sort((a, b) => {
        switch (sortBy) {
          case 'amount-desc':
            return parseFloat(b.amount) - parseFloat(a.amount);
          case 'amount-asc':
            return parseFloat(a.amount) - parseFloat(b.amount);
          case 'date-desc':
            return new Date(b.invoiceDate) - new Date(a.invoiceDate);
          case 'date-asc':
            return new Date(a.invoiceDate) - new Date(b.invoiceDate);
          case 'due-desc':
            return new Date(b.dueDate) - new Date(a.dueDate);
          case 'due-asc':
            return new Date(a.dueDate) - new Date(b.dueDate);
          default:
            return 0;
        }
      });
    }
    
    return result;
  }, [invoices, statusFilter, searchQuery, sortBy]);
  
  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedInvoices.length / ITEMS_PER_PAGE);
  
  const paginatedInvoices = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedInvoices.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedInvoices, currentPage]);
  
  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
    setSelectedInvoices([]);
  }, [statusFilter, searchQuery, sortBy]);

  // Toggle individual invoice selection
  const toggleInvoiceSelection = useCallback((invoiceId) => {
    setSelectedInvoices(prev => 
      prev.includes(invoiceId) 
        ? prev.filter(id => id !== invoiceId)
        : [...prev, invoiceId]
    );
  }, []);

  // Select all on current page
  const toggleSelectAll = useCallback(() => {
    const unpaidInvoices = paginatedInvoices.filter(inv => !inv.paymentDate);
    const unpaidIds = unpaidInvoices.map(inv => inv.id);
    
    const allSelected = unpaidIds.every(id => selectedInvoices.includes(id));
    
    if (allSelected) {
      setSelectedInvoices(prev => prev.filter(id => !unpaidIds.includes(id)));
    } else {
      setSelectedInvoices(prev => [...new Set([...prev, ...unpaidIds])]);
    }
  }, [paginatedInvoices, selectedInvoices]);

  // Bulk mark as paid
  const handleBulkMarkAsPaid = useCallback(() => {
    if (selectedInvoices.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      bulkMarkAsPaid(selectedInvoices, today);
      setSelectedInvoices([]);
    }
  }, [selectedInvoices, bulkMarkAsPaid]);

  // Check if all unpaid on current page are selected
  const unpaidOnPage = paginatedInvoices.filter(inv => !inv.paymentDate);
  const allUnpaidSelected = unpaidOnPage.length > 0 && 
    unpaidOnPage.every(inv => selectedInvoices.includes(inv.id));
  
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    // Scroll to top of table
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  if (filteredAndSortedInvoices.length === 0) {
    return (
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-8 sm:p-12 text-center`}>
        <FileText className={`w-12 h-12 sm:w-16 sm:h-16 ${darkMode ? 'text-gray-600' : 'text-gray-300'} mx-auto mb-4`} />
        <h3 className={`text-lg sm:text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>No invoices found</h3>
        <p className={`text-sm sm:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {searchQuery || statusFilter !== 'All' 
            ? 'Try adjusting your filters or search query' 
            : 'Add your first invoice to get started'}
        </p>
      </div>
    );
  }
  
  return (
    <div>
      {/* Bulk Actions Bar */}
      {selectedInvoices.length > 0 && (
        <div className={`${darkMode ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-200'} border rounded-lg p-3 sm:p-4 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3`}>
          <div className="flex items-center gap-3">
            <CheckSquare className={`w-5 h-5 ${darkMode ? 'text-blue-300' : 'text-blue-600'}`} />
            <span className={`font-semibold text-sm sm:text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {selectedInvoices.length} invoice{selectedInvoices.length > 1 ? 's' : ''} selected
            </span>
          </div>
          <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={() => setSelectedInvoices([])}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 text-sm ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-white hover:bg-gray-50 text-gray-700'} border ${darkMode ? 'border-gray-600' : 'border-gray-300'} rounded-lg transition-colors font-medium`}
            >
              Clear
            </button>
            <button
              onClick={handleBulkMarkAsPaid}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium shadow-sm"
            >
              Mark All Paid
            </button>
          </div>
        </div>
      )}

      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border overflow-hidden`}>
        {/* Mobile Card View */}
        <div className="block lg:hidden">
          {paginatedInvoices.map(invoice => (
            <MobileInvoiceCard 
              key={invoice.id} 
              invoice={invoice}
              darkMode={darkMode}
              isSelected={selectedInvoices.includes(invoice.id)}
              onToggleSelect={toggleInvoiceSelection}
            />
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={toggleSelectAll}
                    className="flex items-center gap-2 hover:opacity-70 transition-opacity"
                  >
                    {allUnpaidSelected ? (
                      <CheckSquare className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Square className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                    )}
                  </button>
                </th>
                <th className={`px-6 py-4 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>
                  Invoice #
                </th>
                <th className={`px-6 py-4 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>
                  Customer Name
                </th>
                <th className={`px-6 py-4 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>
                  Invoice Date
                </th>
                <th className={`px-6 py-4 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>
                  Due Date
                </th>
                <th className={`px-6 py-4 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>
                  Amount
                </th>
                <th className={`px-6 py-4 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>
                  Status
                </th>
                <th className={`px-6 py-4 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>
                  Days Info
                </th>
                <th className={`px-6 py-4 text-left text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody className={`${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {paginatedInvoices.map(invoice => (
                <InvoiceRow 
                  key={invoice.id} 
                  invoice={invoice}
                  darkMode={darkMode}
                  isSelected={selectedInvoices.includes(invoice.id)}
                  onToggleSelect={toggleInvoiceSelection}
                />
              ))}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={filteredAndSortedInvoices.length}
            itemsPerPage={ITEMS_PER_PAGE}
            darkMode={darkMode}
          />
        )}
      </div>
    </div>
  );
};

export default InvoiceTable;