
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
  UserCircle
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MembershipPlanProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  recommended?: boolean;
  current?: boolean;
}

const MembershipPlan = ({ 
  title, 
  price, 
  description, 
  features, 
  recommended, 
  current 
}: MembershipPlanProps) => (
  <Card className={`${recommended ? 'border-primary' : ''} h-full flex flex-col`}>
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
      <Button className="w-full" variant={current ? "outline" : "default"}>
        {current ? "Manage Plan" : "Upgrade Plan"}
      </Button>
    </CardFooter>
  </Card>
);

const Membership = () => {
  const { role } = useUserRole();

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
        <Button variant="outline">
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
                <MembershipPlan key={index} {...plan} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="interpreter">
            <div className="grid gap-6 md:grid-cols-3">
              {interpreterPlans.map((plan, index) => (
                <MembershipPlan key={index} {...plan} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="lsp">
            <div className="grid gap-6 md:grid-cols-3">
              {lspPlans.map((plan, index) => (
                <MembershipPlan key={index} {...plan} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <>
          <Card className="mb-6">
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
                <Button variant="outline" size="sm">
                  Manage Subscription
                </Button>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-xl font-bold mb-4">Available Plans</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {getUserTypePlans().map((plan, index) => (
              <MembershipPlan key={index} {...plan} />
            ))}
          </div>
        </>
      )}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Need a Custom Solution?</CardTitle>
          <CardDescription>
            Contact our sales team for custom pricing and solutions tailored to your needs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="flex items-center">
            Contact Sales
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Membership;
