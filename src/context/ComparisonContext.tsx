import React, { useState, createContext, useContext } from 'react';
interface ComparisonContextType {
  comparisonTools: any[];
  addToComparison: (tool: any) => void;
  removeFromComparison: (id: number) => void;
  clearComparison: () => void;
  isInComparison: (id: number) => boolean;
}
const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);
export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
};
interface ComparisonProviderProps {
  children: ReactNode;
}
export const ComparisonProvider: React.FC<ComparisonProviderProps> = ({
  children
}) => {
  const [comparisonTools, setComparisonTools] = useState<any[]>([]);
  const addToComparison = (tool: any) => {
    if (comparisonTools.length >= 4) {
      alert('You can only compare up to 4 tools at a time');
      return;
    }
    if (comparisonTools.some(t => t.id === tool.id)) {
      return; // Tool already in comparison
    }
    setComparisonTools([...comparisonTools, tool]);
  };
  const removeFromComparison = (id: number) => {
    setComparisonTools(comparisonTools.filter(tool => tool.id !== id));
  };
  const clearComparison = () => {
    setComparisonTools([]);
  };
  const isInComparison = (id: number) => {
    return comparisonTools.some(tool => tool.id === id);
  };
  return <ComparisonContext.Provider value={{
    comparisonTools,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison
  }}>
      {children}
    </ComparisonContext.Provider>;
};