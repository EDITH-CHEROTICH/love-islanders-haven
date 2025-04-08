
import { useImageUpload } from '@/hooks/profile/useImageUpload';
import FileSelector from './image-controls/FileSelector';
import FilePreview from './image-controls/FilePreview';

interface ProfileImageUploaderProps {
  onImageUploaded: (imageUrl: string) => void;
  position: number;
}

const ProfileImageUploader = ({ onImageUploaded, position }: ProfileImageUploaderProps) => {
  const {
    file,
    isUploading,
    handleFileChange,
    handleUpload,
    clearFile
  } = useImageUpload(position, onImageUploaded);
  
  return (
    <div className="space-y-4">
      <FileSelector 
        id={`image-upload-${position}`}
        onChange={handleFileChange}
        disabled={isUploading}
      />
      
      {file && (
        <FilePreview
          fileName={file.name}
          onRemove={clearFile}
          onConfirm={handleUpload}
          isUploading={isUploading}
        />
      )}
    </div>
  );
};

export default ProfileImageUploader;
