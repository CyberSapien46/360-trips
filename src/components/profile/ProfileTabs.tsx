
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import { useTravel, Destination, PackageGroup } from '@/context/TravelContext';
import { CalendarIcon, PackageIcon, UserIcon, HeartIcon, PlusCircle, FolderPlus } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ProfileTabsProps {
  destinations: Destination[];
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ destinations }) => {
  const { user, updateProfile } = useAuth();
  const { 
    bookings, 
    userPackages, 
    packageGroups,
    currentPackageGroup,
    setCurrentPackageGroup,
    createPackageGroup,
    cancelBooking, 
    requestQuote 
  } = useTravel();
  const [favoriteDestinations, setFavoriteDestinations] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPackageName, setNewPackageName] = useState('');
  
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
    },
  });
  
  useEffect(() => {
    const loadFavorites = async () => {
      if (user) {
        try {
          const storedFavorites = localStorage.getItem(`vr-travel-favorites-${user.id}`);
          if (storedFavorites) {
            setFavoriteDestinations(JSON.parse(storedFavorites));
          }
        } catch (error) {
          console.error('Error loading favorite destinations:', error);
        }
      }
    };
    
    loadFavorites();
  }, [user]);
  
  const onSubmit = async (data: any) => {
    await updateProfile({
      name: data.name,
      email: data.email,
    });
  };
  
  const userDestinations = destinations.filter(dest => 
    userPackages.includes(dest.id)
  );
  
  const userFavorites = destinations.filter(dest => 
    favoriteDestinations.includes(dest.id)
  );

  const handleQuoteRequest = async () => {
    try {
      await requestQuote();
    } catch (error) {
      console.error('Error requesting quote:', error);
    }
  };

  const handleCreatePackage = async () => {
    if (newPackageName.trim()) {
      await createPackageGroup(newPackageName.trim());
      setNewPackageName('');
      setIsDialogOpen(false);
    }
  };

  const handleSelectPackageGroup = (packageGroupId: string) => {
    const selectedGroup = packageGroups.find(group => group.id === packageGroupId);
    if (selectedGroup) {
      setCurrentPackageGroup(selectedGroup);
    }
  };
  
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid grid-cols-4 mb-8">
        <TabsTrigger value="profile" className="flex items-center gap-2">
          <UserIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Profile</span>
        </TabsTrigger>
        <TabsTrigger value="bookings" className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4" />
          <span className="hidden sm:inline">My Bookings</span>
        </TabsTrigger>
        <TabsTrigger value="packages" className="flex items-center gap-2">
          <PackageIcon className="h-4 w-4" />
          <span className="hidden sm:inline">My Packages</span>
        </TabsTrigger>
        <TabsTrigger value="favorites" className="flex items-center gap-2">
          <HeartIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Favorites</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="profile" className="animate-fade-in">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your profile information here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex justify-center mb-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user?.photoUrl || ''} />
                  <AvatarFallback className="bg-primary text-xl">
                    {user?.name ? user.name.substring(0, 2).toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    {...register('name', { required: true })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Your email"
                    {...register('email', { required: true })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Your phone number"
                    {...register('phone')}
                  />
                </div>
              </div>
              
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="bookings" className="animate-fade-in">
        <Card>
          <CardHeader>
            <CardTitle>VR Experience Bookings</CardTitle>
            <CardDescription>
              Manage your scheduled VR experiences.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  You haven't booked any VR experiences yet.
                </p>
                <Button asChild variant="outline">
                  <a href="/vr-booking">Book a VR Experience</a>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div 
                    key={booking.id}
                    className="flex flex-col md:flex-row justify-between bg-muted p-4 rounded-lg"
                  >
                    <div className="mb-4 md:mb-0">
                      <h4 className="font-medium">
                        VR Experience on {booking.date}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Time: {booking.time}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Address: {booking.address}
                      </p>
                      {booking.additionalNotes && (
                        <p className="text-sm text-muted-foreground">
                          Notes: {booking.additionalNotes}
                        </p>
                      )}
                      <div className="mt-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'}`
                        }>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                      <div className="flex items-center">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                          onClick={() => cancelBooking(booking.id)}
                        >
                          Cancel Booking
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="packages" className="animate-fade-in">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>My Travel Packages</CardTitle>
              <CardDescription>
                Destinations you've added to your travel packages.
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="ml-auto">
                  <FolderPlus className="h-4 w-4 mr-2" />
                  Create Package
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Package Group</DialogTitle>
                  <DialogDescription>
                    Give your travel package a name to help organize your destinations.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="package-name">Package Name</Label>
                    <Input
                      id="package-name"
                      placeholder="e.g., Summer Vacation 2025"
                      value={newPackageName}
                      onChange={(e) => setNewPackageName(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreatePackage}>Create Package</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {packageGroups.length > 0 && (
              <div className="mb-6">
                <Label htmlFor="package-group" className="mb-2 block">Select Package Group</Label>
                <Select 
                  value={currentPackageGroup?.id || ''} 
                  onValueChange={handleSelectPackageGroup}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a package group" />
                  </SelectTrigger>
                  <SelectContent>
                    {packageGroups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {userDestinations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  You haven't added any destinations to your package yet.
                </p>
                <Button asChild variant="outline">
                  <a href="/destinations">Explore Destinations</a>
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {userDestinations.map((destination) => (
                  <div 
                    key={destination.id}
                    className="flex bg-muted rounded-lg overflow-hidden hover:shadow-subtle transition-shadow"
                  >
                    <div 
                      className="w-24 h-24 bg-cover bg-center"
                      style={{ backgroundImage: `url(${destination.imageUrl})` }}
                    />
                    <div className="p-3 flex-1">
                      <h4 className="font-medium line-clamp-1">{destination.name}</h4>
                      <p className="text-xs text-muted-foreground mb-1">
                        {destination.location}
                      </p>
                      <p className="text-sm font-medium text-primary">
                        ${destination.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          {userDestinations.length > 0 && (
            <CardFooter>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={handleQuoteRequest}
              >
                Request a Quote
              </Button>
            </CardFooter>
          )}
        </Card>
      </TabsContent>
      
      <TabsContent value="favorites" className="animate-fade-in">
        <Card>
          <CardHeader>
            <CardTitle>Favorite Destinations</CardTitle>
            <CardDescription>
              Destinations you've marked as favorites.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userFavorites.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  You haven't added any destinations to your favorites yet.
                </p>
                <Button asChild variant="outline">
                  <a href="/destinations">Explore Destinations</a>
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {userFavorites.map((destination) => (
                  <div 
                    key={destination.id}
                    className="flex bg-muted rounded-lg overflow-hidden hover:shadow-subtle transition-shadow"
                  >
                    <div 
                      className="w-24 h-24 bg-cover bg-center"
                      style={{ backgroundImage: `url(${destination.imageUrl})` }}
                    />
                    <div className="p-3 flex-1">
                      <h4 className="font-medium line-clamp-1">{destination.name}</h4>
                      <p className="text-xs text-muted-foreground mb-1">
                        {destination.location}
                      </p>
                      <p className="text-sm font-medium text-primary">
                        ${destination.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
