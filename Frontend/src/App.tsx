import React, { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';
import { Applicant, UploadProgress } from './types/applicant';
import FileUpload from './components/FileUpload';
import DataPreview from './components/DataPreview';
import Dashboard from './components/Dashboard';
import ApprovedCandidates from './components/ApprovedCandidates';
import Shortlisted from './components/Shortlisted';
import Sidebar from './components/Sidebar';
import { Building, Settings, LogOut } from 'lucide-react';

const AppContent: React.FC = () => {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState<'applicants' | 'approved' | 'shortlisted' | 'upload' | 'preview'>('applicants');
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [approvedApplicants, setApprovedApplicants] = useState<Applicant[]>([]);
  const [shortlistedApplicants, setShortlistedApplicants] = useState<Applicant[]>([]);
  const [previewData, setPreviewData] = useState<Applicant[]>([]);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    total: 0,
    processed: 0,
    errors: [],
    warnings: []
  });

  useEffect(() => {
    // Clear previous data and start fresh
    localStorage.removeItem('ongc-applicants');
    localStorage.removeItem('ongc-approved');
    localStorage.removeItem('ongc-shortlisted');
    setApplicants([]);
    setApprovedApplicants([]);
    setShortlistedApplicants([]);
  }, []);

  // Auto-approve ONGC employee wards
  const autoApproveONGCWards = (newApplicants: Applicant[]) => {
    const autoApproved: Applicant[] = [];
    const remaining: Applicant[] = [];

    newApplicants.forEach(applicant => {
      // Check if applicant is ward of ONGC employee
      const isONGCWard = applicant.fatherMotherOccupation?.toLowerCase().includes('ongc') ||
                        applicant.fatherMotherOccupation?.toLowerCase().includes('oil and natural gas') ||
                        applicant.guardianOccupationDetails?.toLowerCase().includes('ongc') ||
                        applicant.guardianOccupationDetails?.toLowerCase().includes('oil and natural gas');

      if (isONGCWard) {
        autoApproved.push({
          ...applicant,
          status: 'Approved',
          autoApproved: true,
          approvalReason: 'ONGC Employee Ward'
        });
      } else {
        remaining.push(applicant);
      }
    });

    return { autoApproved, remaining };
  };
  const handleDataProcessed = (data: Applicant[]) => {
    setPreviewData(data);
    setCurrentView('preview');
  };

  const handleProgressUpdate = (progress: UploadProgress) => {
    setUploadProgress(progress);
  };

  const handleConfirmData = () => {
    // Prevent duplicates by checking email and CPF
    const existingEmails = new Set(applicants.map(a => a.email.toLowerCase()));
    const existingCPFs = new Set(applicants.map(a => a.cpf));
    
    const uniqueNewApplicants = previewData.filter(newApplicant => {
      const emailExists = existingEmails.has(newApplicant.email.toLowerCase());
      const cpfExists = existingCPFs.has(newApplicant.cpf);
      return !emailExists && !cpfExists;
    });
    
    // Auto-approve ONGC wards
    const { autoApproved, remaining } = autoApproveONGCWards(uniqueNewApplicants);
    
    const newApplicants = [...applicants, ...uniqueNewApplicants];
    const newApproved = [...approvedApplicants, ...autoApproved];
    
    setApplicants(newApplicants);
    setApprovedApplicants(newApproved);
    
    localStorage.setItem('ongc-applicants', JSON.stringify(newApplicants));
    localStorage.setItem('ongc-approved', JSON.stringify(newApproved));
    
    setCurrentView('applicants');
  };

  const handleRefresh = () => {
    // In a real app, this would fetch from the API
    const savedApplicants = localStorage.getItem('ongc-applicants');
    const savedApproved = localStorage.getItem('ongc-approved');
    const savedShortlisted = localStorage.getItem('ongc-shortlisted');
    
    if (savedApplicants) {
      setApplicants(JSON.parse(savedApplicants));
    }
    if (savedApproved) {
      setApprovedApplicants(JSON.parse(savedApproved));
    }
    if (savedShortlisted) {
      setShortlistedApplicants(JSON.parse(savedShortlisted));
    }
  };

  const handleApprove = (applicant: Applicant) => {
    const updatedApplicants = applicants.filter(a => a.email !== applicant.email);
    const approvedApplicant = { ...applicant, status: 'Approved', manuallyApproved: true };
    const updatedApproved = [...approvedApplicants, approvedApplicant];
    
    setApplicants(updatedApplicants);
    setApprovedApplicants(updatedApproved);
    
    localStorage.setItem('ongc-applicants', JSON.stringify(updatedApplicants));
    localStorage.setItem('ongc-approved', JSON.stringify(updatedApproved));
  };

  const handleReject = (applicant: Applicant) => {
    const updatedApplicants = applicants.map(a => 
      a.email === applicant.email ? { ...a, status: 'Rejected' } : a
    );
    setApplicants(updatedApplicants);
    localStorage.setItem('ongc-applicants', JSON.stringify(updatedApplicants));
  };

  const handleBulkApprove = (selectedApplicants: Applicant[]) => {
    const selectedEmails = new Set(selectedApplicants.map(a => a.email));
    const updatedApplicants = applicants.filter(a => !selectedEmails.has(a.email));
    const newlyApproved = selectedApplicants.map(a => ({ ...a, status: 'Approved', manuallyApproved: true }));
    const updatedApproved = [...approvedApplicants, ...newlyApproved];
    
    setApplicants(updatedApplicants);
    setApprovedApplicants(updatedApproved);
    
    localStorage.setItem('ongc-applicants', JSON.stringify(updatedApplicants));
    localStorage.setItem('ongc-approved', JSON.stringify(updatedApproved));
  };

  const handleBulkReject = (selectedApplicants: Applicant[]) => {
    const selectedEmails = new Set(selectedApplicants.map(a => a.email));
    const updatedApplicants = applicants.map(a => 
      selectedEmails.has(a.email) ? { ...a, status: 'Rejected' } : a
    );
    setApplicants(updatedApplicants);
    localStorage.setItem('ongc-applicants', JSON.stringify(updatedApplicants));
  };
  const handleShortlist = (applicant: Applicant) => {
    const updatedApproved = approvedApplicants.filter(a => a.email !== applicant.email);
    const shortlistedApplicant = { ...applicant, status: 'Shortlisted' };
    const updatedShortlisted = [...shortlistedApplicants, shortlistedApplicant];
    
    setApprovedApplicants(updatedApproved);
    setShortlistedApplicants(updatedShortlisted);
    
    localStorage.setItem('ongc-approved', JSON.stringify(updatedApproved));
    localStorage.setItem('ongc-shortlisted', JSON.stringify(updatedShortlisted));
  };

  const handleRemoveFromApproved = (applicant: Applicant) => {
    const updatedApproved = approvedApplicants.filter(a => a.email !== applicant.email);
    const restoredApplicant = { ...applicant, status: 'Pending', manuallyApproved: false, autoApproved: false };
    const updatedApplicants = [...applicants, restoredApplicant];
    
    setApprovedApplicants(updatedApproved);
    setApplicants(updatedApplicants);
    
    localStorage.setItem('ongc-approved', JSON.stringify(updatedApproved));
    localStorage.setItem('ongc-applicants', JSON.stringify(updatedApplicants));
  };
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 flex">
        {/* Sidebar */}
        <Sidebar 
          currentView={currentView} 
          setCurrentView={setCurrentView}
          applicantsCount={applicants.length}
          approvedCount={approvedApplicants.length}
          shortlistedCount={shortlistedApplicants.length}
        />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <Building className="w-8 h-8 text-blue-600" />
                    <div>
                      <h1 className="text-xl font-bold text-gray-900">ONGC Dehradun</h1>
                      <p className="text-sm text-gray-500">Internship Application Tracking System</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>{user?.name || 'User'}</span>
                    <span className="text-xs text-gray-500">({user?.role?.replace('_', ' ').toUpperCase()})</span>
                  </div>
                  <button 
                    onClick={logout}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Settings className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            {currentView === 'upload' && (
              <FileUpload
                onDataProcessed={handleDataProcessed}
                onProgressUpdate={handleProgressUpdate}
              />
            )}
            
            {currentView === 'preview' && (
              <DataPreview
                data={previewData}
                progress={uploadProgress}
                onConfirm={handleConfirmData}
              />
            )}
            
            {currentView === 'applicants' && (
              <Dashboard
                applicants={applicants}
                onRefresh={handleRefresh}
                onApprove={handleApprove}
                onReject={handleReject}
                onBulkApprove={handleBulkApprove}
                onBulkReject={handleBulkReject}
                onUpload={() => setCurrentView('upload')}
              />
            )}
            
            {currentView === 'approved' && (
              <ApprovedCandidates
                approvedApplicants={approvedApplicants}
                onShortlist={handleShortlist}
                onRemoveFromApproved={handleRemoveFromApproved}
              />
            )}
            
            {currentView === 'shortlisted' && (
              <Shortlisted
                shortlistedApplicants={shortlistedApplicants}
              />
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;