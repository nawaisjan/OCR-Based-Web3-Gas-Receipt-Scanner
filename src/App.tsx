import React, { useState, useEffect } from 'react';
import { FileText, Database } from 'lucide-react';
import ReceiptScanner from './components/ReceiptScanner';
import BlockchainStorage from './components/BlockchainStorage';
import ReceiptsTable from './components/ReceiptsTable';
import { ReceiptData } from './types';

function App() {
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [allReceipts, setAllReceipts] = useState<ReceiptData[]>([]);

  const handleReceiptScanned = (data: ReceiptData) => {
    console.log('Receipt data received:', data);
    setReceiptData(data);
    setAllReceipts(prevReceipts => [...prevReceipts, data]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Gas Receipt Scanner & Blockchain Storage</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Scan Receipt</h2>
          <ReceiptScanner onReceiptScanned={handleReceiptScanned} />
          {receiptData && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">Scanned Receipt Data</h3>
              <ul className="space-y-2">
                <li><FileText className="inline mr-2" size={18} /> Total Amount: ${receiptData.totalAmount.toFixed(2)}</li>
                <li><FileText className="inline mr-2" size={18} /> Date: {receiptData.date}</li>
                <li><FileText className="inline mr-2" size={18} /> Time: {receiptData.time}</li>
                <li><FileText className="inline mr-2" size={18} /> Fuel Quantity: {receiptData.fuelQuantity.toFixed(2)} gallons</li>
              </ul>
              <BlockchainStorage receiptData={receiptData} />
            </div>
          )}
        </div>
        <div className="w-full md:w-1/2 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">All Receipts</h2>
          <ReceiptsTable receipts={allReceipts} />
        </div>
      </div>
    </div>
  );
}

export default App;