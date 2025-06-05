
import React, { useRef, useState } from 'react';
import { Upload, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoUploadProps {
  onVideoUpload: (file: File) => void;
}

const VideoUpload: React.FC<VideoUploadProps> = ({ onVideoUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('video/')) {
        onVideoUpload(file);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('video/')) {
        onVideoUpload(file);
      }
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-gray-800 rounded-2xl border-2 border-dashed border-gray-600 p-12 text-center transition-all duration-300 hover:border-gray-500">
      <div
        className={`transition-all duration-300 ${
          isDragging ? 'scale-105 opacity-80' : 'scale-100 opacity-100'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Video className="mx-auto h-16 w-16 text-gray-400 mb-6" />
        
        <h3 className="text-2xl font-semibold mb-4">Upload Your Video</h3>
        
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Drag and drop your video file here, or click the button below to browse your files. 
          Supported formats: MP4, AVI, MOV, WMV
        </p>

        <Button
          onClick={openFileDialog}
          className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-6 text-lg font-semibold rounded-xl transition-all duration-200 hover:scale-105"
        >
          <Upload className="mr-2 h-5 w-5" />
          Choose Video File
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default VideoUpload;
