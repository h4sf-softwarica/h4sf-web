import React, { useState } from 'react';
import VideoUpload from '@/components/VideoUpload';
import VideoPlayer from '@/components/VideoPlayer';
import LoadingSpinner from '@/components/LoadingSpinner';
import ResponseDisplay from '@/components/ResponseDisplay';
import { Button } from '@/components/ui/button';
import { Zap, Upload, Download } from 'lucide-react';

const Index = () => {
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<string>('');

  // When user selects a file, save it and create preview URL
  const handleVideoSelected = (file: File) => {
    setUploadedVideo(file);
    setVideoUrl(URL.createObjectURL(file));
    setApiResponse('');
  };

  // Chunk upload + analysis triggered on button click
  const handleAnalyzeVideo = async () => {
    if (!uploadedVideo) return;

    setIsLoading(true);
    setApiResponse('');

    const chunkSize = 1024 * 1024; // 1MB chunks
    const totalChunks = Math.ceil(uploadedVideo.size / chunkSize);
    const uploadId = Date.now().toString();

    try {
      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const start = chunkIndex * chunkSize;
        const end = Math.min(uploadedVideo.size, start + chunkSize);
        const chunk = uploadedVideo.slice(start, end);

        const formData = new FormData();
        formData.append('chunk', chunk);
        formData.append('upload_id', uploadId);
        formData.append('chunk_index', chunkIndex.toString());
        formData.append('total_chunks', totalChunks.toString());

        await fetch(`${import.meta.env.VITE_SERVER_IP}/api/upload-chunk/`, {
          method: 'POST',
          body: formData,
        });
      }

      // Call analysis endpoint after all chunks uploaded
      const analysisResponse = await fetch(`${import.meta.env.VITE_SERVER_IP}/api/generate-analysis/`, {
        method: 'POST',
        body: JSON.stringify({ upload_id: uploadId }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await analysisResponse.json();
      setApiResponse(data.result || 'No result received.');
    } catch (error) {
      setApiResponse('Error processing video. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset upload and UI states
  const resetUpload = () => {
    setUploadedVideo(null);
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
      setVideoUrl('');
    }
    setApiResponse('');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-poppins">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            FREEZO<span style={{ color: 'rgb(8, 186, 153)' }}>SCAN</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Upload your videos, analyze them instantly, and get AI-powered insights with our Model
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          {!uploadedVideo ? (
            <VideoUpload onVideoUpload={handleVideoSelected} />
          ) : (
            <div className="space-y-6">
              {/* Video Preview */}
              <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold">Video Preview</h2>
                  <Button
                    onClick={resetUpload}
                    variant="outline"
                    className="border-gray-600 text-black hover:bg-gray-700 bg-white"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload New Video
                  </Button>
                </div>
                <VideoPlayer videoUrl={videoUrl} />
              </div>

              {/* Analyze Button */}
              <div className="text-center">
                <Button
                  onClick={handleAnalyzeVideo}
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
                      Analyze Video
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
                <>
                  <ResponseDisplay response={apiResponse} />
                  <div className="text-center mt-6">
                    <Button
                      onClick={() => {
                        const blob = new Blob([apiResponse], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'analysis.txt';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }}
                      className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg text-base transition-all duration-200 hover:scale-105 inline-flex items-center"
                    >
                      <Download className="mr-2 h-5 w-5" />
                      Download Analysis
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
