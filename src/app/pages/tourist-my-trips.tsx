import { TouristLayout } from "../components/tourist-layout";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Calendar, MapPin, Clock, Trash2, Share2, Download, LogIn } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { TouristAuthProps } from "../types/tourist-auth";
import {
  countSavedTripPlaces,
  SAVED_TRIP_ITINERARIES,
  SELECTED_SAVED_TRIP_KEY,
} from "../data/tourist-saved-trips";

interface TouristMyTripsProps extends TouristAuthProps {
  onNavigate?: (page: string) => void;
}

export function TouristMyTrips({ onNavigate, isTouristLoggedIn, onTouristLogout }: TouristMyTripsProps) {
  const [trips, setTrips] = useState(SAVED_TRIP_ITINERARIES);

  const handleDelete = (id: string) => {
    setTrips(trips.filter(t => t.id !== id));
    toast.success("Trip deleted successfully");
  };

  const handleShare = (tripName: string) => {
     // Simulating share
     toast.success(`Share link for "${tripName}" copied to clipboard`);
  };

  const handleExport = (tripName: string) => {
      // Simulating export
      toast.success(`Exported "${tripName}" to JSON`);
  };

  const handleViewDetails = (tripId: string) => {
    window.localStorage.setItem(SELECTED_SAVED_TRIP_KEY, tripId);
    onNavigate?.('ai-planner');
  };

  return (
    <TouristLayout activePage="my-trips" onNavigate={onNavigate} isTouristLoggedIn={isTouristLoggedIn} onTouristLogout={onTouristLogout}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Trips</h1>
            <p className="text-muted-foreground">Manage your saved itineraries</p>
          </div>
          <Button onClick={() => onNavigate?.('ai-planner')}>
            + Plan New Trip
          </Button>
        </div>

        {!isTouristLoggedIn ? (
          <Card className="border-dashed bg-slate-50">
            <CardContent className="py-12 text-center">
              <MapPin className="size-14 text-slate-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Sign in to save generated itineraries and manage your trip plans.</h2>
              <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                Browse routes and places without an account. Sign in when you want to save or manage trip plans.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Button onClick={() => onNavigate?.("login")}>
                  <LogIn className="size-4 mr-2" />
                  Sign in
                </Button>
                <Button variant="outline" onClick={() => onNavigate?.("register")}>
                  Create account
                </Button>
                <Button variant="ghost" onClick={() => onNavigate?.("home")}>
                  Continue browsing
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : trips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trips.map((trip) => (
              <Card key={trip.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 relative">
                  <img 
                    src={trip.image} 
                    alt={trip.name} 
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-4 right-4 bg-white/90 text-black hover:bg-white">
                    {trip.status}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="flex justify-between items-start">
                    <span>{trip.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="size-4" />
                        {trip.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="size-4" />
                        {trip.duration}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="size-4" />
                      {countSavedTripPlaces(trip)} Places planned
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button className="flex-1" variant="outline" onClick={() => handleViewDetails(trip.id)}>
                        View Details
                      </Button>
                      <Button size="icon" variant="outline" onClick={() => handleShare(trip.name)}>
                        <Share2 className="size-4" />
                      </Button>
                      <Button size="icon" variant="outline" onClick={() => handleExport(trip.name)}>
                        <Download className="size-4" />
                      </Button>
                      <Button size="icon" variant="outline" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(trip.id)}>
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-xl border-2 border-dashed">
            <MapPin className="size-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No trips saved yet</h3>
            <p className="text-muted-foreground mb-6">
              Use our AI Planner to create your first adventure
            </p>
            <Button onClick={() => onNavigate?.('ai-planner')}>
              Start Planning
            </Button>
          </div>
        )}
      </div>
    </TouristLayout>
  );
}
