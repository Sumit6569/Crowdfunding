
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CampaignCard from "@/components/CampaignCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const campaignCategories = [
  "All Categories", "Environment", "Healthcare", "Education", "Community",
  "Humanitarian", "Arts", "Technology", "Sports", "Business"
];

interface Campaign {
  id: string;
  title: string;
  description: string;
  target_amount: number;
  current_amount: number;
  end_date: string;
  image_url: string;
  creator_id: string;
  category?: string;
}

const Discover = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("newest");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchCampaigns();
  }, []);

  useEffect(() => {
    filterAndSortCampaigns();
  }, [campaigns, searchTerm, category, sortBy]);

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('status', 'active');

      if (error) {
        throw error;
      }

      setCampaigns(data || []);
      setFilteredCampaigns(data || []);
    } catch (error: any) {
      console.error('Error fetching campaigns:', error.message);
      toast({
        title: "Error",
        description: "Failed to load campaigns. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortCampaigns = () => {
    let filtered = [...campaigns];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (campaign) =>
          campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          campaign.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (category && category !== "All Categories") {
      filtered = filtered.filter((campaign) => campaign.category === category);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.end_date).getTime() - new Date(a.end_date).getTime();
        case "mostFunded":
          return b.current_amount - a.current_amount;
        case "endingSoon":
          return new Date(a.end_date).getTime() - new Date(b.end_date).getTime();
        default:
          return 0;
      }
    });

    setFilteredCampaigns(filtered);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  // Calculate days left from end date
  const getDaysLeft = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="bg-gradient-to-r from-teal-500 to-indigo-600 py-12 text-white">
        <div className="container px-4 mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Discover Campaigns</h1>
          <p className="text-white/80 max-w-2xl mx-auto">
            Explore a wide range of causes and projects that need your support. Find something
            you're passionate about and make a difference today.
          </p>
        </div>
      </div>

      <main className="flex-1 container px-4 mx-auto py-8">
        <div className="mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="space-y-4">
              <div>
                <label htmlFor="search" className="text-sm font-medium mb-1 block">
                  Search Campaigns
                </label>
                <Input
                  id="search"
                  placeholder="Search by campaign name or description"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="text-sm font-medium mb-1 block">
                    Filter by Category
                  </label>
                  <Select value={category} onValueChange={handleCategoryChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {campaignCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label htmlFor="sort" className="text-sm font-medium mb-1 block">
                    Sort by
                  </label>
                  <Select value={sortBy} onValueChange={handleSortChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="mostFunded">Most Funded</SelectItem>
                      <SelectItem value="endingSoon">Ending Soon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : filteredCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map((campaign) => (
              <div key={campaign.id} className="h-full">
                <CampaignCard 
                  id={campaign.id}
                  title={campaign.title}
                  description={campaign.description}
                  image={campaign.image_url || '/placeholder.svg'}
                  category={campaign.category || "Other"}
                  goalAmount={Number(campaign.target_amount)}
                  raisedAmount={Number(campaign.current_amount)}
                  daysLeft={getDaysLeft(campaign.end_date)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-medium text-gray-700 mb-4">No campaigns found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filters to find what you're looking for.</p>
            <Button onClick={() => { setSearchTerm(''); setCategory('All Categories'); }}>
              Clear Filters
            </Button>
          </div>
        )}

        <div className="mt-12 text-center">
          <h3 className="text-xl font-bold mb-4">Start Your Own Campaign</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Have a cause you're passionate about? Create your own campaign and start raising funds today.
          </p>
          <Button 
            onClick={() => navigate('/create-campaign')}
            className="bg-gradient-to-r from-teal-500 to-indigo-600"
          >
            Start a Campaign
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Discover;
