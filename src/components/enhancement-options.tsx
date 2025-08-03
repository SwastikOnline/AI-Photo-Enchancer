import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ZoomIn, Brush, Focus, RotateCcw, Loader2 } from "lucide-react";

interface EnhancementOptionsProps {
  selectedType: string;
  onTypeSelect: (type: string) => void;
  onEnhance: () => void;
  isEnhancing: boolean;
  hasImage: boolean;
}

const enhancementTypes = [
  {
    id: "upscale",
    name: "Upscale",
    description: "Increase resolution up to 8x",
    icon: ZoomIn,
    color: "primary",
  },
  {
    id: "denoise",
    name: "Denoise",
    description: "Remove grain and artifacts",
    icon: Brush,
    color: "secondary",
  },
  {
    id: "sharpen",
    name: "Sharpen",
    description: "Enhance details and clarity",
    icon: Focus,
    color: "accent",
  },
  {
    id: "restore",
    name: "Restore",
    description: "Fix old and damaged photos",
    icon: RotateCcw,
    color: "success",
  },
];



export default function EnhancementOptions({
  selectedType,
  onTypeSelect,
  onEnhance,
  isEnhancing,
  hasImage,
}: EnhancementOptionsProps) {
  return (
    <Card className="bg-surface p-6 border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Enhancement Options</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-6">
        {enhancementTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedType === type.id;
          
          return (
            <div
              key={type.id}
              className={`bg-background rounded-xl p-3 border transition-all cursor-pointer professional-hover ${
                isSelected 
                  ? "border-blue-500 ring-2 ring-blue-500/20 bg-blue-500/10" 
                  : "border-gray-700 hover:border-gray-600"
              }`}
              onClick={() => onTypeSelect(type.id)}
            >
              <Icon className={`h-6 w-6 mb-2 ${
                type.color === "primary" ? "text-primary" :
                type.color === "secondary" ? "text-secondary" :
                type.color === "accent" ? "text-accent" :
                "text-success"
              }`} />
              <h4 className="font-semibold mb-1 text-sm">{type.name}</h4>
              <p className="text-xs text-text-secondary">{type.description}</p>
            </div>
          );
        })}
      </div>

      <Button 
        onClick={onEnhance}
        disabled={!hasImage || isEnhancing}
        className="bg-success hover:bg-green-600 text-white w-full"
      >
        {isEnhancing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          "Enhance Image"
        )}
      </Button>
    </Card>
  );
}
