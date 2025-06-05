
import React, { useState } from 'react';
import VideoUpload from '@/components/VideoUpload';
import VideoPlayer from '@/components/VideoPlayer';
import LoadingSpinner from '@/components/LoadingSpinner';
import ResponseDisplay from '@/components/ResponseDisplay';
import { Button } from '@/components/ui/button';
import { Upload, Zap } from 'lucide-react';

const Index = () => {
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<string>('');

  const handleVideoUpload = (file: File) => {
    setUploadedVideo(file);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    setApiResponse(''); // Clear previous response
  };

  const handleRenderVideo = async () => {
    if (!uploadedVideo) return;

    setIsLoading(true);
    
    try {
      // Simulate API call - replace with your actual API endpoint
      const formData = new FormData();
      formData.append('video', uploadedVideo);
      
      // Mock API call with timeout to simulate processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock response - replace with actual API call
      const mockResponse = `Video analysis complete! 
      
      Video Details:
      - Duration: ${Math.floor(Math.random() * 60 + 30)} seconds
      - Format: ${uploadedVideo.type}
      - Size: ${(uploadedVideo.size / (1024 * 1024)).toFixed(2)} MB
      - Processing Status: Successfully analyzed
      
      AI Analysis:
      The uploaded video has been processed successfully. The content appears to be of high quality with good lighting and composition. The video processing pipeline has extracted key frames and performed content analysis.`;
      
      setApiResponse(mockResponse);
    } catch (error) {
      setApiResponse('Error processing video. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetUpload = () => {
    setUploadedVideo(null);
    setVideoUrl('');
    setApiResponse('');
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Video Render Studio
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Upload your videos, render them instantly, and get AI-powered analysis with our modern processing platform
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Upload Section */}
          {!uploadedVideo ? (
            <VideoUpload onVideoUpload={handleVideoUpload} />
          ) : (
            <div className="space-y-6">
              {/* Video Preview */}
              <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold">Video Preview</h2>
                  <Button 
                    onClick={resetUpload}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Upload New Video
                  </Button>
                </div>
                <VideoPlayer videoUrl={videoUrl} />
              </div>

              {/* Render Button */}
              <div className="text-center">
                <Button
                  onClick={handleRenderVideo}
                  disabled={isLoading}
                  className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-6 text-lg font-semibold rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner />
                      Processing Video...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-5 w-5" />
                      Render & Analyze Video
                    </>
                  )}
                </Button>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
                  <div className="text-center">
                    <LoadingSpinner size="large" />
                    <h3 className="text-xl font-semibold mt-4 mb-2">Processing Your Video</h3>
                    <p className="text-gray-400">This may take a few moments. Please don't close this tab.</p>
                  </div>
                </div>
              )}

              {/* API Response */}
              {apiResponse && !isLoading && (
                <ResponseDisplay response={apiResponse} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
