import { Card, CardContent, CardHeader } from "./ui/card";
import { CertifyingSourceLogoBadge, TrustStatus } from "./halal-badge";
import { MapPin, Star, Heart } from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface PlaceCardProps {
  id: string;
  name: string;
  category: string;
  location: string;
  rating: number;
  reviews: number;
  image: string;
  trustStatus?: TrustStatus;
  agency?: string;
  source?: string;
  expiryDate?: string;
  /** @deprecated use trustStatus instead */
  halalVerified?: boolean;
  isFavorite?: boolean;
  onFavoriteToggle?: (id: string) => void;
  onClick?: (id: string) => void;
}

export function PlaceCard({
  id,
  name,
  category,
  location,
  rating,
  reviews,
  image,
  trustStatus,
  agency,
  source,
  expiryDate,
  halalVerified,
  isFavorite = false,
  onFavoriteToggle,
  onClick
}: PlaceCardProps) {
  // Derive status from legacy prop when new prop is absent
  const resolvedStatus: TrustStatus = trustStatus ?? (halalVerified ? 'source-verified' : 'owner-submitted');

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
      <div className="relative" onClick={() => onClick?.(id)}>
        <ImageWithFallback
          src={image}
          alt={name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <CertifyingSourceLogoBadge status={resolvedStatus} agency={agency} source={source} size="lg" />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 bg-white/80 hover:bg-white"
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteToggle?.(id);
          }}
        >
          <Heart className={`size-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
        </Button>
      </div>
      <CardHeader onClick={() => onClick?.(id)}>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg">{name}</h3>
            <p className="text-sm text-muted-foreground">{category}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent onClick={() => onClick?.(id)}>
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <MapPin className="size-4 mr-1" />
          <span>{location}</span>
        </div>
        <div className="flex items-center">
          <Star className="size-4 fill-yellow-400 text-yellow-400 mr-1" />
          <span className="font-medium">{rating.toFixed(1)}</span>
          <span className="text-sm text-muted-foreground ml-1">({reviews} reviews)</span>
        </div>
      </CardContent>
    </Card>
  );
}
