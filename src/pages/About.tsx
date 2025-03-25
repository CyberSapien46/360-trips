
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Users, Award, Clock, Globe, Heart } from 'lucide-react';

const About = () => {
  return (
    <MainLayout>
      <section className="pt-16 pb-8 bg-muted/50">
        <div className="container">
          <div className="flex flex-col items-center text-center mb-8">
            <Users className="h-12 w-12 text-primary mb-4" />
            <h1 className="text-4xl font-bold mb-4">
              About ExploreVR
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              We're on a mission to transform how people discover, experience, and plan their travels 
              through the power of virtual reality.
            </p>
          </div>
        </div>
      </section>
      
      <section className="py-16">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4">
                <p>
                  ExploreVR was founded in 2023 by a team of travel enthusiasts and technology experts 
                  who recognized the potential of virtual reality to revolutionize travel planning.
                </p>
                <p>
                  We saw that travelers often faced uncertainty when choosing destinations and activities. 
                  Photos and videos can only convey so much, leaving travelers wondering if a destination 
                  would truly match their expectations.
                </p>
                <p>
                  Our solution: harness the immersive power of VR to let travelers virtually experience 
                  destinations before they commit. This not only helps travelers make more informed 
                  decisions but also builds excitement for their upcoming adventures.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="h-96 rounded-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
                  alt="Team collaboration" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-36 h-36 bg-primary rounded-xl flex items-center justify-center text-white p-4 shadow-subtle">
                <div className="text-center">
                  <p className="text-sm font-medium">Founded</p>
                  <p className="text-3xl font-bold">2023</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Mission & Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We believe that virtual reality can make travel more accessible, sustainable, and 
              enjoyable for everyone. Our core values guide everything we do.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Globe,
                title: "Sustainability",
                description: "We promote sustainable tourism by helping travelers make informed choices that respect local cultures and environments."
              },
              {
                icon: Heart,
                title: "Passion",
                description: "We're passionate about travel and technology, and believe in their power to connect people and create meaningful experiences."
              },
              {
                icon: Award,
                title: "Excellence",
                description: "We strive for excellence in every virtual experience we create, ensuring the highest quality and attention to detail."
              },
              {
                icon: Clock,
                title: "Innovation",
                description: "We're constantly exploring new technologies and approaches to improve the travel planning experience."
              }
            ].map((value, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-xl shadow-subtle border border-muted/50"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-16">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="h-64 rounded-xl overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
                    alt="Person using VR headset" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="h-64 rounded-xl overflow-hidden mt-8">
                  <img 
                    src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2069&q=80"
                    alt="Technology development" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="h-40 rounded-xl overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
                    alt="Code development" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="h-40 rounded-xl overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1483058712412-4245e9b90334?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
                    alt="Office space" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-bold mb-6">Our Team</h2>
              <div className="space-y-4">
                <p>
                  Our diverse team brings together expertise in virtual reality development, 
                  travel planning, 3D modeling, and customer experience design.
                </p>
                <p>
                  We're united by our passion for travel and our belief in technology's power 
                  to enhance the travel planning experience. Each team member contributes unique 
                  skills and perspectives, from capturing stunning 360° footage to creating intuitive user interfaces.
                </p>
                <p>
                  Based across four continents, our global perspective helps us understand and 
                  serve travelers from all backgrounds and with diverse preferences.
                </p>
              </div>
              
              <div className="mt-8">
                <Button asChild>
                  <Link to="/contact">Contact Our Team</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-primary text-white">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Experience Travel in VR?
            </h2>
            <p className="text-primary-foreground/80 mb-8">
              Join thousands of travelers who use ExploreVR to discover and plan their perfect vacations.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" variant="secondary" className="rounded-full px-8">
                <Link to="/destinations">Explore Destinations</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-8 bg-transparent border-white/60 text-white hover:bg-white/10">
                <Link to="/vr-booking">Book VR Experience</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default About;
