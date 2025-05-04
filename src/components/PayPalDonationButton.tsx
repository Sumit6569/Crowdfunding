
import { useState } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface PayPalDonationButtonProps {
  campaignId: string;
  campaignTitle: string;
  amount?: string;
}

const PayPalDonationButton = ({ campaignId, campaignTitle, amount }: PayPalDonationButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [donationAmount, setDonationAmount] = useState(amount || "");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleDonateClick = () => {
    setDonationAmount(amount || "");
    setIsDialogOpen(true);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    setDonationAmount(value);
  };

  const validateAmount = () => {
    const numAmount = parseFloat(donationAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid donation amount.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const createOrder = async (data: any, actions: any) => {
    if (!validateAmount()) return null;

    return actions.order
      .create({
        purchase_units: [
          {
            description: `Donation to ${campaignTitle}`,
            amount: {
              value: donationAmount,
              currency_code: "USD",
            },
          },
        ],
        application_context: {
          shipping_preference: "NO_SHIPPING",
        },
      })
      .then((orderId: string) => {
        return orderId;
      });
  };

  const onApprove = async (data: any, actions: any) => {
    setIsProcessing(true);
    
    return actions.order.capture().then(async (details: any) => {
      try {
        // Store donation in database
        const { error } = await supabase.from("donations").insert({
          campaign_id: campaignId,
          donor_id: user?.id || null,
          amount: parseFloat(donationAmount),
          payment_id: details.id,
          anonymous: isAnonymous,
          message: message || null,
        });

        if (error) throw error;

        // Update campaign amount
        const { error: updateError } = await supabase.rpc("increment_campaign_amount", {
          p_campaign_id: campaignId,
          p_amount: parseFloat(donationAmount),
        });

        if (updateError) throw updateError;

        toast({
          title: "Thank you for your donation!",
          description: `You have successfully donated $${parseFloat(donationAmount).toFixed(2)} to ${campaignTitle}.`,
        });

        setIsDialogOpen(false);
      } catch (error) {
        console.error("Error processing donation:", error);
        toast({
          title: "Donation processing error",
          description: "There was an error recording your donation. Please contact support.",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    });
  };

  const onError = (err: any) => {
    console.error("PayPal error:", err);
    toast({
      title: "Payment failed",
      description: "There was an error processing your donation. Please try again.",
      variant: "destructive",
    });
    setIsProcessing(false);
  };

  return (
    <>
      <Button className="w-full" size="lg" onClick={handleDonateClick}>
        Donate Now
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Make a Donation</DialogTitle>
            <DialogDescription>
              Support {campaignTitle} with your contribution.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="amount" className="text-sm font-medium">
                Donation Amount ($)
              </label>
              <Input
                id="amount"
                placeholder="Enter amount"
                value={donationAmount}
                onChange={handleAmountChange}
                type="text"
                inputMode="decimal"
                disabled={isProcessing}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="anonymous"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded border-gray-300"
                disabled={isProcessing}
              />
              <label htmlFor="anonymous" className="text-sm">
                Make this donation anonymous
              </label>
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                Message (optional)
              </label>
              <textarea
                id="message"
                placeholder="Add a message of support"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full min-h-[80px] rounded border border-gray-300 p-2"
                disabled={isProcessing}
              />
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-col gap-2">
            {parseFloat(donationAmount) > 0 && (
              <PayPalButtons
                className="w-full"
                style={{
                  layout: "vertical",
                  shape: "rect",
                  label: "donate",
                }}
                disabled={isProcessing}
                createOrder={createOrder}
                onApprove={onApprove}
                onError={onError}
              />
            )}
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)} 
              disabled={isProcessing}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PayPalDonationButton;
