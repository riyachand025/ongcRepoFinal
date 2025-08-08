import React, { useState } from 'react';
import { Applicant } from '../types/applicant';
import { Star, Award, Send } from 'lucide-react';
import ApplicantTable from './ApplicantTable';
import EmailModal from './EmailModal';

interface ShortlistedProps {
  shortlistedApplicants: Applicant[];
}

const Shortlisted: React.FC<ShortlistedProps> = ({ shortlistedApplicants }) => {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailRecipients, setEmailRecipients] = useState<Applicant[]>([]);

  const stats = {
    total: shortlistedApplicants.length,
    summer: shortlistedApplicants.filter(a => a.term === 'Summer').length,
    winter: shortlistedApplicants.filter(a => a.term === 'Winter').length,
    general: shortlistedApplicants.filter(a => a.quotaCategory === 'General').length,
    reserved: shortlistedApplicants.filter(a => a.quotaCategory === 'Reserved').length
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
          <Star className="w-6 h-6 text-yellow-600" />
          <h2 className="text-xl font-semibold text-gray-900">Shortlisted Candidates</h2>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm font-medium text-yellow-700">Total Shortlisted</p>
          <p className="text-2xl font-bold text-yellow-900">{stats.total}</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <p className="text-sm font-medium text-orange-700">Summer Term</p>
          <p className="text-2xl font-bold text-orange-900">{stats.summer}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm font-medium text-blue-700">Winter Term</p>
          <p className="text-2xl font-bold text-blue-900">{stats.winter}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm font-medium text-purple-700">Reserved Quota</p>
          <p className="text-2xl font-bold text-purple-900">{stats.reserved}</p>
        </div>
      </div>

      {/* Results */}
      {shortlistedApplicants.length > 0 ? (
        <ApplicantTable 
          applicants={shortlistedApplicants} 
          showActions={false}
          showBulkActions={true}
          showEmailButton={true}
          onSendEmails={handleSendEmails}
          emailButtonLabel="Send Training Confirmation"
        />
      ) : (
        <div className="text-center py-12">
          <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Shortlisted Candidates Yet</h3>
          <p className="text-gray-500">
            Candidates will appear here once they are shortlisted from the approved list.
          </p>
        </div>
      )}
    </div>

      {/* Email Modal */}
      {showEmailModal && (
        <EmailModal
          recipients={emailRecipients}
          emailType="shortlisted"
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

export default Shortlisted;