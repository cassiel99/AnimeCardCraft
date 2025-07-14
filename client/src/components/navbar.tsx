import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { user, logoutMutation } = useAuth();

  return (
    <nav className="bg-card-bg border-b border-accent/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold font-orbitron text-accent animate-glow">
              <i className="fas fa-magic mr-2"></i>
              AnimeCards
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-white">Welcome, {user?.username}!</span>
            <Button
              onClick={() => logoutMutation.mutate()}
              variant="outline"
              className="border-accent/30 text-accent hover:bg-accent/10"
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
