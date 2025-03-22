
import { Shield } from 'lucide-react';

interface PrivacyControlSectionProps {
  title: string;
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

const PrivacyControlsSection = ({ 
  title,
  icon = <Shield size={16} className="text-muted-foreground" />,
  className = "",
  children
}: PrivacyControlSectionProps) => {
  return (
    <div className={`space-y-4 pt-4 border-t border-island-light/30 ${className}`}>
      <h4 className="text-sm font-medium text-love flex items-center gap-2">
        {icon}
        {title}
      </h4>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
};

export default PrivacyControlsSection;
