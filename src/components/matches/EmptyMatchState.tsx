
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const EmptyMatchState: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="border-love/20 backdrop-blur-md bg-island-light/20 animate-fade-in">
      <CardContent className="p-8 text-center">
        <h2 className="text-xl font-semibold mb-2">No matches yet</h2>
        <p className="text-muted-foreground mb-6">
          Keep swiping to find your match!
        </p>
        <Button 
          onClick={() => navigate('/discover')}
          className="bg-love hover:bg-love-dark text-white px-6 py-2 rounded-full transition-all"
        >
          Continue Swiping
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyMatchState;
