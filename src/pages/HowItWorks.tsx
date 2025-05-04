
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Lightbulb, 
  PencilRuler, 
  Share2, 
  Users, 
  CreditCard, 
  BarChart3, 
  CheckCircle2, 
  AlertCircle
} from "lucide-react";

const HowItWorks = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="bg-gradient-to-r from-teal-500 to-indigo-600 py-12 text-white">
        <div className="container px-4 mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">How FundRise Works</h1>
          <p className="text-white/80 max-w-2xl mx-auto">
            Learn how to create and manage successful crowdfunding campaigns to bring your ideas to life
          </p>
        </div>
      </div>
      
      <main className="flex-1 container px-4 mx-auto py-12">
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Start Your Campaign in 4 Easy Steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-l-4 border-l-teal-500 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-teal-100 text-teal-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Lightbulb size={24} />
                </div>
                <CardTitle>1. Plan Your Idea</CardTitle>
                <CardDescription>Define your goals, budget, and timeline</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Start by clarifying your vision, setting realistic funding goals, and creating a project timeline. 
                  Research similar successful campaigns for inspiration.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-indigo-500 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-indigo-100 text-indigo-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <PencilRuler size={24} />
                </div>
                <CardTitle>2. Create Your Campaign</CardTitle>
                <CardDescription>Build your campaign page with compelling content</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Craft a compelling story, upload high-quality images or videos, and set up engaging reward 
                  tiers to attract potential backers.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-teal-500 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-teal-100 text-teal-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Share2 size={24} />
                </div>
                <CardTitle>3. Share & Promote</CardTitle>
                <CardDescription>Spread the word to potential supporters</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Share your campaign on social media, email your network, and engage with your community 
                  to build momentum and reach your funding goal.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-indigo-500 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-indigo-100 text-indigo-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <CreditCard size={24} />
                </div>
                <CardTitle>4. Collect Funds</CardTitle>
                <CardDescription>Receive your funds and fulfill your promises</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Once your campaign reaches its goal, you'll receive the funds and can start bringing your 
                  project to life while keeping your supporters updated.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
        
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Why Choose FundRise?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform offers everything you need to run successful campaigns and reach your goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-gradient-to-r from-teal-500 to-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Users className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">Global Reach</h3>
              <p className="text-gray-600">
                Connect with supporters worldwide and tap into our diverse community of backers passionate about innovation.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-gradient-to-r from-teal-500 to-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">Powerful Analytics</h3>
              <p className="text-gray-600">
                Track your campaign's performance with detailed analytics and insights to optimize your fundraising strategy.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-gradient-to-r from-teal-500 to-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">Secure Payments</h3>
              <p className="text-gray-600">
                Our platform uses industry-leading security to ensure all transactions are safe and protected.
              </p>
            </div>
          </div>
        </section>
        
        <section className="mb-16">
          <div className="bg-gray-50 rounded-xl p-8">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Common Questions</h2>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold flex items-center">
                      <AlertCircle size={18} className="mr-2 text-teal-500" />
                      What types of campaigns can I create?
                    </h4>
                    <p className="text-gray-600 ml-6 mt-1">
                      You can create campaigns for a wide variety of causes including creative projects, business ventures, 
                      community initiatives, charitable causes, and more.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold flex items-center">
                      <AlertCircle size={18} className="mr-2 text-teal-500" />
                      How long can my campaign run?
                    </h4>
                    <p className="text-gray-600 ml-6 mt-1">
                      Campaigns can run from 1 to 60 days. Most successful campaigns last around 30 days, giving you enough time to 
                      build momentum without losing urgency.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold flex items-center">
                      <AlertCircle size={18} className="mr-2 text-teal-500" />
                      What fees does FundRise charge?
                    </h4>
                    <p className="text-gray-600 ml-6 mt-1">
                      FundRise charges a 5% platform fee on the funds you raise, plus payment processing fees (typically 2.9% + $0.30 per transaction).
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="md:w-1/2 bg-white p-6 rounded-lg shadow-md border">
                <h3 className="text-xl font-bold mb-4 text-center">Ready to Get Started?</h3>
                <p className="text-gray-600 mb-6 text-center">
                  Create your campaign today and start bringing your ideas to life
                </p>
                <div className="flex flex-col space-y-3">
                  <Button 
                    asChild
                    className="w-full bg-gradient-to-r from-teal-500 to-indigo-600"
                  >
                    <Link to="/create-campaign">Start Your Campaign</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/discover">Browse Campaigns</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HowItWorks;
