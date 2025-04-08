
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Separator } from "@/components/ui/separator";
import { Camera, Download, FileText, Mail, BarChart, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Media = () => {
  const pressReleases = [
    {
      date: "March 15, 2025",
      title: "360° Trips Expands Virtual Reality Travel Experiences to 20 New Destinations Across India",
      summary: "Expansion includes new immersive experiences in Northeast India and remote Himalayan regions."
    },
    {
      date: "February 2, 2025",
      title: "360° Trips Partners with Tourism Authority of Kerala for Exclusive VR Content",
      summary: "Partnership brings authentic Kerala backwaters and cultural experiences to virtual reality."
    },
    {
      date: "December 10, 2024",
      title: "360° Trips Launches Revolutionary Home VR Service in 5 Major Indian Cities",
      summary: "New service brings travel VR experiences directly to customers' homes with expert guidance."
    }
  ];

  const mediaAssets = [
    {
      title: "Company Logo Pack",
      description: "High-resolution logo files in various formats (PNG, SVG, EPS)",
      icon: <FileText className="h-6 w-6" />
    },
    {
      title: "Product Images",
      description: "High-quality images of our VR experiences and services",
      icon: <Camera className="h-6 w-6" />
    },
    {
      title: "Press Releases",
      description: "Archive of all press releases in PDF format",
      icon: <Newspaper className="h-6 w-6" />
    },
    {
      title: "Company Fact Sheet",
      description: "Key information and statistics about 360° Trips",
      icon: <BarChart className="h-6 w-6" />
    }
  ];

  return (
    <MainLayout>
      <div className="container mx-auto py-12 px-4">
        <div className="flex items-center gap-3 mb-6">
          <Newspaper className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Media & Press</h1>
        </div>
        <Separator className="mb-8" />
        
        <div className="max-w-4xl mb-12">
          <p className="text-xl text-gray-600 mb-6">
            Welcome to the 360° Trips media center. Here you'll find press releases, media assets, 
            and information about our company for press and media professionals.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-semibold mb-6">About 360° Trips</h2>
            <p className="text-gray-600 mb-4">
              Founded in 2023, 360° Trips is revolutionizing the travel industry by allowing customers to 
              experience destinations in immersive virtual reality before booking their holidays. Focusing 
              initially on Indian destinations, we help travelers make informed decisions and plan perfect 
              trips based on firsthand virtual experiences.
            </p>
            <p className="text-gray-600 mb-4">
              Our unique home VR demonstration service brings the equipment and experience directly to 
              customers in major Indian cities, making virtual travel accessible to everyone.
            </p>
            <p className="text-gray-600 mb-4">
              360° Trips partners with leading hotels, tourism boards, and travel operators to create 
              authentic and comprehensive virtual travel experiences followed by expertly curated tour packages.
            </p>
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Key Facts</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Founded: 2023, Mumbai, India</li>
                <li>• Coverage: Over 150 destinations across India</li>
                <li>• Home VR Service: Available in Mumbai, Delhi, Bangalore, Chennai, and Hyderabad</li>
                <li>• Team: 45+ travel and technology professionals</li>
                <li>• Funding: Series A funded with ₹150 million investment</li>
              </ul>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-6">Press Releases</h2>
            <div className="space-y-6">
              {pressReleases.map((release, index) => (
                <div key={index} className="border-b pb-6 last:border-b-0">
                  <p className="text-sm text-gray-500 mb-1">{release.date}</p>
                  <h3 className="text-lg font-medium mb-2">{release.title}</h3>
                  <p className="text-gray-600 mb-3">{release.summary}</p>
                  <Button variant="link" className="p-0 h-auto font-medium">
                    Read Full Release
                  </Button>
                </div>
              ))}
            </div>
            <Button className="mt-8" variant="outline">
              View All Press Releases
            </Button>
          </div>
        </div>
        
        <div className="bg-blue-50 rounded-2xl p-8 md:p-12 mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-center">Media Assets</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mediaAssets.map((asset, index) => (
              <Card key={index} className="border-0 shadow-sm bg-white">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    {asset.icon}
                    <CardTitle className="text-lg">{asset.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <p className="text-sm text-gray-600">{asset.description}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="w-full gap-1">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
        
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-4">Press & Media Inquiries</h2>
          <p className="text-gray-600 mb-8">
            For press inquiries, interview requests, or additional information, please contact our media relations team.
            We're happy to provide expert commentary on virtual reality travel, Indian tourism, or travel technology trends.
          </p>
          <div className="inline-block bg-muted p-6 rounded-lg text-left">
            <h3 className="font-medium mb-2">Media Contact</h3>
            <p>Priya Sharma, Head of Communications</p>
            <p>Email: media@360trips.com</p>
            <p>Phone: +91 98765 43210</p>
            <Button variant="default" className="mt-4 gap-2">
              <Mail className="h-4 w-4" />
              Contact Media Team
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Media;
