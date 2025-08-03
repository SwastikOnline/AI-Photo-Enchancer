import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-surface border-b border-gray-700 sticky top-0 z-50 backdrop-blur-sm bg-surface/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-secondary" />
              <span className="text-xl font-bold text-text-primary">AI Enhancer Pro</span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('features')}
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('pricing')}
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              Pricing
            </button>
            <button 
              onClick={() => scrollToSection('enhancer')}
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              Try Now
            </button>
            <Button 
              onClick={() => scrollToSection('enhancer')}
              className="bg-primary hover:bg-blue-700 text-white"
            >
              Get Started
            </Button>
          </nav>
          
          <button 
            className="md:hidden text-text-primary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700">
            <div className="flex flex-col space-y-4">
              <button 
                onClick={() => scrollToSection('features')}
                className="text-text-secondary hover:text-text-primary transition-colors text-left"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('pricing')}
                className="text-text-secondary hover:text-text-primary transition-colors text-left"
              >
                Pricing
              </button>
              <button 
                onClick={() => scrollToSection('enhancer')}
                className="text-text-secondary hover:text-text-primary transition-colors text-left"
              >
                Try Now
              </button>
              <Button 
                onClick={() => scrollToSection('enhancer')}
                className="bg-primary hover:bg-blue-700 text-white w-full"
              >
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
