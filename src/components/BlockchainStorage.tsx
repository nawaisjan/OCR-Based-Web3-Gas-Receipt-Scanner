import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Database } from 'lucide-react';
import { ReceiptData } from '../types';

const contractABI = [
  "function storeReceipt(uint256 _totalAmount, string memory _date, string memory _time, uint256 _fuelQuantity) public",
  "function getReceiptCount() public view returns (uint256)",
  "function getReceipt(uint256 index) public view returns (uint256, string memory, string memory, uint256)"
];
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // This is the default address for the first contract deployed on hardhat network

interface BlockchainStorageProps {
  receiptData: ReceiptData;
}

const BlockchainStorage: React.FC<BlockchainStorageProps> = ({ receiptData }) => {
  const [isStoring, setIsStoring] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const storeOnBlockchain = async () => {
    setIsStoring(true);
    setError(null);
    try {
      const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const totalAmountInWei = ethers.utils.parseEther(receiptData.totalAmount.toString());
      const fuelQuantityInWei = ethers.utils.parseEther(receiptData.fuelQuantity.toString());

      const transaction = await contract.storeReceipt(
        totalAmountInWei,
        receiptData.date,
        receiptData.time,
        fuelQuantityInWei
      );

      await transaction.wait();
      setTransactionHash(transaction.hash);
    } catch (err) {
      console.error('Error storing on blockchain:', err);
      setError('Failed to store on blockchain. Please try again.');
    } finally {
      setIsStoring(false);
    }
  };

  return (
    <div className="mt-6">
      <button
        onClick={storeOnBlockchain}
        disabled={isStoring}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors flex items-center justify-center w-full"
      >
        <Database className="mr-2" size={18} />
        {isStoring ? 'Storing...' : 'Store on Blockchain'}
      </button>
      {transactionHash && (
        <p className="mt-2 text-sm text-gray-600">
          Transaction Hash: {transactionHash}
        </p>
      )}
      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default BlockchainStorage;