
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FormControlsProps {
  onCancel: () => void;
  isSubmitDisabled: boolean;
  isSubmitting?: boolean;
}

const FormControls = ({ onCancel, isSubmitDisabled, isSubmitting = false }: FormControlsProps) => {
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
        className="relative"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Posting...
          </>
        ) : (
          "Post Streak"
        )}
      </Button>
    </div>
  );
};

export default FormControls;
