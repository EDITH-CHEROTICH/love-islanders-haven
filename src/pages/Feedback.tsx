
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, ArrowLeft } from 'lucide-react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

type FeedbackItem = {
  id: string;
  feedback: string;
  created_at: string;
  category: string;
  status: string;
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'bug':
      return 'bg-red-500';
    case 'feature':
      return 'bg-green-500';
    case 'ui':
      return 'bg-blue-500';
    default:
      return 'bg-gray-500';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'new':
      return 'bg-yellow-500';
    case 'in-progress':
      return 'bg-blue-500';
    case 'completed':
      return 'bg-green-500';
    case 'rejected':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

const FeedbackPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchFeedback = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('user_feedback')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setFeedbackItems(data || []);
      } catch (err) {
        console.error('Error fetching feedback:', err);
        setError('Failed to load feedback. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedback();
  }, [isAuthenticated, navigate]);

  const handleBack = () => {
    navigate('/settings');
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-island-dark via-island to-island-dark">
      <div className="page-container">
        <header className="container max-w-4xl mx-auto px-4 pt-4 mb-4 flex items-center">
          <Button variant="ghost" onClick={handleBack} className="text-white">
            <ArrowLeft className="mr-2" size={18} />
            Back to Settings
          </Button>
          <h1 className="text-2xl font-bold text-gradient text-center flex-1">Feedback History</h1>
          <div className="w-28"></div> {/* For balance */}
        </header>

        <main className="container max-w-4xl mx-auto px-4 pb-20">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 text-love animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-400 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          ) : feedbackItems.length === 0 ? (
            <div className="text-center py-12 bg-island-light/10 rounded-lg">
              <h3 className="text-xl font-medium mb-2">No Feedback Yet</h3>
              <p className="text-gray-400 mb-6">You haven't submitted any feedback yet.</p>
              <Button onClick={() => navigate('/settings')}>Go to Settings</Button>
            </div>
          ) : (
            <div className="bg-island-light/10 rounded-lg overflow-hidden shadow-lg">
              <Table>
                <TableHeader>
                  <TableRow className="bg-island-light/20">
                    <TableHead className="text-white">Date</TableHead>
                    <TableHead className="text-white">Category</TableHead>
                    <TableHead className="text-white">Feedback</TableHead>
                    <TableHead className="text-white">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedbackItems.map((item) => (
                    <TableRow key={item.id} className="border-b border-island-light/20">
                      <TableCell className="text-gray-300">
                        {formatDate(item.created_at)}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getCategoryColor(item.category)}`}>
                          {item.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-white">
                        {item.feedback}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(item.status)}`}>
                          {item.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </main>
      </div>
      <Navbar />
    </div>
  );
};

export default FeedbackPage;
