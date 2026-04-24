"use client";

import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts/app";

export default function CommunityActions() {
  const { user, setShowSignModal } = useAppContext();

  const handleAction = (action: string) => {
    if (!user) {
      setShowSignModal(true);
      return;
    }
    console.log("Performing action:", action);
    // Future: implement actual discussion creation
  };

  return (
    <div className="mt-8 flex justify-center gap-4">
      <Button 
        className="rounded-full px-8 py-6 text-lg font-bold"
        onClick={() => handleAction("new_discussion")}
      >
        Start New Discussion
      </Button>
      <Button 
        variant="outline" 
        className="rounded-full px-8 py-6 text-lg font-bold"
        onClick={() => handleAction("browse_tutorials")}
      >
        Browse Tutorials
      </Button>
    </div>
  );
}
