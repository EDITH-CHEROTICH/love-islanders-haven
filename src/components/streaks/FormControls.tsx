
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FormControlsProps {
  onCancel: () => void;
  isSubmitDisabled: boolean;
  isSubmitting?: boolean;
  submitText?: string;
}

const FormControls = ({ 
  onCancel, 
  isSubmitDisabled, 
  isSubmitting = false, 
  submitText = "Post Streak" 
}: FormControlsProps) => {
  console.log("FormControls state:", { isSubmitDisabled, isSubmitting });
  
  return (
    <div className="flex gap-2 justify-end">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button 
        type="submit" 
        disabled={isSubmitDisabled || isSubmitting}
        className="bg-primary hover:bg-primary/90 focus:ring-2 focus:ring-primary/20"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            <span>Posting...</span>
          </>
        ) : (
          submitText
        )}
      </Button>
    </div>
  );
};

export default FormControls;
