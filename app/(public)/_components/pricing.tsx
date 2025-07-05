import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
    {
        name: "Basic",
        price: "₹999/month",
        features: [
            "Access to study materials",
            "Recorded video lectures",
            "Weekly mock tests",
            "Basic performance analytics",
        ],
    },
    {
        name: "Premium",
        price: "₹1999/month",
        features: [
            "All Basic features",
            "Live classes",
            "Personalized study plan",
            "Daily current affairs updates",
            "Doubt clearing sessions",
        ],
    },
    {
        name: "Ultimate",
        price: "₹2999/month",
        features: [
            "All Premium features",
            "One-on-one mentoring",
            "Interview preparation",
            "Advanced performance analytics",
            "Exclusive study groups",
        ],
    },
];

export default function Pricing() {
    return (
        <section id="pricing" className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <h2 className="mb-12 text-3xl font-bold text-center text-gray-900">
                    Choose Your Plan
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className="bg-white rounded-lg shadow-md p-8 flex flex-col"
                        >
                            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                                {plan.name}
                            </h3>
                            <p className="text-4xl font-bold text-[#3498db] mb-6">
                                {plan.price}
                            </p>
                            <ul className="mb-8 flex-grow">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="flex items-center mb-2">
                                        <Check className="h-5 w-5 text-green-500 mr-2" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <Button className="w-full bg-[#3498db] text-white hover:bg-[#3498db]">
                                Get Started
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
