
import { Upload } from 'lucide-react';

interface FileSelectorProps {
  id: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const FileSelector = ({ id, onChange, disabled = false }: FileSelectorProps) => {
  return (
    <div className="flex items-center space-x-4">
      <input
        type="file"
        accept="image/*"
        id={id}
        className="hidden"
        onChange={onChange}
        disabled={disabled}
      />
      <label
        htmlFor={id}
        className={`flex items-center justify-center w-full h-10 px-4 py-2 text-sm font-medium text-white bg-love rounded-md hover:bg-love-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-love cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <Upload className="w-4 h-4 mr-2" />
        Select Image
      </label>
    </div>
  );
};

export default FileSelector;
