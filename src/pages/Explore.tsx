
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CampaignCard from "@/components/CampaignCard";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Define campaign interface to avoid TypeScript errors
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

const categories = ["All", "Environment", "Healthcare", "Education", "Community", "Humanitarian", "Arts"];

const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState("");
  const [resultsCount, setResultsCount] = useState(0);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true);
      
      try {
        let query = supabase
          .from("campaigns")
          .select("*")
          .eq("status", "active")
          .order("created_at", { ascending: false });
        
        if (activeCategory !== "All") {
          query = query.eq("category", activeCategory);
        }
        
        if (searchTerm) {
          query = query.ilike("title", `%${searchTerm}%`);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        setCampaigns(data || []);
        setResultsCount(data?.length || 0);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        setCampaigns([]);
        setResultsCount(0);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCampaigns();
    
    // Update URL search params
    if (activeCategory !== "All") {
      setSearchParams({ category: activeCategory });
    } else {
      setSearchParams({});
    }
  }, [activeCategory, searchTerm, setSearchParams]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The search is already triggered by the useEffect when searchTerm changes
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-teal-500 to-indigo-600 py-12 text-white">
          <div className="container px-4 mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Explore All Projects</h1>
            <p className="text-lg max-w-2xl mx-auto opacity-90">
              Discover and support campaigns that are making a difference in communities around the world
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-md mx-auto mt-8">
              <div className="relative">
                <Input 
                  type="text"
                  placeholder="Search projects..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 py-6 text-black"
                />
                <Search className="absolute left-3 top-3 text-gray-400" />
              </div>
            </form>
          </div>
        </section>
        
        {/* Filter Section */}
        <section className="py-8 border-b bg-white">
          <div className="container px-4 mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex overflow-x-auto pb-2 -mx-2 flex-grow">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`mx-2 px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                      activeCategory === category
                        ? "bg-gradient-to-r from-teal-500 to-indigo-600 text-white"
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              
              <div className="text-sm text-gray-500">
                {resultsCount} {resultsCount === 1 ? "result" : "results"} found
              </div>
            </div>
          </div>
        </section>
        
        {/* Results Section */}
        <section className="py-12">
          <div className="container px-4 mx-auto">
            {loading ? (
              <div className="flex justify-center items-center min-h-[300px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : campaigns.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.map((campaign) => (
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
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No projects found</h3>
                <p className="text-gray-500 mb-6">Try a different search term or category</p>
                <Button onClick={() => {setActiveCategory("All"); setSearchTerm("");}}>
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Explore;
