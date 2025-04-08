
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Separator } from "@/components/ui/separator";
import { FileText, ScrollText } from 'lucide-react';

const Terms = () => {
  return (
    <MainLayout>
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <div className="flex items-center gap-3 mb-6">
          <ScrollText className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Terms of Service</h1>
        </div>
        <Separator className="mb-8" />
        
        <p className="text-muted-foreground mb-6">Last Updated: April 8, 2025</p>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">Introduction</h2>
            <p className="text-gray-600">
              Welcome to 360° Trips! These Terms of Service ("Terms") govern your use of our website, 
              virtual reality services, and travel booking platform (collectively, the "Services"). 
              By accessing or using our Services, you agree to be bound by these Terms. If you do not 
              agree to these Terms, please do not use our Services.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4">Definitions</h2>
            <ul className="list-disc pl-6 text-gray-600">
              <li>"User," "you," and "your" refer to the individual or entity accessing or using the Services.</li>
              <li>"360° Trips," "we," "us," and "our" refer to 360° Trips and its affiliates.</li>
              <li>"Content" includes text, graphics, images, videos, audio files, and other materials.</li>
              <li>"VR Experience" refers to the virtual reality demonstrations of travel destinations.</li>
              <li>"Travel Services" refers to the tour packages, accommodations, and other travel-related services offered through our platform.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4">Account Registration</h2>
            <p className="text-gray-600">
              To access certain features of our Services, you may need to create an account. You agree to provide accurate, 
              current, and complete information during the registration process and to update such information to keep it 
              accurate, current, and complete. You are responsible for safeguarding your password and for all activities 
              that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4">VR Experiences and Travel Bookings</h2>
            <div className="space-y-4">
              <p className="text-gray-600">
                <strong>VR Demonstrations:</strong> When booking a VR demonstration, you agree to be available at the 
                scheduled time and location. Cancellations must be made at least 24 hours in advance to avoid cancellation fees.
              </p>
              <p className="text-gray-600">
                <strong>Travel Bookings:</strong> All travel bookings are subject to availability and confirmation. 
                Prices, itineraries, and inclusions are subject to change without notice. You are responsible for 
                ensuring that you meet all requirements for travel, including valid identification, visas, and health documentation.
              </p>
              <p className="text-gray-600">
                <strong>Payments and Refunds:</strong> Payments for our Services are processed securely through our platform. 
                Refund policies vary depending on the specific travel package or service booked. Please refer to the specific 
                terms for each booking for details on cancellation and refund policies.
              </p>
            </div>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4">User Conduct</h2>
            <p className="text-gray-600">You agree not to:</p>
            <ul className="list-disc pl-6 mt-2 text-gray-600">
              <li>Use our Services for any illegal purpose or in violation of any local, state, national, or international law</li>
              <li>Interfere with or disrupt the Services or servers or networks connected to the Services</li>
              <li>Attempt to gain unauthorized access to any portion of the Services or any systems or networks connected to the Services</li>
              <li>Use the Services to transmit any viruses, worms, defects, Trojan horses, or other items of a destructive nature</li>
              <li>Harass, abuse, or harm another person, or to impersonate or attempt to impersonate 360° Trips or its employees</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4">Intellectual Property</h2>
            <p className="text-gray-600">
              The Services and its original Content, features, and functionality are and will remain the exclusive property of 
              360° Trips and its licensors. The Services are protected by copyright, trademark, and other laws. Our trademarks 
              and trade dress may not be used in connection with any product or service without the prior written consent of 360° Trips.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4">User Content</h2>
            <p className="text-gray-600">
              By posting, uploading, or otherwise making available any content on our Services, you grant 360° Trips a non-exclusive, 
              royalty-free, worldwide, perpetual license to use, modify, publicly display, reproduce, and distribute such content on 
              and through our Services. You represent and warrant that you have all rights necessary to grant these rights.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4">Disclaimer of Warranties</h2>
            <p className="text-gray-600">
              THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, 
              INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, 
              OR COURSE OF PERFORMANCE. 360° TRIPS DOES NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED OR ERROR-FREE.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4">Limitation of Liability</h2>
            <p className="text-gray-600">
              IN NO EVENT SHALL 360° TRIPS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, 
              INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM 
              YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICES.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4">Indemnification</h2>
            <p className="text-gray-600">
              You agree to defend, indemnify, and hold harmless 360° Trips and its officers, directors, employees, and agents, 
              from and against any claims, liabilities, damages, losses, and expenses, including, without limitation, reasonable 
              legal and accounting fees, arising out of or in any way connected with your access to or use of the Services or your 
              violation of these Terms.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4">Changes to Terms</h2>
            <p className="text-gray-600">
              We may modify these Terms at any time. The updated version will be effective as soon as it is posted. By continuing 
              to use our Services after any changes to these Terms, you agree to be bound by the revised Terms.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4">Governing Law</h2>
            <p className="text-gray-600">
              These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict 
              of law principles. Any disputes arising under or in connection with these Terms shall be subject to the exclusive 
              jurisdiction of the courts located in Mumbai, India.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
            <p className="text-gray-600">
              If you have any questions about these Terms, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="font-medium">360° Trips</p>
              <p>Email: legal@360trips.com</p>
              <p>Address: 123 Travel Lane, Mumbai, Maharashtra, India - 400001</p>
              <p>Phone: +91 98765 43210</p>
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  );
};

export default Terms;
