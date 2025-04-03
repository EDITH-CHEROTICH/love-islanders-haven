
import React, { useEffect } from 'react';

// Add a declaration for the adsbygoogle property on the Window interface
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface AdSenseProps {
  slot?: string;
  format?: string;
  responsive?: boolean;
  className?: string;
}

const AdSense: React.FC<AdSenseProps> = ({
  slot = 'auto',
  format = 'auto',
  responsive = true,
  className = ''
}) => {
  useEffect(() => {
    try {
      // Push the AdSense code to the queue for execution
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  return (
    <div className={`ad-container my-4 ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-1964467782276816"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      ></ins>
    </div>
  );
};

export default AdSense;
