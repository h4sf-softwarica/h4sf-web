
import React from 'react';
import { CheckCircle } from 'lucide-react';

interface ResponseDisplayProps {
  response: string;
}

const ResponseDisplay: React.FC<ResponseDisplayProps> = ({ response }) => {
  return (
    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 animate-fade-in">
      <div className="flex items-center mb-4">
        <CheckCircle className="h-6 w-6 text-green-400 mr-3" />
        <h3 className="text-2xl font-semibold">Processing Complete</h3>
      </div>
      
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-600">
        <pre className="whitespace-pre-wrap text-gray-100 font-mono text-sm leading-relaxed">
          {response}
        </pre>
      </div>
    </div>
  );
};

export default ResponseDisplay;
