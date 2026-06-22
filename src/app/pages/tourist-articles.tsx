import { TouristLayout } from "../components/tourist-layout";
import { TouristAuthProps } from "../types/tourist-auth";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Search, Clock, User, BookOpen } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

interface TouristArticlesProps extends TouristAuthProps {
  onNavigate?: (page: string) => void;
}

export function TouristArticles({ onNavigate, isTouristLoggedIn, onTouristLogout }: TouristArticlesProps) {
  const articles = [
    {
      id: '1',
      title: 'Top 10 Halal Restaurants in Bangkok You Must Try',
      excerpt: 'Discover the best halal dining experiences in Thailand\'s capital city...',
      image: 'https://images.unsplash.com/photo-1600555379885-08a02224726d?w=800',
      author: 'Sarah Abdullah',
      date: '2 days ago',
      readTime: '5 min read',
      category: 'Food & Dining',
    },
    {
      id: '2',
      title: 'Muslim-Friendly Travel Guide to Phuket',
      excerpt: 'Everything you need to know about traveling to Phuket as a Muslim tourist...',
      image: 'https://images.unsplash.com/photo-1761475051005-c22a463f1084?w=800',
      author: 'Ahmad Hassan',
      date: '5 days ago',
      readTime: '8 min read',
      category: 'Travel Guide',
    },
    {
      id: '3',
      title: 'Prayer Facilities: A Comprehensive Guide',
      excerpt: 'Find out where to pray during your travels in Thailand...',
      image: 'https://images.unsplash.com/photo-1768152860286-15fa04f4b1a1?w=800',
      author: 'Fatima Ali',
      date: '1 week ago',
      readTime: '6 min read',
      category: 'Religious',
    },
    {
      id: '4',
      title: 'Best Halal Hotels for Family Vacations',
      excerpt: 'Family-friendly accommodations that cater to Muslim travelers...',
      image: 'https://images.unsplash.com/photo-1766856925165-94997a2104b4?w=800',
      author: 'Mohammed Khan',
      date: '2 weeks ago',
      readTime: '7 min read',
      category: 'Accommodation',
    },
    {
      id: '5',
      title: 'Halal Street Food Tour in Chiang Mai',
      excerpt: 'Experience the authentic flavors of Northern Thailand with halal options...',
      image: 'https://images.unsplash.com/photo-1607411144164-97857cf86e1a?w=800',
      author: 'Sarah Abdullah',
      date: '3 weeks ago',
      readTime: '6 min read',
      category: 'Food & Dining',
    },
    {
      id: '6',
      title: 'Islamic Heritage Sites in Thailand',
      excerpt: 'Explore the rich Islamic history and cultural landmarks across Thailand...',
      image: 'https://images.unsplash.com/photo-1600383963284-91ef78fc9b6d?w=800',
      author: 'Ahmad Hassan',
      date: '1 month ago',
      readTime: '10 min read',
      category: 'Culture',
    },
  ];

  const categories = ['All', 'Food & Dining', 'Travel Guide', 'Religious', 'Accommodation', 'Culture'];

  return (
    <TouristLayout activePage="articles" onNavigate={onNavigate} isTouristLoggedIn={isTouristLoggedIn} onTouristLogout={onTouristLogout}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Article & Guides</h1>
          <p className="text-muted-foreground">
            Tips, guides, and stories for halal-conscious travelers
          </p>
        </div>

        {/* Search & Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              className="pl-10"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === 'All' ? 'default' : 'outline'}
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Article */}
        <Card className="mb-8 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <ImageWithFallback
              src={articles[0].image}
              alt={articles[0].title}
              className="w-full h-full object-cover min-h-[300px]"
            />
            <CardContent className="p-6 flex flex-col justify-center">
              <Badge className="w-fit mb-3">{articles[0].category}</Badge>
              <h2 className="text-2xl font-bold mb-3">{articles[0].title}</h2>
              <p className="text-muted-foreground mb-4">{articles[0].excerpt}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <User className="size-4" />
                  {articles[0].author}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="size-4" />
                  {articles[0].readTime}
                </div>
              </div>
              <Button onClick={() => onNavigate?.('article-detail')}>Read Article</Button>
            </CardContent>
          </div>
        </Card>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.slice(1).map((article) => (
            <Card 
              key={article.id} 
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => onNavigate?.('article-detail')}
            >
              <ImageWithFallback
                src={article.image}
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
                    {article.readTime}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline" size="lg">
            <BookOpen className="size-4 mr-2" />
            Load More Articles
          </Button>
        </div>
      </div>
    </TouristLayout>
  );
}
