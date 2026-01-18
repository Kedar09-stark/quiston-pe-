import React, { useCallback } from 'react';
import { calculateStatus, calculateDaysInfo } from '@/app/utils/invoiceUtils';
import { useInvoiceContext } from '@/app/context/InvoiceContext';
import { CheckCircle, CheckSquare, Square, Calendar, DollarSign, User } from 'lucide-react';

const MobileInvoiceCard = ({ invoice, darkMode, isSelected, onToggleSelect }) => {
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
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        {status}
      </span>
    );
  };
  
  return (
    <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} ${isSelected ? (darkMode ? 'bg-blue-900 bg-opacity-20' : 'bg-blue-50') : ''}`}>
      {/* Header Row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <button
            onClick={handleCheckboxClick}
            disabled={status === 'Paid'}
            className="mt-1 flex-shrink-0"
          >
            {isSelected ? (
              <CheckSquare className="w-5 h-5 text-blue-600" />
            ) : (
              <Square className={`w-5 h-5 ${status === 'Paid' ? 'text-gray-300' : (darkMode ? 'text-gray-400' : 'text-gray-400')}`} />
            )}
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <h3 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'} truncate`}>
                {invoice.id}
              </h3>
              {getStatusBadge(status)}
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <User className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} truncate`}>
                {invoice.customerName}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Amount */}
      <div className="mb-3">
        <div className="flex items-center gap-2">
          <DollarSign className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {formatCurrency(invoice.amount)}
          </span>
        </div>
      </div>
      
      {/* Dates */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} mb-1`}>Invoice Date</p>
          <div className="flex items-center gap-1.5">
            <Calendar className={`w-3.5 h-3.5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {formatDate(invoice.invoiceDate)}
            </p>
          </div>
        </div>
        <div>
          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} mb-1`}>Due Date</p>
          <div className="flex items-center gap-1.5">
            <Calendar className={`w-3.5 h-3.5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {formatDate(invoice.dueDate)}
            </p>
          </div>
        </div>
      </div>
      
      {/* Days Info */}
      <div className="mb-3">
        <p className={`text-sm font-medium ${daysInfo.color}`}>
          {daysInfo.text}
        </p>
      </div>
      
      {/* Action Button */}
      {status !== 'Paid' && (
        <button
          onClick={handleMarkAsPaid}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
        >
          <CheckCircle className="w-4 h-4" />
          Mark as Paid
        </button>
      )}
    </div>
  );
};

export default MobileInvoiceCard;
