import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { generateDummyInvoices } from '@/app/utils/invoiceUtils';
import { loadInvoices, saveInvoices } from '@/app/utils/localStorage';

const InvoiceContext = createContext(null);

export const useInvoiceContext = () => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error('useInvoiceContext must be used within InvoiceProvider');
  }
  return context;
};

export const InvoiceProvider = ({ children }) => {
  const [invoices, setInvoices] = useState([]);
  
  // Load invoices from localStorage or generate dummy data
  useEffect(() => {
    const stored = loadInvoices();
    if (stored && stored.length > 0) {
      setInvoices(stored);
    } else {
      const dummy = generateDummyInvoices();
      setInvoices(dummy);
      saveInvoices(dummy);
    }
  }, []);
  
  // Save to localStorage whenever invoices change
  useEffect(() => {
    if (invoices.length > 0) {
      saveInvoices(invoices);
    }
  }, [invoices]);
  
  const addInvoice = useCallback((invoice) => {
    setInvoices(prev => [invoice, ...prev]);
  }, []);
  
  const markAsPaid = useCallback((invoiceId, paymentDate) => {
    setInvoices(prev => 
      prev.map(inv => 
        inv.id === invoiceId 
          ? { ...inv, paymentDate } 
          : inv
      )
    );
  }, []);

  const bulkMarkAsPaid = useCallback((invoiceIds, paymentDate) => {
    setInvoices(prev => 
      prev.map(inv => 
        invoiceIds.includes(inv.id) 
          ? { ...inv, paymentDate } 
          : inv
      )
    );
  }, []);
  
  const value = {
    invoices,
    addInvoice,
    markAsPaid,
    bulkMarkAsPaid
  };
  
  return (
    <InvoiceContext.Provider value={value}>
      {children}
    </InvoiceContext.Provider>
  );
};