import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AnimeCard } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CardCollectionProps {
  cards: AnimeCard[];
  isLoading: boolean;
}

export function CardCollection({ cards, isLoading }: CardCollectionProps) {
  const [filter, setFilter] = useState<string>("all");
  const { toast } = useToast();

  const deleteCardMutation = useMutation({
    mutationFn: async (cardId: number) => {
      await apiRequest("DELETE", `/api/cards/${cardId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cards"] });
      toast({
        title: "Card deleted successfully",
        description: "Your card has been removed from your collection.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete card",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const filteredCards = cards.filter(card => {
    if (filter === "all") return true;
    return card.type === filter;
  });

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "text-gray-400";
      case "rare": return "text-blue-400";
      case "legendary": return "text-accent";
      default: return "text-gray-400";
    }
  };

  const getAbilityColor = (ability: string) => {
    const colors: Record<string, string> = {
      regeneration: "text-green-400",
      berserker: "text-red-400",
      magic_shield: "text-blue-400",
      spell_boost: "text-purple-400",
      stealth: "text-gray-400",
      fire_immunity: "text-orange-400",
    };
    return colors[ability] || "text-gray-400";
  };

  const getAbilityLabel = (ability: string) => {
    const labels: Record<string, string> = {
      regeneration: "Regeneration",
      berserker: "Berserker",
      magic_shield: "Magic Shield",
      spell_boost: "Spell Boost",
      stealth: "Stealth",
      fire_immunity: "Fire Immunity",
    };
    return labels[ability] || ability;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold font-orbitron text-accent">My Card Collection</h2>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48 bg-card-bg border-accent/30 text-white">
            <SelectValue placeholder="Filter cards" />
          </SelectTrigger>
          <SelectContent className="bg-card-bg border-accent/30">
            <SelectItem value="all">All Cards</SelectItem>
            <SelectItem value="character">Characters</SelectItem>
            <SelectItem value="spell">Spells</SelectItem>
            <SelectItem value="artifact">Artifacts</SelectItem>
            <SelectItem value="summon">Summons</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredCards.length === 0 ? (
        <Card className="bg-card-bg border-accent/30">
          <CardContent className="text-center py-12">
            <i className="fas fa-layer-group text-4xl text-gray-400 mb-4"></i>
            <h3 className="text-xl font-bold text-gray-300 mb-2">No cards yet</h3>
            <p className="text-gray-400">
              {filter === "all" 
                ? "Create your first anime card to get started!" 
                : `No ${filter} cards found. Try creating one!`
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCards.map((card) => (
            <div key={card.id} className="card-frame rounded-lg p-4 hover:scale-105 transition-transform">
              <div className="text-center mb-3">
                <h4 className="text-lg font-bold font-orbitron text-accent">{card.name}</h4>
                <p className="text-sm text-gray-300 capitalize">
                  {card.type} • <span className={getRarityColor(card.rarity)}>{card.rarity}</span>
                </p>
              </div>
              
              {/* Card Image */}
              <div className="relative mb-3">
                {card.imageUrl ? (
                  <img
                    src={card.imageUrl}
                    alt={card.name}
                    className="w-full h-32 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-32 bg-gray-600 rounded-lg flex items-center justify-center">
                    <i className="fas fa-image text-gray-400 text-2xl"></i>
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-accent text-dark-bg px-2 py-1 rounded text-xs font-bold">
                  {card.mana} <i className="fas fa-magic"></i>
                </div>
              </div>

              {/* Card Stats */}
              {(card.type === "character" || card.type === "summon") && (
                <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                  <div className="bg-red-500/20 rounded p-2">
                    <div className="text-red-400 font-bold">{card.attack}</div>
                    <div className="text-xs text-gray-400">ATK</div>
                  </div>
                  <div className="bg-blue-500/20 rounded p-2">
                    <div className="text-blue-400 font-bold">{card.defense}</div>
                    <div className="text-xs text-gray-400">DEF</div>
                  </div>
                  <div className="bg-green-500/20 rounded p-2">
                    <div className="text-green-400 font-bold">{card.health}</div>
                    <div className="text-xs text-gray-400">HP</div>
                  </div>
                </div>
              )}

              {/* Special Abilities */}
              {card.abilities && card.abilities.length > 0 && (
                <div className="text-xs text-gray-300 mb-2">
                  {card.abilities.slice(0, 2).map((ability, index) => (
                    <p key={index}>
                      <span className={getAbilityColor(ability)}>{getAbilityLabel(ability)}:</span> Special ability
                    </p>
                  ))}
                  {card.abilities.length > 2 && (
                    <p className="text-gray-400">+{card.abilities.length - 2} more abilities</p>
                  )}
                </div>
              )}

              {/* Description */}
              {card.description && (
                <p className="text-xs text-gray-400 italic mb-3 line-clamp-2">
                  "{card.description}"
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between items-center">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-blue-400/30 text-blue-400 hover:bg-blue-400/10"
                >
                  <i className="fas fa-edit mr-1"></i>Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-400/30 text-red-400 hover:bg-red-400/10"
                  onClick={() => deleteCardMutation.mutate(card.id)}
                  disabled={deleteCardMutation.isPending}
                >
                  <i className="fas fa-trash mr-1"></i>Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
