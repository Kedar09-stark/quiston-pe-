
  # Invoice Management Dashboard

  This is a code bundle for Invoice Management Dashboard. The original project is available at https://www.figma.com/design/W6NAiUOT45765i9n7Y1pja/Invoice-Management-Dashboard.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  




  
### 1. Export to CSV ✓
- **Location**: Header toolbar (green button with Download icon)
- **Functionality**: 
  - Downloads filtered invoice list as CSV file
  - Includes all invoice details: ID, Customer, Amount, Dates, Status
  - Respects current filters and search
  - Auto-generates filename with current date
  - Disabled when no invoices to export
- **File**: `/src/app/utils/exportUtils.js`

### 2. Dark Mode ✓
- **Location**: Header toolbar (Moon/Sun icon button)
- **Functionality**:
  - Toggle between light and dark themes
  - Persists preference in localStorage
  - Smooth transitions on all components
  - Full dark mode support across entire dashboard
- **Implementation**: Context-based with `toggleDarkMode()` function
- **Files Modified**: All components updated with `dark:` Tailwind classes

### 3. Charts (Recharts) ✓
- **Location**: Main content area (toggle with "Show/Hide Chart" button)
- **Functionality**:
  - Interactive Pie Chart showing invoice status distribution
  - Displays count and amount for Paid/Pending/Overdue
  - Responsive design
  - Custom tooltip with detailed information
  - Color-coded legend
- **Library**: Recharts (already installed)
- **File**: `/src/app/components/InvoiceStatusChart.jsx`

### 4. Bulk Actions ✓
- **Location**: Invoice table
- **Functionality**:
  - Checkbox column for selecting multiple invoices
  - "Select All" checkbox in header (only selects unpaid invoices)
  - Bulk action bar appears when invoices selected
  - "Mark All as Paid" button to update multiple invoices at once
  - "Clear Selection" to deselect all
  - Selected rows highlighted with blue background
  - Only unpaid invoices can be selected
  - Selection clears when filters change
- **Implementation**: Set-based selection for performance

## Key Features Summary

### Core Features
- ✅ Invoice list view with filtering/sorting/search
- ✅ Summary cards showing financial metrics
- ✅ Add invoice functionality with validation
- ✅ Payment tracking (Mark as Paid)
- ✅ Auto-calculating status (Paid/Pending/Overdue)
- ✅ Days calculations (early/late/overdue/days left)
- ✅ Real-time summary updates
- ✅ Pagination (15 items per page)
- ✅ localStorage persistence
- ✅ 12 dummy invoices on initial load

### Bonus Features
- ✅ Export to CSV
- ✅ Dark Mode with persistence
- ✅ Status distribution chart (Recharts)
- ✅ Bulk selection and actions

## Technical Implementation

### Performance Optimizations
- `useMemo` for filtered/sorted data
- `useCallback` for event handlers
- `React.memo` for InvoiceRow component
- Set-based selection for O(1) lookups
- Pagination to limit DOM nodes

### Code Structure
```
/src/app/
├── App.tsx                         # Main app component
├── context/
│   └── InvoiceContext.jsx         # State management + dark mode
├── components/
│   ├── InvoiceTable.jsx           # Table with bulk selection
│   ├── InvoiceRow.jsx             # Individual row with checkbox
│   ├── InvoiceStatusChart.jsx     # Recharts pie chart
│   ├── SummaryCards.jsx           # Financial metrics
│   ├── SummaryCard.jsx            # Individual metric card
│   ├── FilterBar.jsx              # Search/filter/sort
│   ├── AddInvoiceModal.jsx        # New invoice form
│   └── Pagination.jsx             # Page navigation
└── utils/
    ├── invoiceUtils.js            # Business logic
    ├── localStorage.js            # Data persistence
    └── exportUtils.js             # CSV export

```

## User Guide

### Using Bulk Actions
1. Check boxes next to invoices you want to mark as paid
2. Or click the header checkbox to select all unpaid invoices on current page
3. Click "Mark All as Paid" in the blue action bar
4. Selected invoices will be updated immediately

### Exporting Data
1. Apply any filters/search you want
2. Click the green "Export CSV" button in header
3. CSV file downloads with filtered results

### Dark Mode
1. Click the Moon icon in header to enable dark mode
2. Click the Sun icon to switch back to light mode
3. Preference is saved automatically

### Viewing Charts
1. Click "Show Chart" button in header
2. Interactive pie chart appears above filters
3. Hover over chart sections for detailed tooltips
4. Click "Hide Chart" to collapse

## Browser Compatibility
- Modern browsers with ES6+ support
- LocalStorage support required
- Tested on Chrome, Firefox, Safari, Edge

## Data Persistence
- All invoice data stored in localStorage
- Dark mode preference saved separately
- Data persists across page refreshes
- No backend required (frontend-only solution)
