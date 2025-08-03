import { Card } from "@/components/ui/card";
import { Expand, Sparkles, Clock, History, Sliders, Cloud } from "lucide-react";

const features = [
  {
    icon: Expand,
    title: "AI Super Resolution",
    description: "Upscale images up to 8x original resolution while preserving fine details and textures with professional quality.",
    gradient: "from-primary to-secondary",
  },
  {
    icon: Sparkles,
    title: "Smart Denoising",
    description: "Remove noise and grain from low-light photos while maintaining image sharpness and natural details.",
    gradient: "from-secondary to-accent",
  },
  {
    icon: Clock,
    title: "Batch Processing",
    description: "Process multiple images simultaneously with consistent quality and save hours of manual editing work.",
    gradient: "from-accent to-success",
  },
  {
    icon: History,
    title: "Photo Restoration",
    description: "Repair old, damaged, or degraded photos with AI-powered restoration algorithms.",
    gradient: "from-success to-primary",
  },
  {
    icon: Sliders,
    title: "Advanced Controls",
    description: "Fine-tune enhancement parameters for professional-grade customization and optimal results.",
    gradient: "from-primary to-accent",
  },
  {
    icon: Cloud,
    title: "Cloud Processing",
    description: "Powerful cloud-based AI processing ensures fast results without requiring expensive hardware.",
    gradient: "from-secondary to-success",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">Professional AI Enhancement Features</h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Powered by cutting-edge AI models to deliver expert-quality results that match professional photo editing standards.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="bg-surface p-8 border-gray-700 hover:border-primary transition-all duration-300 professional-hover"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-text-secondary leading-relaxed">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
