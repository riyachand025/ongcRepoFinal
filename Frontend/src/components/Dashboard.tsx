import React, { useState, useEffect } from 'react';
import { Applicant, FilterOptions } from '../types/applicant';
import { Search, Filter, Download, RefreshCw, Upload, Users, Send } from 'lucide-react';
import ApplicantTable from './ApplicantTable';
import EmailModal from './EmailModal';

interface DashboardProps {
  applicants: Applicant[];
  onRefresh: () => void;
  onApprove: (applicant: Applicant) => void;
  onReject: (applicant: Applicant) => void;
  onBulkApprove: (applicants: Applicant[]) => void;
  onBulkReject: (applicants: Applicant[]) => void;
  onUpload: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  applicants, 
  onRefresh, 
  onApprove, 
  onReject, 
  onBulkApprove,
  onBulkReject,
  onUpload 
}) => {
  const [filteredApplicants, setFilteredApplicants] = useState<Applicant[]>(applicants);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [showFilters, setShowFilters] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [wardFilter, setWardFilter] = useState('');
  const [collegeFilter, setCollegeFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailRecipients, setEmailRecipients] = useState<Applicant[]>([]);

  useEffect(() => {
    let filtered = applicants;

    // Sort by submission timestamp (most recent first)
    filtered = filtered.sort((a, b) => {
      const dateA = a.submissionTimestamp ? new Date(a.submissionTimestamp).getTime() : 0;
      const dateB = b.submissionTimestamp ? new Date(b.submissionTimestamp).getTime() : 0;
      return dateB - dateA; // Descending order (newest first)
    });

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(applicant =>
        applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        applicant.cpf.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    if (filters.term) {
      filtered = filtered.filter(applicant => applicant.term === filters.term);
    }
    if (filters.category) {
      filtered = filtered.filter(applicant => applicant.category === filters.category);
    }
    if (filters.quotaCategory) {
      filtered = filtered.filter(applicant => applicant.quotaCategory === filters.quotaCategory);
    }
    if (filters.status) {
      filtered = filtered.filter(applicant => applicant.status === filters.status);
    }
    if (filters.mentorAssigned) {
      filtered = filtered.filter(applicant => 
        filters.mentorAssigned === 'yes' ? applicant.mentorName : !applicant.mentorName
      );
    }
    if (filters.lateApplication !== undefined) {
      filtered = filtered.filter(applicant => applicant.lateApplication === filters.lateApplication);
    }
    
    // Apply special filters
    if (wardFilter === 'ongc') {
      filtered = filtered.filter(applicant => 
        applicant.fatherMotherOccupation?.toLowerCase().includes('ongc') ||
        applicant.fatherMotherOccupation?.toLowerCase().includes('oil and natural gas') ||
        applicant.guardianOccupationDetails?.toLowerCase().includes('ongc') ||
        applicant.guardianOccupationDetails?.toLowerCase().includes('oil and natural gas')
      );
    }
    
    if (collegeFilter === 'government') {
      filtered = filtered.filter(applicant => {
        const institute = applicant.presentInstitute?.toLowerCase() || '';
        return institute.includes('iit') || 
               institute.includes('nit') || 
               institute.includes('indian institute') ||
               institute.includes('national institute');
      });
    }
    
    if (locationFilter === 'dehradun') {
      filtered = filtered.filter(applicant => 
        applicant.address?.toLowerCase().includes('dehradun') ||
        applicant.location?.toLowerCase().includes('dehradun')
      );
    }

    setFilteredApplicants(filtered);
  }, [applicants, searchTerm, filters, wardFilter, collegeFilter, locationFilter]);

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === '' ? undefined : value
    }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
    setWardFilter('');
    setCollegeFilter('');
    setLocationFilter('');
  };

  const exportToCSV = () => {
    const headers = [
      'Name', 'Email', 'CPF', 'Term', 'Quota Category', 'Status', 'Late Application',
      'Mentor Name', 'Institute', 'SGPA', 'Category'
    ];
    
    const csvContent = [
      headers.join(','),
      ...filteredApplicants.map(applicant => [
        applicant.name,
        applicant.email,
        applicant.cpf,
        applicant.term,
        applicant.quotaCategory,
        applicant.status,
        applicant.lateApplication ? 'Yes' : 'No',
        applicant.mentorName || '',
        applicant.presentInstitute,
        applicant.lastSemesterSGPA,
        applicant.category
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'internship_applicants.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const clearAllData = () => {
    localStorage.removeItem('ongc-applicants');
    onRefresh();
    setShowClearConfirm(false);
  };

  const handleSendEmails = (selectedApplicants: Applicant[]) => {
    setEmailRecipients(selectedApplicants);
    setShowEmailModal(true);
  };

  const stats = {
    total: filteredApplicants.length,
    pending: filteredApplicants.filter(a => a.status === 'Pending').length,
    rejected: filteredApplicants.filter(a => a.status === 'Rejected').length,
    ongcWards: filteredApplicants.filter(a => 
      a.fatherMotherOccupation?.toLowerCase().includes('ongc') ||
      a.fatherMotherOccupation?.toLowerCase().includes('oil and natural gas') ||
      a.guardianOccupationDetails?.toLowerCase().includes('ongc') ||
      a.guardianOccupationDetails?.toLowerCase().includes('oil and natural gas')
    ).length,
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <Users className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Applicants</h2>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={onUpload}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Excel</span>
          </button>
          <button
            onClick={() => setShowClearConfirm(true)}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center space-x-2"
          >
            <span>Clear All Data</span>
          </button>
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm font-medium text-blue-700">Total Applications</p>
          <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm font-medium text-yellow-700">Pending</p>
          <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <p className="text-sm font-medium text-orange-700">ONGC Wards</p>
          <p className="text-2xl font-bold text-orange-900">{stats.ongcWards}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-sm font-medium text-red-700">Rejected</p>
          <p className="text-2xl font-bold text-red-900">{stats.rejected}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or CPF..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Term</label>
                <select
                  value={filters.term || ''}
                  onChange={(e) => handleFilterChange('term', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Terms</option>
                  <option value="Summer">Summer</option>
                  <option value="Winter">Winter</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quota Category</label>
                <select
                  value={filters.quotaCategory || ''}
                  onChange={(e) => handleFilterChange('quotaCategory', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  <option value="General">General</option>
                  <option value="Reserved">Reserved</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mentor Assigned</label>
                <select
                  value={filters.mentorAssigned || ''}
                  onChange={(e) => handleFilterChange('mentorAssigned', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ward Filter</label>
                <select
                  value={wardFilter}
                  onChange={(e) => setWardFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Applicants</option>
                  <option value="ongc">ONGC Employee Wards</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">College Type</label>
                <select
                  value={collegeFilter}
                  onChange={(e) => setCollegeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Colleges</option>
                  <option value="government">Government (IITs, NITs)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Locations</option>
                  <option value="dehradun">Dehradun Citizens</option>
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
        actionType="approve"
        onAction={onApprove}
        onSecondaryAction={onReject}
        onBulkAction={onBulkApprove}
        onBulkSecondaryAction={onBulkReject}
        onSendEmails={handleSendEmails}
        actionLabel="Approve"
        secondaryActionLabel="Reject"
        bulkActionLabel="Bulk Approve"
        bulkSecondaryActionLabel="Bulk Reject"
        emailButtonLabel="Send Approval Emails"
      />

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Clear All Data</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete all applicant data? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={clearAllData}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete All Data
              </button>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
};

export default Dashboard;