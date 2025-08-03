import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, Star } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$0",
    period: "/month",
    features: [
      { name: "5 images per month", included: true },
      { name: "2x upscaling max", included: true },
      { name: "Basic denoising", included: true },
      { name: "Batch processing", included: false },
      { name: "Priority processing", included: false },
      { name: "API access", included: false },
    ],
    buttonText: "Get Started Free",
    buttonVariant: "outline" as const,
    popular: false,
  },
  {
    name: "Professional",
    price: "$29",
    period: "/month",
    features: [
      { name: "500 images per month", included: true },
      { name: "8x upscaling max", included: true },
      { name: "Advanced AI models", included: true },
      { name: "Batch processing", included: true },
      { name: "Priority processing", included: true },
      { name: "API access", included: false },
    ],
    buttonText: "Upgrade to Pro",
    buttonVariant: "default" as const,
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/month",
    features: [
      { name: "Unlimited images", included: true },
      { name: "All AI models", included: true },
      { name: "API access", included: true },
      { name: "Custom processing", included: true },
      { name: "Dedicated support", included: true },
      { name: "White-label options", included: true },
    ],
    buttonText: "Contact Sales",
    buttonVariant: "secondary" as const,
    popular: false,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-background to-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">Professional Pricing Plans</h2>
          <p className="text-xl text-text-secondary">Choose the perfect plan for your image enhancement needs</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index}
              className={`bg-surface p-8 relative ${
                plan.popular 
                  ? "border-2 border-primary shadow-xl shadow-primary/20" 
                  : "border-gray-700"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-text-secondary">{plan.period}</span>
                </div>
              </div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    {feature.included ? (
                      <Check className="h-5 w-5 text-success mr-3 flex-shrink-0" />
                    ) : (
                      <X className="h-5 w-5 text-text-secondary mr-3 flex-shrink-0" />
                    )}
                    <span className={feature.included ? "text-text-primary" : "text-text-secondary"}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
              
              <Button 
                variant={plan.buttonVariant}
                className={`w-full py-3 font-semibold ${
                  plan.popular 
                    ? "bg-primary hover:bg-blue-700 text-white" 
                    : plan.buttonVariant === "secondary"
                    ? "bg-gradient-to-r from-secondary to-accent hover:from-purple-700 hover:to-yellow-500 text-white"
                    : ""
                }`}
              >
                {plan.buttonText}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
