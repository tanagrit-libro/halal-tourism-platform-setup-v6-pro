import { useMemo, useState } from "react";
import { TouristLayout } from "../components/tourist-layout";
import { TouristAuthProps } from "../types/tourist-auth";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Search, Clock, User, BookOpen } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  CONTENT_CATEGORIES,
  PrototypeContentRecord,
  getPublishedContent,
  setSelectedArticleId,
  usePrototypeContent,
} from "../data/prototype-content-workflow";

interface TouristArticlesProps extends TouristAuthProps {
  onNavigate?: (page: string) => void;
}

function readTime(content: PrototypeContentRecord) {
  const words = `${content.title} ${content.excerpt} ${content.body}`.split(/\s+/).filter(Boolean).length;
  return `${Math.max(3, Math.ceil(words / 180))} min read`;
}

export function TouristArticles({ onNavigate, isTouristLoggedIn, onTouristLogout }: TouristArticlesProps) {
  const { content } = usePrototypeContent();
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All");

  const published = useMemo(() => getPublishedContent(content), [content]);
  const categories = ["All", ...CONTENT_CATEGORIES];

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return published.filter((article) => {
      const matchCategory = category === "All" || article.category === category;
      const matchSearch =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.excerpt.toLowerCase().includes(q) ||
        article.tags.join(" ").toLowerCase().includes(q);
      return matchCategory && matchSearch;
    });
  }, [published, searchQuery, category]);

  const featured = filtered.find((article) => article.featured) ?? filtered[0];
  const gridArticles = featured ? filtered.filter((article) => article.id !== featured.id) : filtered;

  const openArticle = (id: string) => {
    setSelectedArticleId(id);
    onNavigate?.("article-detail");
  };

  return (
    <TouristLayout activePage="articles" onNavigate={onNavigate} isTouristLoggedIn={isTouristLoggedIn} onTouristLogout={onTouristLogout}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Article & Guides</h1>
          <p className="text-muted-foreground">
            Published halal-friendly travel guides, source-aware updates, and planning stories from GoSafar Thailand.
          </p>
        </div>

        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-muted-foreground" />
            <Input
              placeholder="Search articles, tags, or travel topics..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {categories.map((item) => (
              <Button
                key={item}
                variant={category === item ? "default" : "outline"}
                size="sm"
                onClick={() => setCategory(item)}
              >
                {item}
              </Button>
            ))}
          </div>
        </div>

        {featured ? (
          <>
            <Card className="mb-8 overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <ImageWithFallback
                  src={featured.coverImage}
                  alt={featured.title}
                  className="w-full h-full object-cover min-h-[300px]"
                />
                <CardContent className="p-6 flex flex-col justify-center">
                  <Badge className="w-fit mb-3">{featured.category}</Badge>
                  <h2 className="text-2xl font-bold mb-3">{featured.title}</h2>
                  <p className="text-muted-foreground mb-4">{featured.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <User className="size-4" />
                      {featured.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="size-4" />
                      {readTime(featured)}
                    </div>
                  </div>
                  <Button onClick={() => openArticle(featured.id)}>Read Article</Button>
                </CardContent>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gridArticles.map((article) => (
                <Card
                  key={article.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => openArticle(article.id)}
                >
                  <ImageWithFallback
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                  <CardHeader>
                    <Badge className="w-fit mb-2">{article.category}</Badge>
                    <h3 className="font-semibold text-lg line-clamp-2">{article.title}</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="size-3" />
                        {article.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {readTime(article)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {gridArticles.length > 6 && (
              <div className="text-center mt-8">
                <Button variant="outline" size="lg">
                  <BookOpen className="size-4 mr-2" />
                  Load More Articles
                </Button>
              </div>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="size-10 mx-auto text-muted-foreground mb-3" />
              <h2 className="text-xl font-semibold mb-2">No published articles found</h2>
              <p className="text-sm text-muted-foreground">
                Try another search or category. Draft and archived content stays hidden from the Tourist Portal.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </TouristLayout>
  );
}
