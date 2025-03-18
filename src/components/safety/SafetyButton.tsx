
import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import DateSafety from './DateSafety';

interface SafetyButtonProps {
  matchId: string;
  matchName: string;
}

const SafetyButton = ({ matchId, matchName }: SafetyButtonProps) => {
  const [open, setOpen] = useState(false);
  
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="rounded-full flex items-center gap-1 bg-background/50 backdrop-blur-sm hover:bg-background/80"
        >
          <Shield className="h-4 w-4 text-love" />
          <span>Dating Safety</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="px-4 pb-4 pt-0">
        <div className="pt-4 max-w-md mx-auto">
          <DateSafety matchId={matchId} matchName={matchName} />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default SafetyButton;
