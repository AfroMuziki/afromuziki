// frontend/src/components/ui/Tabs/Tabs.tsx
import { createContext, useContext, ReactNode } from 'react';
import { cn } from '../../../utils/cn';

interface TabsContextType {
  value: string;
  onChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider');
  }
  return context;
};

export interface TabsProps {
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  className?: string;
}

export const Tabs = ({ value, onChange, children, className }: TabsProps) => {
  return (
    <TabsContext.Provider value={{ value, onChange }}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  );
};

export interface TabProps {
  value: string;
  label: string;
  disabled?: boolean;
}

export const Tab = ({ value, label, disabled }: TabProps) => {
  const { value: selectedValue, onChange } = useTabs();
  const isSelected = selectedValue === value;

  return (
    <button
      onClick={() => !disabled && onChange(value)}
      disabled={disabled}
      className={cn(
        'px-4 py-2 text-sm font-medium transition-all duration-200 border-b-2',
        isSelected
          ? 'border-gold-500 text-gold-600 dark:text-gold-500'
          : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      {label}
    </button>
  );
};

export interface TabPanelProps {
  value: string;
  children: ReactNode;
}

export const TabPanel = ({ value, children }: TabPanelProps) => {
  const { value: selectedValue } = useTabs();
  
  if (selectedValue !== value) {
    return null;
  }
  
  return <div>{children}</div>;
};
