import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { type Enhancement } from "@shared/schema";

export function useImageEnhancement() {
  const [currentEnhancementId, setCurrentEnhancementId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  // Poll for enhancement status
  const { data: currentEnhancement } = useQuery({
    queryKey: ['/api/enhance', currentEnhancementId],
    enabled: !!currentEnhancementId,
    refetchInterval: (data) => {
      // Stop polling if enhancement is completed or failed
      return data?.status === 'processing' ? 2000 : false;
    },
  });

  const enhanceMutation = useMutation({
    mutationFn: async ({ file, enhancementType }: { file: File; enhancementType: string }) => {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('enhancementType', enhancementType);

      const response = await apiRequest('POST', '/api/enhance', formData);
      return response.json();
    },
    onSuccess: (data) => {
      setCurrentEnhancementId(data.id);
      // Invalidate recent enhancements to refresh the sidebar
      queryClient.invalidateQueries({ queryKey: ['/api/enhancements/recent'] });
    },
  });

  const enhanceImage = async (file: File, enhancementType: string) => {
    return enhanceMutation.mutateAsync({ file, enhancementType });
  };

  return {
    enhanceImage,
    isEnhancing: enhanceMutation.isPending || currentEnhancement?.status === 'processing',
    currentEnhancement: currentEnhancement as Enhancement | null,
    error: enhanceMutation.error,
  };
}
