import { Button } from "@/components/ui/button";
import { Upload, Play, CheckCircle } from "lucide-react";

export default function HeroSection() {
  const scrollToEnhancer = () => {
    const element = document.getElementById('enhancer');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-background"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Professional{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                AI Image
              </span>{" "}
              Enhancement
            </h1>
            <p className="text-xl text-text-secondary mb-8 leading-relaxed">
              Transform your images with expert-quality AI enhancement. Upscale, denoise, sharpen, and restore photos with professional results in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                onClick={scrollToEnhancer}
                className="bg-primary hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold transform hover:scale-105 transition-all"
              >
                <Upload className="w-5 h-5 mr-2" />
                Start Enhancing
              </Button>
              <Button 
                variant="outline"
                className="border-gray-600 hover:border-gray-500 text-text-primary px-8 py-4 text-lg font-semibold"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-surface rounded-2xl p-6 shadow-2xl">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-sm text-text-secondary">Before</span>
                  <div className="aspect-square bg-gray-700 rounded-xl relative overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=30" 
                      alt="Before enhancement - lower quality landscape" 
                      className="w-full h-full object-cover opacity-70"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-sm text-success">After</span>
                  <div className="aspect-square bg-gray-700 rounded-xl relative overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=95" 
                      alt="After enhancement - high quality landscape" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-success text-white text-xs px-2 py-1 rounded-full">
                      4K Enhanced
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 bg-gradient-to-r from-success/20 to-primary/20 rounded-xl p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">Processing Time:</span>
                  <span className="text-success font-semibold">2.3 seconds</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                  <div className="bg-gradient-to-r from-success to-primary h-2 rounded-full w-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
