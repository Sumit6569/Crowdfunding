
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import PayPalDonationButton from "@/components/PayPalDonationButton";
import { useAuth } from "@/contexts/AuthContext";

// Replace with your PayPal Client ID from environment variables
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || "test"; // This will come from env in a real app

const Campaign = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updates, setUpdates] = useState([]);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchCampaign = async () => {
      if (!id) return;
      
      try {
        const { data: campaignData, error: campaignError } = await supabase
          .from('campaigns')
          .select(`
            *,
            creator:creator_id(id, username, full_name, avatar_url)
          `)
          .eq('id', id)
          .single();
        
        if (campaignError) throw campaignError;
        
        // Fetch campaign updates and comments
        // This would be implemented in a real application
        // For now, we'll use mock data
        
        setCampaign(campaignData);
      } catch (error) {
        console.error('Error fetching campaign:', error);
        toast({
          title: "Error",
          description: "Failed to load campaign details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaign();
  }, [id, toast]);

  // For demo purposes, using mock data when no real data is available
  const campaignDetails = campaign || {
    id: "1",
    title: "Solar-Powered Community Garden",
    description: "Help us build a sustainable community garden that uses solar power for irrigation and lighting.",
    story: `<p>Our community has long dreamed of transforming the vacant lot on Elm Street into something beautiful and useful. After two years of planning and getting permits, we're finally ready to break ground on our solar-powered community garden!</p>
            <p>This garden will serve multiple purposes:</p>
            <ul>
              <li>Provide fresh produce to local families</li>
              <li>Create an educational space for schools</li>
              <li>Demonstrate sustainable urban farming techniques</li>
              <li>Build community connections and provide a peaceful gathering space</li>
            </ul>
            <p>The solar panels we plan to install will power the irrigation system, lighting, and a small tool shed with charging stations for electric garden tools. This will make our garden completely self-sufficient and environmentally friendly.</p>
            <p>Your contribution will help us purchase materials, plants, and pay for professional installation of the solar equipment. Any amount helps us get closer to our goal!</p>`,
    image_url: "https://images.unsplash.com/photo-1599013852859-34206d100581?ixlib=rb-1.2.1&auto=format&fit=crop&w=1280&q=80",
    category: "Environment",
    target_amount: 15000,
    current_amount: 8750,
    start_date: new Date().toISOString(),
    end_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    creator: {
      username: "GreenCommunityAlliance",
      full_name: "Green Community Alliance",
      avatar_url: "https://images.unsplash.com/photo-1599048192699-7800836c17c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=64&h=64&q=80",
    },
    location: "Portland, Oregon"
  };

  // Add a safe creator object that prevents null reference errors
  const safeCreator = campaignDetails.creator || {
    username: "Unknown",
    full_name: "Unknown Creator",
    avatar_url: "https://images.unsplash.com/photo-1599048192699-7800836c17c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=64&h=64&q=80",
  };

  const mockUpdates = [
    {
      id: "1",
      date: "April 15, 2025",
      title: "Site preparation has begun!",
      content: "Thanks to your early support, we've started clearing the site and preparing the soil for planting. The solar installation company will be visiting next week to finalize placement of panels."
    },
    {
      id: "2",
      date: "April 5, 2025",
      title: "Project approved by city council",
      content: "We're excited to announce that our project received unanimous support from the city council! This means we can proceed with our timeline as planned."
    }
  ];

  const mockComments = [
    {
      id: "1",
      user: "Sarah Johnson",
      date: "April 10, 2025",
      content: "This is exactly what our neighborhood needs! Can't wait to see it completed.",
      userImage: "https://images.unsplash.com/photo-1580489944761-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=48&h=48&q=80"
    },
    {
      id: "2",
      user: "Miguel Sanchez",
      date: "April 8, 2025",
      content: "I teach at the elementary school nearby and would love to bring my class to help plant once it's ready!",
      userImage: "https://images.unsplash.com/photo-1500648767791-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=48&h=48&q=80"
    }
  ];
  
  const handlePostComment = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to post a comment.",
        variant: "destructive"
      });
      return;
    }
    
    if (!comment.trim()) {
      toast({
        title: "Empty comment",
        description: "Please write something before posting.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would save to the database
    toast({
      title: "Comment posted",
      description: "Your comment has been posted successfully.",
    });
    setComment('');
  };
  
  // Calculate progress percentage
  const progress = campaign 
    ? Math.round((campaign.current_amount / campaign.target_amount) * 100)
    : Math.round((campaignDetails.current_amount / campaignDetails.target_amount) * 100);
  
  // Calculate days left
  const endDate = campaign 
    ? new Date(campaign.end_date)
    : new Date(campaignDetails.end_date);
  const now = new Date();
  const daysLeft = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  
  // Get image URL with fallback
  const imageUrl = campaign?.image_url || campaignDetails.image_url || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1280&q=80";
  
  const handleChangePassword = () => {
    toast({
      title: "Feature coming soon",
      description: "The change password feature will be available soon.",
    });
  };

  const handleUpdateProfile = () => {
    toast({
      title: "Feature coming soon",
      description: "The update profile feature will be available soon.",
    });
  };

  const handleSubscribe = () => {
    toast({
      title: "Subscribed!",
      description: "You've been successfully subscribed to our newsletter.",
    });
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading campaign details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Campaign Header */}
        <div className="bg-gray-50 py-8 border-b">
          <div className="container px-4 mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{campaignDetails.title}</h1>
            <p className="text-gray-600 mb-6">{campaignDetails.description}</p>
            
            <div className="flex items-center text-sm text-gray-500 mb-6">
              <span className="flex items-center mr-6">
                <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
                  <img src={safeCreator.avatar_url} alt={safeCreator.full_name} className="w-full h-full object-cover" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1599048192699-7800836c17c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=64&h=64&q=80";
                    }}
                  />
                </div>
                <span>By {safeCreator.full_name || safeCreator.username || "Unknown Creator"}</span>
              </span>
              <span className="mr-6">
                {campaignDetails.location || "No location specified"}
              </span>
              <span>
                {campaignDetails.category || "Uncategorized"}
              </span>
            </div>
          </div>
        </div>
        
        <div className="container px-4 mx-auto py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Campaign Content - Left 2/3 */}
            <div className="lg:col-span-2">
              {/* Campaign Image */}
              <div className="rounded-lg overflow-hidden mb-8">
                <img
                  src={imageUrl}
                  alt={campaignDetails.title}
                  className="w-full h-auto"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1280&q=80";
                  }}
                />
              </div>
              
              {/* Campaign Tabs */}
              <Tabs defaultValue="story" className="mb-8">
                <TabsList>
                  <TabsTrigger value="story">Campaign Story</TabsTrigger>
                  <TabsTrigger value="updates">Updates ({mockUpdates.length})</TabsTrigger>
                  <TabsTrigger value="comments">Comments ({mockComments.length})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="story" className="mt-6">
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: campaignDetails.story }} />
                </TabsContent>
                
                <TabsContent value="updates" className="mt-6 space-y-6">
                  {mockUpdates.map(update => (
                    <Card key={update.id}>
                      <CardContent className="p-6">
                        <div className="text-sm text-gray-500 mb-1">{update.date}</div>
                        <h3 className="text-xl font-bold mb-2">{update.title}</h3>
                        <div className="text-gray-700">{update.content}</div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
                
                <TabsContent value="comments" className="mt-6 space-y-6">
                  {mockComments.map(comment => (
                    <div key={comment.id} className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          <img 
                            src={comment.userImage} 
                            alt={comment.user} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=48&h=48&q=80";
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                          <div className="font-medium">{comment.user}</div>
                          <div className="text-sm text-gray-500">{comment.date}</div>
                        </div>
                        <div className="text-gray-700">
                          {comment.content}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-4">
                    <h4 className="font-medium mb-2">Leave a comment</h4>
                    <textarea
                      className="w-full border border-gray-300 rounded p-3 min-h-[100px]"
                      placeholder="Write your comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    ></textarea>
                    <div className="mt-2 flex justify-end">
                      <Button onClick={handlePostComment}>Post Comment</Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Campaign Sidebar - Right 1/3 */}
            <div>
              <div className="sticky top-20">
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <div className="mb-6">
                      <div className="flex justify-between items-end mb-2">
                        <div className="text-2xl font-bold">
                          ${(campaignDetails.current_amount || 0).toLocaleString()}
                        </div>
                        <div className="text-gray-500">
                          raised of ${(campaignDetails.target_amount || 0).toLocaleString()}
                        </div>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <div className="text-xl font-bold">124</div>
                        <div className="text-gray-500">Backers</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold">{daysLeft}</div>
                        <div className="text-gray-500">Days Left</div>
                      </div>
                    </div>
                    
                    <PayPalScriptProvider options={{ 
                      clientId: PAYPAL_CLIENT_ID,
                      currency: "USD",
                      components: "buttons"
                    }}>
                      <PayPalDonationButton 
                        campaignId={campaignDetails.id} 
                        campaignTitle={campaignDetails.title}
                        amount={amount} 
                      />
                    </PayPalScriptProvider>
                    
                    <div className="flex justify-center gap-4 mt-3">
                      <button className="text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                        </svg>
                      </button>
                      <button className="text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                        </svg>
                      </button>
                      <button className="text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                      </button>
                      <button className="text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                        </svg>
                      </button>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="bg-gray-50 border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Popular Donation Amounts</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="w-full justify-center" onClick={() => setAmount("10") }>$10</Button>
                    <Button variant="outline" className="w-full justify-center" onClick={() => setAmount("25") }>$25</Button>
                    <Button variant="outline" className="w-full justify-center" onClick={() => setAmount("50") }>$50</Button>
                    <Button variant="outline" className="w-full justify-center" onClick={() => setAmount("100") }>$100</Button>
                  </div>
                </div>

                <div className="bg-gray-50 border rounded-lg p-4 mt-6">
                  <h3 className="font-medium mb-2">Account Settings</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-center" onClick={handleChangePassword}>Change Password</Button>
                    <Button variant="outline" className="w-full justify-center" onClick={handleUpdateProfile}>Update Profile</Button>
                  </div>
                </div>

                <div className="bg-gray-50 border rounded-lg p-4 mt-6">
                  <h3 className="font-medium mb-2">Subscribe to Newsletter</h3>
                  <div className="space-y-3">
                    <Input placeholder="Enter your email" type="email" />
                    <Button className="w-full" onClick={handleSubscribe}>Subscribe</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Campaign;
