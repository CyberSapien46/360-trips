import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const Admin = () => {
  const { user, isAuthenticated, isAdmin, isLoading } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [quoteRequests, setQuoteRequests] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect logic for non-admin users
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate('/login');
      } else if (!isAdmin) {
        navigate('/');
        toast({
          title: "Access Denied",
          description: "You do not have admin privileges",
          variant: "destructive",
        });
      } else {
        fetchData();
      }
    }
  }, [isAuthenticated, isAdmin, isLoading, navigate]);

  const fetchData = async () => {
    setFetchLoading(true);
    try {
      // Fetch all bookings with user details
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('vr_bookings')
        .select(`
          *,
          profiles:user_id(name, email)
        `);

      if (bookingsError) throw bookingsError;
      setBookings(bookingsData || []);

      // Fetch all quote requests with user details
      const { data: quotesData, error: quotesError } = await supabase
        .from('quote_requests')
        .select(`
          *,
          profiles:user_id(name, email)
        `);

      if (quotesError) throw quotesError;
      setQuoteRequests(quotesData || []);

      // Fetch all users
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;
      setUsers(usersData || []);

    } catch (error) {
      console.error('Error fetching admin data:', error);
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
      
      // Refresh data
      fetchData();
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const updateQuoteStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('quote_requests')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      
      // Refresh data
      fetchData();
    } catch (error) {
      console.error('Error updating quote status:', error);
    }
  };

  if (isLoading || fetchLoading) {
    return (
      <MainLayout>
        <div className="container py-16 text-center">
          <p>Loading...</p>
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
          <div className="flex flex-col items-center text-center mb-8">
            <ShieldCheck className="h-12 w-12 text-primary mb-4" />
            <h1 className="text-4xl font-bold mb-4">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Manage bookings, quote requests, and users from this central dashboard.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          <Tabs defaultValue="bookings" className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="bookings">VR Bookings</TabsTrigger>
              <TabsTrigger value="quotes">Quote Requests</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
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
                    <p className="text-center py-8 text-muted-foreground">No bookings found.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="py-3 px-4 text-left">Date</th>
                            <th className="py-3 px-4 text-left">Time</th>
                            <th className="py-3 px-4 text-left">Customer</th>
                            <th className="py-3 px-4 text-left">Address</th>
                            <th className="py-3 px-4 text-left">Status</th>
                            <th className="py-3 px-4 text-left">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bookings.map((booking) => (
                            <tr key={booking.id} className="border-b hover:bg-muted/50">
                              <td className="py-3 px-4">{booking.date}</td>
                              <td className="py-3 px-4">{booking.time}</td>
                              <td className="py-3 px-4">
                                {booking.profiles?.name}<br />
                                <span className="text-xs text-muted-foreground">{booking.profiles?.email}</span>
                              </td>
                              <td className="py-3 px-4">{booking.address}</td>
                              <td className="py-3 px-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                  ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                    booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                    'bg-gray-100 text-gray-800'}`
                                }>
                                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </span>
                              </td>
                              <td className="py-3 px-4">
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
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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
                    <p className="text-center py-8 text-muted-foreground">No quote requests found.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="py-3 px-4 text-left">Date</th>
                            <th className="py-3 px-4 text-left">Customer</th>
                            <th className="py-3 px-4 text-left">Package IDs</th>
                            <th className="py-3 px-4 text-left">Status</th>
                            <th className="py-3 px-4 text-left">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {quoteRequests.map((quote) => (
                            <tr key={quote.id} className="border-b hover:bg-muted/50">
                              <td className="py-3 px-4">{new Date(quote.created_at).toLocaleDateString()}</td>
                              <td className="py-3 px-4">
                                {quote.profiles?.name}<br />
                                <span className="text-xs text-muted-foreground">{quote.profiles?.email}</span>
                              </td>
                              <td className="py-3 px-4">
                                {Array.isArray(quote.package_ids) 
                                  ? quote.package_ids.join(', ')
                                  : '(No destinations)'}
                              </td>
                              <td className="py-3 px-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                  ${quote.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    quote.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    quote.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                    quote.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                                    'bg-gray-100 text-gray-800'}`
                                }>
                                  {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                                </span>
                              </td>
                              <td className="py-3 px-4">
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
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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
                    <p className="text-center py-8 text-muted-foreground">No users found.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="py-3 px-4 text-left">Name</th>
                            <th className="py-3 px-4 text-left">Email</th>
                            <th className="py-3 px-4 text-left">Registered On</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((user) => (
                            <tr key={user.id} className="border-b hover:bg-muted/50">
                              <td className="py-3 px-4">{user.name}</td>
                              <td className="py-3 px-4">{user.email}</td>
                              <td className="py-3 px-4">{new Date(user.created_at).toLocaleDateString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </MainLayout>
  );
};

export default Admin;
