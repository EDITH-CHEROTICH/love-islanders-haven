
import React, { useEffect, useRef } from 'react';

interface AdSenseProps {
  adSlot?: string;
  adFormat?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
  style?: React.CSSProperties;
  className?: string;
}

const AdSense: React.FC<AdSenseProps> = ({ 
  adSlot = '',
  adFormat = 'auto',
  style = {},
  className = ''
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    try {
      // Skip in development environment to avoid errors
      if (process.env.NODE_ENV === 'development') {
        console.log('AdSense disabled in development environment');
        return;
      }
      
      // Add AdSense ad if it exists
      if (adRef.current && typeof window !== 'undefined') {
        const adsbygoogle = (window as any).adsbygoogle || [];
        adsbygoogle.push({});
      }
    } catch (error) {
      console.error('Error loading AdSense ad:', error);
    }
  }, []);

  const defaultStyle: React.CSSProperties = {
    display: 'block',
    textAlign: 'center',
    ...style
  };

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={defaultStyle}
        data-ad-client="ca-pub-1964467782276816"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdSense;
