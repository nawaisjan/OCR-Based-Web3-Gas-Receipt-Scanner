import React from 'react';
import { ReceiptData } from '../types';

interface ReceiptsTableProps {
  receipts: ReceiptData[];
}

const ReceiptsTable: React.FC<ReceiptsTableProps> = ({ receipts }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Date</th>
            <th className="py-3 px-6 text-left">Time</th>
            <th className="py-3 px-6 text-right">Amount</th>
            <th className="py-3 px-6 text-right">Fuel Quantity</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {receipts.map((receipt, index) => (
            <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">{receipt.date}</td>
              <td className="py-3 px-6 text-left">{receipt.time}</td>
              <td className="py-3 px-6 text-right">${receipt.totalAmount.toFixed(2)}</td>
              <td className="py-3 px-6 text-right">{receipt.fuelQuantity.toFixed(2)} gallons</td>
            </tr>
          ))}
        </tbody>
      </table>
      {receipts.length === 0 && (
        <p className="text-center py-4 text-gray-500">No receipts scanned yet.</p>
      )}
    </div>
  );
};

export default ReceiptsTable;