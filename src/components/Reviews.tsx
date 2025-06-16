
import { useState } from 'react';
import { Star, ThumbsUp, MessageSquare, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useReviews } from '@/hooks/useReviews';
import { toast } from '@/hooks/use-toast';

interface ReviewsProps {
  toolId: string;
}

const Reviews = ({ toolId }: ReviewsProps) => {
  const { user } = useAuth();
  const { reviews, userReview, loading, userVotes, submitReview, voteReview } = useReviews(toolId);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitReview = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to write a review",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    const success = await submitReview(rating, title || undefined, content || undefined);
    
    if (success) {
      toast({
        title: userReview ? "Review updated!" : "Review submitted!",
        description: "Thank you for your feedback",
      });
      setShowReviewForm(false);
      setTitle('');
      setContent('');
      setRating(5);
    } else {
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive",
      });
    }
    setSubmitting(false);
  };

  const handleVoteReview = async (reviewId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to vote on reviews",
        variant: "destructive",
      });
      return;
    }

    const success = await voteReview(reviewId, true);
    if (!success) {
      toast({
        title: "Error",
        description: "Failed to vote on review",
        variant: "destructive",
      });
    }
  };

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={() => interactive && onRate && onRate(star)}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center text-gray-500">Loading reviews...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Reviews Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center">
            <MessageSquare className="w-6 h-6 mr-2" />
            Reviews ({reviews.length})
          </h2>
          {reviews.length > 0 && (
            <div className="flex items-center space-x-2">
              {renderStars(Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length))}
              <span className="text-sm text-gray-500">
                {(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)} average
              </span>
            </div>
          )}
        </div>
        
        {user && !userReview && (
          <Button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Write Review</span>
          </Button>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <Card>
          <CardHeader>
            <CardTitle>Write a Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              {renderStars(rating, true, setRating)}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Title (optional)</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Brief summary of your experience"
                maxLength={100}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Review (optional)</label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your detailed experience with this tool..."
                rows={4}
                maxLength={1000}
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                onClick={handleSubmitReview}
                disabled={submitting}
                className="flex-1"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowReviewForm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* User's existing review */}
      {userReview && (
        <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-900/20 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback>You</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Your Review</p>
                  <div className="flex items-center space-x-2">
                    {renderStars(userReview.rating)}
                    <span className="text-sm text-gray-500">
                      {new Date(userReview.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setRating(userReview.rating);
                  setTitle(userReview.title || '');
                  setContent(userReview.content || '');
                  setShowReviewForm(true);
                }}
              >
                Edit
              </Button>
            </div>
            
            {userReview.title && (
              <h4 className="font-medium mb-2">{userReview.title}</h4>
            )}
            
            {userReview.content && (
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {userReview.content}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.filter(review => review.user_id !== user?.id).map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Anonymous User</p>
                    <div className="flex items-center space-x-2">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVoteReview(review.id)}
                  className={`flex items-center space-x-1 ${
                    userVotes.has(review.id) ? 'text-blue-600 bg-blue-50' : 'text-gray-500'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{review.helpful_count}</span>
                </Button>
              </div>
              
              {review.title && (
                <h4 className="font-medium mb-2">{review.title}</h4>
              )}
              
              {review.content && (
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {review.content}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
        
        {reviews.filter(review => review.user_id !== user?.id).length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">No reviews yet. Be the first to share your experience!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Reviews;
