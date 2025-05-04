
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedCampaigns from "@/components/FeaturedCampaigns";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <FeaturedCampaigns />
      
      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-teal-600 font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Create Your Campaign</h3>
              <p className="text-gray-600">
                Set up your campaign with a compelling story, images, and funding goal to share your vision.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-indigo-600 font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Share With Everyone</h3>
              <p className="text-gray-600">
                Share your campaign with friends, family, and social networks to gain support.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-emerald-600 font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Receive Funding</h3>
              <p className="text-gray-600">
                Collect donations securely through our platform and track your progress in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Success Stats Section */}
      <section className="py-16 bg-gradient-to-r from-teal-500 to-indigo-600 text-white">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">$24M+</div>
              <p>Total Funds Raised</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">12,000+</div>
              <p>Successful Campaigns</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">150K+</div>
              <p>Happy Backers</p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
