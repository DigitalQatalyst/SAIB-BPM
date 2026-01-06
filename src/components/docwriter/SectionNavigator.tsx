import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Circle,
  Sparkles,
  ArrowUp,
  ArrowDown,
  RotateCw,
  List,
} from 'lucide-react';
import { DocumentSection } from '../../utils/sectionParser';

interface SectionNavigatorProps {
  sections: DocumentSection[];
  onGenerateSection: (sectionId: string) => void;
  onRegenerateSection: (sectionId: string) => void;
  onMoveSection: (sectionId: string, direction: 'up' | 'down') => void;
  onSelectSection: (sectionId: string) => void;
  selectedSectionId?: string;
  generatingSection?: string;
}

const SectionNavigator: React.FC<SectionNavigatorProps> = ({
  sections,
  onGenerateSection,
  onRegenerateSection,
  onMoveSection,
  onSelectSection,
  selectedSectionId,
  generatingSection,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const getIndentation = (level: number) => {
    return `${(level - 1) * 16}px`;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div
        className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center cursor-pointer"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="flex items-center">
          <List className="h-5 w-5 text-gray-500 mr-2" />
          <h3 className="text-sm font-medium text-gray-900">
            Document Sections
          </h3>
          <span className="ml-2 text-xs text-gray-500">
            ({sections.filter((s) => s.generated).length}/{sections.length}{' '}
            generated)
          </span>
        </div>
        {collapsed ? (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        )}
      </div>

      {/* Section List */}
      {!collapsed && (
        <div className="max-h-96 overflow-y-auto">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className={`border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors ${
                selectedSectionId === section.id ? 'bg-blue-50' : ''
              }`}
            >
              <div
                className="px-4 py-3 flex items-center justify-between cursor-pointer"
                style={{ paddingLeft: `calc(1rem + ${getIndentation(section.level)})` }}
                onClick={() => onSelectSection(section.id)}
              >
                {/* Section Info */}
                <div className="flex items-center flex-1 min-w-0">
                  {section.generated ? (
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  ) : (
                    <Circle className="h-4 w-4 text-gray-300 mr-2 flex-shrink-0" />
                  )}
                  <span
                    className={`text-sm truncate ${
                      section.generated ? 'text-gray-900' : 'text-gray-500'
                    }`}
                  >
                    {section.title}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-1 ml-2">
                  {/* Move Up */}
                  {index > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveSection(section.id, 'up');
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                      title="Move up"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                  )}

                  {/* Move Down */}
                  {index < sections.length - 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveSection(section.id, 'down');
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                      title="Move down"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                  )}

                  {/* Generate/Regenerate Button */}
                  {section.generated ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRegenerateSection(section.id);
                      }}
                      disabled={generatingSection === section.id}
                      className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded disabled:opacity-50"
                      title="Regenerate section"
                    >
                      {generatingSection === section.id ? (
                        <RotateCw className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <RotateCw className="h-3.5 w-3.5" />
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onGenerateSection(section.id);
                      }}
                      disabled={generatingSection === section.id}
                      className="p-1 text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 rounded disabled:opacity-50"
                      title="Generate section"
                    >
                      {generatingSection === section.id ? (
                        <RotateCw className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="h-3.5 w-3.5" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer with bulk actions */}
      {!collapsed && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
          <button
            onClick={() => {
              sections
                .filter((s) => !s.generated)
                .forEach((s) => onGenerateSection(s.id));
            }}
            disabled={
              sections.every((s) => s.generated) || generatingSection !== undefined
            }
            className="w-full inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Generate All Missing Sections
          </button>
        </div>
      )}
    </div>
  );
};

export default SectionNavigator;
