import React, { useState } from 'react';
import { Applicant } from '../types/applicant';
import { Star, ArrowLeft, Search, Filter, CheckCircle, Award, Send } from 'lucide-react';
import ApplicantTable from './ApplicantTable';
import EmailModal from './EmailModal';

interface ApprovedCandidatesProps {
  approvedApplicants: Applicant[];
  onShortlist: (applicant: Applicant) => void;
  onRemoveFromApproved: (applicant: Applicant) => void;
}

const ApprovedCandidates: React.FC<ApprovedCandidatesProps> = ({ 
  approvedApplicants, 
  onShortlist, 
  onRemoveFromApproved 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailRecipients, setEmailRecipients] = useState<Applicant[]>([]);
  const [filters, setFilters] = useState({
    approvalType: '',
    term: '',
    quotaCategory: ''
  });

  const filteredApplicants = approvedApplicants.filter(applicant => {
    const matchesSearch = !searchTerm || 
      applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.cpf.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesApprovalType = !filters.approvalType || 
      (filters.approvalType === 'auto' && applicant.autoApproved) ||
      (filters.approvalType === 'manual' && applicant.manuallyApproved);

    const matchesTerm = !filters.term || applicant.term === filters.term;
    const matchesQuota = !filters.quotaCategory || applicant.quotaCategory === filters.quotaCategory;

    return matchesSearch && matchesApprovalType && matchesTerm && matchesQuota;
  });

  const stats = {
    total: approvedApplicants.length,
    autoApproved: approvedApplicants.filter(a => a.autoApproved).length,
    manuallyApproved: approvedApplicants.filter(a => a.manuallyApproved).length,
    ongcWards: approvedApplicants.filter(a => a.autoApproved && a.approvalReason === 'ONGC Employee Ward').length
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === '' ? '' : value
    }));
  };

  const clearFilters = () => {
    setFilters({
      approvalType: '',
      term: '',
      quotaCategory: ''
    });
    setSearchTerm('');
  };

  const handleBulkShortlist = (selectedApplicants: Applicant[]) => {
    selectedApplicants.forEach(applicant => onShortlist(applicant));
  };

  const handleBulkRemove = (selectedApplicants: Applicant[]) => {
    selectedApplicants.forEach(applicant => onRemoveFromApproved(applicant));
  };

  const handleSendEmails = (selectedApplicants: Applicant[]) => {
    setEmailRecipients(selectedApplicants);
    setShowEmailModal(true);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <h2 className="text-xl font-semibold text-gray-900">Approved Candidates</h2>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm font-medium text-green-700">Total Approved</p>
          <p className="text-2xl font-bold text-green-900">{stats.total}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm font-medium text-blue-700">Auto Approved</p>
          <p className="text-2xl font-bold text-blue-900">{stats.autoApproved}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm font-medium text-purple-700">Manual Approved</p>
          <p className="text-2xl font-bold text-purple-900">{stats.manuallyApproved}</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <p className="text-sm font-medium text-orange-700">ONGC Wards</p>
          <p className="text-2xl font-bold text-orange-900">{stats.ongcWards}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search approved candidates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>

        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Approval Type</label>
                <select
                  value={filters.approvalType}
                  onChange={(e) => handleFilterChange('approvalType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">All Types</option>
                  <option value="auto">Auto Approved</option>
                  <option value="manual">Manually Approved</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Term</label>
                <select
                  value={filters.term}
                  onChange={(e) => handleFilterChange('term', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">All Terms</option>
                  <option value="Summer">Summer</option>
                  <option value="Winter">Winter</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quota Category</label>
                <select
                  value={filters.quotaCategory}
                  onChange={(e) => handleFilterChange('quotaCategory', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">All Categories</option>
                  <option value="General">General</option>
                  <option value="Reserved">Reserved</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <ApplicantTable 
        applicants={filteredApplicants} 
        showActions={true}
        showBulkActions={true}
        showEmailButton={true}
        actionType="shortlist"
        onAction={onShortlist}
        onSecondaryAction={onRemoveFromApproved}
        onBulkAction={handleBulkShortlist}
        onBulkSecondaryAction={handleBulkRemove}
        onSendEmails={handleSendEmails}
        actionLabel="Shortlist"
        secondaryActionLabel="Remove"
        bulkActionLabel="Bulk Shortlist"
        bulkSecondaryActionLabel="Bulk Remove"
        emailButtonLabel="Send Approval Emails"
        actionIcon={Star}
        secondaryActionIcon={ArrowLeft}
        actionColor="bg-yellow-600 hover:bg-yellow-700"
        secondaryActionColor="bg-red-600 hover:bg-red-700"
      />

      {filteredApplicants.length === 0 && (
        <div className="text-center py-8">
          <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No approved candidates found</p>
        </div>
      )}
    </div>

      {/* Email Modal */}
      {showEmailModal && (
        <EmailModal
          recipients={emailRecipients}
          emailType="approval"
          onClose={() => setShowEmailModal(false)}
          onSend={() => {
            setShowEmailModal(false);
            setEmailRecipients([]);
          }}
        />
      )}
    </>
  );
};

export default ApprovedCandidates;