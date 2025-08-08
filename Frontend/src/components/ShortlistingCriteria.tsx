import React, { useState, useEffect } from 'react';
import { Applicant } from '../types/applicant';
import { Filter, Users, Star, CheckCircle, XCircle, Save, RefreshCw } from 'lucide-react';

interface ShortlistingCriteriaProps {
  applicants: Applicant[];
  onShortlist: (applicants: Applicant[]) => void;
  onClearShortlist: () => void;
  shortlistedApplicants: Applicant[];
}

interface Criteria {
  // Academic Criteria
  minSGPA: number;
  minPercentage10Plus2: number;
  preferredInstitutes: string[];
  
  // Personal Criteria
  ageRange: { min: number; max: number };
  preferredCategories: string[];
  preferredGenders: string[];
  
  // ONGC Specific Criteria
  ongcEmployeeWards: boolean;
  preferredLocations: string[];
  preferredTrainingAreas: string[];
  
  // Application Criteria
  termPreference: 'Summer' | 'Winter' | 'Both';
  quotaCategoryPreference: 'General' | 'Reserved' | 'Both';
  lateApplicationAllowed: boolean;
  
  // Mentor Criteria
  mentorRequired: boolean;
  mentorAvailable: boolean;
}

const ShortlistingCriteria: React.FC<ShortlistingCriteriaProps> = ({
  applicants,
  onShortlist,
  onClearShortlist,
  shortlistedApplicants
}) => {
  const [criteria, setCriteria] = useState<Criteria>({
    minSGPA: 7.0,
    minPercentage10Plus2: 60,
    preferredInstitutes: [],
    ageRange: { min: 18, max: 25 },
    preferredCategories: [],
    preferredGenders: [],
    ongcEmployeeWards: false,
    preferredLocations: [],
    preferredTrainingAreas: [],
    termPreference: 'Both',
    quotaCategoryPreference: 'Both',
    lateApplicationAllowed: false,
    mentorRequired: false,
    mentorAvailable: false
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filteredApplicants, setFilteredApplicants] = useState<Applicant[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Available options for dropdowns
  const availableInstitutes = [...new Set(applicants.map(a => a.presentInstitute).filter(Boolean))];
  const availableCategories = [...new Set(applicants.map(a => a.category).filter(Boolean))];
  const availableGenders = [...new Set(applicants.map(a => a.gender).filter(Boolean))];
  const availableLocations = [...new Set(applicants.map(a => a.location).filter(Boolean))];
  const availableTrainingAreas = [...new Set(applicants.map(a => a.areasOfTraining).filter(Boolean))];

  // Apply criteria and filter applicants
  const applyCriteria = () => {
    setIsProcessing(true);
    console.log('🔍 Applying shortlisting criteria...');
    console.log('📊 Criteria:', criteria);

    const filtered = applicants.filter(applicant => {
      // Academic criteria
      if (applicant.lastSemesterSGPA < criteria.minSGPA) {
        console.log(`❌ ${applicant.name}: SGPA ${applicant.lastSemesterSGPA} < ${criteria.minSGPA}`);
        return false;
      }

      if (applicant.percentageIn10Plus2 < criteria.minPercentage10Plus2) {
        console.log(`❌ ${applicant.name}: 10+2 % ${applicant.percentageIn10Plus2} < ${criteria.minPercentage10Plus2}`);
        return false;
      }

      if (criteria.preferredInstitutes.length > 0 && 
          !criteria.preferredInstitutes.some(inst => 
            applicant.presentInstitute?.toLowerCase().includes(inst.toLowerCase())
          )) {
        console.log(`❌ ${applicant.name}: Institute ${applicant.presentInstitute} not in preferred list`);
        return false;
      }

      // Age criteria
      if (applicant.age < criteria.ageRange.min || applicant.age > criteria.ageRange.max) {
        console.log(`❌ ${applicant.name}: Age ${applicant.age} not in range ${criteria.ageRange.min}-${criteria.ageRange.max}`);
        return false;
      }

      // Category criteria
      if (criteria.preferredCategories.length > 0 && 
          !criteria.preferredCategories.includes(applicant.category)) {
        console.log(`❌ ${applicant.name}: Category ${applicant.category} not preferred`);
        return false;
      }

      // Gender criteria
      if (criteria.preferredGenders.length > 0 && 
          !criteria.preferredGenders.includes(applicant.gender)) {
        console.log(`❌ ${applicant.name}: Gender ${applicant.gender} not preferred`);
        return false;
      }

      // ONGC employee wards criteria
      if (criteria.ongcEmployeeWards) {
        const isONGCWard = applicant.fatherMotherOccupation?.toLowerCase().includes('ongc') ||
                          applicant.guardianOccupationDetails?.toLowerCase().includes('ongc');
        if (!isONGCWard) {
          console.log(`❌ ${applicant.name}: Not ONGC employee ward`);
          return false;
        }
      }

      // Location criteria
      if (criteria.preferredLocations.length > 0 && 
          !criteria.preferredLocations.some(loc => 
            applicant.location?.toLowerCase().includes(loc.toLowerCase())
          )) {
        console.log(`❌ ${applicant.name}: Location ${applicant.location} not preferred`);
        return false;
      }

      // Training area criteria
      if (criteria.preferredTrainingAreas.length > 0 && 
          !criteria.preferredTrainingAreas.some(area => 
            applicant.areasOfTraining?.toLowerCase().includes(area.toLowerCase())
          )) {
        console.log(`❌ ${applicant.name}: Training area ${applicant.areasOfTraining} not preferred`);
        return false;
      }

      // Term preference
      if (criteria.termPreference !== 'Both' && applicant.term !== criteria.termPreference) {
        console.log(`❌ ${applicant.name}: Term ${applicant.term} not ${criteria.termPreference}`);
        return false;
      }

      // Quota category preference
      if (criteria.quotaCategoryPreference !== 'Both' && 
          applicant.quotaCategory !== criteria.quotaCategoryPreference) {
        console.log(`❌ ${applicant.name}: Quota category ${applicant.quotaCategory} not ${criteria.quotaCategoryPreference}`);
        return false;
      }

      // Late application criteria
      if (!criteria.lateApplicationAllowed && applicant.lateApplication) {
        console.log(`❌ ${applicant.name}: Late application not allowed`);
        return false;
      }

      // Mentor criteria
      if (criteria.mentorRequired && !applicant.mentorName) {
        console.log(`❌ ${applicant.name}: Mentor required but not assigned`);
        return false;
      }

      if (criteria.mentorAvailable && applicant.mentorDetailsAvailable?.toLowerCase() !== 'yes') {
        console.log(`❌ ${applicant.name}: Mentor details not available`);
        return false;
      }

      console.log(`✅ ${applicant.name}: Passed all criteria`);
      return true;
    });

    console.log(`📊 Filtering complete: ${filtered.length}/${applicants.length} applicants selected`);
    setFilteredApplicants(filtered);
    setIsProcessing(false);
  };

  // Apply shortlist
  const handleShortlist = () => {
    console.log('⭐ Shortlisting applicants...');
    console.log(`📋 Selected ${filteredApplicants.length} applicants for shortlisting`);
    onShortlist(filteredApplicants);
  };

  // Clear shortlist
  const handleClearShortlist = () => {
    console.log('🗑️ Clearing shortlist...');
    onClearShortlist();
  };

  // Reset criteria
  const handleResetCriteria = () => {
    console.log('🔄 Resetting criteria...');
    setCriteria({
      minSGPA: 7.0,
      minPercentage10Plus2: 60,
      preferredInstitutes: [],
      ageRange: { min: 18, max: 25 },
      preferredCategories: [],
      preferredGenders: [],
      ongcEmployeeWards: false,
      preferredLocations: [],
      preferredTrainingAreas: [],
      termPreference: 'Both',
      quotaCategoryPreference: 'Both',
      lateApplicationAllowed: false,
      mentorRequired: false,
      mentorAvailable: false
    });
  };

  useEffect(() => {
    applyCriteria();
  }, [criteria, applicants]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <Filter className="mr-2" />
          Shortlisting Criteria
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {showAdvanced ? 'Basic' : 'Advanced'} Criteria
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Academic Criteria */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Academic Criteria</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum SGPA
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              value={criteria.minSGPA}
              onChange={(e) => setCriteria({...criteria, minSGPA: parseFloat(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum 10+2 Percentage
            </label>
            <input
              type="number"
              step="1"
              min="0"
              max="100"
              value={criteria.minPercentage10Plus2}
              onChange={(e) => setCriteria({...criteria, minPercentage10Plus2: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Institutes
            </label>
            <select
              multiple
              value={criteria.preferredInstitutes}
              onChange={(e) => setCriteria({
                ...criteria, 
                preferredInstitutes: Array.from(e.target.selectedOptions, option => option.value)
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {availableInstitutes.map(institute => (
                <option key={institute} value={institute}>{institute}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Personal Criteria */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Personal Criteria</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age Range
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                min="16"
                max="30"
                value={criteria.ageRange.min}
                onChange={(e) => setCriteria({
                  ...criteria, 
                  ageRange: {...criteria.ageRange, min: parseInt(e.target.value)}
                })}
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Min"
              />
              <input
                type="number"
                min="16"
                max="30"
                value={criteria.ageRange.max}
                onChange={(e) => setCriteria({
                  ...criteria, 
                  ageRange: {...criteria.ageRange, max: parseInt(e.target.value)}
                })}
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Max"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Categories
            </label>
            <select
              multiple
              value={criteria.preferredCategories}
              onChange={(e) => setCriteria({
                ...criteria, 
                preferredCategories: Array.from(e.target.selectedOptions, option => option.value)
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {availableCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Genders
            </label>
            <select
              multiple
              value={criteria.preferredGenders}
              onChange={(e) => setCriteria({
                ...criteria, 
                preferredGenders: Array.from(e.target.selectedOptions, option => option.value)
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {availableGenders.map(gender => (
                <option key={gender} value={gender}>{gender}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ONGC Specific Criteria */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">ONGC Specific</h3>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="ongcWards"
              checked={criteria.ongcEmployeeWards}
              onChange={(e) => setCriteria({...criteria, ongcEmployeeWards: e.target.checked})}
              className="mr-2"
            />
            <label htmlFor="ongcWards" className="text-sm font-medium text-gray-700">
              ONGC Employee Wards Only
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Locations
            </label>
            <select
              multiple
              value={criteria.preferredLocations}
              onChange={(e) => setCriteria({
                ...criteria, 
                preferredLocations: Array.from(e.target.selectedOptions, option => option.value)
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {availableLocations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Training Areas
            </label>
            <select
              multiple
              value={criteria.preferredTrainingAreas}
              onChange={(e) => setCriteria({
                ...criteria, 
                preferredTrainingAreas: Array.from(e.target.selectedOptions, option => option.value)
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {availableTrainingAreas.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Advanced Criteria */}
      {showAdvanced && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Application Criteria</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Term Preference
              </label>
              <select
                value={criteria.termPreference}
                onChange={(e) => setCriteria({...criteria, termPreference: e.target.value as 'Summer' | 'Winter' | 'Both'})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Both">Both Terms</option>
                <option value="Summer">Summer Only</option>
                <option value="Winter">Winter Only</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quota Category
              </label>
              <select
                value={criteria.quotaCategoryPreference}
                onChange={(e) => setCriteria({...criteria, quotaCategoryPreference: e.target.value as 'General' | 'Reserved' | 'Both'})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Both">Both Categories</option>
                <option value="General">General Only</option>
                <option value="Reserved">Reserved Only</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="lateApplication"
                checked={criteria.lateApplicationAllowed}
                onChange={(e) => setCriteria({...criteria, lateApplicationAllowed: e.target.checked})}
                className="mr-2"
              />
              <label htmlFor="lateApplication" className="text-sm font-medium text-gray-700">
                Allow Late Applications
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Mentor Criteria</h3>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="mentorRequired"
                checked={criteria.mentorRequired}
                onChange={(e) => setCriteria({...criteria, mentorRequired: e.target.checked})}
                className="mr-2"
              />
              <label htmlFor="mentorRequired" className="text-sm font-medium text-gray-700">
                Mentor Assignment Required
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="mentorAvailable"
                checked={criteria.mentorAvailable}
                onChange={(e) => setCriteria({...criteria, mentorAvailable: e.target.checked})}
                className="mr-2"
              />
              <label htmlFor="mentorAvailable" className="text-sm font-medium text-gray-700">
                Mentor Details Available
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Results and Actions */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Users className="mr-2 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                Total Applicants: {applicants.length}
              </span>
            </div>
            <div className="flex items-center">
              <Star className="mr-2 text-yellow-600" />
              <span className="text-sm font-medium text-gray-700">
                Filtered: {filteredApplicants.length}
              </span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="mr-2 text-green-600" />
              <span className="text-sm font-medium text-gray-700">
                Shortlisted: {shortlistedApplicants.length}
              </span>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleResetCriteria}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 flex items-center"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset
            </button>
            <button
              onClick={handleShortlist}
              disabled={isProcessing || filteredApplicants.length === 0}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 flex items-center"
            >
              <Star className="mr-2 h-4 w-4" />
              Shortlist ({filteredApplicants.length})
            </button>
            <button
              onClick={handleClearShortlist}
              disabled={shortlistedApplicants.length === 0}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 flex items-center"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Clear Shortlist
            </button>
          </div>
        </div>

        {isProcessing && (
          <div className="text-center py-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-600 mt-2">Processing criteria...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShortlistingCriteria; 