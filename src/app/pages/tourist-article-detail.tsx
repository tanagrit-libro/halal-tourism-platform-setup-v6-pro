import { TouristLayout } from "../components/tourist-layout";
import { TouristAuthProps } from "../types/tourist-auth";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Calendar, User, Clock, MapPin, ChevronLeft, Heart } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { PlaceCard } from "../components/place-card";
import { ShareButton } from "../components/share-button";
import { useState } from "react";
import { toast } from "sonner";

interface TouristArticleDetailProps extends TouristAuthProps {
  onNavigate?: (page: string) => void;
}

export function TouristArticleDetail({ onNavigate, isTouristLoggedIn, onTouristLogout }: TouristArticleDetailProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Removed from favorites" : "Saved to favorites");
  };

  // Mock Article Data
  const article = {
    id: '1',
    title: 'Top 10 Halal Restaurants in Bangkok You Must Try',
    subtitle: 'Discover the best halal dining experiences in Thailand\'s capital city, from street food to fine dining.',
    image: 'https://images.unsplash.com/photo-1600555379885-08a02224726d?w=1200',
    author: 'Sarah Abdullah',
    date: 'February 7, 2026',
    readTime: '5 min read',
    category: 'Food & Dining',
    content: [
      "Bangkok is a paradise for food lovers, and Muslim travelers can enjoy a wide array of delicious halal options. From authentic Thai cuisine to international flavors, the city offers something for everyone.",
      "In this guide, we've curated a list of the top halal-certified restaurants that combine great taste with strict halal standards. Whether you're looking for a quick bite near a mosque or a luxurious dinner with family, these spots won't disappoint.",
      "One of the highlights of Bangkok's food scene is the vibrant street food culture. Many Muslim-friendly stalls can be found in the Ramkhamhaeng and Charoen Krung areas, offering savory beef noodles, chicken biryani, and sweet roti.",
      "For a more upscale experience, several hotels and standalone restaurants provide certified halal kitchens, ensuring peace of mind for Muslim diners. These venues often feature prayer rooms and family-friendly amenities."
    ]
  };

  // Mock Related Places Data (Requirement 2.4)
  const relatedPlaces = [
    {
      id: '1',
      name: 'Grand Mosque Restaurant',
      category: 'Restaurant',
      location: 'Bangkok, Thailand',
      rating: 4.8,
      reviews: 234,
      image: 'https://images.unsplash.com/photo-1600555379885-08a02224726d?w=400',
      halalVerified: true,
    },
    {
      id: '6',
      name: 'Traditional Thai Halal',
      category: 'Restaurant',
      location: 'Bangkok, Thailand',
      rating: 4.7,
      reviews: 198,
      image: 'https://images.unsplash.com/photo-1600555379885-08a02224726d?w=400',
      halalVerified: true,
    }
  ];

  return (
    <TouristLayout activePage="articles" onNavigate={onNavigate} isTouristLoggedIn={isTouristLoggedIn} onTouristLogout={onTouristLogout}>
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          className="mb-4 pl-0 hover:pl-2 transition-all" 
          onClick={() => onNavigate?.('articles')}
        >
          <ChevronLeft className="size-4 mr-2" />
          Back to Articles
        </Button>

        {/* Article Header */}
        <div className="mb-8">
          <Badge className="mb-4">{article.category}</Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            {article.title}
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            {article.subtitle}
          </p>

          <div className="flex items-center justify-between py-4 border-y">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarFallback>SA</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold text-sm">{article.author}</div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3" />
                    {article.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" />
                    {article.readTime}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant={isFavorite ? "default" : "outline"} 
                size="icon"
                onClick={toggleFavorite}
                className={isFavorite ? "bg-red-500 hover:bg-red-600 text-white border-red-500" : ""}
              >
                <Heart className={`size-5 ${isFavorite ? "fill-current" : ""}`} />
              </Button>
              <ShareButton title={article.title} />
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="rounded-2xl overflow-hidden mb-8">
          <ImageWithFallback
            src={article.image}
            alt={article.title}
            className="w-full h-[400px] object-cover"
          />
        </div>

        {/* Content & Related Places Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Article Content */}
          <div className="lg:col-span-2">
            <div className="prose prose-emerald max-w-none">
              {article.content.map((paragraph, idx) => (
                <p key={idx} className="text-lg leading-relaxed text-slate-700 mb-6">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Sidebar: Related Places (Req 2.4) */}
          <div className="space-y-6">
            <div className="bg-slate-50 p-6 rounded-xl border">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="size-5 text-emerald-600" />
                <h3 className="font-bold text-lg">Related Places</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Check out these places mentioned in the article
              </p>
              
              <div className="space-y-4">
                {relatedPlaces.map((place) => (
                  <div key={place.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    <PlaceCard
                      {...place}
                      onClick={() => onNavigate?.('place-detail')}
                    />
                  </div>
                ))}
              </div>
            </div>

            <Card className="bg-emerald-600 text-white border-none">
              <CardContent className="p-6 text-center">
                <h3 className="font-bold text-lg mb-2">Plan your trip?</h3>
                <p className="text-emerald-100 text-sm mb-4">
                  Use our AI Trip Planner to create a customized itinerary including these places.
                </p>
                <Button 
                  className="w-full bg-white text-emerald-600 hover:bg-emerald-50"
                  onClick={() => onNavigate?.('ai-planner')}
                >
                  Start Planning
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TouristLayout>
  );
}
