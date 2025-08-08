import React, { useState } from 'react';
import { Applicant } from '../types/applicant';
import { ChevronLeft, ChevronRight, Eye, Mail, Phone, CheckCircle, XCircle, Star, ArrowLeft, Send } from 'lucide-react';

interface ApplicantTableProps {
  applicants: Applicant[];
  showActions?: boolean;
  actionType?: 'approve' | 'shortlist';
  onAction?: (applicant: Applicant) => void;
  onSecondaryAction?: (applicant: Applicant) => void;
  actionLabel?: string;
  secondaryActionLabel?: string;
  actionIcon?: React.ComponentType<any>;
  secondaryActionIcon?: React.ComponentType<any>;
  actionColor?: string;
  secondaryActionColor?: string;
  showBulkActions?: boolean;
  onBulkAction?: (applicants: Applicant[]) => void;
  onBulkSecondaryAction?: (applicants: Applicant[]) => void;
  onSendEmails?: (applicants: Applicant[]) => void;
  bulkActionLabel?: string;
  bulkSecondaryActionLabel?: string;
  emailButtonLabel?: string;
  showEmailButton?: boolean;
}

const ApplicantTable: React.FC<ApplicantTableProps> = ({ 
  applicants,
  showActions = false,
  actionType = 'approve',
  onAction,
  onSecondaryAction,
  actionLabel = 'Approve',
  secondaryActionLabel = 'Reject',
  actionIcon,
  secondaryActionIcon,
  actionColor = 'bg-green-600 hover:bg-green-700',
  secondaryActionColor = 'bg-red-600 hover:bg-red-700',
  showBulkActions = false,
  onBulkAction,
  onBulkSecondaryAction,
  onSendEmails,
  bulkActionLabel = 'Bulk Approve',
  bulkSecondaryActionLabel = 'Bulk Reject',
  emailButtonLabel = 'Send Emails',
  showEmailButton = false
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50); // Changed to 50 records per page
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [selectedApplicants, setSelectedApplicants] = useState<Set<string>>(new Set());

  // Set default icons based on action type
  const ActionIcon = actionIcon || (actionType === 'approve' ? CheckCircle : Star);
  const SecondaryActionIcon = secondaryActionIcon || (actionType === 'approve' ? XCircle : ArrowLeft);

  const totalPages = Math.ceil(applicants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentApplicants = applicants.slice(startIndex, endIndex);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatSubmissionTime = (date: Date) => {
    return new Date(date).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(currentApplicants.map(a => a.email));
      setSelectedApplicants(allIds);
    } else {
      setSelectedApplicants(new Set());
    }
  };

  const handleSelectApplicant = (email: string, checked: boolean) => {
    const newSelected = new Set(selectedApplicants);
    if (checked) {
      newSelected.add(email);
    } else {
      newSelected.delete(email);
    }
    setSelectedApplicants(newSelected);
  };

  const getSelectedApplicants = () => {
    return applicants.filter(a => selectedApplicants.has(a.email));
  };

  const isAllSelected = currentApplicants.length > 0 && 
    currentApplicants.every(a => selectedApplicants.has(a.email));
  const isIndeterminate = selectedApplicants.size > 0 && !isAllSelected;

  return (
    <div className="space-y-4">
      {/* Bulk Actions */}
      {showBulkActions && selectedApplicants.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              {selectedApplicants.size} applicant{selectedApplicants.size !== 1 ? 's' : ''} selected
            </span>
            <div className="flex space-x-2">
              {showEmailButton && onSendEmails && (
                <button
                  onClick={() => onSendEmails(getSelectedApplicants())}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1 text-sm"
                >
                  <Send className="w-3 h-3" />
                  <span>{emailButtonLabel}</span>
                </button>
              )}
              {onBulkAction && (
                <button
                  onClick={() => onBulkAction(getSelectedApplicants())}
                  className={`px-3 py-1 text-white rounded-lg transition-colors flex items-center space-x-1 text-sm ${actionColor}`}
                >
                  <ActionIcon className="w-3 h-3" />
                  <span>{bulkActionLabel}</span>
                </button>
              )}
              {onBulkSecondaryAction && (
                <button
                  onClick={() => onBulkSecondaryAction(getSelectedApplicants())}
                  className={`px-3 py-1 text-white rounded-lg transition-colors flex items-center space-x-1 text-sm ${secondaryActionColor}`}
                >
                  <SecondaryActionIcon className="w-3 h-3" />
                  <span>{bulkSecondaryActionLabel}</span>
                </button>
              )}
              <button
                onClick={() => setSelectedApplicants(new Set())}
                className="px-3 py-1 text-gray-600 hover:text-gray-800 transition-colors text-sm"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {showBulkActions && (
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isIndeterminate;
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
              )}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Applicant
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Academic
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mentor
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              {showActions && (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                View
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentApplicants.map((applicant) => (
              <tr key={applicant._id} className="hover:bg-gray-50">
                {showBulkActions && (
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedApplicants.has(applicant.email)}
                      onChange={(e) => handleSelectApplicant(applicant.email, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                )}
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">{applicant.name}</span>
                    <span className="text-xs text-gray-500">CPF: {applicant.cpf}</span>
                    <span className="text-xs text-gray-500">
                      {applicant.submissionTimestamp ? 
                        `Submitted: ${formatSubmissionTime(applicant.submissionTimestamp)}` : 
                        `Age: ${applicant.age}`
                      }
                    </span>
                    {(applicant.autoApproved || applicant.manuallyApproved) && (
                      <div className="flex items-center space-x-1 mt-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          applicant.autoApproved ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {applicant.autoApproved ? 'Auto' : 'Manual'}
                        </span>
                        {applicant.approvalReason && (
                          <span className="text-xs text-gray-500">({applicant.approvalReason})</span>
                        )}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-1">
                      <Mail className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-600">{applicant.email}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Phone className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-600">{applicant.mobileNo}</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-gray-900">
                      {applicant.presentInstitute}
                    </span>
                    <span className="text-xs text-gray-500">
                      Sem {applicant.presentSemester} | SGPA: {applicant.lastSemesterSGPA}
                    </span>
                    <span className="text-xs text-gray-500">
                      12th: {applicant.percentageIn10Plus2}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col space-y-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      applicant.term === 'Summer' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {applicant.term}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      applicant.quotaCategory === 'General' ? 'bg-gray-100 text-gray-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {applicant.quotaCategory}
                    </span>
                    {applicant.lateApplication && (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        Late
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    {applicant.mentorName ? (
                      <>
                        <span className="text-xs font-medium text-gray-900">{applicant.mentorName}</span>
                        <span className="text-xs text-gray-500">{applicant.mentorDesignation}</span>
                        <span className="text-xs text-gray-500">{applicant.mentorSection}</span>
                      </>
                    ) : (
                      <span className="text-xs text-gray-500">No mentor assigned</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(applicant.status)}`}>
                    {applicant.status}
                  </span>
                </td>
                {showActions && (
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      {onAction && (
                        <button
                          onClick={() => onAction(applicant)}
                          className={`px-3 py-1 text-xs text-white rounded-lg transition-colors flex items-center space-x-1 ${actionColor}`}
                        >
                          <ActionIcon className="w-3 h-3" />
                          <span>{actionLabel}</span>
                        </button>
                      )}
                      {onSecondaryAction && (
                        <button
                          onClick={() => onSecondaryAction(applicant)}
                          className={`px-3 py-1 text-xs text-white rounded-lg transition-colors flex items-center space-x-1 ${secondaryActionColor}`}
                        >
                          <SecondaryActionIcon className="w-3 h-3" />
                          <span>{secondaryActionLabel}</span>
                        </button>
                      )}
                    </div>
                  </td>
                )}
                <td className="px-4 py-3">
                  <button
                    onClick={() => setSelectedApplicant(applicant)}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(endIndex, applicants.length)} of {applicants.length} results
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Applicant Detail Modal */}
      {selectedApplicant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Applicant Details: {selectedApplicant.name}
                </h3>
                <button
                  onClick={() => setSelectedApplicant(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Personal Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Name:</span> {selectedApplicant.name}</div>
                    <div><span className="font-medium">Age:</span> {selectedApplicant.age}</div>
                    <div><span className="font-medium">Gender:</span> {selectedApplicant.gender}</div>
                    <div><span className="font-medium">Email:</span> {selectedApplicant.email}</div>
                    <div><span className="font-medium">Mobile:</span> {selectedApplicant.mobileNo}</div>
                    <div><span className="font-medium">Address:</span> {selectedApplicant.address}</div>
                    <div><span className="font-medium">Father/Mother:</span> {selectedApplicant.fatherMotherName}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Academic Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Institute:</span> {selectedApplicant.presentInstitute}</div>
                    <div><span className="font-medium">Semester:</span> {selectedApplicant.presentSemester}</div>
                    <div><span className="font-medium">SGPA:</span> {selectedApplicant.lastSemesterSGPA}</div>
                    <div><span className="font-medium">12th Percentage:</span> {selectedApplicant.percentageIn10Plus2}%</div>
                    <div><span className="font-medium">Training Area:</span> {selectedApplicant.areasOfTraining}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Application Details</h4>
                  <div className="space-y-2 text-sm">
                    {selectedApplicant.submissionTimestamp && (
                      <div><span className="font-medium">Submitted:</span> {formatSubmissionTime(selectedApplicant.submissionTimestamp)}</div>
                    )}
                    <div><span className="font-medium">CPF:</span> {selectedApplicant.cpf}</div>
                    <div><span className="font-medium">Category:</span> {selectedApplicant.category}</div>
                    <div><span className="font-medium">Quota:</span> {selectedApplicant.quotaCategory}</div>
                    <div><span className="font-medium">Term:</span> {selectedApplicant.term}</div>
                    <div><span className="font-medium">Status:</span> {selectedApplicant.status}</div>
                    <div><span className="font-medium">Late Application:</span> {selectedApplicant.lateApplication ? 'Yes' : 'No'}</div>
                    {selectedApplicant.autoApproved && (
                      <div><span className="font-medium">Auto Approved:</span> Yes ({selectedApplicant.approvalReason})</div>
                    )}
                    {selectedApplicant.manuallyApproved && (
                      <div><span className="font-medium">Manually Approved:</span> Yes</div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Mentor Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Name:</span> {selectedApplicant.mentorName || 'Not assigned'}</div>
                    <div><span className="font-medium">Designation:</span> {selectedApplicant.mentorDesignation || 'N/A'}</div>
                    <div><span className="font-medium">Section:</span> {selectedApplicant.mentorSection || 'N/A'}</div>
                    <div><span className="font-medium">Location:</span> {selectedApplicant.mentorLocation || 'N/A'}</div>
                    <div><span className="font-medium">Email:</span> {selectedApplicant.mentorEmail || 'N/A'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicantTable;