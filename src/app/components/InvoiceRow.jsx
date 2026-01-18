import React, { useCallback } from 'react';
import { calculateStatus, calculateDaysInfo } from '@/app/utils/invoiceUtils';
import { useInvoiceContext } from '@/app/context/InvoiceContext';
import { CheckCircle, CheckSquare, Square } from 'lucide-react';

const InvoiceRow = React.memo(({ invoice, darkMode, isSelected, onToggleSelect }) => {
  const { markAsPaid } = useInvoiceContext();
  
  const status = calculateStatus(invoice);
  const daysInfo = calculateDaysInfo(invoice);
  
  const handleMarkAsPaid = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    markAsPaid(invoice.id, today);
  }, [invoice.id, markAsPaid]);

  const handleCheckboxClick = useCallback(() => {
    if (status !== 'Paid') {
      onToggleSelect(invoice.id);
    }
  }, [invoice.id, onToggleSelect, status]);
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };
  
  const getStatusBadge = (status) => {
    const styles = {
      Paid: 'bg-green-100 text-green-800 border-green-200',
      Pending: 'bg-blue-100 text-blue-800 border-blue-200',
      Overdue: 'bg-red-100 text-red-800 border-red-200'
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${styles[status]}`}>
        {status}
      </span>
    );
  };
  
  return (
    <tr className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}>
      <td className="px-6 py-4 whitespace-nowrap">
        <button
          onClick={handleCheckboxClick}
          disabled={status === 'Paid'}
          className="flex items-center hover:opacity-70 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {isSelected ? (
            <CheckSquare className="w-5 h-5 text-blue-600" />
          ) : (
            <Square className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
          )}
        </button>
      </td>
      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        {invoice.id}
      </td>
      <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
        {invoice.customerName}
      </td>
      <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        {formatDate(invoice.invoiceDate)}
      </td>
      <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        {formatDate(invoice.dueDate)}
      </td>
      <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        {formatCurrency(invoice.amount)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {getStatusBadge(status)}
      </td>
      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${daysInfo.color}`}>
        {daysInfo.text}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        {status !== 'Paid' && (
          <button
            onClick={handleMarkAsPaid}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            Mark Paid
          </button>
        )}
      </td>
    </tr>
  );
});

InvoiceRow.displayName = 'InvoiceRow';

export default InvoiceRow;