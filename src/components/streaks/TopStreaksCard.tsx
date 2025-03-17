
import { Award, Flame, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TopStreak } from "./types";

interface TopStreaksCardProps {
  topStreaks: TopStreak[];
}

const TopStreaksCard = ({ topStreaks }: TopStreaksCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Top Streaks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {topStreaks.map((streak, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {index === 0 && <Award className="text-yellow-500 h-5 w-5" />}
                <User className="h-8 w-8 p-1 bg-muted rounded-full" />
                <span>{streak.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Flame className="text-love h-4 w-4" />
                <span className="font-semibold">{streak.count}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopStreaksCard;
