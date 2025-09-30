import React from 'react';
import { X, Check } from 'lucide-react';
interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTools: any[];
}
const ComparisonModal: React.FC<ComparisonModalProps> = ({
  isOpen,
  onClose,
  selectedTools
}) => {
  if (!isOpen) return null;
  // Generate comparison attributes based on tool properties
  const getComparisonAttributes = () => {
    return [{
      name: 'Complexity',
      key: 'complexity'
    }, {
      name: 'Industry',
      key: 'industry'
    }, {
      name: 'Use Case',
      key: 'useCase'
    }, {
      name: 'Risk Level',
      key: 'riskLevel'
    }, {
      name: 'Ease of Use',
      key: 'easeOfUse'
    }, {
      name: 'AI-Powered',
      key: 'aiPowered',
      type: 'boolean'
    }, {
      name: 'Real-Time',
      key: 'realTime',
      type: 'boolean'
    }, {
      name: 'Integration',
      key: 'integration'
    }, {
      name: 'Feature',
      key: 'feature'
    }, {
      name: 'Department',
      key: 'department'
    }, {
      name: 'Platform',
      key: 'platform'
    }];
  };
  const comparisonAttributes = getComparisonAttributes();
  return <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            Process Mining Tool Comparison
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X size={24} />
          </button>
        </div>
        <div className="overflow-auto flex-grow">
          <div className="min-w-full">
            {/* Header row with tool names */}
            <div className="grid grid-cols-[250px_repeat(auto-fill,minmax(180px,1fr))] border-b border-gray-200">
              <div className="p-4 font-medium text-gray-700">Item Details</div>
              {selectedTools.map(tool => <div key={tool.id} className="p-4 border-l border-gray-200">
                  <div className="flex flex-col items-center">
                    <div className="bg-[#FFEDA8] p-3 rounded-full mb-2">
                      <div className="h-8 w-8 flex items-center justify-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#9E800D]">
                          <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                          <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
                          <path d="M10 12h4" />
                          <path d="M10 16h4" />
                          <path d="M10 8h1" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="font-medium text-gray-900 text-center">
                      {tool.title}
                    </h3>
                  </div>
                </div>)}
              {/* Empty slots if less than 4 tools */}
              {Array.from({
              length: Math.max(0, 4 - selectedTools.length)
            }).map((_, index) => <div key={`empty-slot-${index}`} className="p-4 border-l border-gray-200">
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 w-full h-full flex items-center justify-center">
                      <span className="text-gray-400">Add an item</span>
                    </div>
                  </div>
                </div>)}
            </div>
            {/* Description row */}
            <div className="grid grid-cols-[250px_repeat(auto-fill,minmax(180px,1fr))] border-b border-gray-200">
              <div className="p-4 font-medium text-gray-700">Description</div>
              {selectedTools.map(tool => <div key={`desc-${tool.id}`} className="p-4 border-l border-gray-200">
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {tool.description}
                  </p>
                </div>)}
              {Array.from({
              length: Math.max(0, 4 - selectedTools.length)
            }).map((_, index) => <div key={`empty-desc-${index}`} className="p-4 border-l border-gray-200"></div>)}
            </div>
            {/* Comparison attributes rows */}
            {comparisonAttributes.map(attr => {
            // Skip if none of the tools have this attribute
            const hasAttribute = selectedTools.some(tool => tool[attr.key] !== null && tool[attr.key] !== undefined);
            if (!hasAttribute) return null;
            return <div key={attr.key} className="grid grid-cols-[250px_repeat(auto-fill,minmax(180px,1fr))] border-b border-gray-200">
                  <div className="p-4 font-medium text-gray-700">
                    {attr.name}
                  </div>
                  {selectedTools.map(tool => <div key={`${attr.key}-${tool.id}`} className="p-4 border-l border-gray-200">
                      {attr.type === 'boolean' ? tool[attr.key] ? <div className="flex items-center">
                            <Check size={18} className="text-green-500 mr-1" />
                            <span>Yes</span>
                          </div> : <div className="flex items-center">
                            <X size={18} className="text-red-500 mr-1" />
                            <span>No</span>
                          </div> : <span>
                          {tool[attr.key] || <span className="text-gray-400">N/A</span>}
                        </span>}
                    </div>)}
                  {Array.from({
                length: Math.max(0, 4 - selectedTools.length)
              }).map((_, index) => <div key={`empty-${attr.key}-${index}`} className="p-4 border-l border-gray-200"></div>)}
                </div>;
          })}
          </div>
        </div>
        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button onClick={onClose} className="bg-[#FECC0E] hover:bg-[#FECC0E]/90 text-gray-900 font-medium py-2 px-6 rounded-md transition-colors shadow-sm">
            Close
          </button>
        </div>
      </div>
    </div>;
};
export default ComparisonModal;