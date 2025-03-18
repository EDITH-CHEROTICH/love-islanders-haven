
import { Flame, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UserStreakCardProps {
  streakCount: number;
  hasPostedToday: boolean;
}

const UserStreakCard = ({ streakCount, hasPostedToday }: UserStreakCardProps) => {
  return (
    <Card className="bg-island-light/20 border border-love/20 backdrop-blur-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-gradient">Your Streak</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="text-love h-8 w-8" />
            <div>
              <p className="text-xl font-bold">{streakCount} days</p>
              <p className="text-sm text-muted-foreground">Current streak</p>
            </div>
          </div>
          <div>
            {hasPostedToday ? (
              <div className="flex items-center gap-2 text-green-500">
                <Clock size={18} />
                <span className="text-sm">Posted today</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-amber-500">
                <Clock size={18} />
                <span className="text-sm">Post today to keep your streak!</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserStreakCard;
