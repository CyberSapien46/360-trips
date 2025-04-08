
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Separator } from "@/components/ui/separator";
import { HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqCategories = [
    {
      category: "Virtual Reality Experience",
      questions: [
        {
          question: "What is the 360° Trips VR experience?",
          answer: "Our VR experience allows you to explore travel destinations in immersive virtual reality before booking your trip. Using VR headsets and high-quality 360° content, you can virtually walk through hotels, visit tourist attractions, and experience local culture from the comfort of your home."
        },
        {
          question: "Do I need my own VR equipment?",
          answer: "No, we bring all necessary VR equipment to your location if you're in one of our supported cities. We offer in-home VR demos where our representatives set up everything for you. If you already own VR equipment, you can also access our experiences through our app."
        },
        {
          question: "How long does a typical VR demo last?",
          answer: "A standard VR demo session lasts approximately 45-60 minutes, allowing you to explore 3-5 destinations of your choice. We can customize the duration based on your preferences and the number of destinations you want to experience."
        },
        {
          question: "Is the VR experience suitable for children?",
          answer: "Our VR experiences are generally suitable for children aged 10 and above. However, we recommend adult supervision for children under 14. Some individuals may experience motion sickness, so we suggest starting with shorter sessions."
        }
      ]
    },
    {
      category: "Bookings & Reservations",
      questions: [
        {
          question: "How do I book a VR demonstration?",
          answer: "You can book a VR demonstration through our website by visiting the 'VR Booking' page, selecting your preferred date, time, and locations you wish to explore. After completing the booking form, our team will contact you to confirm the appointment."
        },
        {
          question: "What is the cancellation policy for VR demos?",
          answer: "You can reschedule or cancel your VR demo up to 24 hours before the scheduled time without any charge. Cancellations made less than 24 hours in advance may incur a cancellation fee of ₹1,000."
        },
        {
          question: "Do I get a discount on travel packages after a VR demo?",
          answer: "Yes! After experiencing destinations in VR, you'll receive a ₹5,000 discount on your first travel package booking with us. This offer is valid for 3 months after your VR demo."
        },
        {
          question: "How far in advance should I book a VR demo?",
          answer: "We recommend booking your VR demo at least 3-5 days in advance to ensure availability, especially during peak season (October-March). However, we do accommodate last-minute bookings when possible."
        }
      ]
    },
    {
      category: "Travel Packages",
      questions: [
        {
          question: "What's included in your travel packages?",
          answer: "Our comprehensive travel packages typically include accommodation, daily breakfast, transfers between destinations, guided sightseeing tours, and entrance fees to attractions mentioned in the itinerary. Some packages also include additional meals and special experiences. The exact inclusions are clearly listed in each package description."
        },
        {
          question: "Can I customize a travel package?",
          answer: "Absolutely! We specialize in creating personalized travel experiences. After your VR demo, our travel consultants can help you customize any package to match your preferences, budget, and schedule."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept credit/debit cards, net banking, UPI payments, and EMI options through our secure payment gateway. For certain packages, we also offer a convenient installment payment plan."
        },
        {
          question: "Is travel insurance included in your packages?",
          answer: "Basic travel insurance is included in our premium packages. For standard packages, we offer travel insurance as an add-on option, which we highly recommend for a worry-free travel experience."
        }
      ]
    },
    {
      category: "Technical Questions",
      questions: [
        {
          question: "What if I experience motion sickness during the VR demo?",
          answer: "Some people may experience mild discomfort during VR experiences. Our representatives are trained to guide you through comfortable experiences and can adjust settings to minimize discomfort. We recommend taking breaks if needed and staying hydrated before your session."
        },
        {
          question: "Can I share my VR experience with family members?",
          answer: "Yes! Multiple family members can take turns experiencing destinations in VR during your scheduled demo time. This makes it a great way for everyone involved in trip planning to preview destinations together."
        },
        {
          question: "Do you offer virtual group tours for corporate events?",
          answer: "Yes, we offer special corporate packages for team building events, corporate retreats planning, and incentive travel programs. Contact our corporate solutions team for customized offerings."
        },
        {
          question: "What devices are compatible with your VR experiences?",
          answer: "If using your own equipment, our VR experiences are compatible with most popular VR headsets including Oculus/Meta Quest, HTC Vive, and PlayStation VR. We also have a mobile app that offers a simplified 360° viewing experience on smartphones."
        }
      ]
    }
  ];

  return (
    <MainLayout>
      <div className="container mx-auto py-12 px-4">
        <div className="flex items-center gap-3 mb-6">
          <HelpCircle className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
        </div>
        <Separator className="mb-8" />
        
        <div className="max-w-4xl mx-auto mb-12">
          <p className="text-xl text-gray-600">
            Find answers to commonly asked questions about our virtual reality travel experiences, 
            booking process, and travel packages.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {faqCategories.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h2 className="text-2xl font-semibold mb-4">{category.category}</h2>
              <Accordion type="single" collapsible className="border rounded-lg overflow-hidden">
                {category.questions.map((faq, faqIndex) => (
                  <AccordionItem key={faqIndex} value={`item-${categoryIndex}-${faqIndex}`}>
                    <AccordionTrigger className="px-4 text-left hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 pt-1 text-gray-600">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
        
        <div className="max-w-3xl mx-auto mt-16 text-center">
          <h2 className="text-2xl font-semibold mb-4">Still Have Questions?</h2>
          <p className="text-gray-600 mb-8">
            If you couldn't find the answer to your question, please don't hesitate to contact us.
            Our customer support team is available 7 days a week to assist you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="default" size="lg">
              <a href="mailto:support@360trips.com">Email Us</a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="tel:+919876543210">Call +91 98765 43210</a>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default FAQ;
