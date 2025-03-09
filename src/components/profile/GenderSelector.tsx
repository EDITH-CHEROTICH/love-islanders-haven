
import { User, Users } from 'lucide-react';

interface GenderSelectorProps {
  selectedPreference: 'male' | 'female' | 'both';
  onPreferenceChange: (preference: 'male' | 'female' | 'both') => void;
}

const GenderSelector = ({ selectedPreference, onPreferenceChange }: GenderSelectorProps) => {
  return (
    <div className="pt-4 border-t border-island-light">
      <h3 className="text-sm font-medium text-love mb-4">Who would you like to see?</h3>
      
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => onPreferenceChange('male')}
          className={`p-3 rounded-lg flex flex-col items-center text-center transition-colors ${
            selectedPreference === 'male' 
              ? 'bg-love text-white' 
              : 'bg-island-dark/80 hover:bg-island-dark text-muted-foreground hover:text-white'
          }`}
        >
          <User size={24} className={selectedPreference === 'male' ? 'text-white' : 'text-blue-400'} />
          <span className="text-sm mt-2">Men</span>
        </button>
        
        <button
          onClick={() => onPreferenceChange('female')}
          className={`p-3 rounded-lg flex flex-col items-center text-center transition-colors ${
            selectedPreference === 'female' 
              ? 'bg-love text-white' 
              : 'bg-island-dark/80 hover:bg-island-dark text-muted-foreground hover:text-white'
          }`}
        >
          <User size={24} className={selectedPreference === 'female' ? 'text-white' : 'text-pink-400'} />
          <span className="text-sm mt-2">Women</span>
        </button>
        
        <button
          onClick={() => onPreferenceChange('both')}
          className={`p-3 rounded-lg flex flex-col items-center text-center transition-colors ${
            selectedPreference === 'both' 
              ? 'bg-love text-white' 
              : 'bg-island-dark/80 hover:bg-island-dark text-muted-foreground hover:text-white'
          }`}
        >
          <Users size={24} className={selectedPreference === 'both' ? 'text-white' : 'text-purple-400'} />
          <span className="text-sm mt-2">Everyone</span>
        </button>
      </div>
    </div>
  );
};

export default GenderSelector;
