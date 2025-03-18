
import { useState } from 'react';
import { useUserRole } from '@/contexts/UserRoleContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Check, 
  Users, 
  CreditCard, 
  ArrowRight,
  Building2,
  UserCheck,
  UserCircle,
  CalendarIcon,
  Receipt
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { slideUpVariants } from '@/utils/animations';

interface MembershipPlanProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  recommended?: boolean;
  current?: boolean;
  onUpgrade?: () => void;
  onManage?: () => void;
}

const MembershipPlan = ({ 
  title, 
  price, 
  description, 
  features, 
  recommended, 
  current,
  onUpgrade,
  onManage
}: MembershipPlanProps) => {
  // Animation class for staggered appearance
  const animationClass = `${slideUpVariants.visible}`;
  
  return (
    <Card className={`${recommended ? 'border-primary shadow-md' : ''} h-full flex flex-col ${animationClass} hover:-translate-y-1 transition-all duration-300`}>
      {recommended && (
        <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-medium">
          Recommended
        </div>
      )}
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {title}
          {current && <Badge>Current Plan</Badge>}
        </CardTitle>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold">{price}</span>
          <span className="text-sm text-muted-foreground">/month</span>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className="h-4 w-4 text-primary mt-1" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full hover:shadow-md transition-all" 
          variant={current ? "outline" : "default"}
          onClick={current ? onManage : onUpgrade}
        >
          {current ? "Manage Plan" : "Upgrade Plan"}
        </Button>
      </CardFooter>
    </Card>
  );
};

const Membership = () => {
  const { role } = useUserRole();
  const { toast } = useToast();
  const [isBillingHistoryOpen, setIsBillingHistoryOpen] = useState(false);
  const [isContactSalesOpen, setIsContactSalesOpen] = useState(false);
  const [isChangePlanOpen, setIsChangePlanOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleUpgradePlan = (planTitle: string) => {
    setSelectedPlan(planTitle);
    setIsChangePlanOpen(true);
  };

  const handleManagePlan = () => {
    toast({
      title: "Manage Current Plan",
      description: "You can view and update your current plan settings here.",
    });
  };

  const confirmPlanChange = () => {
    toast({
      title: "Plan Upgraded",
      description: `You have successfully upgraded to the ${selectedPlan} plan.`,
    });
    setIsChangePlanOpen(false);
  };

  const handleContactSales = () => {
    setIsContactSalesOpen(true);
  };

  // Plans for different user types
  const clientPlans = [
    {
      title: "Basic",
      price: "Free",
      description: "For occasional interpretation needs",
      features: [
        "Access to interpreter marketplace",
        "Basic scheduling tools",
        "Pay-as-you-go pricing",
        "Email support"
      ],
      current: role === 'client'
    },
    {
      title: "Premium",
      price: "$19.99",
      description: "For regular interpretation needs",
      features: [
        "All Basic features",
        "Priority matching with interpreters",
        "Discounted rates (5%)",
        "Priority email & chat support",
        "Detailed reporting"
      ],
      recommended: true
    },
    {
      title: "Enterprise",
      price: "$99.99",
      description: "For businesses with high-volume needs",
      features: [
        "All Premium features",
        "Volume discounts (up to 15%)",
        "Dedicated account manager",
        "Custom integration options",
        "Advanced analytics",
        "24/7 priority support"
      ]
    }
  ];

  const interpreterPlans = [
    {
      title: "Basic",
      price: "Free",
      description: "For part-time interpreters",
      features: [
        "Profile listing",
        "Basic scheduling tools",
        "Standard commission rates",
        "Email support"
      ],
      current: role === 'freelancer'
    },
    {
      title: "Professional",
      price: "$14.99",
      description: "For full-time interpreters",
      features: [
        "All Basic features",
        "Featured profile placement",
        "Reduced commission rates (3% less)",
        "Priority job matching",
        "Advanced scheduling tools",
        "Priority email & chat support"
      ],
      recommended: true
    },
    {
      title: "Premium",
      price: "$29.99",
      description: "For elite interpreters",
      features: [
        "All Professional features",
        "Top profile placement",
        "Lowest commission rates (5% less)",
        "VIP client access",
        "Marketing tools & promotion",
        "Skills development resources",
        "24/7 priority support"
      ]
    }
  ];

  const lspPlans = [
    {
      title: "Basic",
      price: "$49.99",
      description: "For small language service providers",
      features: [
        "Manage up to 10 interpreters",
        "Basic scheduling tools",
        "Standard commission rates",
        "Basic analytics",
        "Email support"
      ],
      current: role === 'lsp'
    },
    {
      title: "Professional",
      price: "$99.99",
      description: "For growing language service providers",
      features: [
        "Manage up to 30 interpreters",
        "Advanced scheduling tools",
        "Reduced commission rates (3% less)",
        "Comprehensive analytics",
        "Brand showcase",
        "Priority email & chat support"
      ],
      recommended: true
    },
    {
      title: "Enterprise",
      price: "$199.99",
      description: "For large language service providers",
      features: [
        "Unlimited interpreters",
        "Advanced scheduling & automation",
        "Lowest commission rates (5% less)",
        "Custom integration options",
        "White-label solutions",
        "Dedicated account manager",
        "24/7 priority support"
      ]
    }
  ];

  const getUserTypePlans = () => {
    switch(role) {
      case 'client': return clientPlans;
      case 'freelancer': return interpreterPlans;
      case 'lsp': return lspPlans;
      case 'admin': return clientPlans; // Default to show client plans for admin
      default: return clientPlans;
    }
  };

  const getIcon = (userType: string) => {
    switch(userType) {
      case 'client': return <UserCircle className="h-5 w-5" />;
      case 'interpreter': return <UserCheck className="h-5 w-5" />;
      case 'lsp': return <Building2 className="h-5 w-5" />;
      default: return <Users className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Membership Management</h1>
        <Button 
          variant="outline"
          onClick={() => setIsBillingHistoryOpen(true)}
          className="transition-all hover:shadow-md"
        >
          <CreditCard className="mr-2 h-4 w-4" />
          Billing History
        </Button>
      </div>

      {role === 'admin' ? (
        <Tabs defaultValue="client">
          <TabsList>
            <TabsTrigger value="client" className="flex items-center gap-1">
              <UserCircle className="h-4 w-4" />
              Client Plans
            </TabsTrigger>
            <TabsTrigger value="interpreter" className="flex items-center gap-1">
              <UserCheck className="h-4 w-4" />
              Interpreter Plans
            </TabsTrigger>
            <TabsTrigger value="lsp" className="flex items-center gap-1">
              <Building2 className="h-4 w-4" />
              LSP Plans
            </TabsTrigger>
          </TabsList>
          <TabsContent value="client">
            <div className="grid gap-6 md:grid-cols-3">
              {clientPlans.map((plan, index) => (
                <MembershipPlan 
                  key={index} 
                  {...plan} 
                  onUpgrade={() => handleUpgradePlan(plan.title)}
                  onManage={handleManagePlan}
                />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="interpreter">
            <div className="grid gap-6 md:grid-cols-3">
              {interpreterPlans.map((plan, index) => (
                <MembershipPlan 
                  key={index} 
                  {...plan}
                  onUpgrade={() => handleUpgradePlan(plan.title)}
                  onManage={handleManagePlan}
                />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="lsp">
            <div className="grid gap-6 md:grid-cols-3">
              {lspPlans.map((plan, index) => (
                <MembershipPlan 
                  key={index} 
                  {...plan}
                  onUpgrade={() => handleUpgradePlan(plan.title)}
                  onManage={handleManagePlan}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <>
          <Card className="mb-6 animate-fade-in">
            <CardHeader>
              <CardTitle>Your Current Membership</CardTitle>
              <CardDescription>
                {role === 'client' 
                  ? 'Manage your client membership plan' 
                  : role === 'freelancer'
                    ? 'Manage your interpreter membership plan'
                    : 'Manage your LSP membership plan'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    {getIcon(role === 'freelancer' ? 'interpreter' : role)}
                    <h3 className="text-lg font-medium">Basic Plan</h3>
                    <Badge>Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Next billing date: June 15, 2023
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleManagePlan}
                  className="transition-all hover:shadow-md hover:scale-105"
                >
                  Manage Subscription
                </Button>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-xl font-bold mb-4">Available Plans</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {getUserTypePlans().map((plan, index) => (
              <MembershipPlan 
                key={index} 
                {...plan}
                onUpgrade={() => handleUpgradePlan(plan.title)}
                onManage={handleManagePlan}
              />
            ))}
          </div>
        </>
      )}

      <Card className="mt-8 animate-fade-in">
        <CardHeader>
          <CardTitle>Need a Custom Solution?</CardTitle>
          <CardDescription>
            Contact our sales team for custom pricing and solutions tailored to your needs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="outline" 
            className="flex items-center transition-all hover:shadow-md hover:bg-primary hover:text-primary-foreground"
            onClick={handleContactSales}
          >
            Contact Sales
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Billing History Dialog */}
      <Dialog open={isBillingHistoryOpen} onOpenChange={setIsBillingHistoryOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="animate-fade-in">Billing History</DialogTitle>
            <DialogDescription className="animate-fade-in">
              Review your recent billing history and payment information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <Table className="animate-fade-in">
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="hover-scale">
                  <TableCell>May 15, 2023</TableCell>
                  <TableCell>
                    {role === 'client' 
                      ? 'Basic Plan Subscription' 
                      : role === 'freelancer'
                        ? 'Interpreter Basic Plan'
                        : 'LSP Basic Plan'}
                  </TableCell>
                  <TableCell>
                    {role === 'client' 
                      ? 'Free' 
                      : role === 'freelancer'
                        ? 'Free'
                        : '$49.99'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Paid
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <Receipt className="h-4 w-4" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow className="hover-scale">
                  <TableCell>April 15, 2023</TableCell>
                  <TableCell>
                    {role === 'client' 
                      ? 'Basic Plan Subscription' 
                      : role === 'freelancer'
                        ? 'Interpreter Basic Plan'
                        : 'LSP Basic Plan'}
                  </TableCell>
                  <TableCell>
                    {role === 'client' 
                      ? 'Free' 
                      : role === 'freelancer'
                        ? 'Free'
                        : '$49.99'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Paid
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <Receipt className="h-4 w-4" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline"
                onClick={() => setIsBillingHistoryOpen(false)}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  toast({
                    title: "Export Complete",
                    description: "Your billing history has been exported to CSV.",
                  });
                }}
              >
                Export History
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contact Sales Dialog */}
      <Dialog open={isContactSalesOpen} onOpenChange={setIsContactSalesOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="animate-fade-in">Contact Sales Team</DialogTitle>
            <DialogDescription className="animate-fade-in">
              Our sales team will contact you to discuss custom solutions for your business.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2 animate-fade-in">
            <p>
              Thank you for your interest in our custom solutions. A member of our sales team will
              contact you within 24 hours to discuss your specific needs and requirements.
            </p>
            <p>
              You can also reach us directly at:
              <br />
              <a href="mailto:sales@interpretease.com" className="text-primary hover:underline">
                sales@interpretease.com
              </a>
              <br />
              <a href="tel:+18005551234" className="text-primary hover:underline">
                +1 (800) 555-1234
              </a>
            </p>
            <div className="flex justify-end space-x-2 mt-4">
              <Button 
                onClick={() => {
                  setIsContactSalesOpen(false);
                  toast({
                    title: "Request Submitted",
                    description: "A sales representative will contact you soon.",
                  });
                }}
              >
                Submit Request
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Change Plan Dialog */}
      <Dialog open={isChangePlanOpen} onOpenChange={setIsChangePlanOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="animate-fade-in">Upgrade to {selectedPlan} Plan</DialogTitle>
            <DialogDescription className="animate-fade-in">
              Confirm your plan upgrade and review the changes.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2 animate-fade-in">
            <p>
              You are about to upgrade to the <strong>{selectedPlan}</strong> plan. Your new billing cycle will start immediately.
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">Plan Change Summary</h4>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>Current Plan:</span>
                  <span>Basic {role === 'lsp' ? '($49.99/month)' : '(Free)'}</span>
                </li>
                <li className="flex justify-between">
                  <span>New Plan:</span>
                  <span>
                    {selectedPlan} 
                    {selectedPlan === 'Premium' ? ' ($19.99/month)' :
                     selectedPlan === 'Professional' ? ' ($14.99/month)' :
                     selectedPlan === 'Enterprise' ? ' ($99.99/month)' : ''}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Prorated Charge:</span>
                  <span>$8.50</span>
                </li>
                <li className="flex justify-between font-medium">
                  <span>Next Billing Date:</span>
                  <span>June 15, 2023</span>
                </li>
              </ul>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button 
                variant="outline"
                onClick={() => setIsChangePlanOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={confirmPlanChange}>
                Confirm Upgrade
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Membership;
