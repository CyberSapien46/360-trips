
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, User, Calendar, Package, UserPlus, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

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
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect logic for non-admin users
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate('/login');
      } else if (!isAdmin) {
        navigate('/profile');
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

      // Calculate stats
      const activeBookingsCount = bookingsData ? bookingsData.filter(b => b.status !== 'completed' && b.status !== 'cancelled').length : 0;
      const pendingQuotesCount = quotesData ? quotesData.filter(q => q.status === 'pending').length : 0;
      
      // Get total packages count
      const { count: packagesCount, error: packagesError } = await supabase
        .from('user_packages')
        .select('*', { count: 'exact', head: true });
      
      if (packagesError) throw packagesError;

      setStats({
        totalUsers: usersData ? usersData.length : 0,
        activeBookings: activeBookingsCount,
        pendingQuotes: pendingQuotesCount,
        totalPackages: packagesCount || 0,
      });

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
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="bookings">VR Bookings</TabsTrigger>
              <TabsTrigger value="quotes">Quote Requests</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="admin">Admin Access</TabsTrigger>
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
                            <th className="py-3 px-4 text-left">Admin Status</th>
                            <th className="py-3 px-4 text-left">Registered On</th>
                            <th className="py-3 px-4 text-left">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((user) => (
                            <tr key={user.id} className="border-b hover:bg-muted/50">
                              <td className="py-3 px-4">{user.name}</td>
                              <td className="py-3 px-4">{user.email}</td>
                              <td className="py-3 px-4">
                                {adminEmails.includes(user.email) ? (
                                  <Badge variant="default" className="bg-green-500">Admin</Badge>
                                ) : (
                                  <Badge variant="outline">User</Badge>
                                )}
                              </td>
                              <td className="py-3 px-4">{new Date(user.created_at).toLocaleDateString()}</td>
                              <td className="py-3 px-4">
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
          </Tabs>
        </div>
      </section>
      
      {/* Modal for detailed booking information */}
      <Dialog>
        <DialogTrigger asChild>
          <span className="hidden">Open Booking Details</span>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              Complete information about this VR experience booking.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Booking details would be displayed here */}
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" className="w-full sm:w-auto">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Admin;
