
import { Button } from "@/components/ui/button";

interface FormControlsProps {
  onCancel: () => void;
  isSubmitDisabled: boolean;
}

const FormControls = ({ onCancel, isSubmitDisabled }: FormControlsProps) => {
  return (
    <div className="flex gap-2 justify-end">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button 
        type="submit" 
        disabled={isSubmitDisabled}
      >
        Post Streak
      </Button>
    </div>
  );
};

export default FormControls;
