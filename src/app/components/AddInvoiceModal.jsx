import React, { useState, useCallback } from 'react';
import { X } from 'lucide-react';
import { useInvoiceContext } from '@/app/context/InvoiceContext';
import { calculateDueDate } from '@/app/utils/invoiceUtils';

const AddInvoiceModal = ({ isOpen, onClose, darkMode }) => {
  const { invoices, addInvoice } = useInvoiceContext();
  const [formData, setFormData] = useState({
    customerName: '',
    amount: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    paymentTerms: '30'
  });
  const [errors, setErrors] = useState({});
  
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    
    if (!formData.invoiceDate) {
      newErrors.invoiceDate = 'Invoice date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Generate invoice ID
    const invoiceNumber = invoices.length > 0 
      ? parseInt(invoices[0].id.split('-')[1]) + 1 
      : 10001;
    const invoiceId = `INV-${String(invoiceNumber).padStart(5, '0')}`;
    
    // Calculate due date
    const dueDate = calculateDueDate(formData.invoiceDate, formData.paymentTerms);
    
    // Create new invoice
    const newInvoice = {
      id: invoiceId,
      customerName: formData.customerName,
      invoiceDate: formData.invoiceDate,
      dueDate: dueDate,
      amount: parseFloat(formData.amount).toFixed(2),
      paymentDate: null,
      paymentTerms: parseInt(formData.paymentTerms)
    };
    
    addInvoice(newInvoice);
    
    // Reset form and close modal
    setFormData({
      customerName: '',
      amount: '',
      invoiceDate: new Date().toISOString().split('T')[0],
      paymentTerms: '30'
    });
    setErrors({});
    onClose();
  }, [formData, invoices, addInvoice, onClose]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Add New Invoice</h2>
          <button
            onClick={onClose}
            className={`p-2 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-lg transition-colors`}
          >
            <X className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Customer Name */}
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Customer Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              } ${errors.customerName ? 'border-red-500' : ''}`}
              placeholder="Enter customer name"
            />
            {errors.customerName && (
              <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>
            )}
          </div>
          
          {/* Invoice Amount */}
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Invoice Amount (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              min="0.01"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              } ${errors.amount ? 'border-red-500' : ''}`}
              placeholder="Enter amount"
            />
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
            )}
          </div>
          
          {/* Invoice Date */}
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Invoice Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="invoiceDate"
              value={formData.invoiceDate}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              } ${errors.invoiceDate ? 'border-red-500' : ''}`}
            />
            {errors.invoiceDate && (
              <p className="text-red-500 text-sm mt-1">{errors.invoiceDate}</p>
            )}
          </div>
          
          {/* Payment Terms */}
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Payment Terms <span className="text-red-500">*</span>
            </label>
            <select
              name="paymentTerms"
              value={formData.paymentTerms}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              }`}
            >
              <option value="7">7 Days</option>
              <option value="15">15 Days</option>
              <option value="30">30 Days</option>
              <option value="45">45 Days</option>
              <option value="60">60 Days</option>
            </select>
          </div>
          
          {/* Due Date Preview */}
          <div className={`${darkMode ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-200'} border rounded-lg p-4`}>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <span className="font-medium">Due Date: </span>
              {formData.invoiceDate && (
                <span className={`${darkMode ? 'text-blue-300' : 'text-blue-700'} font-semibold`}>
                  {new Date(calculateDueDate(formData.invoiceDate, formData.paymentTerms))
                    .toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                </span>
              )}
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-4 py-2 border ${darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'} rounded-lg transition-colors font-medium`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Add Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddInvoiceModal;