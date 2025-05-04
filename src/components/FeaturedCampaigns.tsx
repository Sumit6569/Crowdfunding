
import { useState, useEffect } from "react";
import CampaignCard from "./CampaignCard";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

// Define campaign interface
interface Campaign {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  target_amount: number;
  current_amount: number;
  end_date: string;
  creator_id?: string;
  status: string;
  created_at: string;
}

// Fallback mock data if database fetch fails
const mockCampaigns = [
  {
    id: "1",
    title: "Solar-Powered Community Garden",
    description: "Help us build a sustainable community garden that uses solar power for irrigation and lighting.",
    image_url: "https://images.unsplash.com/photo-1599013852859-34206d100581?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    category: "Environment",
    target_amount: 15000,
    current_amount: 8750,
    end_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000)
  },
  {
    id: "2",
    title: "Art Therapy for Children's Hospital",
    description: "Bringing art supplies and professional therapists to help children heal through creativity.",
    image_url: "https://images.unsplash.com/photo-1581078426770-6d336e5de7bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    category: "Healthcare",
    target_amount: 10000,
    current_amount: 9200,
    end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  },
  {
    id: "3",
    title: "Tech Education for Underserved Communities",
    description: "Providing laptops and coding education to students without access to technology.",
    image_url: "https://images.unsplash.com/photo-1581089781785-603411fa81e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    category: "Education",
    target_amount: 25000,
    current_amount: 12500,
    end_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000)
  },
  {
    id: "4",
    title: "Local Food Bank Expansion",
    description: "Help us expand our facilities to serve more families in need in our community.",
    image_url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    category: "Community",
    target_amount: 30000,
    current_amount: 18000,
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  },
  {
    id: "5",
    title: "Clean Water Initiative",
    description: "Building wells and water purification systems in areas without clean drinking water.",
    image_url: "https://images.unsplash.com/photo-1591377164295-82dc50074ccd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    category: "Humanitarian",
    target_amount: 50000,
    current_amount: 27500,
    end_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
  },
  {
    id: "6",
    title: "Indie Film Production",
    description: "Supporting independent filmmakers in creating a documentary about local heroes.",
    image_url: "https://images.unsplash.com/photo-1585647347384-2acc968d35e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    category: "Arts",
    target_amount: 20000,
    current_amount: 5000,
    end_date: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000)
  }
];

// Category filter options
const categories = ["All", "Environment", "Healthcare", "Education", "Community", "Humanitarian", "Arts"];

const FeaturedCampaigns = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const { data, error } = await supabase
          .from("campaigns")
          .select("*")
          .eq("status", "active")
          .order("created_at", { ascending: false })
          .limit(6);
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          setCampaigns(data);
        } else {
          // If no campaigns in database, use mock data
          setCampaigns(mockCampaigns as unknown as Campaign[]);
        }
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        // Use mock data as fallback
        setCampaigns(mockCampaigns as unknown as Campaign[]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCampaigns();
  }, []);
  
  // Filter campaigns based on selected category
  const filteredCampaigns = activeCategory === "All"
    ? campaigns
    : campaigns.filter(campaign => campaign.category === activeCategory);
  
  return (
    <section className="py-12 bg-gray-50">
      <div className="container px-4 mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">
          Featured Campaigns
        </h2>
        
        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm ${
                activeCategory === category
                  ? "bg-gradient-to-r from-teal-500 to-indigo-600 text-white"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* Campaign cards grid */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCampaigns.map((campaign) => (
                <CampaignCard
                  key={campaign.id}
                  id={campaign.id}
                  title={campaign.title}
                  description={campaign.description}
                  image={campaign.image_url}
                  category={campaign.category || "Uncategorized"}
                  goalAmount={campaign.target_amount}
                  raisedAmount={campaign.current_amount}
                  daysLeft={Math.max(0, Math.floor((new Date(campaign.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))}
                />
              ))}
            </div>
            
            <div className="flex justify-center mt-10">
              <Button asChild size="lg" className="px-8">
                <Link to="/explore">Explore All Projects</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedCampaigns;
