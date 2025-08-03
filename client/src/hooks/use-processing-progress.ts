import { useState, useEffect } from "react";

export interface ProcessingStage {
  id: string;
  name: string;
  status: "pending" | "active" | "completed";
}

export function useProcessingProgress(isProcessing: boolean) {
  const [stages, setStages] = useState<ProcessingStage[]>([
    { id: "upload", name: "Upload & Validation", status: "pending" },
    { id: "enhance", name: "AI Enhancement", status: "pending" },
    { id: "optimize", name: "Quality Optimization", status: "pending" },
    { id: "render", name: "Final Rendering", status: "pending" },
  ]);
  
  const [progress, setProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(5);

  useEffect(() => {
    if (!isProcessing) {
      // Reset when not processing
      setStages([
        { id: "upload", name: "Upload & Validation", status: "pending" },
        { id: "enhance", name: "AI Enhancement", status: "pending" },
        { id: "optimize", name: "Quality Optimization", status: "pending" },
        { id: "render", name: "Final Rendering", status: "pending" },
      ]);
      setProgress(0);
      setEstimatedTime(5);
      return;
    }

    // Start processing simulation
    let currentStage = 0;
    let currentProgress = 0;

    const interval = setInterval(() => {
      currentProgress += Math.random() * 15 + 5; // 5-20% progress per update
      
      if (currentProgress > 100) currentProgress = 100;
      
      setProgress(currentProgress);
      setEstimatedTime(Math.max(1, Math.floor((100 - currentProgress) / 20)));

      // Update stages based on progress
      const newStages = [...stages];
      
      if (currentProgress > 10) {
        newStages[0].status = "completed";
      }
      if (currentProgress > 25) {
        newStages[1].status = "active";
      }
      if (currentProgress > 60) {
        newStages[1].status = "completed";
        newStages[2].status = "active";
      }
      if (currentProgress > 85) {
        newStages[2].status = "completed";
        newStages[3].status = "active";
      }
      if (currentProgress >= 100) {
        newStages[3].status = "completed";
      }

      setStages(newStages);

      if (currentProgress >= 100) {
        clearInterval(interval);
      }
    }, 400); // Update every 400ms

    return () => clearInterval(interval);
  }, [isProcessing]);

  return { stages, progress, estimatedTime };
}