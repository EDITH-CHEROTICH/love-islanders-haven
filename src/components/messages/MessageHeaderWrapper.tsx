
import React from 'react';
import MessageHeader from './MessageHeader';
import DatePlanDialog from './DatePlanDialog';

interface MessageHeaderWrapperProps {
  matchInfo: any;
  onBackClick: () => void;
  onSendMessage: (content: string) => Promise<void>;
}

const MessageHeaderWrapper: React.FC<MessageHeaderWrapperProps> = ({ 
  matchInfo, 
  onBackClick, 
  onSendMessage 
}) => {
  return (
    <MessageHeader 
      matchInfo={matchInfo} 
      onBackClick={onBackClick} 
      actions={<DatePlanDialog onDatePlanCreated={onSendMessage} />}
    />
  );
};

export default MessageHeaderWrapper;
