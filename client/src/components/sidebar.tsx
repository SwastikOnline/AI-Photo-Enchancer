import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Download, ExternalLink, Trash2 } from "lucide-react";
import { type Enhancement } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Sidebar() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: recentEnhancements } = useQuery({
    queryKey: ['/api/enhancements/recent'],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const clearStorageMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('/api/enhancements/clear-completed', {
        method: 'DELETE'
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/enhancements/recent'] });
      toast({
        title: "Storage cleared",
        description: "All completed enhancements have been removed from storage.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error clearing storage",
        description: error.message || "Failed to clear storage. Please try again.",
        variant: "destructive",
      });
    }
  });

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="lg:col-span-1 space-y-6">
      {/* Advertisement Space */}
      <Card className="bg-surface p-6 border-gray-700">
        <div className="text-xs text-text-secondary mb-3 text-center">Advertisement</div>
        <div className="bg-gradient-to-br from-accent/20 to-primary/20 rounded-xl p-8 text-center min-h-[250px] flex flex-col justify-center">
          <div className="text-4xl mb-3">📸</div>
          <h4 className="font-semibold mb-2">Photography Tools</h4>
          <p className="text-sm text-text-secondary mb-4">Professional camera equipment and accessories</p>
          <Button className="bg-accent hover:bg-yellow-500 text-black font-semibold">
            <ExternalLink className="w-4 h-4 mr-2" />
            Shop Now
          </Button>
        </div>
      </Card>

      {/* Processing History */}
      <Card className="bg-surface p-6 border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold">Recent Enhancements</h4>
          {recentEnhancements && recentEnhancements.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => clearStorageMutation.mutate()}
              disabled={clearStorageMutation.isPending}
              className="text-red-400 hover:text-red-300 hover:bg-red-400/10 px-2 py-1 h-auto"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Clear Storage
            </Button>
          )}
        </div>
        <div className="space-y-3">
          {recentEnhancements && recentEnhancements.length > 0 ? (
            recentEnhancements.slice(0, 5).map((enhancement: Enhancement) => (
              <div key={enhancement.id} className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                  {enhancement.enhancedPath ? (
                    <img 
                      src={`/${enhancement.enhancedPath}`}
                      alt="Enhanced thumbnail" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                      <span className="text-xs text-gray-400">...</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{enhancement.originalFilename}</p>
                  <p className="text-xs text-text-secondary">
                    {enhancement.enhancementType} • {formatTimeAgo(enhancement.createdAt)}
                  </p>
                </div>
                {enhancement.status === 'completed' && (
                  <button 
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = `/${enhancement.enhancedPath}`;
                      link.download = `enhanced_${enhancement.originalFilename}`;
                      link.click();
                    }}
                    className="text-text-secondary hover:text-text-primary cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-text-secondary py-8">
              <p className="text-sm">No recent enhancements</p>
              <p className="text-xs mt-1">Upload an image to get started</p>
            </div>
          )}
        </div>
      </Card>

      {/* Affiliate Links Section */}
      <Card className="bg-surface p-6 border-gray-700">
        <h4 className="font-semibold mb-4">Recommended Tools</h4>
        <div className="space-y-4">
          <a 
            href="#" 
            className="block bg-background rounded-xl p-4 border border-gray-700 hover:border-primary transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">Ai</span>
              </div>
              <div>
                <h5 className="font-semibold text-sm">Adobe Creative Suite</h5>
                <p className="text-xs text-text-secondary">Professional photo editing</p>
              </div>
              <ExternalLink className="w-4 h-4 text-text-secondary ml-auto" />
            </div>
          </a>
          
          <a 
            href="#" 
            className="block bg-background rounded-xl p-4 border border-gray-700 hover:border-secondary transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-secondary to-accent rounded-lg flex items-center justify-center">
                <span className="text-white">📷</span>
              </div>
              <div>
                <h5 className="font-semibold text-sm">Camera Gear</h5>
                <p className="text-xs text-text-secondary">Professional equipment</p>
              </div>
              <ExternalLink className="w-4 h-4 text-text-secondary ml-auto" />
            </div>
          </a>
        </div>
      </Card>
    </div>
  );
}
