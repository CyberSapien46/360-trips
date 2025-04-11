
import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import LoginForm from '@/components/auth/LoginForm';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Login = () => {
  return (
    <MainLayout>
      <section className="py-16 min-h-[80vh] flex items-center">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2 lg:w-7/12">
              <div className="hidden md:block lg:pr-20">
                <h1 className="text-4xl font-bold mb-4">
                  Welcome Back to ExploreVR
                </h1>
                <p className="text-muted-foreground mb-6">
                  Sign in to access your account, view your bookings, and continue exploring
                  amazing destinations in virtual reality.
                </p>
                
                <div 
                  className="aspect-video rounded-xl overflow-hidden shadow-subtle bg-cover bg-center"
                  style={{ 
                    backgroundImage: `url('https://images.unsplash.com/photo-1721322800607-8c38375eef04?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80')`,
                  }}
                >
                  <div className="w-full h-full bg-primary/10 backdrop-blur-[2px] flex items-center justify-center">
                    <div className="bg-white/95 backdrop-blur-sm p-6 rounded-lg max-w-md text-center">
                      <h3 className="text-xl font-semibold mb-2">Unlock VR Experiences</h3>
                      <p className="text-muted-foreground">
                        Sign in to book VR sessions and manage your travel packages.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2 lg:w-5/12 w-full">
              <div className="bg-white p-8 rounded-xl shadow-subtle max-w-md mx-auto">
                <div className="mb-6 md:hidden">
                  <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
                  <p className="text-muted-foreground">
                    Sign in to your ExploreVR account
                  </p>
                </div>
                
                <Alert className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    For admin access, use admin@example.com with password: admin123
                  </AlertDescription>
                </Alert>
                
                <LoginForm />
                
                <div className="mt-6 pt-6 border-t text-center">
                  <Link 
                    to="/" 
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Login;
