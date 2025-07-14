import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { insertAnimeCardSchema, InsertAnimeCard, AnimeCard } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { CardPreview } from "./card-preview";

export function CardCreator() {
  const { toast } = useToast();
  const [previewCard, setPreviewCard] = useState<Partial<InsertAnimeCard> | null>(null);

  const form = useForm<InsertAnimeCard>({
    resolver: zodResolver(insertAnimeCardSchema),
    defaultValues: {
      name: "",
      type: "character",
      rarity: "common",
      attack: 0,
      defense: 0,
      health: 0,
      mana: 0,
      description: "",
      imageUrl: "",
      abilities: [],
    },
  });

  const createCardMutation = useMutation({
    mutationFn: async (data: InsertAnimeCard) => {
      const res = await apiRequest("POST", "/api/cards", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cards"] });
      toast({
        title: "Card created successfully!",
        description: "Your anime card has been added to your collection.",
      });
      form.reset();
      setPreviewCard(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create card",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: InsertAnimeCard) => {
    createCardMutation.mutate(data);
  };

  const handlePreview = () => {
    const formData = form.getValues();
    setPreviewCard(formData);
  };

  const availableAbilities = [
    { id: "regeneration", label: "Regeneration", color: "text-green-400" },
    { id: "berserker", label: "Berserker", color: "text-red-400" },
    { id: "magic_shield", label: "Magic Shield", color: "text-blue-400" },
    { id: "spell_boost", label: "Spell Boost", color: "text-purple-400" },
    { id: "stealth", label: "Stealth", color: "text-gray-400" },
    { id: "fire_immunity", label: "Fire Immunity", color: "text-orange-400" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Card Creator Form */}
      <div className="lg:col-span-2">
        <Card className="bg-card-bg border-accent/30">
          <CardHeader>
            <CardTitle className="text-2xl font-bold font-orbitron text-accent">
              Create New Card
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Card Name and Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-gray-300">Card Name</Label>
                  <Input
                    id="name"
                    {...form.register("name")}
                    className="bg-dark-bg border-accent/30 focus:border-accent text-white"
                    placeholder="Enter card name"
                  />
                  {form.formState.errors.name && (
                    <p className="text-red-400 text-sm mt-1">{form.formState.errors.name.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="type" className="text-gray-300">Card Type</Label>
                  <Select value={form.watch("type")} onValueChange={(value) => form.setValue("type", value)}>
                    <SelectTrigger className="bg-dark-bg border-accent/30 focus:border-accent text-white">
                      <SelectValue placeholder="Select card type" />
                    </SelectTrigger>
                    <SelectContent className="bg-dark-bg border-accent/30">
                      <SelectItem value="character">Character</SelectItem>
                      <SelectItem value="spell">Spell</SelectItem>
                      <SelectItem value="artifact">Artifact</SelectItem>
                      <SelectItem value="summon">Summon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Image URL */}
              <div>
                <Label htmlFor="imageUrl" className="text-gray-300">Card Image URL</Label>
                <Input
                  id="imageUrl"
                  {...form.register("imageUrl")}
                  className="bg-dark-bg border-accent/30 focus:border-accent text-white"
                  placeholder="Enter image URL"
                />
              </div>

              {/* Card Stats */}
              <div>
                <Label className="text-gray-300 mb-4 block">Card Statistics</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <i className="fas fa-sword text-red-400 text-xl"></i>
                    </div>
                    <Label className="text-xs text-gray-400">Attack</Label>
                    <Input
                      type="number"
                      {...form.register("attack", { valueAsNumber: true })}
                      className="bg-dark-bg border-accent/30 text-center text-white mt-1"
                      min="0"
                    />
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <i className="fas fa-shield-alt text-blue-400 text-xl"></i>
                    </div>
                    <Label className="text-xs text-gray-400">Defense</Label>
                    <Input
                      type="number"
                      {...form.register("defense", { valueAsNumber: true })}
                      className="bg-dark-bg border-accent/30 text-center text-white mt-1"
                      min="0"
                    />
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <i className="fas fa-heart text-green-400 text-xl"></i>
                    </div>
                    <Label className="text-xs text-gray-400">Health</Label>
                    <Input
                      type="number"
                      {...form.register("health", { valueAsNumber: true })}
                      className="bg-dark-bg border-accent/30 text-center text-white mt-1"
                      min="0"
                    />
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <i className="fas fa-magic text-purple-400 text-xl"></i>
                    </div>
                    <Label className="text-xs text-gray-400">Mana</Label>
                    <Input
                      type="number"
                      {...form.register("mana", { valueAsNumber: true })}
                      className="bg-dark-bg border-accent/30 text-center text-white mt-1"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Card Rarity */}
              <div>
                <Label className="text-gray-300 mb-2 block">Card Rarity</Label>
                <div className="flex space-x-6">
                  {[
                    { value: "common", label: "Common", color: "text-gray-400" },
                    { value: "rare", label: "Rare", color: "text-blue-400" },
                    { value: "legendary", label: "Legendary", color: "text-accent" },
                  ].map((rarity) => (
                    <label key={rarity.value} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        value={rarity.value}
                        {...form.register("rarity")}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 border-2 border-gray-400 rounded-full mr-2 flex items-center justify-center ${form.watch("rarity") === rarity.value ? `border-${rarity.color.split('-')[1]}-400` : ""}`}>
                        {form.watch("rarity") === rarity.value && (
                          <div className={`w-2 h-2 rounded-full ${rarity.color.replace('text-', 'bg-')}`}></div>
                        )}
                      </div>
                      <span className={rarity.color}>{rarity.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Card Description */}
              <div>
                <Label htmlFor="description" className="text-gray-300">Card Description</Label>
                <Textarea
                  id="description"
                  {...form.register("description")}
                  className="bg-dark-bg border-accent/30 focus:border-accent text-white resize-none"
                  rows={4}
                  placeholder="Enter card description and abilities..."
                />
              </div>

              {/* Special Abilities */}
              <div>
                <Label className="text-gray-300 mb-2 block">Special Abilities</Label>
                <div className="space-y-2">
                  {availableAbilities.map((ability) => (
                    <div key={ability.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={ability.id}
                        checked={form.watch("abilities")?.includes(ability.id) || false}
                        onCheckedChange={(checked) => {
                          const currentAbilities = form.getValues("abilities") || [];
                          if (checked) {
                            form.setValue("abilities", [...currentAbilities, ability.id]);
                          } else {
                            form.setValue("abilities", currentAbilities.filter(a => a !== ability.id));
                          }
                        }}
                      />
                      <Label htmlFor={ability.id} className={`${ability.color} cursor-pointer`}>
                        {ability.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <Button
                  type="submit"
                  className="flex-1 bg-accent hover:bg-accent/80 text-dark-bg font-bold"
                  disabled={createCardMutation.isPending}
                >
                  <i className="fas fa-plus mr-2"></i>
                  {createCardMutation.isPending ? "Creating..." : "Create Card"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePreview}
                  className="border-accent/30 text-accent hover:bg-accent/10"
                >
                  <i className="fas fa-eye mr-2"></i>
                  Preview
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Card Preview */}
      <div className="space-y-6">
        <CardPreview card={previewCard || form.getValues()} />
      </div>
    </div>
  );
}
