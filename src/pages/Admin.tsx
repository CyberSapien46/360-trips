import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, User, Calendar, Package, UserPlus, AlertCircle, CheckCircle2, Clock, Loader2, Map, Edit, Plus, Trash } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { destinations, DestinationWithTourDetails } from '@/data/destinations';
import { Textarea } from '@/components/ui/textarea';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const destinationSchema = z.object({
  id: z.string().min(1, "ID is required"),
  name: z.string().min(1, "Name is required"),
  location: z.string().min(1, "Location is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  duration: z.string().min(1, "Duration is required"),
  price: z.number().min(1000, "Price must be at least 1000"),
  rating: z.number().min(0).max(5, "Rating must be between 0 and 5"),
  videoUrl: z.string().url("Must be a valid URL"),
  imageUrl: z.string().url("Must be a valid URL"),
  panoramaUrl: z.string().url("Must be a valid URL").optional(),
  accommodation: z.string().optional(),
});

// Define a consistent type for a new destination to ensure it matches DestinationWithTourDetails
type FormDestinationValues = z.infer<typeof destinationSchema>;

const Admin = () => {
  const { user, isAuthenticated, isAdmin, isLoading, grantAdminAccess, revokeAdminAccess, adminEmails } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [quoteRequests, setQuoteRequests] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeBookings: 0,
    pendingQuotes: 0,
    totalPackages: 0,
  });
  const [destinationsList, setDestinationsList] = useState<DestinationWithTourDetails[]>([...destinations]);
  const [isAddDestinationOpen, setIsAddDestinationOpen] = useState(false);
  const [editingDestination, setEditingDestination] = useState<DestinationWithTourDetails | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  
  const navigate = useNavigate();

  const form = useForm<FormDestinationValues>({
    resolver: zodResolver(destinationSchema),
    defaultValues: {
      id: "",
      name: "",
      location: "",
      description: "",
      duration: "",
      price: 5000,
      rating: 4.5,
      videoUrl: "https://www.youtube.com/embed/...",
      imageUrl: "https://images.unsplash.com/...",
      panoramaUrl: "https://images.unsplash.com/...",
      accommodation: "",
    },
  });

  useEffect(() => {
    // Redirect logic for non-admin users
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate('/login', { state: { from: '/admin' } });
        toast({
          title: "Authentication Required",
          description: "Please login to access the admin dashboard",
        });
      } else if (!isAdmin) {
        navigate('/profile');
        toast({
          title: "Access Denied",
          description: "You do not have admin privileges",
          variant: "destructive",
        });
      } else {
        // Only fetch data if authenticated and admin
        fetchData();
      }
    }
  }, [isAuthenticated, isAdmin, isLoading, navigate]);

  useEffect(() => {
    if (editingDestination) {
      form.reset({
        id: editingDestination.id,
        name: editingDestination.name,
        location: editingDestination.location,
        description: editingDestination.description,
        duration: editingDestination.duration,
        price: editingDestination.price,
        rating: editingDestination.rating,
        videoUrl: editingDestination.videoUrl,
        imageUrl: editingDestination.imageUrl,
        panoramaUrl: editingDestination.panoramaUrl || "",
        accommodation: editingDestination.accommodation || "",
      });
    } else {
      form.reset({
        id: `d${destinationsList.length + 1}`,
        name: "",
        location: "",
        description: "",
        duration: "",
        price: 5000,
        rating: 4.5,
        videoUrl: "https://www.youtube.com/embed/...",
        imageUrl: "https://images.unsplash.com/...",
        panoramaUrl: "https://images.unsplash.com/...",
        accommodation: "",
      });
    }
  }, [editingDestination, form]);

  const fetchData = async () => {
    setFetchLoading(true);
    try {
      console.log('Starting to fetch admin data...');
      
      // Fetch all bookings - Modified to avoid using foreign key relationship
      console.log('Fetching bookings data...');
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('vr_bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (bookingsError) {
        console.error('Error fetching bookings:', bookingsError);
        throw bookingsError;
      }
      
      console.log('Bookings data:', bookingsData);
      
      // Enhanced bookings data with user information
      const enhancedBookings = await Promise.all((bookingsData || []).map(async (booking) => {
        // Fetch the user profile for each booking
        const { data: userProfile, error: userError } = await supabase
          .from('profiles')
          .select('name, email')
          .eq('id', booking.user_id)
          .single();
          
        if (userError) {
          console.log('Could not fetch user for booking:', booking.id);
          return {
            ...booking,
            profiles: { name: 'Unknown', email: 'Unknown' }
          };
        }
        
        return {
          ...booking,
          profiles: userProfile
        };
      }));
      
      setBookings(enhancedBookings || []);

      // Fetch all quote requests - Modified to avoid using foreign key relationship
      console.log('Fetching quote requests...');
      const { data: quotesData, error: quotesError } = await supabase
        .from('quote_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (quotesError) {
        console.error('Error fetching quotes:', quotesError);
        throw quotesError;
      }
      
      console.log('Quote data:', quotesData);
      
      // Enhanced quotes data with user information
      const enhancedQuotes = await Promise.all((quotesData || []).map(async (quote) => {
        // Fetch the user profile for each quote
        const { data: userProfile, error: userError } = await supabase
          .from('profiles')
          .select('name, email')
          .eq('id', quote.user_id)
          .single();
          
        if (userError) {
          console.log('Could not fetch user for quote:', quote.id);
          return {
            ...quote,
            profiles: { name: 'Unknown', email: 'Unknown' }
          };
        }
        
        return {
          ...quote,
          profiles: userProfile
        };
      }));
      
      setQuoteRequests(enhancedQuotes || []);

      // Fetch all users
      console.log('Fetching users...');
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) {
        console.error('Error fetching users:', usersError);
        throw usersError;
      }
      
      console.log('Users data:', usersData);
      setUsers(usersData || []);

      // Calculate stats
      const activeBookingsCount = enhancedBookings ? enhancedBookings.filter(b => b.status !== 'completed' && b.status !== 'cancelled').length : 0;
      const pendingQuotesCount = enhancedQuotes ? enhancedQuotes.filter(q => q.status === 'pending').length : 0;
      
      // Get total packages count
      console.log('Fetching packages count...');
      const { count: packagesCount, error: packagesError } = await supabase
        .from('user_packages')
        .select('*', { count: 'exact', head: true });
      
      if (packagesError) {
        console.error('Error fetching packages count:', packagesError);
        throw packagesError;
      }
      
      console.log('Packages count:', packagesCount);

      setStats({
        totalUsers: usersData ? usersData.length : 0,
        activeBookings: activeBookingsCount,
        pendingQuotes: pendingQuotesCount,
        totalPackages: packagesCount || 0,
      });

    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast({
        title: "Error",
        description: "Failed to load admin data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setFetchLoading(false);
    }
  };

  const updateBookingStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('vr_bookings')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      
      toast({
        description: `Booking status updated to ${status}`,
      });
      
      // Refresh data
      fetchData();
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast({
        description: "Failed to update booking status",
        variant: "destructive"
      });
    }
  };

  const updateQuoteStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('quote_requests')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      
      toast({
        description: `Quote status updated to ${status}`,
      });
      
      // Refresh data
      fetchData();
    } catch (error) {
      console.error('Error updating quote status:', error);
      toast({
        description: "Failed to update quote status",
        variant: "destructive"
      });
    }
  };

  const handleGrantAccess = async () => {
    if (!email.trim()) {
      toast({
        description: "Please enter an email address",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await grantAdminAccess(email);
      setEmail('');
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error granting admin access:', error);
    }
  };

  const handleRevokeAccess = async (email: string) => {
    try {
      await revokeAdminAccess(email);
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error revoking admin access:', error);
    }
  };

  const handleRefresh = () => {
    fetchData();
    toast({
      description: "Refreshing admin dashboard data",
    });
  };

  const onSubmitDestination = (values: FormDestinationValues) => {
    console.log("Destination form values:", values);
    
    // Convert form values to a complete DestinationWithTourDetails object
    const newDestination: DestinationWithTourDetails = {
      ...values,
      // Ensure required properties are present
      id: values.id,
      name: values.name,
      location: values.location,
      description: values.description,
      duration: values.duration,
      price: values.price,
      rating: values.rating,
      videoUrl: values.videoUrl,
      imageUrl: values.imageUrl,
      // Add required properties that are not in the form
      itinerary: [{
        day: 1,
        title: "Day 1",
        description: "Explore the destination"
      }],
      inclusions: ["Accommodation", "Guided tours"],
      // Add optional properties if they exist in the form values
      panoramaUrl: values.panoramaUrl,
      accommodation: values.accommodation,
    };
    
    if (editingDestination) {
      // Update existing destination
      const updatedDestinations = destinationsList.map(dest => 
        dest.id === values.id ? newDestination : dest
      );
      setDestinationsList(updatedDestinations);
      toast({
        description: `Destination "${values.name}" updated successfully`,
      });
    } else {
      // Add new destination
      setDestinationsList([...destinationsList, newDestination]);
      toast({
        description: `Destination "${values.name}" added successfully`,
      });
    }
    
    // Close dialog and reset form
    setIsAddDestinationOpen(false);
    setEditingDestination(null);
  };

  const handleEditDestination = (destination: DestinationWithTourDetails) => {
    setEditingDestination(destination);
    setIsAddDestinationOpen(true);
  };

  const handleDeleteDestination = (id: string) => {
    const updatedDestinations = destinationsList.filter(dest => dest.id !== id);
    setDestinationsList(updatedDestinations);
    setDeleteConfirmId(null);
    toast({
      description: `Destination deleted successfully`,
    });
  };

  if (isLoading || fetchLoading) {
    return (
      <MainLayout>
        <div className="container py-16 flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-xl">Loading admin dashboard...</p>
        </div>
      </MainLayout>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect via useEffect
  }

  return (
    <MainLayout>
      <section className="pt-16 pb-8 bg-muted/50">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div className="flex flex-col items-center md:items-start text-center md:text-left mb-4 md:mb-0">
              <div className="flex items-center gap-3 mb-2">
                <ShieldCheck className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold">
                  Admin Dashboard
                </h1>
              </div>
              <p className="text-muted-foreground">
                Manage bookings, quote requests, users, and destinations
              </p>
            </div>
            <Button onClick={handleRefresh} className="self-center md:self-auto">
              Refresh Data
            </Button>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-2xl font-bold">{stats.totalUsers}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-2xl font-bold">{stats.activeBookings}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending Quotes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-2xl font-bold">{stats.pendingQuotes}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Packages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Package className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-2xl font-bold">{stats.totalPackages}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          <Tabs defaultValue="bookings" className="w-full">
            <TabsList className="grid grid-cols-5 mb-8">
              <TabsTrigger value="bookings">VR Bookings</TabsTrigger>
              <TabsTrigger value="quotes">Quote Requests</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="admin">Admin Access</TabsTrigger>
              <TabsTrigger value="destinations">Destinations</TabsTrigger>
            </TabsList>

            <TabsContent value="bookings">
              <Card>
                <CardHeader>
                  <CardTitle>VR Experience Bookings</CardTitle>
                  <CardDescription>
                    View and manage all VR experience bookings.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {bookings.length === 0 ? (
                    <div className="text-center py-16">
                      <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No bookings found</h3>
                      <p className="text-muted-foreground">
                        All VR bookings will appear here when users make them.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Address</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {bookings.map((booking) => (
                            <TableRow key={booking.id}>
                              <TableCell>{booking.date}</TableCell>
                              <TableCell>{booking.time}</TableCell>
                              <TableCell>
                                {booking.profiles?.name || 'Unknown'}<br />
                                <span className="text-xs text-muted-foreground">{booking.profiles?.email}</span>
                              </TableCell>
                              <TableCell>{booking.address}</TableCell>
                              <TableCell>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                  ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                    booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                    'bg-gray-100 text-gray-800'}`
                                }>
                                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </span>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  {booking.status === 'pending' && (
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                                    >
                                      Confirm
                                    </Button>
                                  )}
                                  {(booking.status === 'confirmed' || booking.status === 'pending') && (
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      onClick={() => updateBookingStatus(booking.id, 'completed')}
                                    >
                                      Complete
                                    </Button>
                                  )}
                                  {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      className="text-red-500"
                                      onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                                    >
                                      Cancel
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="quotes">
              <Card>
                <CardHeader>
                  <CardTitle>Quote Requests</CardTitle>
                  <CardDescription>
                    View and manage all travel package quote requests.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {quoteRequests.length === 0 ? (
                    <div className="text-center py-16">
                      <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No quote requests found</h3>
                      <p className="text-muted-foreground">
                        All quote requests will appear here when users submit them.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Package IDs</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {quoteRequests.map((quote) => (
                            <TableRow key={quote.id}>
                              <TableCell>{new Date(quote.created_at).toLocaleDateString()}</TableCell>
                              <TableCell>
                                {quote.profiles?.name || 'Unknown'}<br />
                                <span className="text-xs text-muted-foreground">{quote.profiles?.email}</span>
                              </TableCell>
                              <TableCell>
                                {Array.isArray(quote.package_ids) 
                                  ? quote.package_ids.join(', ')
                                  : '(No destinations)'}
                              </TableCell>
                              <TableCell>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                  ${quote.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    quote.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    quote.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                    quote.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                                    'bg-gray-100 text-gray-800'}`
                                }>
                                  {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                                </span>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  {quote.status === 'pending' && (
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      onClick={() => updateQuoteStatus(quote.id, 'contacted')}
                                    >
                                      Mark Contacted
                                    </Button>
                                  )}
                                  {(quote.status === 'contacted' || quote.status === 'pending') && (
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      onClick={() => updateQuoteStatus(quote.id, 'completed')}
                                    >
                                      Complete
                                    </Button>
                                  )}
                                  {quote.status !== 'cancelled' && quote.status !== 'completed' && (
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      className="text-red-500"
                                      onClick={() => updateQuoteStatus(quote.id, 'cancelled')}
                                    >
                                      Cancel
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    View all registered users in the system.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {users.length === 0 ? (
                    <div className="text-center py-16">
                      <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No users found</h3>
                      <p className="text-muted-foreground">
                        Users will appear here when they register for the site.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Admin Status</TableHead>
                            <TableHead>Registered On</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {users.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell>{user.name || 'Unknown'}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>
                                {adminEmails.includes(user.email) ? (
                                  <Badge variant="default" className="bg-green-500">Admin</Badge>
                                ) : (
                                  <Badge variant="outline">User</Badge>
                                )}
                              </TableCell>
                              <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                              <TableCell>
                                {adminEmails.includes(user.email) ? (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="text-red-500"
                                    onClick={() => handleRevokeAccess(user.email)}
                                    disabled={user.email === "admin@example.com"}
                                  >
                                    Revoke Admin
                                  </Button>
                                ) : (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => grantAdminAccess(user.email)}
                                  >
                                    Grant Admin
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="admin">
              <Card>
                <CardHeader>
                  <CardTitle>Admin Access Management</CardTitle>
                  <CardDescription>
                    Grant or revoke admin privileges to users.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Current Admin Users</h3>
                      {adminEmails.length === 0 ? (
                        <p className="text-muted-foreground">No admin users configured.</p>
                      ) : (
                        <ul className="space-y-2">
                          {adminEmails.map((email) => (
                            <li key={email} className="flex items-center justify-between bg-muted p-3 rounded-md">
                              <div className="flex items-center">
                                <ShieldCheck className="h-4 w-4 text-primary mr-2" />
                                <span>{email}</span>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-red-500"
                                onClick={() => handleRevokeAccess(email)}
                                disabled={email === "admin@example.com"}
                              >
                                Revoke
                              </Button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Grant Admin Access</h3>
                      <div className="flex gap-2">
                        <Input 
                          placeholder="Enter email address" 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)} 
                          className="max-w-md"
                        />
                        <Button onClick={handleGrantAccess} className="whitespace-nowrap">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Grant Access
                        </Button>
                      </div>
                    </div>
                    
                    <div className="rounded-md border p-4 bg-amber-50 border-amber-200">
                      <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-amber-600 mr-2" />
                        <h4 className="font-medium text-amber-800">Important Note</h4>
                      </div>
                      <p className="text-sm text-amber-700 mt-2">
                        Admin access is currently managed through a simple email list. In a production environment, 
                        you should implement a more robust role-based system with database storage and audit logs.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="destinations">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Destination Management</CardTitle>
                    <CardDescription>
                      Add, edit or delete travel destinations offered by the platform.
                    </CardDescription>
                  </div>
                  <Button onClick={() => {
                    setEditingDestination(null);
                    setIsAddDestinationOpen(true);
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Destination
                  </Button>
                </CardHeader>
                <CardContent>
                  {destinationsList.length === 0 ? (
                    <div className="text-center py-16">
                      <Map className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No destinations found</h3>
                      <p className="text-muted-foreground">
                        Add your first travel destination to get started.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {destinationsList.map((destination) => (
                            <TableRow key={destination.id}>
                              <TableCell>{destination.id}</TableCell>
                              <TableCell className="font-medium">{destination.name}</TableCell>
                              <TableCell>{destination.location}</TableCell>
                              <TableCell>₹{destination.price.toLocaleString()}</TableCell>
                              <TableCell>{destination.rating}/5</TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => handleEditDestination(destination)}
                                  >
                                    <Edit className="h-4 w-4 mr-1" />
                                    Edit
                                  </Button>
                                  {deleteConfirmId === destination.id ? (
                                    <div className="flex gap-2">
                                      <Button
                                        variant="
