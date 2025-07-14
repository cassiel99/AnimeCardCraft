import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InsertAnimeCard } from "@shared/schema";

interface CardPreviewProps {
  card: Partial<InsertAnimeCard>;
}

export function CardPreview({ card }: CardPreviewProps) {
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

  return (
    <Card className="bg-card-bg border-accent/30">
      <CardHeader>
        <CardTitle className="text-xl font-bold font-orbitron text-accent">
          Card Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="card-frame rounded-lg p-4">
          <div className="text-center mb-4">
            <h4 className="text-lg font-bold font-orbitron text-accent">
              {card.name || "Card Name"}
            </h4>
            <p className="text-sm text-gray-300 capitalize">
              {card.type || "character"} • <span className={getRarityColor(card.rarity || "common")}>{card.rarity || "common"}</span>
            </p>
          </div>
          
          {/* Card Image */}
          <div className="relative mb-4">
            {card.imageUrl ? (
              <img
                src={card.imageUrl}
                alt={card.name || "Card image"}
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
              {card.mana || 0} <i className="fas fa-magic"></i>
            </div>
          </div>

          {/* Card Stats */}
          {(card.type === "character" || card.type === "summon") && (
            <div className="grid grid-cols-3 gap-2 mb-4 text-center">
              <div className="bg-red-500/20 rounded p-2">
                <div className="text-red-400 font-bold">{card.attack || 0}</div>
                <div className="text-xs text-gray-400">ATK</div>
              </div>
              <div className="bg-blue-500/20 rounded p-2">
                <div className="text-blue-400 font-bold">{card.defense || 0}</div>
                <div className="text-xs text-gray-400">DEF</div>
              </div>
              <div className="bg-green-500/20 rounded p-2">
                <div className="text-green-400 font-bold">{card.health || 0}</div>
                <div className="text-xs text-gray-400">HP</div>
              </div>
            </div>
          )}

          {/* Special Abilities */}
          {card.abilities && card.abilities.length > 0 && (
            <div className="text-xs text-gray-300 mb-3">
              {card.abilities.map((ability, index) => (
                <p key={index}>
                  <span className={getAbilityColor(ability)}>{getAbilityLabel(ability)}:</span> Special ability
                </p>
              ))}
            </div>
          )}

          {/* Description */}
          {card.description && (
            <p className="text-xs text-gray-400 italic">
              "{card.description}"
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
