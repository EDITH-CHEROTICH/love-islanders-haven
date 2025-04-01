
import React from 'react';

interface SearchErrorProps {
  error: string;
}

const SearchError: React.FC<SearchErrorProps> = ({ error }) => {
  if (!error) return null;
  
  return (
    <p className="text-sm text-red-500">{error}</p>
  );
};

export default SearchError;
