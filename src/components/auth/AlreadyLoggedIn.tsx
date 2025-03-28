
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth";
import { useToast } from "@/hooks/use-toast";

const AlreadyLoggedIn = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="glass-card w-full max-w-md p-6 rounded-xl shadow-lg">
      <div className="space-y-4 text-center">
        <h1 className="text-2xl font-bold text-gradient text-center mb-6">
          Already Logged In
        </h1>
        <p className="mb-4">You are already logged in to your account.</p>
        <Button 
          variant="outline"
          className="w-full" 
          onClick={handleLogout}
        >
          Log Out
        </Button>
        <Button 
          className="w-full bg-love hover:bg-love-dark" 
          onClick={() => navigate('/ai-companion')}
        >
          Return to App
        </Button>
      </div>
    </div>
  );
};

export default AlreadyLoggedIn;
