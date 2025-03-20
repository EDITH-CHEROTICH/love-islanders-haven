
import { FileText, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import PrivacyControlsSection from './PrivacyControlsSection';

const DataManagementSection = () => {
  const handleExportData = () => {
    toast.success('Your data export has been requested. You will receive an email with your data soon.');
  };

  const handleDeleteAccount = () => {
    toast.error('This feature is not yet implemented.', {
      description: 'Account deletion will be available in a future update.'
    });
  };

  return (
    <PrivacyControlsSection title="Your Data" icon={<FileText size={16} className="text-love" />}>
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" className="bg-island-light/10 border-island-light/40" onClick={handleExportData}>
          <Download size={16} className="mr-2" />
          Export Data
        </Button>
        <Button variant="destructive" onClick={handleDeleteAccount}>
          <Trash2 size={16} className="mr-2" />
          Delete Account
        </Button>
      </div>
    </PrivacyControlsSection>
  );
};

export default DataManagementSection;
