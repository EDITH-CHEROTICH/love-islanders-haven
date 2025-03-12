
import { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';

interface SettingsSectionProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
}

const SettingsSection = ({ 
  title, 
  icon, 
  children, 
  className = '',
  collapsible = false,
  defaultOpen = true
}: SettingsSectionProps) => {
  return (
    <div className={`bg-island-dark/80 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {icon && <span className="text-love">{icon}</span>}
          <h3 className="text-lg font-medium text-white">{title}</h3>
        </div>
        {collapsible && (
          <button className="text-muted-foreground">
            <ChevronRight size={18} />
          </button>
        )}
      </div>
      <div>
        {children}
      </div>
    </div>
  );
};

export default SettingsSection;
