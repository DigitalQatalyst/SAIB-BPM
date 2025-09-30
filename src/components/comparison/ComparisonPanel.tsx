import React from 'react';
import { X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
interface ComparisonPanelProps {
  selectedTools: any[];
  removeFromComparison: (id: number) => void;
  clearComparison: () => void;
  openComparisonModal: () => void;
}
const ComparisonPanel: React.FC<ComparisonPanelProps> = ({
  selectedTools,
  removeFromComparison,
  clearComparison,
  openComparisonModal
}) => {
  if (selectedTools.length === 0) return null;
  return <div className="fixed top-16 left-0 right-0 bg-[#F0F9FF] border-b border-gray-200 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h3 className="text-lg font-medium text-gray-900">
              Process Mining Tool Comparison ({selectedTools.length}/4)
            </h3>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={openComparisonModal} disabled={selectedTools.length < 2} className={`flex items-center px-4 py-2 rounded-md font-medium ${selectedTools.length < 2 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-[#FECC0E] text-gray-900 hover:bg-[#FECC0E]/90'}`}>
              Compare Selected
              <ArrowRight size={16} className="ml-2" />
            </button>
            <button onClick={clearComparison} className="text-gray-500 hover:text-gray-700 text-sm">
              Clear All
            </button>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {selectedTools.map(tool => <div key={tool.id} className="flex items-center bg-white rounded-md border border-gray-200 px-3 py-2">
              <span className="text-sm font-medium text-gray-700 mr-2">
                {tool.title}
              </span>
              <button onClick={() => removeFromComparison(tool.id)} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>)}
          {Array.from({
          length: Math.max(0, 4 - selectedTools.length)
        }).map((_, index) => <Link key={`empty-${index}`} to="/process-mining" className="flex items-center justify-center bg-white rounded-md border border-dashed border-gray-300 px-3 py-2 min-w-[150px] hover:border-[#FECC0E] transition-colors">
              <span className="text-sm text-gray-500">Add an item</span>
            </Link>)}
        </div>
      </div>
    </div>;
};
export default ComparisonPanel;