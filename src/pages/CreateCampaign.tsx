
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

const campaignCategories = [
  "Environment", "Healthcare", "Education", "Community",
  "Humanitarian", "Arts", "Technology", "Sports", "Business"
];

const CreateCampaign = () => {
  const [activeTab, setActiveTab] = useState<string>("basics");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    tagline: "",
    category: "",
    location: "",
    goalAmount: "",
    deadline: "",
    image: "",
    story: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a campaign.",
        variant: "destructive",
      });
      navigate("/auth?mode=login");
      return;
    }
    
    // Validate form data
    if (
      !formData.title ||
      !formData.tagline ||
      !formData.category ||
      !formData.location ||
      !formData.goalAmount ||
      !formData.deadline ||
      !formData.image ||
      !formData.story
    ) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate deadline date
      const deadlineDate = new Date(formData.deadline);
      
      // Insert campaign into database
      const { data, error } = await supabase
        .from('campaigns')
        .insert({
          title: formData.title,
          description: formData.story,
          target_amount: parseFloat(formData.goalAmount),
          end_date: deadlineDate.toISOString(),
          creator_id: user.id,
          image_url: formData.image,
          status: 'active'
        })
        .select();

      if (error) {
        throw error;
      }

      toast({
        title: "Campaign created successfully!",
        description: "Your campaign has been submitted for review.",
      });

      // Navigate to the new campaign page or dashboard
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error creating campaign:", error);
      toast({
        title: "Error creating campaign",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="bg-gradient-to-r from-teal-500 to-indigo-600 py-8 text-white">
        <div className="container px-4 mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Create Your Campaign</h1>
          <p className="text-white/80">Share your idea with the world and get the funding you need</p>
        </div>
      </div>
      
      <main className="flex-1 container px-4 mx-auto py-8">
        <div className="max-w-3xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="border rounded-lg mb-8">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="basics">Campaign Basics</TabsTrigger>
                <TabsTrigger value="story">Story & Details</TabsTrigger>
                <TabsTrigger value="funding">Funding & Rewards</TabsTrigger>
              </TabsList>
            </div>
            
            <form onSubmit={handleSubmit}>
              <TabsContent value="basics">
                <Card>
                  <CardHeader>
                    <CardTitle>Campaign Basics</CardTitle>
                    <CardDescription>
                      Let's start with the fundamental details of your campaign
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <label htmlFor="title" className="text-sm font-medium">
                        Campaign Title *
                      </label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="Give your campaign a clear, specific title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="tagline" className="text-sm font-medium">
                        Tagline/Short Description *
                      </label>
                      <Input
                        id="tagline"
                        name="tagline"
                        placeholder="Summarize your project in a single sentence"
                        value={formData.tagline}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="category" className="text-sm font-medium">
                          Category *
                        </label>
                        <Select 
                          value={formData.category} 
                          onValueChange={(value) => handleSelectChange("category", value)}
                        >
                          <SelectTrigger id="category">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {campaignCategories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="location" className="text-sm font-medium">
                          Location *
                        </label>
                        <Input
                          id="location"
                          name="location"
                          placeholder="City, State/Province, Country"
                          value={formData.location}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="image" className="text-sm font-medium">
                        Campaign Image URL *
                      </label>
                      <Input
                        id="image"
                        name="image"
                        type="url"
                        placeholder="Paste an image URL for your campaign cover"
                        value={formData.image}
                        onChange={handleChange}
                        required
                      />
                      <p className="text-xs text-gray-500">
                        This will be the main image for your campaign. Choose something eye-catching.
                      </p>
                    </div>
                    
                    <div className="pt-4 flex justify-end">
                      <Button 
                        type="button" 
                        onClick={() => setActiveTab("story")}
                        className="bg-gradient-to-r from-teal-500 to-indigo-600"
                      >
                        Continue to Story & Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="story">
                <Card>
                  <CardHeader>
                    <CardTitle>Story & Details</CardTitle>
                    <CardDescription>
                      Tell potential backers about your project and why it matters
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <label htmlFor="story" className="text-sm font-medium">
                        Campaign Story *
                      </label>
                      <Textarea
                        id="story"
                        name="story"
                        placeholder="Share your story. What are you trying to accomplish? Why does it matter? How will the funds be used?"
                        className="min-h-[300px]"
                        value={formData.story}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="pt-4 flex justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setActiveTab("basics")}
                      >
                        Back to Basics
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setActiveTab("funding")}
                        className="bg-gradient-to-r from-teal-500 to-indigo-600"
                      >
                        Continue to Funding & Rewards
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="funding">
                <Card>
                  <CardHeader>
                    <CardTitle>Funding & Rewards</CardTitle>
                    <CardDescription>
                      Set your funding goal and timeline
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="goalAmount" className="text-sm font-medium">
                          Funding Goal ($) *
                        </label>
                        <Input
                          id="goalAmount"
                          name="goalAmount"
                          type="number"
                          min="1"
                          placeholder="5000"
                          value={formData.goalAmount}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="deadline" className="text-sm font-medium">
                          Campaign End Date *
                        </label>
                        <Input
                          id="deadline"
                          name="deadline"
                          type="date"
                          value={formData.deadline}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                      <h4 className="font-medium text-yellow-800 mb-2">Coming Soon: Reward Tiers</h4>
                      <p className="text-sm text-yellow-700">
                        You'll be able to add reward tiers for different donation levels after completing the basic campaign setup.
                      </p>
                    </div>
                    
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-bold mb-4">Review & Launch</h3>
                      <p className="text-gray-600 mb-4">
                        After submitting, your campaign will be reviewed by our team before going live. 
                        This usually takes 1-2 business days.
                      </p>
                      
                      <div className="flex items-center mb-6">
                        <input type="checkbox" id="terms" className="mr-2" required />
                        <label htmlFor="terms" className="text-sm">
                          I agree to the <Link to="/terms" className="text-teal-600 hover:underline">Terms & Conditions</Link> and <Link to="/privacy" className="text-teal-600 hover:underline">Privacy Policy</Link>
                        </label>
                      </div>
                    </div>
                    
                    <div className="pt-4 flex justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setActiveTab("story")}
                      >
                        Back to Story
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-gradient-to-r from-teal-500 to-indigo-600"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                            Processing...
                          </>
                        ) : (
                          "Submit Campaign for Review"
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </form>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateCampaign;
