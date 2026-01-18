const STORAGE_KEY = 'qistonpe_invoices';

export const loadInvoices = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error loading invoices from localStorage:', error);
    return null;
  }
};

export const saveInvoices = (invoices) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
  } catch (error) {
    console.error('Error saving invoices to localStorage:', error);
  }
};
