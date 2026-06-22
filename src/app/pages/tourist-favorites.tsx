import { TouristLayout } from "../components/tourist-layout";
import { PlaceCard } from "../components/place-card";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Heart, LogIn } from "lucide-react";
import { useState } from "react";
import { TouristAuthProps } from "../types/tourist-auth";
import { PLACE_TYPES } from "../data/place-types";

interface TouristFavoritesProps extends TouristAuthProps {
  onNavigate?: (page: string) => void;
}

export function TouristFavorites({ onNavigate, isTouristLoggedIn, onTouristLogout }: TouristFavoritesProps) {
  const [favorites] = useState([
    {
      id: '1',
      name: 'Grand Mosque Restaurant',
      category: 'Restaurant',
      location: 'Bangkok, Thailand',
      rating: 4.8,
      reviews: 234,
      image: 'https://images.unsplash.com/photo-1600555379885-08a02224726d?w=400',
      halalVerified: true,
      isFavorite: true,
    },
    {
      id: '2',
      name: 'Islamic Heritage Hotel',
      category: 'Hotel',
      location: 'Phuket, Thailand',
      rating: 4.9,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1766856925165-94997a2104b4?w=400',
      halalVerified: true,
      isFavorite: true,
    },
  ]);

  return (
    <TouristLayout activePage="favorites" onNavigate={onNavigate} isTouristLoggedIn={isTouristLoggedIn} onTouristLogout={onTouristLogout}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Favorites</h1>
          <p className="text-muted-foreground">Places you've saved for later</p>
        </div>

        {!isTouristLoggedIn ? (
          <Card className="border-dashed bg-slate-50">
            <CardContent className="py-12 text-center">
              <Heart className="size-14 text-slate-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Sign in to save and manage your favorite places.</h2>
              <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                You can continue browsing places as a guest. Create an account when you want to keep a personal favorites list.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Button onClick={() => onNavigate?.("login")}>
                  <LogIn className="size-4 mr-2" />
                  Sign in
                </Button>
                <Button variant="outline" onClick={() => onNavigate?.("register")}>
                  Create account
                </Button>
                <Button variant="ghost" onClick={() => onNavigate?.("search")}>
                  Continue browsing
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="h-auto flex flex-wrap justify-start">
            <TabsTrigger value="all">All ({favorites.length})</TabsTrigger>
            {PLACE_TYPES.map((type) => (
              <TabsTrigger key={type.value} value={type.value}>{type.pluralLabel}</TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {favorites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((place) => (
                  <PlaceCard
                    key={place.id}
                    {...place}
                    onClick={(id) => onNavigate?.('place-detail')}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Heart className="size-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start exploring and save places you love
                </p>
                <Button onClick={() => onNavigate?.('search')}>
                  Explore Places
                </Button>
              </div>
            )}
          </TabsContent>

          {PLACE_TYPES.map((type) => (
            <TabsContent key={type.value} value={type.value} className="mt-6">
              <div className="text-center py-12">
                <p className="text-muted-foreground">No favorite {type.pluralLabel.toLowerCase()} yet</p>
              </div>
            </TabsContent>
          ))}
        </Tabs>
        )}
      </div>
    </TouristLayout>
  );
}
