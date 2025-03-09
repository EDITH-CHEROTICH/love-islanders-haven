
import { Heart } from 'lucide-react';

interface RelationshipGoalSelectorProps {
  selectedGoal: 'long-term' | 'casual' | 'both';
  onGoalChange: (goal: 'long-term' | 'casual' | 'both') => void;
}

const RelationshipGoalSelector = ({ selectedGoal, onGoalChange }: RelationshipGoalSelectorProps) => {
  return (
    <div className="pt-4 border-t border-island-light">
      <h3 className="text-sm font-medium text-love mb-4">What are you looking for?</h3>
      
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => onGoalChange('long-term')}
          className={`p-3 rounded-lg flex flex-col items-center text-center transition-colors ${
            selectedGoal === 'long-term' 
              ? 'bg-love text-white' 
              : 'bg-island-dark/80 hover:bg-island-dark text-muted-foreground hover:text-white'
          }`}
        >
          <Heart size={24} className={selectedGoal === 'long-term' ? 'text-white' : 'text-love'} />
          <span className="text-sm mt-2">Life-time Partner</span>
        </button>
        
        <button
          onClick={() => onGoalChange('casual')}
          className={`p-3 rounded-lg flex flex-col items-center text-center transition-colors ${
            selectedGoal === 'casual' 
              ? 'bg-love text-white' 
              : 'bg-island-dark/80 hover:bg-island-dark text-muted-foreground hover:text-white'
          }`}
        >
          <Heart size={24} className={selectedGoal === 'casual' ? 'text-white' : 'text-love'} />
          <span className="text-sm mt-2">Casual Fun</span>
        </button>
        
        <button
          onClick={() => onGoalChange('both')}
          className={`p-3 rounded-lg flex flex-col items-center text-center transition-colors ${
            selectedGoal === 'both' 
              ? 'bg-love text-white' 
              : 'bg-island-dark/80 hover:bg-island-dark text-muted-foreground hover:text-white'
          }`}
        >
          <Heart size={24} className={selectedGoal === 'both' ? 'text-white' : 'text-love'} />
          <span className="text-sm mt-2">Open to Both</span>
        </button>
      </div>
    </div>
  );
};

export default RelationshipGoalSelector;
