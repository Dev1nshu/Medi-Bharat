import React, { useState } from "react";

// --- CONSTANT FOR LOW STOCK THRESHOLD ---
const LOW_STOCK_THRESHOLD = 20;

// --- LOCAL DATA STORE INITIALIZATION ---
const initialMedicines = [
    { id: 'm1', name: 'Paracetamol 500mg', qty: 150, price: 5.50 },
    { id: 'm2', name: 'Amoxicillin 250mg', qty: 15, price: 12.00 }, // Low stock
    { id: 'm3', name: 'Multi-Vitamin Syrup', qty: 80, price: 85.00 },
];

const initialSales = [
    { 
        id: 's1', 
        date: new Date(Date.now() - 86400000 * 2).toISOString(), 
        customerName: 'Aisha Sharma', 
        phoneNumber: '9876543210', // Initial test data with phone number
        paymentMode: 'UPI', 
        orderTotal: 140.50, 
        items: [
            { medicineId: 'm1', name: 'Paracetamol 500mg', qty: 10, price: 5.50, total: 55.00 }, 
            { medicineId: 'm3', name: 'Multi-Vitamin Syrup', qty: 1, price: 85.00, total: 85.00 }
        ] 
    },
    { 
        id: 's2', 
        date: new Date(Date.now() - 86400000).toISOString(), 
        customerName: 'Priya Singh', 
        phoneNumber: '9988776655', // Initial test data with phone number
        paymentMode: 'Cash', 
        orderTotal: 12.00, 
        items: [
            { medicineId: 'm2', name: 'Amoxicillin 250mg', qty: 1, price: 12.00, total: 12.00 }
        ] 
    },
];


// --- Theme Definitions ---
const lightTheme = {
    background: '#f8f8f8', // Off-white background
    text: '#1f2937', 
    primary: '#3b82f6', 
    secondary: '#e5e7eb', // Lighter secondary for contrast
    tableHeader: '#d1d5db',
    cartBackground: '#f0f4f8',
    cartBorder: '#93c5fd', 
    cardBg: '#ffffff', 
    danger: '#ef4444', 
    warning: '#f97316', 
    success: '#4ade80', 
    customerDetail: '#e0f2fe' 
};

const darkTheme = {
    background: '#1a202c', // Dark background
    text: '#e2e8f0', 
    primary: '#60a5fa', 
    secondary: '#2d3748', 
    tableHeader: '#4a5568',
    cartBackground: '#2d3748',
    cartBorder: '#4b5563', 
    cardBg: '#2d3748', 
    danger: '#f87171', 
    warning: '#f97316', 
    success: '#4ade80', 
    customerDetail: '#1e3a8a' 
};

// Global style for table cells
const getTableCellStyle = (theme) => ({
    border: `1px solid ${theme.secondary}`,
    padding: '10px',
    textAlign: 'left',
    backgroundColor: theme.background, 
    color: theme.text
});

const simulateFileUpload = (file) => file ? `Simulated_Path/${file.name}_${Date.now()}` : null;
// --- End of API Service Functions ---


// ----------------------------------------------------------------------
// --- COMPONENT 0: INVENTORY SELECTION MODAL ---
// ----------------------------------------------------------------------
const InventorySelectionModal = ({ 
    theme, 
    medicines, 
    searchQuery, 
    setSearchQuery, 
    closeModal, 
    addToCart 
}) => {
    
    // Filtering logic
    const filteredMedicines = medicines
        .filter(med => med.name.toLowerCase().includes(searchQuery.toLowerCase()) && med.qty > 0)
        .sort((a, b) => a.name.localeCompare(b.name));

    const getQtyCellStyle = (qty) => ({
        fontWeight: qty <= LOW_STOCK_THRESHOLD ? 'bold' : 'normal',
        color: qty <= LOW_STOCK_THRESHOLD ? theme.danger : theme.text,
        textAlign: 'center'
    });
    
    const handleAddToBasket = (med) => {
        addToCart(med);
        // closeModal(); // uncomment this line to close the modal immediately after adding
    };


    return (
        <div 
            style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
                backgroundColor: 'rgba(0, 0, 0, 0.7)', 
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                zIndex: 1000, padding: '10px'
            }}
            onClick={closeModal} // Close modal when clicking outside
        >
            <div 
                style={{
                    backgroundColor: theme.cardBg, 
                    padding: '25px', 
                    borderRadius: '12px', 
                    width: '95%', 
                    maxWidth: '800px',
                    maxHeight: '90vh',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
                    overflowY: 'auto',
                    position: 'relative',
                }}
                onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
            >
                <h3 style={{ margin: '0 0 20px', borderBottom: `2px solid ${theme.primary}`, paddingBottom: '10px' }}>
                    Quick Stock Lookup & Add
                </h3>
                
                <button 
                    onClick={closeModal} 
                    style={{ 
                        position: 'absolute', top: '15px', right: '15px', 
                        backgroundColor: theme.danger, color: 'white', border: 'none', 
                        borderRadius: '50%', width: '30px', height: '30px', 
                        fontSize: '18px', cursor: 'pointer', fontWeight: 'bold'
                    }}
                >
                    &times;
                </button>

                <input
                    type="text"
                    placeholder="Search available medicines..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ 
                        padding: '12px', 
                        border: `2px solid ${theme.cartBorder}`, 
                        borderRadius: '6px', 
                        width: '100%', 
                        marginBottom: '20px',
                        backgroundColor: theme.secondary, 
                        color: theme.text,
                        fontSize: '16px'
                    }}
                />

                <div style={{ maxHeight: 'calc(90vh - 180px)', overflowY: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: theme.tableHeader }}>
                                <th style={{ ...getTableCellStyle(theme), padding: '10px 15px' }}>Medicine Name</th>
                                <th style={{ ...getTableCellStyle(theme), textAlign: 'center' }}>Stock Qty</th>
                                <th style={{ ...getTableCellStyle(theme), textAlign: 'center' }}>Price</th>
                                <th style={{ ...getTableCellStyle(theme), textAlign: 'center' }}>Add</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMedicines.map((m) => (
                                <tr key={m.id} style={{ borderBottom: `1px solid ${theme.secondary}` }}>
                                    <td style={{ ...getTableCellStyle(theme), padding: '10px 15px' }}>{m.name}</td>
                                    <td style={{ ...getTableCellStyle(theme), ...getQtyCellStyle(m.qty) }}>{m.qty}</td>
                                    <td style={{ ...getTableCellStyle(theme), textAlign: 'center' }}>Rs {m.price.toFixed(2)}</td>
                                    <td style={{ ...getTableCellStyle(theme), textAlign: 'center' }}>
                                        <button 
                                            onClick={() => handleAddToBasket(m)}
                                            style={{ 
                                                backgroundColor: '#10b981', 
                                                color: 'white', 
                                                border: 'none', 
                                                padding: '8px 15px', 
                                                borderRadius: '4px', 
                                                cursor: 'pointer', 
                                                fontWeight: 'bold' 
                                            }}
                                        >
                                            Add
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredMedicines.length === 0 && (
                                <tr style={{ borderBottom: `1px solid ${theme.secondary}` }}>
                                    <td colSpan="4" style={{ textAlign: 'center', fontStyle: 'italic', padding: '15px' }}>No available stock matching your search.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};


// ----------------------------------------------------------------------
// --- COMPONENT 1: INVENTORY MANAGEMENT PAGE ---
// ----------------------------------------------------------------------
const InventoryPage = ({ 
    theme, 
    medicines, 
    newMed, 
    setNewMed, 
    handleAddMedicine, 
    searchQuery, 
    setSearchQuery, 
    addToCart, 
    handleEdit, 
    handleDelete 
}) => {
    
    // Filtering logic moved inside the component
    const filteredMedicines = medicines.filter(med => 
        med.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getQtyCellStyle = (qty) => ({
        ...getTableCellStyle(theme),
        fontWeight: qty <= LOW_STOCK_THRESHOLD ? 'bold' : 'normal',
        color: qty <= LOW_STOCK_THRESHOLD ? theme.danger : theme.text,
    });

    return (
        <div style={{ padding: '20px', minHeight: '80vh' }}>
            <h2 style={{ borderBottom: `2px solid ${theme.secondary}`, paddingBottom: '10px', marginBottom: '30px' }}>
                Stock Inventory Management
            </h2>
            
            {/* Add Medicine Section */}
            <h3 style={{ borderBottom: `1px solid ${theme.secondary}`, paddingBottom: '5px' }}>Add New Stock</h3>
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <input 
                    placeholder="Name" 
                    value={newMed.name} 
                    onChange={(e) => setNewMed({ ...newMed, name: e.target.value })} 
                    style={{ padding: '8px', border: `1px solid ${theme.secondary}`, borderRadius: '4px', flexGrow: 1, minWidth: '150px', backgroundColor: theme.secondary, color: theme.text }}
                />
                <input 
                    type="number" 
                    placeholder="Quantity" 
                    value={newMed.qty} 
                    onChange={(e) => setNewMed({ ...newMed, qty: parseInt(e.target.value) || 0 })} 
                    style={{ padding: '8px', border: `1px solid ${theme.secondary}`, borderRadius: '4px', width: '100px', backgroundColor: theme.secondary, color: theme.text }}
                />
                <input 
                    type="number" 
                    placeholder="Price" 
                    value={newMed.price} 
                    onChange={(e) => setNewMed({ ...newMed, price: parseFloat(e.target.value) || 0 })} 
                    style={{ padding: '8px', border: `1px solid ${theme.secondary}`, borderRadius: '4px', width: '100px', backgroundColor: theme.secondary, color: theme.text }}
                />
                <button 
                    onClick={handleAddMedicine} 
                    style={{ padding: '8px 15px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    Add Stock
                </button>
            </div>

            {/* Current Stock Table */}
            <h3 style={{ borderBottom: `1px solid ${theme.secondary}`, paddingBottom: '5px' }}>Current Stock List</h3>
            <div style={{ marginBottom: '15px' }}>
                <input
                    type="text"
                    placeholder="Search medicines by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ padding: '10px', border: `1px solid ${theme.cartBorder}`, borderRadius: '4px', width: '100%', backgroundColor: theme.secondary, color: theme.text }}
                />
            </div>
            
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', marginBottom: '30px' }}>
                    <thead>
                        <tr style={{ backgroundColor: theme.tableHeader }}>
                            <th style={getTableCellStyle(theme)}>ID</th>
                            <th style={getTableCellStyle(theme)}>Name</th>
                            <th style={getTableCellStyle(theme)}>Qty</th>
                            <th style={getTableCellStyle(theme)}>Price</th>
                            <th style={getTableCellStyle(theme)}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMedicines.map((m) => (
                            <tr key={m.id} style={{ borderBottom: `1px solid ${theme.secondary}` }}>
                                <td style={getTableCellStyle(theme)}>{m.id}</td>
                                <td style={getTableCellStyle(theme)}>{m.name}</td>
                                <td style={getQtyCellStyle(m.qty)}>{m.qty}</td>
                                <td style={getTableCellStyle(theme)}>Rs {m.price.toFixed(2)}</td>
                                <td style={getTableCellStyle(theme)}>
                                    <button 
                                        onClick={() => addToCart(m)}
                                        style={{ backgroundColor: theme.primary, color: theme.text, border: 'none', padding: '5px 10px', borderRadius: '4px', marginRight: '5px', cursor: 'pointer' }}
                                    >
                                        Add to Basket
                                    </button>
                                    <button 
                                        onClick={() => handleEdit(m)}
                                        style={{ backgroundColor: '#facc15', color: 'black', border: 'none', padding: '5px 10px', borderRadius: '4px', marginRight: '5px', cursor: 'pointer' }}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(m.id)}
                                        style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredMedicines.length === 0 && (
                            <tr style={{ borderBottom: `1px solid ${theme.secondary}` }}>
                                <td colSpan="5" style={{ textAlign: 'center', fontStyle: 'italic', padding: '10px' }}>No medicines found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


// ----------------------------------------------------------------------
// --- COMPONENT 2: SALES BASKET PAGE ---
// ----------------------------------------------------------------------
const SalesBasketPage = ({ 
    theme, 
    isDarkMode,
    cart,
    customerName,
    setCustomerName,
    customerPhoneNumber,
    setCustomerPhoneNumber,
    paymentMode,
    setPaymentMode,
    prescriptionFile,
    setPrescriptionFile,
    removeFromCart,
    calculateCartTotal,
    handleProcessOrder,
    openInventoryModal // New prop to open modal
}) => {
    
    const tableCellStyle = getTableCellStyle(theme);

    return (
        <div style={{ padding: '20px', minHeight: '80vh' }}>
            <h2 style={{ borderBottom: `2px solid ${theme.secondary}`, paddingBottom: '10px', marginBottom: '30px' }}>
                Selling Basket & Billing
            </h2>

            <div style={{ border: `2px solid ${theme.cartBorder}`, padding: '20px', borderRadius: '8px', backgroundColor: theme.cartBackground, color: theme.text }}>
                
                {/* Customer Details & Payment Setup */}
                <h3 style={{ borderBottom: `1px solid ${theme.cartBorder}`, paddingBottom: '10px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Customer & Payment Details
                    <button 
                        onClick={openInventoryModal}
                        style={{ 
                            padding: '10px 20px', 
                            backgroundColor: '#059669', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '6px', 
                            cursor: 'pointer', 
                            fontWeight: 'bold',
                            fontSize: '16px'
                        }}
                    >
                        + Add Item to Basket (Quick Look)
                    </button>
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px', alignItems: 'flex-end' }}>
                    
                    {/* Customer Name */}
                    <div>
                        <label htmlFor="customerName" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Patient/Customer Name:</label>
                        <input 
                            id="customerName"
                            placeholder="Enter Name" 
                            value={customerName} 
                            onChange={(e) => setCustomerName(e.target.value)} 
                            style={{ padding: '10px', border: `1px solid ${theme.secondary}`, borderRadius: '6px', width: '100%', backgroundColor: theme.background, color: theme.text }}
                        />
                    </div>
                    
                    {/* Phone Number */}
                    <div>
                        <label htmlFor="customerPhone" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Phone Number:</label>
                        <input 
                            id="customerPhone"
                            type="tel"
                            placeholder="Enter Phone Number (Optional)" 
                            value={customerPhoneNumber} 
                            onChange={(e) => setCustomerPhoneNumber(e.target.value)} 
                            style={{ padding: '10px', border: `1px solid ${theme.secondary}`, borderRadius: '6px', width: '100%', backgroundColor: theme.background, color: theme.text }}
                        />
                    </div>
                    
                    {/* Payment Mode Toggle */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Payment Mode:</label>
                        <div style={{ display: 'flex', border: `2px solid ${theme.primary}`, borderRadius: '6px' }}>
                            <button 
                                onClick={() => setPaymentMode('UPI')}
                                style={{ 
                                    flex: 1, padding: '10px', border: 'none', cursor: 'pointer', fontWeight: 'bold',
                                    backgroundColor: paymentMode === 'UPI' ? theme.primary : theme.secondary,
                                    color: paymentMode === 'UPI' ? (isDarkMode ? darkTheme.background : lightTheme.background) : theme.text,
                                    borderRadius: '4px 0 0 4px', transition: 'background-color 0.2s'
                                }}
                            >
                                UPI
                            </button>
                            <button 
                                onClick={() => setPaymentMode('Cash')}
                                style={{ 
                                    flex: 1, padding: '10px', border: 'none', cursor: 'pointer', fontWeight: 'bold',
                                    backgroundColor: paymentMode === 'Cash' ? theme.primary : theme.secondary,
                                    color: paymentMode === 'Cash' ? (isDarkMode ? darkTheme.background : lightTheme.background) : theme.text,
                                    borderRadius: '0 4px 4px 0', transition: 'background-color 0.2s'
                                }}
                            >
                                Cash
                            </button>
                        </div>
                    </div>

                    {/* Prescription File Upload */}
                    <div>
                        <label htmlFor="prescription" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Prescription:</label>
                        <input 
                            id="prescription"
                            type="file" 
                            onChange={(e) => setPrescriptionFile(e.target.files[0])} 
                            style={{ padding: '6px 0', width: '100%' }}
                        />
                        {prescriptionFile && (
                            <p style={{ fontSize: '12px', color: '#10b981', marginTop: '5px' }}>File selected: {prescriptionFile.name}</p>
                        )}
                    </div>
                </div>

                {/* Cart Items Table */}
                <h3 style={{ borderBottom: `1px solid ${theme.cartBorder}`, paddingBottom: '10px', marginTop: '30px', marginBottom: '15px' }}>Items in Basket</h3>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', minWidth: '500px', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: theme.tableHeader, borderBottom: `1px solid ${theme.secondary}` }}>
                                <th style={tableCellStyle}>Medicine</th>
                                <th style={tableCellStyle}>Qty</th>
                                <th style={tableCellStyle}>Price</th>
                                <th style={tableCellStyle}>Total</th>
                                <th style={tableCellStyle}>Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.length === 0 ? (
                                <tr style={{ borderBottom: `1px solid ${theme.secondary}` }}>
                                    <td colSpan="5" style={{ textAlign: 'center', fontStyle: 'italic', padding: '15px' }}>
                                        Basket is empty. Use the **+ Add Item to Basket** button above or add items from the **Inventory Stock** page.
                                    </td>
                                </tr>
                            ) : (
                                cart.map((item) => (
                                    <tr key={item.medicineId} style={{ borderBottom: `1px solid ${theme.secondary}` }}>
                                        <td style={tableCellStyle}>{item.name}</td>
                                        <td style={tableCellStyle}>{item.qty}</td>
                                        <td style={tableCellStyle}>Rs {item.price.toFixed(2)}</td>
                                        <td style={tableCellStyle}>Rs {item.total.toFixed(2)}</td>
                                        <td style={tableCellStyle}>
                                            <button 
                                                onClick={() => removeFromCart(item.medicineId)}
                                                style={{ backgroundColor: '#fca5a5', color: '#dc2626', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                        <tfoot>
                            <tr style={{ fontWeight: 'bold', backgroundColor: theme.secondary }}>
                                <td colSpan="3" style={{ textAlign: 'right', padding: '15px' }}>Grand Total:</td>
                                <td style={{ padding: '15px' }}>Rs {calculateCartTotal().toFixed(2)}</td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                
                <div style={{ textAlign: 'right', marginTop: '30px' }}>
                    <button 
                        onClick={handleProcessOrder}
                        disabled={cart.length === 0 || !customerName.trim()}
                        style={{ 
                            padding: '12px 25px', 
                            backgroundColor: '#ef4444', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '6px',
                            cursor: cart.length === 0 || !customerName.trim() ? 'not-allowed' : 'pointer',
                            fontSize: '18px',
                            fontWeight: 'bold',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}
                    >
                        Process Sale & Print Bill
                    </button>
                </div>
            </div>
        </div>
    );
};


// ----------------------------------------------------------------------
// --- COMPONENT 3: SALES HISTORY PAGE ---
// ----------------------------------------------------------------------
const SalesHistoryPage = ({ theme, sales, handleDeleteSale }) => {

    const tableCellStyle = getTableCellStyle(theme);
    
    return (
        <div style={{ padding: '20px', minHeight: '80vh' }}>
            <h2 style={{ borderBottom: `2px solid ${theme.secondary}`, paddingBottom: '10px', marginBottom: '30px' }}>
                Sales and Billing History
            </h2>
            
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', minWidth: '700px', borderCollapse: 'collapse' }}>
                    <thead>
                    <tr style={{ backgroundColor: theme.tableHeader }}>
                        <th style={tableCellStyle}>Order ID</th>
                        <th style={tableCellStyle}>Date</th> 
                        <th style={tableCellStyle}>Customer Name</th>
                        <th style={tableCellStyle}>Phone</th>
                        <th style={tableCellStyle}>Payment Mode</th>
                        <th style={tableCellStyle}>Total Value</th>
                        <th style={tableCellStyle}>Actions</th> 
                    </tr>
                    </thead>
                    <tbody>
                    {sales
                        .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by newest first
                        .map((s) => (
                        <tr key={s.id} style={{ borderBottom: `1px solid ${theme.secondary}` }}>
                        <td style={tableCellStyle}>{s.id}</td>
                        <td style={tableCellStyle}>{new Date(s.date).toLocaleString()}</td>
                        <td style={tableCellStyle}>{s.customerName}</td>
                        {/* Ensure phone number is displayed here */}
                        <td style={tableCellStyle}>{s.phoneNumber || 'N/A'}</td>
                        <td style={{ ...tableCellStyle, fontWeight: 'bold' }}>
                            <span style={{ color: s.paymentMode === 'UPI' ? theme.primary : theme.danger }}>
                                {s.paymentMode || 'Cash'}
                            </span>
                        </td>
                        <td style={{ ...tableCellStyle, fontWeight: 'bold' }}>Rs {s.orderTotal.toFixed(2)}</td>
                        <td style={tableCellStyle}>
                            <button 
                                onClick={() => handleDeleteSale(s.id)}
                                style={{ backgroundColor: '#dc2626', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                Delete
                            </button>
                        </td>
                        </tr>
                    ))}
                    {sales.length === 0 && (
                        <tr style={{ borderBottom: `1px solid ${theme.secondary}` }}>
                            <td colSpan="7" style={{ textAlign: 'center', fontStyle: 'italic', padding: '15px' }}>No sales records found.</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


// ----------------------------------------------------------------------
// --- COMPONENT 4: DASHBOARD PAGE (KEPT SIMPLE) ---
// ----------------------------------------------------------------------
const DashboardPage = ({ theme, totalRevenue, totalInventoryQuantity, sales, lowStockItems, weeklyRevenue, dailyRevenue }) => (
    <div style={{ padding: '20px', minHeight: '80vh' }}>
        <h2 style={{ borderBottom: `2px solid ${theme.secondary}`, paddingBottom: '10px', marginBottom: '30px' }}>Business Dashboard</h2>
        
        {/* Main Metric Cards Grid */}
        <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', marginBottom: '30px' }}>
            
            {/* Total Revenue Card */}
            <div style={{ padding: '30px', borderRadius: '12px', backgroundColor: theme.cardBg, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderLeft: '5px solid #10b981', textAlign: 'center' }}>
                <h3 style={{ margin: '0 0 10px', color: '#10b981' }}>Total Revenue</h3>
                <p style={{ fontSize: '2.0rem', fontWeight: 'bold', margin: 0 }}>Rs {totalRevenue.toFixed(2)}</p>
                <p style={{ margin: 0, color: theme.text }}>from {sales.length} orders</p>
            </div>

            {/* Inventory Quantity Card */}
            <div style={{ padding: '30px', borderRadius: '12px', backgroundColor: theme.cardBg, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderLeft: '5px solid #3b82f6', textAlign: 'center' }}>
                <h3 style={{ margin: '0 0 10px', color: '#3b82f6' }}>Total Stock</h3>
                <p style={{ fontSize: '2.0rem', fontWeight: 'bold', margin: 0 }}>{totalInventoryQuantity}</p>
                <p style={{ margin: 0, color: theme.text }}>items in inventory</p>
            </div>
            
            {/* Weekly Sales Card */}
            <div style={{ padding: '30px', borderRadius: '12px', backgroundColor: theme.cardBg, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderLeft: `5px solid ${theme.warning}`, textAlign: 'center' }}>
                <h3 style={{ margin: '0 0 10px', color: theme.warning }}>Weekly Sales</h3>
                <p style={{ fontSize: '2.0rem', fontWeight: 'bold', margin: 0 }}>Rs {weeklyRevenue.toFixed(2)}</p>
                <p style={{ margin: 0, color: theme.text }}>Revenue generated this week</p>
            </div>
            
            {/* Daily Sales Card */}
            <div style={{ padding: '30px', borderRadius: '12px', backgroundColor: theme.cardBg, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderLeft: `5px solid ${theme.success}`, textAlign: 'center' }}>
                <h3 style={{ margin: '0 0 10px', color: theme.success }}>Today's Sales</h3>
                <p style={{ fontSize: '2.0rem', fontWeight: 'bold', margin: 0 }}>Rs {dailyRevenue.toFixed(2)}</p>
                <p style={{ margin: 0, color: theme.text }}>Sales processed today</p>
            </div>
        </div>

        {/* Low Stock Alert Card */}
        <div style={{ padding: '20px', borderRadius: '12px', backgroundColor: theme.cardBg, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderLeft: `5px solid ${lowStockItems.length > 0 ? theme.danger : '#facc15'}`, textAlign: 'left' }}>
            <h3 style={{ margin: '0 0 10px', color: lowStockItems.length > 0 ? theme.danger : '#facc15', display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: '1.5rem', marginRight: '10px' }}>{lowStockItems.length > 0 ? '⚠️' : '✅'}</span>
                Low Stock Alert ({lowStockItems.length} items)
            </h3>
            {lowStockItems.length > 0 ? (
                <ul style={{ listStyleType: 'disc', paddingLeft: '20px', margin: 0, color: theme.text }}>
                    {lowStockItems.map(item => (
                        <li key={item.id} style={{ marginBottom: '5px' }}>
                            **{item.name}**: Only **{item.qty}** units left!
                        </li>
                    ))}
                </ul>
            ) : (
                <p style={{ color: theme.text, fontStyle: 'italic' }}>
                    All critical stock levels are healthy (above {LOW_STOCK_THRESHOLD} units).
                </p>
            )}
        </div>
    </div>
);


// ----------------------------------------------------------------------
// --- COMPONENT 5: CUSTOMER HISTORY PAGE (KEPT SIMPLE) ---
// ----------------------------------------------------------------------
const CustomerPage = ({ theme, aggregatedCustomers, selectedCustomer, setSelectedCustomer }) => {
    
    const tableCellStyle = getTableCellStyle(theme);

    // Detailed view of a single customer's sales
    if (selectedCustomer) {
        const sortedSales = selectedCustomer.allSales.sort((a, b) => new Date(b.date) - new Date(a.date));

        return (
            <div style={{ padding: '20px', minHeight: '80vh' }}>
                <h2 style={{ borderBottom: `2px solid ${theme.secondary}`, paddingBottom: '10px', marginBottom: '30px' }}>
                    <button 
                        onClick={() => setSelectedCustomer(null)} 
                        style={{ marginRight: '15px', padding: '8px 12px', backgroundColor: theme.primary, color: theme.text, border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        ← Back
                    </button>
                    History for: {selectedCustomer.name} (Phone: {selectedCustomer.phoneNumber})
                </h2>

                <div style={{ backgroundColor: theme.customerDetail, padding: '15px', borderRadius: '8px', marginBottom: '20px', color: darkTheme.text }}>
                    <p style={{ fontWeight: 'bold', margin: '0 0 5px 0' }}>Total Visits: {selectedCustomer.visits}</p>
                    <p style={{ fontWeight: 'bold', margin: 0 }}>Last Purchase: {new Date(selectedCustomer.lastPurchaseDate).toLocaleDateString()} (Rs {selectedCustomer.lastPurchaseTotal.toFixed(2)})</p>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: theme.tableHeader }}>
                                <th style={tableCellStyle}>Date & Time</th>
                                <th style={tableCellStyle}>Order ID</th>
                                <th style={tableCellStyle}>Payment</th>
                                <th style={tableCellStyle}>Items Bought</th>
                                <th style={tableCellStyle}>Order Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedSales.map(sale => (
                                <tr key={sale.id} style={{ borderBottom: `1px solid ${theme.secondary}` }}>
                                    <td style={tableCellStyle}>{new Date(sale.date).toLocaleString()}</td>
                                    <td style={tableCellStyle}>{sale.id}</td>
                                    <td style={{ ...tableCellStyle, fontWeight: 'bold', color: sale.paymentMode === 'UPI' ? theme.primary : theme.danger }}>{sale.paymentMode}</td>
                                    <td style={tableCellStyle}>
                                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '12px' }}>
                                        {sale.items.map(item => (
                                            <li key={item.medicineId}>{item.name} x {item.qty}</li>
                                        ))}
                                        </ul>
                                    </td>
                                    <td style={{ ...tableCellStyle, fontWeight: 'bold' }}>Rs {sale.orderTotal.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
    
    // Main customer list view
    return (
        <div style={{ padding: '20px', minHeight: '80vh' }}>
            <h2 style={{ borderBottom: `2px solid ${theme.secondary}`, paddingBottom: '10px', marginBottom: '30px' }}>Customer Visit History</h2>
            
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: theme.tableHeader }}>
                            <th style={tableCellStyle}>Customer Name</th>
                            <th style={tableCellStyle}>Phone Number</th>
                            <th style={tableCellStyle}>Total Visits</th>
                            <th style={tableCellStyle}>Last Purchase</th>
                            <th style={tableCellStyle}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {aggregatedCustomers.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', fontStyle: 'italic', padding: '15px' }}>No customer history available.</td>
                            </tr>
                        ) : (
                            aggregatedCustomers
                            .sort((a, b) => new Date(b.lastPurchaseDate) - new Date(a.lastPurchaseDate))
                            .map((customer, index) => (
                                <tr 
                                    key={index} 
                                    style={{ borderBottom: `1px solid ${theme.secondary}`, cursor: 'pointer', transition: 'background-color 0.2s' }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.secondary}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.background}
                                    onClick={() => setSelectedCustomer(customer)}
                                >
                                    <td style={tableCellStyle}>{customer.name}</td>
                                    {/* Ensure phone number is used in aggregation key and displayed here */}
                                    <td style={tableCellStyle}>{customer.phoneNumber}</td>
                                    <td style={{ ...tableCellStyle, fontWeight: 'bold' }}>{customer.visits}</td>
                                    <td style={tableCellStyle}>
                                        {new Date(customer.lastPurchaseDate).toLocaleDateString()} 
                                        (Rs {customer.lastPurchaseTotal.toFixed(2)})
                                    </td>
                                    <td style={tableCellStyle}>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); setSelectedCustomer(customer); }}
                                            style={{ backgroundColor: theme.primary, color: theme.text, border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


// ----------------------------------------------------------------------
// --- MAIN APP COMPONENT ---
// ----------------------------------------------------------------------
export default function App() {
  // Switched to local state simulation for reliable persistence
  const [medicines, setMedicines] = useState(initialMedicines);
  const [sales, setSales] = useState(initialSales);

  const [newMed, setNewMed] = useState({ name: "", qty: 0, price: 0 });
  
  // State for Page Navigation
  const [currentPage, setCurrentPage] = useState('dashboard'); // 'dashboard', 'inventory', 'basket', 'history', 'customers'

  // State for Search
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal State for Quick Add
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [modalSearchQuery, setModalSearchQuery] = useState("");

  // Cart/Selling State
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");
  // IMPORTANT: Phone number state is what feeds the processOrder function
  const [customerPhoneNumber, setCustomerPhoneNumber] = useState("");
  const [paymentMode, setPaymentMode] = useState("UPI"); 
  const [prescriptionFile, setPrescriptionFile] = useState(null);

  // Customer Detail View State
  const [selectedCustomer, setSelectedCustomer] = useState(null); 

  
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(false);
  const theme = isDarkMode ? darkTheme : lightTheme;
  const toggleTheme = () => setIsDarkMode(!isDarkMode);


  // --- API Service Functions (Local State Simulation) ---
  // These functions now directly manipulate the local state (medicines, sales)

  const addMedicine = async (med) => {
    const newMed = { 
        ...med, 
        id: `m${Date.now()}`, 
        qty: parseInt(med.qty) || 0, 
        price: parseFloat(med.price) || 0
    };
    setMedicines(prev => [...prev, newMed]);
  };

  const updateMedicine = async (id, updatedFields) => {
    setMedicines(prev => prev.map(m => m.id === id ? { ...m, ...updatedFields } : m));
  };

  const deleteMedicine = async (id) => {
    setMedicines(prev => prev.filter(m => m.id !== id));
  };
  
  const processOrder = async (orderData) => {
    // 1. Update inventory
    setMedicines(prevMeds => {
        const updatedMeds = [...prevMeds];
        for (const item of orderData.cart) {
            const medIndex = updatedMeds.findIndex(m => m.id === item.medicineId);
            if (medIndex !== -1) {
                updatedMeds[medIndex] = { 
                    ...updatedMeds[medIndex], 
                    qty: updatedMeds[medIndex].qty - item.qty 
                };
            }
        }
        return updatedMeds;
    });

    // 2. Record sale
    const newSale = {
        id: `s${Date.now()}`,
        date: new Date().toISOString(),
        customerName: orderData.customerName,
        phoneNumber: orderData.phoneNumber, // Phone number is explicitly saved here
        paymentMode: orderData.paymentMode,
        orderTotal: orderData.cart.reduce((sum, item) => sum + item.total, 0),
        items: orderData.cart
    };
    
    setSales(prevSales => [...prevSales, newSale]);

    return { order: newSale };
  };

  const deleteSale = async (id) => {
    let saleToDelete;
    
    setSales(prevSales => {
        saleToDelete = prevSales.find(s => s.id === id);
        return prevSales.filter(s => s.id !== id);
    });

    // Restore inventory
    if (saleToDelete && saleToDelete.items) {
        setMedicines(prevMeds => {
            const updatedMeds = [...prevMeds];
            for (const item of saleToDelete.items) {
                const medIndex = updatedMeds.findIndex(m => m.id === item.medicineId);
                if (medIndex !== -1) {
                    updatedMeds[medIndex] = { 
                        ...updatedMeds[medIndex], 
                        qty: updatedMeds[medIndex].qty + item.qty 
                    };
                }
            }
            return updatedMeds;
        });
    }
  };
  // --- End of Local State Simulation ---
  
  // --- Metrics & Aggregation Logic (Now uses local 'sales' state) ---
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.orderTotal, 0);
  const totalInventoryQuantity = medicines.reduce((sum, med) => sum + med.qty, 0);
  const lowStockItems = medicines.filter(med => med.qty <= LOW_STOCK_THRESHOLD);
  
  const calculateRevenueForPeriod = (days) => {
      const timeAgo = new Date();
      timeAgo.setDate(timeAgo.getDate() - days); 
      return sales.filter(sale => new Date(sale.date) >= timeAgo).reduce((sum, sale) => sum + sale.orderTotal, 0);
  };
  
  const weeklyRevenue = calculateRevenueForPeriod(7);
  const dailyRevenue = calculateRevenueForPeriod(1);

  const getAggregatedCustomers = (sales) => {
    const customersMap = new Map();
    // Filter out sales without customer names or with 'N/A' as the phone number
    const filteredSales = sales.filter(sale => sale.customerName.trim());
    
    filteredSales.forEach(sale => {
        // Use customer name + phone number for a unique customer key
        const key = `${sale.customerName.trim()}-${sale.phoneNumber || 'N/A'}`; 
        const existing = customersMap.get(key);
        
        if (existing) {
            existing.visits += 1;
            if (new Date(sale.date) > new Date(existing.lastPurchaseDate)) {
                 existing.lastPurchaseDate = sale.date;
                 existing.lastPurchaseTotal = sale.orderTotal;
            }
            existing.allSales.push(sale);
        } else {
            customersMap.set(key, {
                name: sale.customerName.trim(),
                phoneNumber: sale.phoneNumber || 'N/A', // Phone number retrieval is secure
                visits: 1,
                lastPurchaseDate: sale.date,
                lastPurchaseTotal: sale.orderTotal,
                allSales: [sale]
            });
        }
    });
    return Array.from(customersMap.values());
  };

  const aggregatedCustomers = getAggregatedCustomers(sales);

  // --- Medicine Management Handlers ---
  const handleAddMedicine = async () => {
    if (!newMed.name || newMed.qty <= 0 || newMed.price <= 0) return console.error("Enter valid medicine details.");
    await addMedicine(newMed);
    setNewMed({ name: "", qty: 0, price: 0 });
  };

  const handleEdit = async (med) => {
    const newName = prompt(`Enter new name for ${med.name}:`, med.name);
    if (newName === null) return; 

    const newQty = parseInt(prompt(`Enter new quantity for ${med.name}:`, med.qty));
    if (isNaN(newQty)) return;

    const newPrice = parseFloat(prompt(`Enter new price for ${med.name}:`, med.price));
    if (isNaN(newPrice)) return;

    await updateMedicine(med.id, { name: newName || med.name, qty: newQty, price: newPrice });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this medicine?")) return;
    await deleteMedicine(id);
  };
  
  // --- Sales Handlers ---
  const handleDeleteSale = async (id) => {
      if (!window.confirm("WARNING: Deleting this sale will restore stock. Are you sure?")) return;
      await deleteSale(id);
  };
  
  // --- Cart Management Handlers ---
  const addToCart = (med) => {
    const qty = parseInt(prompt(`Quantity of ${med.name} to add to basket:`, 1));
    if (isNaN(qty) || qty <= 0) return;
    if (qty > med.qty) return console.error(`Cannot add ${qty}. Only ${med.qty} in stock.`);

    const existingItem = cart.find(item => item.medicineId === med.id);

    if (existingItem) {
      if (existingItem.qty + qty > med.qty) return console.error(`Total quantity in basket (${existingItem.qty + qty}) exceeds stock (${med.qty}).`);
      
      setCart(cart.map(item => 
        item.medicineId === med.id 
          ? { ...item, qty: item.qty + qty, total: (item.qty + qty) * item.price } 
          : item
      ));
    } else {
      const newItem = { medicineId: med.id, name: med.name, qty: qty, price: med.price, total: qty * med.price };
      setCart([...cart, newItem]);
    }
    
    // If adding from the modal, keep the modal open for quick successive additions.
    if (!isInventoryModalOpen) {
        setCurrentPage('basket');
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.medicineId !== id));
  };
  
  const calculateCartTotal = () => cart.reduce((sum, item) => sum + item.total, 0);

  // --- Billing/Order Processing Handler ---
  const handleProcessOrder = async () => {
    if (!customerName.trim()) return console.error("Please enter the Patient/Customer name.");
    if (cart.length === 0) return console.error("The basket is empty.");

    try {
        const orderData = {
            customerName: customerName.trim(),
            phoneNumber: customerPhoneNumber.trim() || 'N/A', // Ensuring phone number is included here
            paymentMode: paymentMode,
            prescriptionFile: simulateFileUpload(prescriptionFile),
            cart: cart
        };

        await processOrder(orderData);
        console.log(`Order processed successfully!`);
        
        // Reset state after successful order
        setCart([]);
        setCustomerName("");
        setCustomerPhoneNumber("");
        setPrescriptionFile(null);

        setCurrentPage('history');
    } catch (error) {
        console.error(`Error processing order: ${error.message}`);
    }
  };
  
  const openInventoryModal = () => {
      setIsInventoryModalOpen(true);
      setModalSearchQuery(""); // Reset search when opening
  };
  
  const closeInventoryModal = () => {
      setIsInventoryModalOpen(false);
      setModalSearchQuery(""); 
  };


  // --- Main Content Renderer ---
  const renderContent = () => {
    switch (currentPage) {
        case 'dashboard':
            return <DashboardPage 
                theme={theme}
                totalRevenue={totalRevenue}
                totalInventoryQuantity={totalInventoryQuantity}
                sales={sales}
                lowStockItems={lowStockItems} 
                weeklyRevenue={weeklyRevenue} 
                dailyRevenue={dailyRevenue} 
            />;
        case 'inventory':
            return <InventoryPage 
                theme={theme}
                medicines={medicines}
                newMed={newMed}
                setNewMed={setNewMed}
                handleAddMedicine={handleAddMedicine}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                addToCart={addToCart}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
            />;
        case 'basket':
            return <SalesBasketPage 
                theme={theme}
                isDarkMode={isDarkMode}
                cart={cart}
                customerName={customerName}
                setCustomerName={setCustomerName}
                customerPhoneNumber={customerPhoneNumber}
                setCustomerPhoneNumber={setCustomerPhoneNumber}
                paymentMode={paymentMode}
                setPaymentMode={setPaymentMode}
                prescriptionFile={prescriptionFile}
                setPrescriptionFile={setPrescriptionFile}
                removeFromCart={removeFromCart}
                calculateCartTotal={calculateCartTotal}
                handleProcessOrder={handleProcessOrder}
                openInventoryModal={openInventoryModal}
            />;
        case 'history':
            return <SalesHistoryPage 
                theme={theme}
                sales={sales}
                handleDeleteSale={handleDeleteSale}
            />;
        case 'customers':
            return <CustomerPage
                theme={theme}
                aggregatedCustomers={aggregatedCustomers}
                selectedCustomer={selectedCustomer}
                setSelectedCustomer={setSelectedCustomer}
            />;
        default:
            return <DashboardPage theme={theme} />;
    }
  };


  return (
    // Outer container now simply sets the overall background
    <div 
        style={{ 
            backgroundColor: isDarkMode ? darkTheme.background : lightTheme.background, // Set direct background color based on theme
            minHeight: '100vh',
            fontFamily: 'Inter, sans-serif',
            color: theme.text,
            transition: 'background-color 0.3s, color 0.3s'
        }}
    >
        {/* Inner container (no longer an overlay, just content wrapper) */}
        <div
            style={{ 
                padding: "20px", 
            }}
        >
            <header style={{ borderBottom: `2px solid ${theme.secondary}`, paddingBottom: '10px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h1 style={{ fontSize: '1.8rem', margin: 0 }}>Pharmacy Management System</h1>
                    <button 
                        onClick={toggleTheme}
                        style={{ 
                            padding: '8px 15px', 
                            backgroundColor: theme.primary, 
                            color: isDarkMode ? darkTheme.background : lightTheme.background,
                            border: 'none', 
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        {isDarkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
                    </button>
                </div>

                {/* --- NAVIGATION BAR --- */}
                <nav style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {['dashboard', 'inventory', 'basket', 'history', 'customers'].map(page => (
                        <button 
                            key={page}
                            onClick={() => {
                                setCurrentPage(page);
                                // Clear detail view when navigating away from customers list
                                if (page !== 'customers') setSelectedCustomer(null);
                            }}
                            style={{ 
                                padding: '10px 15px', 
                                backgroundColor: currentPage === page ? theme.primary : theme.secondary,
                                color: currentPage === page ? (isDarkMode ? darkTheme.background : lightTheme.background) : theme.text,
                                border: 'none', 
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                flexShrink: 0
                            }}
                        >
                            {page === 'dashboard' ? 'Dashboard' : 
                             page === 'inventory' ? 'Inventory Stock' :
                             page === 'basket' ? 'Selling Basket' :
                             page === 'history' ? 'Sales History' :
                             'Customers'}
                        </button>
                    ))}
                </nav>
            </header>

            {/* --- Render Content based on currentPage state --- */}
            {renderContent()}

        </div>
        
        {/* --- INVENTORY SELECTION MODAL --- */}
        {isInventoryModalOpen && (
            <InventorySelectionModal
                theme={theme}
                medicines={medicines}
                searchQuery={modalSearchQuery}
                setSearchQuery={setModalSearchQuery}
                closeModal={closeInventoryModal}
                addToCart={addToCart}
            />
        )}
    </div>
  );
}
