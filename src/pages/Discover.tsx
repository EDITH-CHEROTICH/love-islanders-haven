
import React from 'react';
import { useToast } from '@/hooks/use-toast';

const Discover = () => {
  const { toast } = useToast();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-island-dark via-island to-island-dark pb-20">
      <div className="page-container hide-scrollbar">
        <header className="text-center pt-4 mb-6">
          <h1 className="text-2xl font-bold text-gradient">Discover</h1>
        </header>
        
        <main className="container max-w-md mx-auto px-4">
          <div className="glass-card p-8 animate-fade-in">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold mb-2">Find New Connections</h2>
              <p className="text-muted-foreground">
                Discover people that match your interests and preferences
              </p>
            </div>
            
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="glass-card p-4 flex items-center hover:bg-island-light/20 transition-all">
                  <div className="w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0 bg-island-light/30">
                    <div className="w-full h-full flex items-center justify-center text-love">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold">Suggested Match {index + 1}</h3>
                    <p className="text-sm text-muted-foreground">
                      Tap to explore this profile
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Discover;
