
import React from 'react';
import SwipeButtonsContainer from './swipe/SwipeButtonsContainer';

interface SwipeButtonsProps {
  onSwipe?: (direction: 'left' | 'right') => void;
  onSuperLike?: () => void;
  onRewind?: () => void;
  onBoost?: () => void;
  matchId?: string;
  onMessageClick?: () => void;
}

const SwipeButtons = (props: SwipeButtonsProps) => {
  return <SwipeButtonsContainer {...props} />;
};

export default SwipeButtons;
