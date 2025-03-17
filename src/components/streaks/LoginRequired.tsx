
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const LoginRequired = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] p-4">
      <h2 className="text-2xl font-bold mb-4">Login Required</h2>
      <p className="text-center mb-6">Please login to view and post streaks.</p>
      <Button asChild>
        <Link to="/login">Login</Link>
      </Button>
    </div>
  );
};

export default LoginRequired;
