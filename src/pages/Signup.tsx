
import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import RegisterForm from '@/components/auth/RegisterForm';
import { ArrowLeft, CheckCircle } from 'lucide-react';

const Signup = () => {
  return (
    <MainLayout>
      <section className="py-16 min-h-[80vh] flex items-center">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2 lg:w-7/12">
              <div className="hidden md:block lg:pr-20">
                <h1 className="text-4xl font-bold mb-4">
                  Join ExploreVR
                </h1>
                <p className="text-muted-foreground mb-8">
                  Create an account to start exploring destinations in virtual reality
                  and unlock all the features of our platform.
                </p>
                
                <div className="space-y-4">
                  {[
                    "Save your favorite destinations and create travel packages",
                    "Book VR experiences at your home with our premium equipment",
                    "Receive personalized travel recommendations",
                    "Manage your bookings and experiences in one place"
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="h-6 w-6 text-primary mr-3 shrink-0" />
                      <p>{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2 lg:w-5/12 w-full">
              <div className="bg-white p-8 rounded-xl shadow-subtle max-w-md mx-auto">
                <div className="mb-6 md:hidden">
                  <h2 className="text-2xl font-bold mb-2">Create Account</h2>
                  <p className="text-muted-foreground">
                    Sign up to start your VR travel journey
                  </p>
                </div>
                
                <RegisterForm />
                
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

export default Signup;
