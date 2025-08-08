import React, { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { parseExcelFile, parseCSVFile, validateApplicantData } from '../utils/excelParser';
import { Applicant, UploadProgress } from '../types/applicant';

interface FileUploadProps {
  onDataProcessed: (data: Applicant[]) => void;
  onProgressUpdate: (progress: UploadProgress) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onDataProcessed, onProgressUpdate }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  }, []);

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    setUploadStatus('idle');
    setStatusMessage('');

    try {
      // Check file type
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (!['xlsx', 'xls', 'csv'].includes(fileExtension || '')) {
        throw new Error('Please upload a valid Excel (.xlsx, .xls) or CSV file');
      }

      // Parse file
      setStatusMessage('Parsing file...');
      let rawData: any[];
      
      if (fileExtension === 'csv') {
        rawData = await parseCSVFile(file);
      } else {
        rawData = await parseExcelFile(file);
      }

      // Update progress
      onProgressUpdate({
        total: rawData.length,
        processed: 0,
        errors: [],
        warnings: []
      });

      // Validate and process data
      setStatusMessage('Validating data...');
      const { valid, errors, duplicates } = validateApplicantData(rawData);

      // Update final progress
      onProgressUpdate({
        total: rawData.length,
        processed: valid.length,
        errors: [...errors, ...duplicates],
        warnings: []
      });

      if (valid.length === 0) {
        throw new Error('No valid data found in the file');
      }

      // Send to parent component
      onDataProcessed(valid);
      
      setUploadStatus('success');
      const totalIssues = errors.length + duplicates.length;
      setStatusMessage(`Successfully processed ${valid.length} applicants${totalIssues > 0 ? ` (${duplicates.length} duplicates skipped, ${errors.length} errors)` : ''}`);
    } catch (error) {
      setUploadStatus('error');
      setStatusMessage(error instanceof Error ? error.message : 'An error occurred during processing');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Internship Applications</h2>
      
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className={`p-3 rounded-full ${isDragging ? 'bg-blue-100' : 'bg-gray-100'}`}>
            <Upload className={`w-8 h-8 ${isDragging ? 'text-blue-600' : 'text-gray-600'}`} />
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-900">
              {isDragging ? 'Drop your file here' : 'Drag and drop your Excel file'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Supports .xlsx, .xls, and .csv files
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">or</span>
            <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
              <FileText className="w-4 h-4 mr-2" />
              Choose File
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {(isProcessing || uploadStatus !== 'idle') && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            {isProcessing && (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            )}
            {uploadStatus === 'success' && (
              <CheckCircle className="w-5 h-5 text-green-600" />
            )}
            {uploadStatus === 'error' && (
              <XCircle className="w-5 h-5 text-red-600" />
            )}
            <span className={`text-sm font-medium ${
              uploadStatus === 'success' ? 'text-green-700' :
              uploadStatus === 'error' ? 'text-red-700' : 'text-gray-700'
            }`}>
              {statusMessage}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;