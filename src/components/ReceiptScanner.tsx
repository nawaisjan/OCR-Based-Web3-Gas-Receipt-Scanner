import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { createWorker } from 'tesseract.js';
import { Upload, Loader } from 'lucide-react';
import { ReceiptData } from '../types';

interface ReceiptScannerProps {
  onReceiptScanned: (data: ReceiptData) => void;
}

const ReceiptScanner: React.FC<ReceiptScannerProps> = ({ onReceiptScanned }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setIsScanning(true);
    setError(null);
    
    try {
      console.log('Creating Tesseract worker...');
      const worker = await createWorker('eng');
      
      console.log('Loading Tesseract...');
      await worker.load();
      
      console.log('Loading English language...');
      await worker.loadLanguage('eng');
      
      console.log('Initializing Tesseract...');
      await worker.initialize('eng');
      
      console.log('Starting OCR...');
      const { data: { text } } = await worker.recognize(file);
      console.log('OCR Result:', text);
      
      const extractedData = extractReceiptData(text);
      console.log('Extracted Data:', extractedData);
      
      onReceiptScanned(extractedData);
      
      await worker.terminate();
    } catch (error) {
      console.error('Error scanning receipt:', error);
      setError('Failed to scan receipt. Please try again.');
    } finally {
      setIsScanning(false);
    }
  }, [onReceiptScanned]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: {'image/*': []} });

  return (
    <div>
      <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors">
        <input {...getInputProps()} />
        {isScanning ? (
          <div className="flex flex-col items-center">
            <Loader className="animate-spin mb-2" size={32} />
            <p>Scanning receipt...</p>
          </div>
        ) : (
          <>
            <Upload className="mx-auto mb-2" size={32} />
            {isDragActive ? (
              <p>Drop the receipt image here...</p>
            ) : (
              <p>Drag & drop a receipt image here, or click to select one</p>
            )}
          </>
        )}
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

function extractReceiptData(text: string): ReceiptData {
  console.log('Extracting data from:', text);
  
  // Updated regex to handle space between $ and amount
  const totalAmountMatch = text.match(/Total:?\s*\$?\s*(\d+(?:\.\d{2})?)/i);
  const dateMatch = text.match(/Date:?\s*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})/i);
  const timeMatch = text.match(/Time:?\s*(\d{1,2}:\d{2}(?:\s*[AP]M)?)/i);
  const fuelQuantityMatch = text.match(/Gallons:?\s*(\d+(?:\.\d{1,3})?)/i);

  console.log('Matches:', { totalAmountMatch, dateMatch, timeMatch, fuelQuantityMatch });

  return {
    totalAmount: totalAmountMatch ? parseFloat(totalAmountMatch[1]) : 0,
    date: dateMatch ? dateMatch[1] : '',
    time: timeMatch ? timeMatch[1] : '',
    fuelQuantity: fuelQuantityMatch ? parseFloat(fuelQuantityMatch[1]) : 0,
  };
}

export default ReceiptScanner;