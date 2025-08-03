import { useState } from "react";
import EnhancementOptions from "./enhancement-options";
import ImageComparison from "./image-comparison";
import Sidebar from "./sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useImageEnhancement } from "@/hooks/use-image-enhancement";
import { useProcessingProgress } from "@/hooks/use-processing-progress";
import { Upload, CloudUpload, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ImageEnhancer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [enhancementType, setEnhancementType] = useState<string>("upscale");
  const { enhanceImage, isEnhancing, currentEnhancement } = useImageEnhancement();
  const { stages, progress, estimatedTime } = useProcessingProgress(isEnhancing);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 50MB",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
      toast({
        title: "Image uploaded successfully",
        description: `${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB) is ready for enhancement`,
      });
    }
  };

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 50MB",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
      toast({
        title: "Image uploaded successfully",
        description: `${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB) is ready for enhancement`,
      });
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleEnhance = async () => {
    if (!selectedFile) {
      toast({
        title: "No image selected",
        description: "Please select an image to enhance",
        variant: "destructive",
      });
      return;
    }

    try {
      await enhanceImage(selectedFile, enhancementType);
      toast({
        title: "Enhancement started",
        description: "Your image is being processed with AI",
      });
    } catch (error) {
      toast({
        title: "Enhancement failed",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <section id="enhancer" className="py-20 bg-gradient-to-b from-background to-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Enhancement Panel */}
          <div className="lg:col-span-3 space-y-8">
            {/* Image Display Section - Show uploaded and enhanced images side by side */}
            {selectedFile && (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Uploaded Image */}
                <Card className="bg-surface p-6 border-green-600 border-2">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">Uploaded Image</h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-400 font-medium">Successfully Uploaded</span>
                    </div>
                  </div>
                  <div className="aspect-video bg-gray-700 rounded-xl overflow-hidden relative">
                    <img 
                      src={URL.createObjectURL(selectedFile)}
                      alt="Uploaded image"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                      ✓ Ready
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-text-secondary">
                    <p className="font-medium">{selectedFile.name}</p>
                    <p>{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Image loaded successfully</p>
                  </div>
                </Card>

                {/* Processing Result */}
                <Card className="bg-surface p-6 border-gray-700">
                  <h3 className="text-lg font-bold mb-4">Processing Result</h3>
                  <div className="bg-gray-700 rounded-xl overflow-hidden flex items-center justify-center" style={{minHeight: '320px'}}>
                    {currentEnhancement?.enhancedPath && currentEnhancement.status === 'completed' ? (
                      <img 
                        src={`/${currentEnhancement.enhancedPath}`}
                        alt="Processing result"
                        className="w-full h-full object-cover"
                      />
                    ) : isEnhancing ? (
                      <div className="flex flex-col justify-center p-4 w-full h-full">
                        {/* Processing Stages */}
                        <div className="mb-4">
                          <h4 className="text-base font-semibold mb-3 text-white text-center">AI Processing Pipeline</h4>
                          <div className="space-y-2">
                            {stages.map((stage, index) => (
                              <div key={stage.id} className="flex items-center space-x-3 text-left">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                                  stage.status === 'completed' 
                                    ? 'bg-green-500' 
                                    : stage.status === 'active' 
                                      ? 'bg-blue-500 animate-pulse' 
                                      : 'bg-gray-500'
                                }`}>
                                  {stage.status === 'completed' ? (
                                    <span className="text-white text-xs">✓</span>
                                  ) : stage.status === 'active' ? (
                                    <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                                  ) : (
                                    <span className="text-gray-300 text-xs">⋯</span>
                                  )}
                                </div>
                                <span className={`text-sm font-medium ${
                                  stage.status === 'completed' 
                                    ? 'text-green-400' 
                                    : stage.status === 'active' 
                                      ? 'text-blue-400' 
                                      : 'text-gray-400'
                                }`}>
                                  {stage.name}
                                  {stage.id === 'enhance' ? ` (${enhancementType})` : ''}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="mb-3">
                          <div className="flex justify-between text-xs mb-2">
                            <span className="text-blue-400 font-medium">Processing... {Math.round(progress)}%</span>
                            <span className="text-blue-400">{estimatedTime}s remaining</span>
                          </div>
                          <div className="w-full bg-gray-600 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500" 
                              style={{width: `${progress}%`}}
                            ></div>
                          </div>
                        </div>
                        
                        <p className="text-text-secondary text-xs text-center">
                          Applying {enhancementType} enhancement with advanced AI algorithms
                        </p>
                      </div>
                    ) : (
                      <div className="text-center text-text-secondary">
                        <p>Processing result will appear here</p>
                      </div>
                    )}
                  </div>
                  {currentEnhancement?.status === 'completed' && (
                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-sm text-text-secondary">
                        <p className="font-medium text-success">Completed • {currentEnhancement.enhancementType}</p>
                        <p>{currentEnhancement.processingTime?.toFixed(1)}s processing time</p>
                      </div>
                      <Button 
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = `/${currentEnhancement.enhancedPath}`;
                          link.download = `enhanced_${currentEnhancement.originalFilename}`;
                          link.click();
                        }}
                        className="bg-success hover:bg-green-600 text-white"
                        size="sm"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  )}
                </Card>
              </div>
            )}

            {/* Upload and Enhancement Options - Side by Side */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Image Upload Area */}
              <Card className="bg-surface p-6 border-gray-700">
                <h2 className="text-xl font-bold mb-4">Upload & Enhance Your Image</h2>
                <div 
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
                    selectedFile 
                      ? "border-green-500 bg-green-500/10" 
                      : "border-gray-600 hover:border-primary"
                  }`}
                  onDrop={handleFileDrop}
                  onDragOver={handleDragOver}
                  onClick={() => document.getElementById('file-input')?.click()}
                >
                  {selectedFile ? (
                    <>
                      <div className="flex items-center justify-center mb-3">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-xl">✓</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-green-400">
                        {selectedFile.name}
                      </h3>
                      <p className="text-green-300 mb-3 text-sm font-medium">
                        File uploaded successfully! Ready for enhancement.
                      </p>
                      <Button className="bg-green-600 hover:bg-green-700 text-white">
                        <Upload className="w-4 h-4 mr-2" />
                        Change Image
                      </Button>
                      <div className="mt-3 text-xs text-green-300">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.type}
                      </div>
                    </>
                  ) : (
                    <>
                      <CloudUpload className="h-12 w-12 text-text-secondary mb-3 mx-auto" />
                      <h3 className="text-lg font-semibold mb-2">
                        Drop your image here
                      </h3>
                      <p className="text-text-secondary mb-3 text-sm">Or click to browse files</p>
                      <Button className="bg-primary hover:bg-blue-700 text-white">
                        <Upload className="w-4 h-4 mr-2" />
                        Select Image
                      </Button>
                      <div className="mt-3 text-xs text-text-secondary">
                        Supports JPG, PNG, WebP up to 50MB
                      </div>
                    </>
                  )}
                  <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </Card>

              {/* Enhancement Options */}
              <EnhancementOptions 
                selectedType={enhancementType}
                onTypeSelect={setEnhancementType}
                onEnhance={handleEnhance}
                isEnhancing={isEnhancing}
                hasImage={!!selectedFile}
              />
            </div>

            {/* Processing Results */}
            <ImageComparison 
              originalFile={selectedFile}
              enhancement={currentEnhancement}
              isEnhancing={isEnhancing}
            />
          </div>

          {/* Sidebar */}
          <Sidebar />
        </div>
      </div>
    </section>
  );
}
