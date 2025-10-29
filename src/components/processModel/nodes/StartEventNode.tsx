import React, { useState, useRef, useEffect } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

interface StartEventNodeData {
  label: string;
  onLabelChange?: (nodeId: string, newLabel: string) => void;
}

const StartEventNode: React.FC<NodeProps<StartEventNodeData>> = ({ id, data }) => {
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
      <div className="w-12 h-12 bg-green-500 rounded-full border-2 border-green-700 flex items-center justify-center shadow-lg cursor-pointer hover:bg-green-600 transition-colors" onDoubleClick={handleDoubleClick}>
        <span className="text-white text-xs font-bold">Start</span>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-green-600"
      />
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white text-gray-900 text-xs font-medium text-center px-2 py-1 rounded border-2 border-green-300 focus:outline-none focus:border-green-500"
          onClick={(e) => e.stopPropagation()}
          style={{ minWidth: '80px' }}
        />
      ) : (
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs font-medium text-gray-700">
          {data.label}
        </div>
      )}
    </div>
  );
};

export default StartEventNode;
