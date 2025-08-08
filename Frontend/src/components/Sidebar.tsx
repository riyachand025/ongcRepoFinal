import React from 'react';
import { Users, CheckCircle, Star, FileText } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: 'applicants' | 'approved' | 'shortlisted' | 'upload' | 'preview') => void;
  applicantsCount: number;
  approvedCount: number;
  shortlistedCount: number;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  setCurrentView, 
  applicantsCount, 
  approvedCount, 
  shortlistedCount 
}) => {
  const menuItems = [
    {
      id: 'applicants',
      label: 'Applicants',
      icon: Users,
      count: applicantsCount,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      hoverColor: 'hover:bg-blue-100'
    },
    {
      id: 'approved',
      label: 'Approved',
      icon: CheckCircle,
      count: approvedCount,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      hoverColor: 'hover:bg-green-100'
    },
    {
      id: 'shortlisted',
      label: 'Shortlisted',
      icon: Star,
      count: shortlistedCount,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      hoverColor: 'hover:bg-yellow-100'
    }
  ];

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as any)}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                isActive 
                  ? `${item.bgColor} ${item.color} border border-current border-opacity-20` 
                  : `text-gray-700 hover:bg-gray-50 ${item.hoverColor}`
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-5 h-5 ${isActive ? item.color : 'text-gray-500'}`} />
                <span className="font-medium">{item.label}</span>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                isActive 
                  ? 'bg-white bg-opacity-80' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {item.count}
              </span>
            </button>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 space-y-1">
          <div>Total Applications: {applicantsCount + approvedCount + shortlistedCount}</div>
          <div>Pending Review: {applicantsCount}</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;