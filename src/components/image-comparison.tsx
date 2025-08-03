import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Expand, Download, CheckCircle, Clock, AlertCircle, Upload } from "lucide-react";
import { type Enhancement } from "@shared/schema";

interface ImageComparisonProps {
  originalFile: File | null;
  enhancement: Enhancement | null;
  isEnhancing: boolean;
}

export default function ImageComparison({ 
  originalFile, 
  enhancement, 
  isEnhancing 
}: ImageComparisonProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const downloadImage = () => {
    if (enhancement?.enhancedPath) {
      const link = document.createElement('a');
      link.href = `/${enhancement.enhancedPath}`;
      link.download = `enhanced_${enhancement.originalFilename}`;
      link.click();
    }
  };

  const getStatusIcon = () => {
    if (isEnhancing) return <Clock className="h-5 w-5 text-accent animate-pulse" />;
    if (enhancement?.status === 'completed') return <CheckCircle className="h-5 w-5 text-success" />;
    if (enhancement?.status === 'failed') return <AlertCircle className="h-5 w-5 text-destructive" />;
    return null;
  };

  const getStatusText = () => {
    if (isEnhancing) return "Processing...";
    if (enhancement?.status === 'completed') return "Enhancement Complete";
    if (enhancement?.status === 'failed') return "Enhancement Failed";
    return "Ready to enhance";
  };

  return (
    <Card className="bg-surface p-8 border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <h3 className="text-xl font-bold">Processing Results</h3>
          {getStatusIcon()}
          <span className="text-sm text-text-secondary">{getStatusText()}</span>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            <Expand className="h-4 w-4" />
          </Button>
          {enhancement?.status === 'completed' && (
            <Button 
              onClick={downloadImage}
              className="bg-success hover:bg-green-600 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          )}
        </div>
      </div>
      
      <div className="relative bg-background rounded-xl overflow-hidden">
        {originalFile ? (
          <div 
            ref={containerRef}
            className="comparison-slider aspect-video relative cursor-col-resize"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Original Image */}
            <img 
              src={URL.createObjectURL(originalFile)}
              alt="Original image"
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* Enhanced Image Overlay */}
            {enhancement?.enhancedPath && enhancement.status === 'completed' && (
              <div 
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${sliderPosition}%` }}
              >
                <img 
                  src={`/${enhancement.enhancedPath}`}
                  alt="Enhanced image"
                  className="w-full h-full object-cover"
                  style={{ width: `${100 * (100 / sliderPosition)}%` }}
                />
              </div>
            )}
            
            {/* Processing Overlay */}
            {isEnhancing && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-white font-semibold">Enhancing with AI...</p>
                  <p className="text-gray-300 text-sm">This may take a few seconds</p>
                </div>
              </div>
            )}
            
            {/* Slider Handle */}
            {enhancement?.enhancedPath && enhancement.status === 'completed' && (
              <div 
                className="slider-handle"
                style={{ left: `${sliderPosition}%` }}
                onMouseDown={handleMouseDown}
              >
                <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 cursor-grab shadow-lg flex items-center justify-center">
                  <div className="w-1 h-4 bg-gray-800 rounded"></div>
                  <div className="w-1 h-4 bg-gray-800 rounded ml-1"></div>
                </div>
              </div>
            )}
            
            {/* Labels */}
            <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
              Before
            </div>
            {enhancement?.status === 'completed' && (
              <div className="absolute bottom-4 right-4 bg-success/90 text-white px-3 py-1 rounded-full text-sm">
                After - Enhanced
              </div>
            )}
          </div>
        ) : (
          <div className="aspect-video bg-gray-700 rounded-xl flex items-center justify-center">
            <div className="text-center text-text-secondary">
              <Upload className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Upload an image to see the comparison</p>
            </div>
          </div>
        )}
      </div>
      
      {enhancement?.processingTime && (
        <div className="mt-4 bg-gradient-to-r from-success/20 to-primary/20 rounded-xl p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Processing Time:</span>
            <span className="text-success font-semibold">{enhancement.processingTime.toFixed(1)} seconds</span>
          </div>
        </div>
      )}
    </Card>
  );
}
