
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Separator } from "@/components/ui/separator";
import { FileText, Shield, Lock } from 'lucide-react';

const Privacy = () => {
  return (
    <MainLayout>
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
        </div>
        <Separator className="mb-8" />
        
        <p className="text-muted-foreground mb-6">Last Updated: April 8, 2025</p>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">Introduction</h2>
            <p className="text-gray-600">
              360° Trips ("we," "our," or "us") respects your privacy and is committed to protecting your personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our virtual reality travel experience services.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4">Information We Collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Personal Information</h3>
                <p className="text-gray-600">
                  We may collect personal information that you voluntarily provide when using our services, including:
                </p>
                <ul className="list-disc pl-6 mt-2 text-gray-600">
                  <li>Name, email address, phone number, and residential address</li>
                  <li>Payment information (processed through secure third-party payment processors)</li>
                  <li>Travel preferences and booking information</li>
                  <li>Account credentials</li>
                  <li>Communication preferences</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Automatically Collected Information</h3>
                <p className="text-gray-600">
                  When you access our website, we may automatically collect certain information, including:
                </p>
                <ul className="list-disc pl-6 mt-2 text-gray-600">
                  <li>IP address and device information</li>
                  <li>Browser type and version</li>
                  <li>Operating system</li>
                  <li>Pages visited and time spent on those pages</li>
                  <li>Referring websites</li>
                  <li>Location data (if enabled)</li>
                </ul>
              </div>
            </div>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4">How We Use Your Information</h2>
            <p className="text-gray-600">We use the information we collect to:</p>
            <ul className="list-disc pl-6 mt-2 text-gray-600">
              <li>Process and fulfill your VR demo and travel bookings</li>
              <li>Create and manage your account</li>
              <li>Provide customer support</li>
              <li>Send administrative information and updates about your bookings</li>
              <li>Send marketing communications (with your consent)</li>
              <li>Improve our services and website functionality</li>
              <li>Analyze usage patterns to enhance user experience</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4">Sharing Your Information</h2>
            <p className="text-gray-600">We may share your information with:</p>
            <ul className="list-disc pl-6 mt-2 text-gray-600">
              <li>Service providers who assist us in operating our business</li>
              <li>Travel partners necessary to fulfill your bookings</li>
              <li>Legal authorities when required by law</li>
              <li>In connection with a business transaction such as a merger or acquisition</li>
            </ul>
            <p className="text-gray-600 mt-4">
              We do not sell or rent your personal information to third parties for their marketing purposes.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4">Data Security</h2>
            <p className="text-gray-600">
              We implement appropriate technical and organizational measures to protect your personal information 
              against unauthorized access, alteration, disclosure, or destruction. However, no method of 
              transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4">Your Rights</h2>
            <p className="text-gray-600">Depending on your location, you may have rights regarding your personal information, including:</p>
            <ul className="list-disc pl-6 mt-2 text-gray-600">
              <li>Accessing, correcting, or deleting your personal information</li>
              <li>Withdrawing consent for processing your data</li>
              <li>Restricting or objecting to our processing of your data</li>
              <li>Data portability</li>
              <li>Lodging a complaint with a supervisory authority</li>
            </ul>
            <p className="text-gray-600 mt-4">
              To exercise these rights, please contact us using the information provided in the "Contact Us" section.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4">Children's Privacy</h2>
            <p className="text-gray-600">
              Our services are not intended for individuals under the age of 18. We do not knowingly collect or 
              solicit personal information from children. If we learn that we have collected personal information 
              from a child, we will delete that information as quickly as possible.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4">Changes to This Privacy Policy</h2>
            <p className="text-gray-600">
              We may update this Privacy Policy from time to time to reflect changes in our practices or for other 
              operational, legal, or regulatory reasons. We will notify you of any material changes by posting the 
              new Privacy Policy on this page and updating the "Last Updated" date.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
            <p className="text-gray-600">
              If you have questions or concerns about this Privacy Policy or our data practices, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="font-medium">360° Trips</p>
              <p>Email: privacy@360trips.com</p>
              <p>Address: 123 Travel Lane, Mumbai, Maharashtra, India - 400001</p>
              <p>Phone: +91 98765 43210</p>
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  );
};

export default Privacy;
