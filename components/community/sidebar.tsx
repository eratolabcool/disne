"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts/app";

export default function CommunitySidebar() {
  const { user, setShowSignModal } = useAppContext();

  return (
    <div className="space-y-8">
      {!user && (
        <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white border-none shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Join the Magic!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm opacity-90">Sign up now to start posting tutorials, sharing your high scores, and getting help with tough levels.</p>
            <Button 
              variant="secondary" 
              className="w-full font-bold"
              onClick={() => setShowSignModal(true)}
            >
              Create Account
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Popular Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {["Tutorial", "Strategy", "Levels", "Characters", "Art", "Balance", "DailyChallenge", "NewUpdate"].map((tag, i) => (
              <span key={i} className="px-3 py-1 text-xs bg-muted hover:bg-primary hover:text-white transition-colors cursor-pointer rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
