
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertTriangle, SirenAlert } from 'lucide-react';
import { useDatingSafety } from '@/hooks/use-dating-safety';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface EmergencyButtonProps {
  className?: string;
}

const EmergencyButton = ({ className }: EmergencyButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const { safetyContacts, sendEmergencyAlert } = useDatingSafety();

  const handleEmergencyButtonClick = () => {
    setIsDialogOpen(true);
  };

  const handleConfirmAlert = async () => {
    if (safetyContacts.length === 0) {
      setResult({
        success: false,
        message: "You haven't added any safety contacts yet."
      });
      return;
    }

    setIsSending(true);
    setResult(null);
    
    try {
      const location = await getCurrentLocation();
      const success = await sendEmergencyAlert(location);
      
      setResult({
        success,
        message: success 
          ? "Emergency alert sent to your safety contacts." 
          : "Failed to send emergency alert. Please try again or call emergency services directly."
      });
    } catch (error) {
      setResult({
        success: false,
        message: "Unable to determine your location. Alert sent without location data."
      });
    } finally {
      setIsSending(false);
    }
  };

  const getCurrentLocation = (): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser."));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    });
  };

  return (
    <>
      <Button 
        variant="destructive" 
        className={`gap-2 ${className}`} 
        onClick={handleEmergencyButtonClick}
      >
        <SirenAlert className="h-4 w-4" />
        Emergency Alert
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Send Emergency Alert
            </DialogTitle>
            <DialogDescription>
              This will send an emergency alert with your current location to all your safety contacts.
            </DialogDescription>
          </DialogHeader>

          {result && (
            <Alert variant={result.success ? "default" : "destructive"}>
              <AlertDescription>{result.message}</AlertDescription>
            </Alert>
          )}

          {safetyContacts.length === 0 && !result && (
            <Alert variant="destructive">
              <AlertDescription>
                You haven't added any safety contacts yet. Add contacts in the "Create Plan" tab first.
              </AlertDescription>
            </Alert>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              disabled={isSending}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmAlert}
              disabled={isSending || safetyContacts.length === 0}
            >
              {isSending ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Sending...
                </>
              ) : (
                "Send Alert"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EmergencyButton;
