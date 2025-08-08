import React from 'react';
import { Applicant, UploadProgress } from '../types/applicant';
import { CheckCircle, XCircle, AlertTriangle, Users, Filter } from 'lucide-react';

interface DataPreviewProps {
  data: Applicant[];
  progress: UploadProgress;
  onConfirm: () => void;
}

const DataPreview: React.FC<DataPreviewProps> = ({ data, progress, onConfirm }) => {
  const stats = {
    total: progress.total,
    processed: progress.processed,
    errors: progress.errors.length,
    warnings: progress.warnings.length,
    general: data.filter(a => a.quotaCategory === 'General').length,
    reserved: data.filter(a => a.quotaCategory === 'Reserved').length,
    summer: data.filter(a => a.term === 'Summer').length,
    winter: data.filter(a => a.term === 'Winter').length,
    lateApplications: data.filter(a => a.lateApplication).length
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Preview</h2>
      
      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Total Records</span>
          </div>
          <p className="text-2xl font-bold text-blue-900">{stats.processed}</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-700">Success Rate</span>
          </div>
          <p className="text-2xl font-bold text-green-900">
            {Math.round((stats.processed / stats.total) * 100)}%
          </p>
        </div>
        
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium text-orange-700">Reserved Quota</span>
          </div>
          <p className="text-2xl font-bold text-orange-900">{stats.reserved}</p>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="text-sm font-medium text-red-700">Late Applications</span>
          </div>
          <p className="text-2xl font-bold text-red-900">{stats.lateApplications}</p>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Quota Distribution</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">General</span>
              <span className="font-medium">{stats.general}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Reserved</span>
              <span className="font-medium">{stats.reserved}</span>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Term Distribution</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Summer</span>
              <span className="font-medium">{stats.summer}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Winter</span>
              <span className="font-medium">{stats.winter}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Errors */}
      {(progress.errors.length > 0 || progress.warnings.length > 0) && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-red-700 mb-3 flex items-center">
            <XCircle className="w-5 h-5 mr-2" />
            Issues Found ({progress.errors.length + progress.warnings.length})
          </h3>
          <div className="bg-red-50 p-4 rounded-lg max-h-40 overflow-y-auto">
            <ul className="text-sm text-red-700 space-y-1">
              {progress.errors.map((error, index) => (
                <li key={index} className={error.includes('Duplicate') ? 'text-orange-700' : 'text-red-700'}>
                  • {error}
                </li>
              ))}
              {progress.warnings.map((warning, index) => (
                <li key={`warning-${index}`} className="text-yellow-700">
                  • {warning}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Sample Data */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Sample Records</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Term</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quota</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data
                .sort((a, b) => {
                  const dateA = a.submissionTimestamp ? new Date(a.submissionTimestamp).getTime() : 0;
                  const dateB = b.submissionTimestamp ? new Date(b.submissionTimestamp).getTime() : 0;
                  return dateB - dateA;
                })
                .slice(0, 5)
                .map((applicant, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-xs text-gray-600">
                    {applicant.submissionTimestamp ? 
                      new Date(applicant.submissionTimestamp).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 
                      'N/A'
                    }
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900">{applicant.name}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">{applicant.email}</td>
                  <td className="px-4 py-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      applicant.term === 'Summer' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {applicant.term}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      applicant.quotaCategory === 'General' ? 'bg-gray-100 text-gray-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {applicant.quotaCategory}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">{applicant.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {data.length > 5 && (
          <p className="text-sm text-gray-500 mt-2">Showing 5 of {data.length} records</p>
        )}
      </div>

      {/* Confirm Button */}
      <div className="flex justify-end">
        <button
          onClick={onConfirm}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Confirm and Save to Database
        </button>
      </div>
    </div>
  );
};

export default DataPreview;