import { useAuth } from "@/hooks/use-auth";
import { Navbar } from "@/components/navbar";
import { CardCreator } from "@/components/card-creator";
import { CardCollection } from "@/components/card-collection";
import { useQuery } from "@tanstack/react-query";
import { AnimeCard } from "@shared/schema";

export default function HomePage() {
  const { user } = useAuth();
  
  const { data: cards = [], isLoading } = useQuery<AnimeCard[]>({
    queryKey: ["/api/cards"],
    enabled: !!user,
  });

  const stats = {
    totalCards: cards.length,
    rareCards: cards.filter(card => card.rarity === "rare").length,
    legendaryCards: cards.filter(card => card.rarity === "legendary").length,
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold font-orbitron text-accent mb-2">
            Welcome back, {user?.username}!
          </h1>
          <p className="text-gray-300">Ready to create your next legendary anime card?</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card-bg rounded-lg p-6 border border-accent/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Cards</p>
                <p className="text-2xl font-bold text-accent">{stats.totalCards}</p>
              </div>
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                <i className="fas fa-layer-group text-accent"></i>
              </div>
            </div>
          </div>
          
          <div className="bg-card-bg rounded-lg p-6 border border-accent/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Rare Cards</p>
                <p className="text-2xl font-bold text-accent">{stats.rareCards}</p>
              </div>
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                <i className="fas fa-star text-accent"></i>
              </div>
            </div>
          </div>
          
          <div className="bg-card-bg rounded-lg p-6 border border-accent/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Legendary Cards</p>
                <p className="text-2xl font-bold text-accent">{stats.legendaryCards}</p>
              </div>
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                <i className="fas fa-crown text-accent"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          <CardCreator />
          <CardCollection cards={cards} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
