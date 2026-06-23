import { useMemo, useState } from "react";
import { toast } from "sonner";
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
import {
  PrototypeContentRecord,
  getPublishedContent,
  getSelectedArticleId,
  usePrototypeContent,
} from "../data/prototype-content-workflow";
import { usePrototypePlaces } from "../data/prototype-place-workflow";

interface TouristArticleDetailProps extends TouristAuthProps {
  onNavigate?: (page: string) => void;
}

function readTime(content: PrototypeContentRecord) {
  const words = `${content.title} ${content.excerpt} ${content.body}`.split(/\s+/).filter(Boolean).length;
  return `${Math.max(3, Math.ceil(words / 180))} min read`;
}

function initials(name: string) {
  return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "GS";
}

export function TouristArticleDetail({ onNavigate, isTouristLoggedIn, onTouristLogout }: TouristArticleDetailProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const { content } = usePrototypeContent();
  const { places } = usePrototypePlaces();
  const published = useMemo(() => getPublishedContent(content), [content]);
  const selectedId = getSelectedArticleId();
  const article = published.find((item) => item.id === selectedId) ?? published[0];

  const relatedPlaces = useMemo(() => {
    if (!article) return [];
    const explicit = places.filter((place) => article.relatedPlaceIds.includes(place.id));
    if (explicit.length) return explicit;
    return places.filter((place) => place.status === "Approved" || place.status === "Expiring Soon").slice(0, 2);
  }, [article, places]);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Removed from favorites" : "Saved to favorites");
  };

  if (!article) {
    return (
      <TouristLayout activePage="articles" onNavigate={onNavigate} isTouristLoggedIn={isTouristLoggedIn} onTouristLogout={onTouristLogout}>
        <div className="max-w-3xl mx-auto text-center py-16">
          <h1 className="text-2xl font-bold mb-2">Article not found</h1>
          <p className="text-muted-foreground mb-6">This content may still be in draft, archived, or not yet published.</p>
          <Button onClick={() => onNavigate?.("articles")}>Back to Articles</Button>
        </div>
      </TouristLayout>
    );
  }

  return (
    <TouristLayout activePage="articles" onNavigate={onNavigate} isTouristLoggedIn={isTouristLoggedIn} onTouristLogout={onTouristLogout}>
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          className="mb-4 pl-0 hover:pl-2 transition-all"
          onClick={() => onNavigate?.("articles")}
        >
          <ChevronLeft className="size-4 mr-2" />
          Back to Articles
        </Button>

        <div className="mb-8">
          <Badge className="mb-4">{article.category}</Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            {article.title}
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            {article.excerpt}
          </p>

          <div className="flex items-center justify-between py-4 border-y gap-3">
            <div className="flex items-center gap-4 min-w-0">
              <Avatar>
                <AvatarFallback>{initials(article.author)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold text-sm flex items-center gap-1">
                  <User className="size-3" /> {article.author}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3" />
                    {article.publishedAt ?? article.updatedAt}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" />
                    {readTime(article)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
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

        <div className="rounded-2xl overflow-hidden mb-8">
          <ImageWithFallback
            src={article.coverImage}
            alt={article.title}
            className="w-full h-[400px] object-cover"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="prose prose-emerald max-w-none">
              {article.body.split("\n").filter(Boolean).map((paragraph, idx) => (
                <p key={idx} className="text-lg leading-relaxed text-slate-700 mb-6">
                  {paragraph}
                </p>
              ))}
            </div>
            <Card className="bg-blue-50 border-blue-200 mt-6">
              <CardContent className="pt-5 text-sm text-blue-800 leading-relaxed">
                GoSafar Thailand displays travel information from recognized agencies, partner datasets, and reviewed operator submissions. The platform does not issue halal certification. Certification decisions remain with the relevant certifying authority.
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-50 p-6 rounded-xl border">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="size-5 text-emerald-600" />
                <h3 className="font-bold text-lg">Related Places</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Reviewed places connected to this guide or useful for planning.
              </p>

              <div className="space-y-4">
                {relatedPlaces.map((place) => (
                  <div key={place.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    <PlaceCard
                      id={place.id}
                      name={place.name}
                      category={place.type}
                      location={`${place.province}, Thailand`}
                      rating={place.rating}
                      reviews={place.reviews}
                      image={place.image}
                      halalVerified={place.status === "Approved" || place.status === "Expiring Soon"}
                      onClick={() => onNavigate?.("place-detail")}
                    />
                  </div>
                ))}
                {relatedPlaces.length === 0 && (
                  <p className="text-sm text-muted-foreground">No related published places are linked yet.</p>
                )}
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
                  onClick={() => onNavigate?.("ai-planner")}
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
