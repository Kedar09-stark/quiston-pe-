import React, { useMemo } from 'react';
import { useInvoiceContext } from '@/app/context/InvoiceContext';
import SummaryCard from '@/app/components/SummaryCard';
import { 
  calculateTotalOutstanding, 
  calculateTotalOverdue, 
  calculateTotalPaidThisMonth,
  calculateAveragePaymentDelay 
} from '@/app/utils/invoiceUtils';
import { DollarSign, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const SummaryCards = ({ filteredInvoices, darkMode }) => {
  const { invoices } = useInvoiceContext();
  
  // Use filtered invoices for calculations when filtering is active
  const invoicesToUse = filteredInvoices || invoices;
  
  const totalOutstanding = useMemo(() => 
    calculateTotalOutstanding(invoicesToUse), 
    [invoicesToUse]
  );
  
  const totalOverdue = useMemo(() => 
    calculateTotalOverdue(invoicesToUse), 
    [invoicesToUse]
  );
  
  const totalPaidThisMonth = useMemo(() => 
    calculateTotalPaidThisMonth(invoicesToUse), 
    [invoicesToUse]
  );
  
  const averagePaymentDelay = useMemo(() => 
    calculateAveragePaymentDelay(invoicesToUse), 
    [invoicesToUse]
  );
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <SummaryCard
        title="Total Outstanding"
        value={formatCurrency(totalOutstanding)}
        subtitle="Pending + Overdue"
        icon={<DollarSign className="w-6 h-6 text-blue-600" />}
        trend="info"
        darkMode={darkMode}
      />
      
      <SummaryCard
        title="Total Overdue"
        value={formatCurrency(totalOverdue)}
        subtitle="Needs immediate attention"
        icon={<AlertCircle className="w-6 h-6 text-red-600" />}
        trend="danger"
        darkMode={darkMode}
      />
      
      <SummaryCard
        title="Paid This Month"
        value={formatCurrency(totalPaidThisMonth)}
        subtitle="Current month collections"
        icon={<CheckCircle className="w-6 h-6 text-green-600" />}
        trend="success"
        darkMode={darkMode}
      />
      
      <SummaryCard
        title="Avg Payment Delay"
        value={`${averagePaymentDelay} days`}
        subtitle={averagePaymentDelay > 0 ? 'Late payments' : averagePaymentDelay < 0 ? 'Early payments' : 'On time'}
        icon={<Clock className="w-6 h-6 text-blue-600" />}
        trend="info"
        darkMode={darkMode}
      />
    </div>
  );
};

export default SummaryCards;