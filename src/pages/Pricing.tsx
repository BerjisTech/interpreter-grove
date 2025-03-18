
import { Check, X, CreditCard, Shield, Star, Clock, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PricingTier = ({ title, price, description, features, recommended = false, buttonText = "Get Started" }) => (
  <div className={`bg-card rounded-xl p-8 border ${recommended ? 'border-primary shadow-lg' : 'border-border shadow-sm'} relative`}>
    {recommended && (
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
        Recommended
      </div>
    )}
    <h3 className="text-2xl font-bold mb-2">{title}</h3>
    <div className="mb-4">
      <span className="text-4xl font-bold">${price}</span>
      {price !== 'Custom' && <span className="text-muted-foreground">/minute</span>}
    </div>
    <p className="text-muted-foreground mb-6">{description}</p>
    <ul className="space-y-3 mb-8">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start">
          {feature.included ? (
            <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
          ) : (
            <X className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
          )}
          <span className={feature.included ? "" : "text-muted-foreground"}>{feature.text}</span>
        </li>
      ))}
    </ul>
    <Button className="w-full" variant={recommended ? "default" : "outline"}>
      {buttonText}
    </Button>
  </div>
);

const Pricing = () => {
  const clientFeatures = [
    {
      title: "Basic",
      price: "1.99",
      description: "For individuals with occasional interpretation needs",
      features: [
        { text: "General interpretation", included: true },
        { text: "Video calls", included: true },
        { text: "Phone calls", included: true },
        { text: "24/7 availability", included: false },
        { text: "Specialized interpreters", included: false },
        { text: "Priority matching", included: false },
      ],
    },
    {
      title: "Professional",
      price: "2.99",
      description: "For business users with regular interpretation needs",
      recommended: true,
      features: [
        { text: "General interpretation", included: true },
        { text: "Video calls", included: true },
        { text: "Phone calls", included: true },
        { text: "24/7 availability", included: true },
        { text: "Specialized interpreters", included: true },
        { text: "Priority matching", included: false },
      ],
    },
    {
      title: "Enterprise",
      price: "Custom",
      description: "For organizations with high-volume requirements",
      features: [
        { text: "General interpretation", included: true },
        { text: "Video calls", included: true },
        { text: "Phone calls", included: true },
        { text: "24/7 availability", included: true },
        { text: "Specialized interpreters", included: true },
        { text: "Priority matching", included: true },
      ],
      buttonText: "Contact Sales"
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="pt-28 pb-16 bg-accent/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Simple, Transparent Pricing</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Pay only for the minutes you use with no hidden fees or long-term commitments.
            </p>
            <div className="inline-flex items-center bg-accent rounded-full p-2">
              <Button className="rounded-full">For Clients</Button>
              <Button variant="ghost" className="rounded-full">For Interpreters</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-20 container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {clientFeatures.map((tier, index) => (
            <PricingTier
              key={index}
              title={tier.title}
              price={tier.price}
              description={tier.description}
              features={tier.features}
              recommended={tier.recommended}
              buttonText={tier.buttonText}
            />
          ))}
        </div>

        {/* Additional Pricing Details */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Interpreter Earnings */}
          <div className="bg-card rounded-xl p-8 border border-border shadow-sm">
            <BadgeCheck className="h-12 w-12 text-primary mb-6" />
            <h2 className="text-2xl font-bold mb-4">Interpreter Earnings</h2>
            <p className="text-muted-foreground mb-6">
              Set your own rates based on your experience, credentials, and specialization. 
              Our platform takes a small commission to maintain quality service.
            </p>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-border">
                <span>Base rate for general interpretation</span>
                <span className="font-medium">70-80% of client payment</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-border">
                <span>Specialized interpretation</span>
                <span className="font-medium">75-85% of client payment</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-border">
                <span>Emergency/after-hours services</span>
                <span className="font-medium">80-90% of client payment</span>
              </div>
            </div>
            <Button className="mt-8" variant="outline">Register as Interpreter</Button>
          </div>

          {/* LSP Options */}
          <div className="bg-card rounded-xl p-8 border border-border shadow-sm">
            <Building className="h-12 w-12 text-primary mb-6" />
            <h2 className="text-2xl font-bold mb-4">Language Service Provider Options</h2>
            <p className="text-muted-foreground mb-6">
              Specialized pricing and features for interpretation agencies and language service providers.
            </p>
            <div className="space-y-4 mb-6">
              <div className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Custom dashboard for interpreter management</span>
              </div>
              <div className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Call routing and assignment tools</span>
              </div>
              <div className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Detailed analytics and reporting</span>
              </div>
              <div className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Volume-based discounted rates</span>
              </div>
              <div className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>API integration with existing systems</span>
              </div>
            </div>
            <Button className="mt-2">Contact for LSP Pricing</Button>
          </div>
        </div>
      </div>

      {/* FAQs and Guarantees */}
      <div className="py-16 bg-accent/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Guarantees</h2>
            <p className="text-muted-foreground">
              We stand behind the quality and reliability of our interpretation services
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm text-center">
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Satisfaction Guarantee</h3>
              <p className="text-muted-foreground">
                If you're not satisfied with the interpretation quality, we'll provide a partial refund or credit.
              </p>
            </div>
            
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm text-center">
              <CreditCard className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Secure Payments</h3>
              <p className="text-muted-foreground">
                Your payments are processed securely, and we only charge for the minutes you use.
              </p>
            </div>
            
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm text-center">
              <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Punctuality Promise</h3>
              <p className="text-muted-foreground">
                Our interpreters will be on time for your scheduled appointments or you'll receive a credit.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link to="/interpreters">Find an Interpreter Now</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
