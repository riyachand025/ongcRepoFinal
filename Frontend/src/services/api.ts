import { Applicant } from '../types/applicant';

const API_BASE_URL = '/api';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('ongc-auth-token');
};

// Helper function to make authenticated API calls
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication token not found');
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API call failed: ${response.status}`);
  }

  return response.json();
};

// Shortlisted Candidates API
export const shortlistedApi = {
  // Get all shortlisted candidates
  getAll: async (): Promise<Applicant[]> => {
    const response = await apiCall('/shortlisted');
    return response.data || [];
  },

  // Add candidate to shortlisted
  add: async (applicantData: Applicant, shortlistedBy: string, shortlistReason?: string, shortlistNotes?: string): Promise<Applicant> => {
    const response = await apiCall('/shortlisted', {
      method: 'POST',
      body: JSON.stringify({
        applicantData,
        shortlistedBy,
        shortlistReason,
        shortlistNotes
      }),
    });
    return response.data;
  },

  // Remove candidate from shortlisted
  remove: async (candidateId: string): Promise<void> => {
    await apiCall(`/shortlisted/${candidateId}`, {
      method: 'DELETE',
    });
  }
};

// Approved Candidates API
export const approvedApi = {
  // Get all approved candidates
  getAll: async (): Promise<Applicant[]> => {
    const response = await apiCall('/approved');
    return response.data || [];
  },

  // Approve a shortlisted candidate
  approve: async (candidateId: string, approvedBy: string, approvalReason?: string, approvalNotes?: string): Promise<Applicant> => {
    const response = await apiCall('/approved', {
      method: 'POST',
      body: JSON.stringify({
        applicantId: candidateId,
        approvedBy,
        approvalReason,
        approvalNotes
      }),
    });
    return response.data;
  },

  // Update offer letter status
  updateOfferLetter: async (candidateId: string, offerLetterSent: boolean): Promise<Applicant> => {
    const response = await apiCall(`/approved/${candidateId}/offer-letter`, {
      method: 'PATCH',
      body: JSON.stringify({
        offerLetterSent,
        offerLetterSentAt: offerLetterSent ? new Date().toISOString() : null
      }),
    });
    return response.data;
  }
};

// Health check
export const healthCheck = async () => {
  return await fetch(`${API_BASE_URL}/health`).then(res => res.json());
}; 