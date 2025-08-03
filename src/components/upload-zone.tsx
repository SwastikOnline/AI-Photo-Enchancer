import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CloudUpload, Loader2 } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ProcessingStatus } from "@/types/enhancement";

interface UploadZoneProps {
  onEnhancementStart: (enhancement: ProcessingStatus) => void;
  selectedOptions: string[];
}

export default function UploadZone({ onEnhancementStart, selectedOptions }: UploadZoneProps) {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const enhancementMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiRequest("POST", "/api/enhance", formData);
      return response.json();
    },
    onSuccess: (data) => {
      onEnhancementStart({
        id: data.id,
        status: "processing",
        originalFilename: "",
        enhancementType: selectedOptions[0] || "upscale",
        createdAt: new Date().toISOString(),
      });
      toast({
        title: "Upload Successful",
        description: "Your image is being processed. Results will appear below.",
      });
      setUploading(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
      setUploading(false);
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (!selectedOptions.length) {
      toast({
        title: "No Enhancement Selected",
        description: "Please select at least one enhancement option below.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    
    const formData = new FormData();
    formData.append("image", file);
    formData.append("enhancementType", selectedOptions[0]);
    formData.append("settings", JSON.stringify({
      scale: selectedOptions.includes("upscale") ? 2 : undefined,
      sigma: selectedOptions.includes("sharpen") ? 1 : undefined,
    }));

    enhancementMutation.mutate(formData);
  }, [selectedOptions, enhancementMutation, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024, // 50MB
  });

  return (
    <Card className="surface border-border" data-upload-section>
      <CardContent className="p-8">
        <h2 className="text-2xl font-bold mb-6 text-text-primary">Upload & Enhance Your Image</h2>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
            isDragActive 
              ? "border-primary bg-primary/5" 
              : "border-border hover:border-primary/50"
          } ${uploading ? "pointer-events-none opacity-50" : ""}`}
        >
          <input {...getInputProps()} />
          
          {uploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-text-primary">Processing...</h3>
              <p className="text-text-secondary">Your image is being enhanced</p>
            </div>
          ) : (
            <>
              <CloudUpload className="h-16 w-16 text-text-secondary mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2 text-text-primary">
                {isDragActive ? "Drop your image here" : "Drop your image here"}
              </h3>
              <p className="text-text-secondary mb-4">Or click to browse files</p>
              <Button className="button-primary">
                Select Image
              </Button>
              <div className="mt-4 text-sm text-text-secondary">
                Supports JPG, PNG, WebP up to 50MB
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
