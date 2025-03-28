
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Calendar as CalendarIcon, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/context/AuthContext';
import { useTravel } from '@/context/TravelContext';

const formSchema = z.object({
  date: z.date({
    required_error: "Please select a date for your VR experience.",
  }),
  time: z.string({
    required_error: "Please select a time slot.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  additionalNotes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const VRBookingForm: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { createVRBooking, hasActiveBooking, bookings } = useTravel();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      additionalNotes: "",
    },
  });
  
  const onSubmit = async (data: FormValues) => {
    if (!isAuthenticated || !user) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await createVRBooking({
        userId: user.id,
        date: format(data.date, 'yyyy-MM-dd'),
        time: data.time,
        address: data.address,
        status: 'confirmed',
        additionalNotes: data.additionalNotes
      });
      
      form.reset();
    } catch (error) {
      console.error('Booking creation failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const timeSlots = [
    "9:00 AM - 11:00 AM",
    "11:00 AM - 1:00 PM",
    "1:00 PM - 3:00 PM",
    "3:00 PM - 5:00 PM",
    "5:00 PM - 7:00 PM",
  ];

  // Find active booking details for display
  const activeBooking = bookings.find(booking => 
    booking.status !== 'cancelled' && booking.status !== 'completed'
  );

  return (
    <>
      {hasActiveBooking && activeBooking ? (
        <div className="mb-8">
          <Alert variant="warning">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Booking Limit Reached</AlertTitle>
            <AlertDescription>
              You already have an active booking scheduled for {activeBooking.date} at {activeBooking.time}. 
              You can only have one active booking at a time. Please cancel your existing booking or wait until it's completed to book another VR experience.
            </AlertDescription>
          </Alert>
          <div className="mt-4 text-center">
            <Button 
              variant="outline" 
              className="mr-2"
              onClick={() => window.location.href = '/profile'}
            >
              View My Bookings
            </Button>
          </div>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Select date</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Choose the date for your VR experience.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Slot</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a time slot" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {timeSlots.map((slot) => (
                          <SelectItem key={slot} value={slot}>
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4" />
                              <span>{slot}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select a preferred time slot for your appointment.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full address" {...field} />
                  </FormControl>
                  <FormDescription>
                    We'll send our VR equipment to this address.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="additionalNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any special requirements or questions?"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Book VR Experience"}
            </Button>
          </form>
        </Form>
      )}
    </>
  );
};

export default VRBookingForm;
