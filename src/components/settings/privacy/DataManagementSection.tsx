
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

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
    <div className="space-y-4 pt-4 border-t border-island-light/30">
      <h4 className="text-sm font-medium text-love">Your Data</h4>
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" className="bg-island-light/10 border-island-light/40" onClick={handleExportData}>
          <FileText size={16} className="mr-2" />
          Export Data
        </Button>
        <Button variant="destructive" onClick={handleDeleteAccount}>
          Delete Account
        </Button>
      </div>
    </div>
  );
};

export default DataManagementSection;
