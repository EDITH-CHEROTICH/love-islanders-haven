
import { ShieldCheck, ShieldAlert } from 'lucide-react';

interface VerificationSectionProps {
  verified: boolean;
  onVerificationRequest: () => void;
}

const VerificationSection = ({ 
  verified, 
  onVerificationRequest 
}: VerificationSectionProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-sm font-medium text-white flex items-center gap-2">
          {verified ? (
            <>
              <ShieldCheck size={18} className="text-green-400" />
              <span>Verified Profile</span>
            </>
          ) : (
            <>
              <ShieldAlert size={18} className="text-yellow-400" />
              <span>Unverified Profile</span>
            </>
          )}
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          {verified 
            ? "Your profile has been verified. This helps others trust you're a real person."
            : "Get verified to let others know you're a real person."}
        </p>
      </div>
      
      {!verified && (
        <button
          onClick={onVerificationRequest}
          className="bg-love/20 hover:bg-love/30 text-love-light px-3 py-1.5 text-sm rounded-lg flex items-center gap-1 transition-colors"
        >
          <ShieldCheck size={16} />
          <span>Verify</span>
        </button>
      )}
    </div>
  );
};

export default VerificationSection;
