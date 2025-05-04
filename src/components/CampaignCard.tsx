
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CampaignCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  goalAmount: number;
  raisedAmount: number;
  daysLeft: number;
  // Add backwards compatibility for the Discover page
  currentAmount?: number;
  targetAmount?: number;
  endDate?: Date;
}

const CampaignCard = ({
  id,
  title,
  description,
  image,
  category,
  goalAmount,
  raisedAmount,
  daysLeft,
  // Handle optional props from different usage patterns
  currentAmount,
  targetAmount,
  endDate
}: CampaignCardProps) => {
  // Use fallbacks for different property naming conventions
  const actualRaisedAmount = raisedAmount || currentAmount || 0;
  const actualGoalAmount = goalAmount || targetAmount || 1; // Prevent division by zero
  const actualDaysLeft = daysLeft || (endDate ? Math.max(0, Math.floor((new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : 0);
  
  // Calculate progress safely
  const progress = Math.min(Math.round((actualRaisedAmount / actualGoalAmount) * 100), 100);
  
  // Use a fallback image if the provided one is null, undefined or empty
  const defaultImage = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=500&q=60";
  const imageUrl = image && image.trim() !== "" ? image : defaultImage;
  
  return (
    <Link to={`/campaign/${id}`}>
      <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              // If image fails to load, use a fallback
              (e.target as HTMLImageElement).src = defaultImage;
            }}
          />
          <Badge className="absolute top-2 right-2 bg-white text-gray-800">
            {category || "Uncategorized"}
          </Badge>
        </div>
        
        <CardHeader className="pb-2">
          <h3 className="text-xl font-bold line-clamp-2">{title}</h3>
        </CardHeader>
        
        <CardContent className="pb-3">
          <p className="text-gray-500 text-sm line-clamp-2 mb-4">{description}</p>
          
          {/* Progress bar */}
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-teal-500 to-indigo-500 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between items-center mt-2 text-sm">
            <span className="font-medium">{progress}% Funded</span>
            <span className="text-gray-500">{actualDaysLeft} days left</span>
          </div>
        </CardContent>
        
        <CardFooter className="pt-0 border-t">
          <div className="w-full flex justify-between items-center">
            <div className="font-medium">
              ${actualRaisedAmount.toLocaleString()}
              <span className="text-gray-500 text-xs ml-1">raised of ${actualGoalAmount.toLocaleString()}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default CampaignCard;
