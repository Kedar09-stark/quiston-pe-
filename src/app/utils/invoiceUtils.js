// Utility functions for invoice calculations

export const calculateStatus = (invoice) => {
  if (invoice.paymentDate) return 'Paid';
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(invoice.dueDate);
  dueDate.setHours(0, 0, 0, 0);
  
  if (dueDate < today) return 'Overdue';
  return 'Pending';
};

export const calculateDaysInfo = (invoice) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(invoice.dueDate);
  dueDate.setHours(0, 0, 0, 0);
  
  const status = calculateStatus(invoice);
  
  if (status === 'Paid') {
    const paymentDate = new Date(invoice.paymentDate);
    paymentDate.setHours(0, 0, 0, 0);
    const diffTime = dueDate - paymentDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
      return { text: `Paid ${diffDays} days early`, color: 'text-green-600' };
    } else if (diffDays < 0) {
      return { text: `Paid ${Math.abs(diffDays)} days late`, color: 'text-orange-600' };
    } else {
      return { text: 'Paid on time', color: 'text-green-600' };
    }
  } else if (status === 'Overdue') {
    const diffTime = today - dueDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return { text: `Overdue by ${diffDays} days`, color: 'text-red-600' };
  } else {
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return { text: `Due in ${diffDays} days`, color: 'text-blue-600' };
  }
};

export const calculateDueDate = (invoiceDate, paymentTerms) => {
  const date = new Date(invoiceDate);
  date.setDate(date.getDate() + parseInt(paymentTerms));
  return date.toISOString().split('T')[0];
};

export const calculateTotalOutstanding = (invoices) => {
  return invoices
    .filter(inv => {
      const status = calculateStatus(inv);
      return status === 'Pending' || status === 'Overdue';
    })
    .reduce((sum, inv) => sum + parseFloat(inv.amount), 0);
};

export const calculateTotalOverdue = (invoices) => {
  return invoices
    .filter(inv => calculateStatus(inv) === 'Overdue')
    .reduce((sum, inv) => sum + parseFloat(inv.amount), 0);
};

export const calculateTotalPaidThisMonth = (invoices) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  return invoices
    .filter(inv => {
      if (!inv.paymentDate) return false;
      const paymentDate = new Date(inv.paymentDate);
      return paymentDate.getMonth() === currentMonth && 
             paymentDate.getFullYear() === currentYear;
    })
    .reduce((sum, inv) => sum + parseFloat(inv.amount), 0);
};

export const calculateAveragePaymentDelay = (invoices) => {
  const paidInvoices = invoices.filter(inv => inv.paymentDate);
  
  if (paidInvoices.length === 0) return 0;
  
  const totalDelay = paidInvoices.reduce((sum, inv) => {
    const dueDate = new Date(inv.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    const paymentDate = new Date(inv.paymentDate);
    paymentDate.setHours(0, 0, 0, 0);
    const diffTime = paymentDate - dueDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return sum + diffDays;
  }, 0);
  
  return Math.round(totalDelay / paidInvoices.length);
};

export const generateDummyInvoices = () => {
  const customers = [
    'Acme Corp', 'TechStart Inc', 'Global Traders', 'Swift Solutions',
    'Prime Industries', 'Digital Dynamics', 'Metro Supplies', 'Apex Ventures',
    'BlueSky Ltd', 'Quantum Systems'
  ];
  
  const invoices = [];
  const today = new Date();
  
  for (let i = 0; i < 10; i++) {
    const daysAgo = Math.floor(Math.random() * 60);
    const invoiceDate = new Date(today);
    invoiceDate.setDate(invoiceDate.getDate() - daysAgo);
    
    const paymentTerms = [7, 15, 30, 45, 60][Math.floor(Math.random() * 5)];
    const dueDate = calculateDueDate(invoiceDate.toISOString().split('T')[0], paymentTerms);
    
    // 40% paid, 60% unpaid
    const isPaid = Math.random() < 0.4;
    let paymentDate = null;
    
    if (isPaid) {
      const dueDateObj = new Date(dueDate);
      const paymentDelay = Math.floor(Math.random() * 20) - 5; // -5 to +15 days
      const paymentDateObj = new Date(dueDateObj);
      paymentDateObj.setDate(paymentDateObj.getDate() + paymentDelay);
      paymentDate = paymentDateObj.toISOString().split('T')[0];
    }
    
    invoices.push({
      id: `INV-${String(10001 + i).padStart(5, '0')}`,
      customerName: customers[i],
      invoiceDate: invoiceDate.toISOString().split('T')[0],
      dueDate: dueDate,
      amount: (Math.random() * 50000 + 5000).toFixed(2),
      paymentDate: paymentDate,
      paymentTerms: paymentTerms
    });
  }
  
  return invoices;
};
