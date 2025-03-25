
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import ProfileTabs from '@/components/profile/ProfileTabs';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { UserRound } from 'lucide-react';
import { destinations } from '@/data/destinations';

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  if (!isAuthenticated || !user) {
    return null; // Will redirect to login
  }

  return (
    <MainLayout>
      <section className="pt-16 pb-8 bg-muted/50">
        <div className="container">
          <div className="flex flex-col items-center text-center mb-8">
            <UserRound className="h-12 w-12 text-primary mb-4" />
            <h1 className="text-4xl font-bold mb-4">
              My Profile
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Manage your account details, view your bookings, and track your travel packages.
            </p>
          </div>
        </div>
      </section>
      
      <section className="py-8">
        <div className="container">
          <ProfileTabs destinations={destinations} />
        </div>
      </section>
    </MainLayout>
  );
};

export default Profile;
