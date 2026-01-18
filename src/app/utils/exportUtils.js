// Export invoices to CSV
export const exportToCSV = (invoices, filename = 'invoices.csv') => {
  if (!invoices || invoices.length === 0) {
    alert('No invoices to export');
    return;
  }

  // Define CSV headers
  const headers = ['Invoice ID', 'Customer Name', 'Amount', 'Invoice Date', 'Due Date', 'Payment Date', 'Payment Terms', 'Status'];
  
  // Convert invoices to CSV rows
  const rows = invoices.map(invoice => [
    invoice.id,
    `"${invoice.customerName}"`, // Wrap in quotes to handle commas in names
    invoice.amount,
    invoice.invoiceDate,
    invoice.dueDate,
    invoice.paymentDate || 'N/A',
    `${invoice.paymentTerms} days`,
    invoice.status
  ]);
  
  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
