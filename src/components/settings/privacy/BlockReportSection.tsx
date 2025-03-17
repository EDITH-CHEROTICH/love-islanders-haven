
import { UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BlockReportSection = () => {
  return (
    <div className="space-y-4 pt-4 border-t border-island-light/30">
      <h4 className="text-sm font-medium text-love">Block & Report</h4>
      <Button variant="outline" className="w-full bg-island-light/10 border-island-light/40">
        <UserX size={16} className="mr-2" />
        Manage Blocked Users
      </Button>
    </div>
  );
};

export default BlockReportSection;
