
import React from 'react';
import { Lightbulb } from 'lucide-react';

type RecommendationMessageProps = {
  content: string;
};

const RecommendationMessage: React.FC<RecommendationMessageProps> = ({ content }) => {
  return (
    <div className="flex justify-start mb-2">
      <div className="bg-amber-700/30 rounded-lg p-3 max-w-[80%] flex items-start gap-2">
        <Lightbulb className="h-5 w-5 text-amber-400 mt-1 flex-shrink-0" />
        <div>
          <div className="text-amber-400 font-medium mb-1">Streak Suggestion</div>
          <div className="text-white">{content.replace('STREAK RECOMMENDATION:', '')}</div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationMessage;
