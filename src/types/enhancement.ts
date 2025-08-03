export interface EnhancementSettings {
  scale?: number;
  sigma?: number;
  flat?: number;
  jagged?: number;
  brightness?: number;
  contrast?: number;
  saturation?: number;
}

export interface EnhancementOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  settings?: Partial<EnhancementSettings>;
}

export interface ProcessingStatus {
  id: number;
  status: "processing" | "completed" | "failed";
  progress?: number;
  originalFilename: string;
  enhancementType: string;
  createdAt: string;
  completedAt?: string;
  enhancedPath?: string;
}
