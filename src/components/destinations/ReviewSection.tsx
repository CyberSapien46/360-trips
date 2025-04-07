
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Star, MessageCircle, User, Calendar } from 'lucide-react';

type Review = {
  id: string;
  user_id: string;
  destination_id: string;
  rating: number;
  comment: string;
  experience_type: 'vr' | 'real_life';
  user_name: string;
  created_at: string;
};

interface ReviewSectionProps {
  destinationId: string;
  destinationName: string;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ destinationId, destinationName }) => {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [experienceType, setExperienceType] = useState<'vr' | 'real_life'>('vr');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [filter, setFilter] = useState<'all' | 'vr' | 'real_life'>('all');

  // Fetch reviews when component mounts
  useEffect(() => {
    fetchReviews();
  }, [destinationId]);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('destination_reviews')
        .select(`
          *,
          profiles:profiles(name)
        `)
        .eq('destination_id', destinationId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedReviews = data.map(review => ({
          ...review,
          user_name: review.profiles?.name || 'Anonymous User',
        }));
        setReviews(formattedReviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleSubmitReview = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit a review",
      });
      return;
    }

    if (!comment.trim()) {
      toast({
        title: "Review required",
        description: "Please share your experience in the comment field",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('destination_reviews')
        .insert({
          user_id: user!.id,
          destination_id: destinationId,
          rating,
          comment,
          experience_type: experienceType,
        })
        .select();

      if (error) throw error;

      toast({
        title: "Review submitted",
        description: "Thank you for sharing your experience!",
      });

      // Reset form and refresh reviews
      setRating(5);
      setComment('');
      fetchReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: "There was a problem submitting your review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredReviews = filter === 'all' 
    ? reviews 
    : reviews.filter(review => review.experience_type === filter);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Reviews for {destinationName}</h3>
        <Select value={filter} onValueChange={(value: 'all' | 'vr' | 'real_life') => setFilter(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter reviews" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Reviews</SelectItem>
            <SelectItem value="vr">VR Experience</SelectItem>
            <SelectItem value="real_life">Real-life Experience</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isAuthenticated && (
        <Card>
          <CardHeader>
            <CardTitle>Share Your Experience</CardTitle>
            <CardDescription>
              Let others know about your experience at this destination
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>What kind of experience are you reviewing?</Label>
              <RadioGroup 
                value={experienceType} 
                onValueChange={(value: 'vr' | 'real_life') => setExperienceType(value)}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="vr" id="vr" />
                  <Label htmlFor="vr">Virtual Reality Experience</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="real_life" id="real_life" />
                  <Label htmlFor="real_life">Real-life Visit Experience</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Rate your experience (1-5 stars)</Label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button
                    key={star}
                    type="button"
                    variant={rating >= star ? "default" : "outline"}
                    size="sm"
                    className="w-10 h-10 p-0"
                    onClick={() => setRating(star)}
                  >
                    <Star className={rating >= star ? "fill-current" : ""} size={16} />
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment">Your review</Label>
              <Textarea
                id="comment"
                placeholder="Share details of your experience at this destination..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleSubmitReview} 
              disabled={isSubmitting}
            >
              Submit Review
            </Button>
          </CardFooter>
        </Card>
      )}

      {!isAuthenticated && (
        <Card className="bg-muted/50">
          <CardContent className="p-6 text-center">
            <p>Please log in to share your experience at this destination.</p>
            <Button className="mt-4" variant="outline" asChild>
              <a href="/login">Log In or Sign Up</a>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-2 text-muted-foreground">
              No reviews yet. Be the first to share your experience!
            </p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <Card key={review.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{review.user_name}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(review.created_at)}
                      </div>
                    </div>
                  </div>
                  <div>
                    <span className="inline-block px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                      {review.experience_type === 'vr' ? 'VR Experience' : 'Real-life Visit'}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="flex items-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`h-4 w-4 ${star <= review.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <p className="text-sm">{review.comment}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
