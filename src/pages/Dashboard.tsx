import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart } from "@/components/ui/bar-chart";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Settings, ChartBar, CircleDollarSign, User } from "lucide-react";

const mockUserCampaigns = [
  {
    id: "1",
    title: "Solar-Powered Community Garden",
    image: "https://images.unsplash.com/photo-1599013852859-34206d100581?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
    goalAmount: 15000,
    raisedAmount: 8750,
    backers: 124,
    daysLeft: 21,
    status: "active"
  },
  {
    id: "2",
    title: "Local Animal Shelter Renovation",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
    goalAmount: 10000,
    raisedAmount: 3200,
    backers: 45,
    daysLeft: 15,
    status: "active"
  }
];

const mockUserDonations = [
  {
    id: "1",
    campaignId: "101",
    campaignTitle: "Sustainable Water Solutions",
    amount: 75,
    date: "April 10, 2025",
    status: "completed"
  },
  {
    id: "2",
    campaignId: "102",
    campaignTitle: "Children's Book Publishing Project",
    amount: 120,
    date: "March 28, 2025",
    status: "completed"
  },
  {
    id: "3",
    campaignId: "103",
    campaignTitle: "Urban Tree Planting Initiative",
    amount: 50,
    date: "March 15, 2025",
    status: "completed"
  }
];

const chartData = [
  {
    name: "Apr",
    value: 1200,
  },
  {
    name: "May",
    value: 900,
  },
  {
    name: "Jun",
    value: 1500,
  },
  {
    name: "Jul",
    value: 2800,
  },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<string>("overview");
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 bg-gray-50">
        <div className="bg-white border-b">
          <div className="container px-4 mx-auto py-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
                <p className="text-gray-600">Manage your campaigns and donations</p>
              </div>
              <Button className="bg-gradient-to-r from-teal-500 to-indigo-600" asChild>
                <Link to="/create-campaign" className="flex items-center gap-1">
                  <Plus className="w-4 h-4" /> Create New Campaign
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="container px-4 mx-auto py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <div className="border-b">
              <TabsList className="flex overflow-x-auto pb-px">
                <TabsTrigger value="overview" className="flex gap-2 items-center">
                  <ChartBar className="w-4 h-4" /> Overview
                </TabsTrigger>
                <TabsTrigger value="campaigns" className="flex gap-2 items-center">
                  <CircleDollarSign className="w-4 h-4" /> My Campaigns
                </TabsTrigger>
                <TabsTrigger value="donations" className="flex gap-2 items-center">
                  <User className="w-4 h-4" /> My Donations
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex gap-2 items-center">
                  <Settings className="w-4 h-4" /> Account Settings
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="overview" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-700">Total Raised</h3>
                      <CircleDollarSign className="text-teal-500 w-5 h-5" />
                    </div>
                    <div className="text-3xl font-bold">$11,950</div>
                    <div className="text-sm text-green-600 mt-1">+15% from last month</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-700">Active Campaigns</h3>
                      <ChartBar className="text-indigo-500 w-5 h-5" />
                    </div>
                    <div className="text-3xl font-bold">2</div>
                    <div className="text-sm text-gray-500 mt-1">Across 2 categories</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-700">Total Backers</h3>
                      <User className="text-emerald-500 w-5 h-5" />
                    </div>
                    <div className="text-3xl font-bold">169</div>
                    <div className="text-sm text-green-600 mt-1">+24% from last month</div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Fundraising Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <BarChart
                      data={chartData}
                      index="name"
                      categories={["value"]}
                      colors={["#14b8a6"]}
                      valueFormatter={(value) => `$${value}`}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-5">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <CircleDollarSign className="w-5 h-5 text-teal-600" />
                      </div>
                      <div>
                        <p className="font-medium">New donation of $75 to Solar-Powered Community Garden</p>
                        <p className="text-sm text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-medium">New comment on your Local Animal Shelter Renovation campaign</p>
                        <p className="text-sm text-gray-500">8 hours ago</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <ChartBar className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-medium">Your campaign reached 50% of the funding goal</p>
                        <p className="text-sm text-gray-500">Yesterday</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="campaigns">
              <div className="grid gap-6">
                {mockUserCampaigns.map((campaign) => (
                  <Card key={campaign.id}>
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-48 h-48 overflow-hidden">
                          <img
                            src={campaign.image}
                            alt={campaign.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-6 flex-1">
                          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                            <div>
                              <h3 className="text-xl font-bold mb-1">
                                <Link to={`/campaign/${campaign.id}`} className="hover:text-teal-600">
                                  {campaign.title}
                                </Link>
                              </h3>
                              <div className="text-sm text-gray-500 mb-4">
                                <span className="inline-block px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                                  Active
                                </span>
                                <span className="ml-2">{campaign.daysLeft} days left</span>
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link to={`/campaign/${campaign.id}/edit`}>Edit</Link>
                              </Button>
                              <Button variant="outline" size="sm" asChild>
                                <Link to={`/campaign/${campaign.id}/manage`}>Manage</Link>
                              </Button>
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm text-gray-500">
                                ${campaign.raisedAmount.toLocaleString()} raised of ${campaign.goalAmount.toLocaleString()}
                              </span>
                              <span className="text-sm font-medium">
                                {Math.round((campaign.raisedAmount / campaign.goalAmount) * 100)}%
                              </span>
                            </div>
                            <Progress value={Math.round((campaign.raisedAmount / campaign.goalAmount) * 100)} className="h-2" />
                          </div>
                          
                          <div className="flex items-center gap-4 mt-2">
                            <div>
                              <div className="text-lg font-bold">{campaign.backers}</div>
                              <div className="text-sm text-gray-500">Backers</div>
                            </div>
                            <div className="h-8 border-l"></div>
                            <div>
                              <div className="text-lg font-bold">${campaign.raisedAmount.toLocaleString()}</div>
                              <div className="text-sm text-gray-500">Raised</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <div className="text-center py-8">
                  <Button className="bg-gradient-to-r from-teal-500 to-indigo-600" asChild>
                    <Link to="/create-campaign" className="flex items-center gap-1">
                      <Plus className="w-4 h-4" /> Create New Campaign
                    </Link>
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="donations">
              <Card>
                <CardHeader>
                  <CardTitle>My Donations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <div className="relative w-full overflow-auto">
                      <table className="w-full caption-bottom text-sm">
                        <thead>
                          <tr className="border-b bg-gray-50">
                            <th className="h-12 px-4 text-left align-middle font-medium">Campaign</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Amount</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                            <th className="h-12 px-4 text-right align-middle font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {mockUserDonations.map((donation) => (
                            <tr key={donation.id} className="border-b transition-colors">
                              <td className="p-4 align-middle">
                                <Link to={`/campaign/${donation.campaignId}`} className="font-medium hover:text-teal-600">
                                  {donation.campaignTitle}
                                </Link>
                              </td>
                              <td className="p-4 align-middle font-medium">${donation.amount}</td>
                              <td className="p-4 align-middle text-gray-700">{donation.date}</td>
                              <td className="p-4 align-middle">
                                <span className="inline-block px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                                  {donation.status}
                                </span>
                              </td>
                              <td className="p-4 align-middle text-right">
                                <Button variant="ghost" size="sm" asChild>
                                  <Link to={`/campaign/${donation.campaignId}`}>View Campaign</Link>
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-medium">
                            Full Name
                          </label>
                          <Input
                            id="name"
                            defaultValue="John Doe"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-medium">
                            Email
                          </label>
                          <Input
                            id="email"
                            type="email"
                            defaultValue="john@example.com"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="bio" className="text-sm font-medium">
                          Bio
                        </label>
                        <Textarea
                          id="bio"
                          placeholder="Tell us a little about yourself"
                          className="min-h-[100px]"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label htmlFor="location" className="text-sm font-medium">
                            Location
                          </label>
                          <Input
                            id="location"
                            defaultValue="Portland, Oregon"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="website" className="text-sm font-medium">
                            Website
                          </label>
                          <Input
                            id="website"
                            type="url"
                            placeholder="https://yourwebsite.com"
                          />
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <Button className="bg-gradient-to-r from-teal-500 to-indigo-600">
                          Save Changes
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Picture</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center">
                        <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
                          <img
                            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80"
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <Button variant="outline" size="sm">
                          Change Picture
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Security</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button variant="outline" className="w-full justify-start">
                        Change Password
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        Two-Factor Authentication
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        Connected Accounts
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
