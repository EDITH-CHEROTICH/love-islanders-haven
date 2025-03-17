
import { Music } from "lucide-react";

const EmptyStreaks = () => {
  return (
    <div className="text-center py-16 min-h-[300px] flex flex-col items-center justify-center gap-4">
      <div className="h-16 w-16 rounded-full bg-muted/30 flex items-center justify-center">
        <Music className="h-8 w-8 text-muted-foreground" />
      </div>
      <div>
        <h3 className="text-lg font-medium mb-1">No streak posts yet</h3>
        <p className="text-muted-foreground">
          Be the first to share a streak with your favorite song!
        </p>
      </div>
    </div>
  );
};

export default EmptyStreaks;
