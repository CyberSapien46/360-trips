
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Separator } from "@/components/ui/separator";
import { Handshake, Building2, Globe, Hotel, CreditCard, Headphones, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

const Partnerships = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    partnerType: '',
    message: '',
    agreeTerms: false
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, agreeTerms: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeTerms) {
      toast({
        title: "Please agree to terms",
        description: "You must agree to our terms and conditions to proceed.",
        variant: "destructive"
      });
      return;
    }

    // Here you would typically send the data to your backend
    console.log("Partnership application submitted:", formData);
    
    // Show success state
    setFormSubmitted(true);
    
    // Reset form after 3 seconds and close dialog
    setTimeout(() => {
      setFormSubmitted(false);
      setFormOpen(false);
      setFormData({
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        partnerType: '',
        message: '',
        agreeTerms: false
      });
    }, 3000);

    toast({
      title: "Application Received!",
      description: "We've received your partnership application and will be in touch soon.",
    });
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-12 px-4">
        <div className="flex items-center gap-3 mb-6">
          <Handshake className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Partner With Us</h1>
        </div>
        <Separator className="mb-8" />
        
        <div className="max-w-4xl mb-12">
          <p className="text-xl text-gray-600 mb-6">
            360° Trips partners with tourism boards, hotels, resorts, tour operators, and technology providers 
            to create immersive virtual reality experiences and deliver unforgettable travel adventures across India.
          </p>
          <p className="text-gray-600">
            Join our network of trusted partners and grow your business while helping travelers experience 
            the beauty of India through innovative virtual reality technology.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {[
            {
              title: "Tourism Boards",
              icon: <Globe className="h-10 w-10 text-primary mb-4" />,
              description: "Partner with us to showcase your region's attractions in stunning VR and drive tourism to your area."
            },
            {
              title: "Hotels & Resorts",
              icon: <Hotel className="h-10 w-10 text-primary mb-4" />,
              description: "Feature your property in our VR experiences and connect with travelers who have already explored your destination virtually."
            },
            {
              title: "Tour Operators",
              icon: <Building2 className="h-10 w-10 text-primary mb-4" />,
              description: "Integrate your tours into our platform and benefit from pre-qualified leads who have previewed experiences in VR."
            },
            {
              title: "Payment Partners",
              icon: <CreditCard className="h-10 w-10 text-primary mb-4" />,
              description: "Provide seamless payment solutions for our customers booking experiences and travel packages."
            },
            {
              title: "Technology Providers",
              icon: <Headphones className="h-10 w-10 text-primary mb-4" />,
              description: "Supply VR hardware, software solutions, or other technology that enhances our immersive travel experiences."
            }
          ].map((partner, index) => (
            <Card key={index} className="border border-gray-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-center">{partner.icon}</div>
                <CardTitle className="text-xl text-center">{partner.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-600">{partner.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12 mb-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Why Partner With 360° Trips?</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-3">Increased Visibility</h3>
                <p className="text-gray-600">
                  Showcase your destination, property, or service to our growing user base of travel enthusiasts.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Higher Conversion Rates</h3>
                <p className="text-gray-600">
                  Connect with travelers who have already experienced your offering virtually and are more likely to book.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Innovative Marketing</h3>
                <p className="text-gray-600">
                  Leverage cutting-edge VR technology to differentiate your offering in a competitive market.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Data Insights</h3>
                <p className="text-gray-600">
                  Gain valuable information about traveler preferences and behavior through our analytics.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Become a Partner Today</h2>
          <p className="text-gray-600 mb-8">
            Interested in partnering with 360° Trips? Fill out our partnership inquiry form, and our team will 
            contact you to discuss how we can collaborate to create amazing travel experiences.
          </p>
          <Button size="lg" className="px-8" onClick={() => setFormOpen(true)}>
            Apply for Partnership
          </Button>
        </div>

        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>{formSubmitted ? "Application Received!" : "Partnership Application"}</DialogTitle>
              <DialogDescription>
                {formSubmitted 
                  ? "Thank you for your interest in partnering with 360° Trips. Our team will review your application and be in touch soon."
                  : "Please fill out the form below to apply for a partnership with 360° Trips."
                }
              </DialogDescription>
            </DialogHeader>
            
            {formSubmitted ? (
              <div className="flex flex-col items-center justify-center py-6">
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                <p className="text-center text-gray-600">
                  We've received your application and will contact you within 2-3 business days.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input 
                      id="companyName" 
                      name="companyName" 
                      value={formData.companyName} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Contact Person *</Label>
                    <Input 
                      id="contactName" 
                      name="contactName" 
                      value={formData.contactName} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={formData.email} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      type="tel" 
                      value={formData.phone} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="partnerType">Partnership Type *</Label>
                  <select 
                    id="partnerType" 
                    name="partnerType" 
                    value={formData.partnerType} 
                    onChange={handleInputChange} 
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="" disabled>Select partnership type</option>
                    <option value="Tourism Board">Tourism Board</option>
                    <option value="Hotel/Resort">Hotel/Resort</option>
                    <option value="Tour Operator">Tour Operator</option>
                    <option value="Payment Partner">Payment Partner</option>
                    <option value="Technology Provider">Technology Provider</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Tell us about your company and how you'd like to partner *</Label>
                  <Textarea 
                    id="message" 
                    name="message" 
                    value={formData.message} 
                    onChange={handleInputChange} 
                    required
                    rows={4}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="agreeTerms" 
                    checked={formData.agreeTerms} 
                    onCheckedChange={handleCheckboxChange} 
                  />
                  <label 
                    htmlFor="agreeTerms" 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the terms and conditions and privacy policy
                  </label>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Submit Application</Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
        
        <div className="mt-16 pt-8 border-t">
          <h3 className="text-xl font-semibold mb-6">Current Partners</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {['Incredible India', 'Tourism Authority of Kerala', 'Rajasthan Tourism', 'Indian Railways', 'Taj Hotels', 'Make My Trip'].map((partner, index) => (
              <div key={index} className="flex items-center justify-center h-20 bg-gray-100 rounded-lg">
                <span className="font-medium text-gray-700">{partner}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Partnerships;
