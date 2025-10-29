import React, { useState, useRef, useEffect } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

interface SubprocessNodeData {
  label: string;
  onLabelChange?: (nodeId: string, newLabel: string) => void;
}

const SubprocessNode: React.FC<NodeProps<SubprocessNodeData>> = ({ id, data }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (label.trim() !== '' && label !== data.label && data.onLabelChange) {
      data.onLabelChange(id, label.trim());
    } else {
      setLabel(data.label);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      inputRef.current?.blur();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setLabel(data.label);
      setIsEditing(false);
    }
  };

  return (
    <div className="relative">
      <div className="min-w-[140px] px-4 py-3 bg-purple-500 border-2 border-purple-700 rounded-lg shadow-lg cursor-pointer hover:bg-purple-600 transition-colors" onDoubleClick={handleDoubleClick}>
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-full bg-white text-gray-900 text-sm font-medium text-center px-2 py-1 rounded border-2 border-purple-300 focus:outline-none focus:border-purple-500 mb-2"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <div className="text-white text-sm font-medium text-center mb-2">
            {data.label}
          </div>
        )}
        <div className="flex justify-center">
          <div className="w-4 h-4 bg-white rounded flex items-center justify-center">
            <span className="text-purple-600 text-xs font-bold">+</span>
          </div>
        </div>
      </div>
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-purple-600"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-purple-600"
      />
    </div>
  );
};

export default SubprocessNode;
