import {
    Book,
    Video,
    Users,
    Award,
    Calendar,
    Zap,
    BarChart,
    MessageSquare,
  } from "lucide-react";
  
  const features = [
    {
      name: "Comprehensive Study Material",
      description:
        "Access a vast library of up-to-date content covering all exam topics, curated by expert educators.",
      icon: Book,
    },
    {
      name: "Live & Recorded Classes",
      description:
        "Learn from top educators through engaging live and recorded video lessons, available 24/7.",
      icon: Video,
    },
    {
      name: "Mock Tests & Quizzes",
      description:
        "Practice with realistic mock exams and topic-wise quizzes to gauge and improve your preparation.",
      icon: Users,
    },
    {
      name: "Personalized Feedback",
      description:
        "Receive detailed performance analysis and tailored feedback to focus on your improvement areas.",
      icon: Award,
    },
    {
      name: "Structured Study Plans",
      description:
        "Follow customized study schedules designed to optimize your preparation and time management.",
      icon: Calendar,
    },
    {
      name: "Current Affairs Updates",
      description:
        "Stay informed with daily current affairs updates and analysis relevant to your exams.",
      icon: Zap,
    },
    {
      name: "Performance Analytics",
      description:
        "Track your progress with advanced analytics and compare your performance with peers.",
      icon: BarChart,
    },
    {
      name: "Doubt Clearing Sessions",
      description:
        "Get your questions answered by experts in regular doubt clearing sessions and forums.",
      icon: MessageSquare,
    },
  ];
  
  export default function Features() {
    return (
      <section id="features" className="py-20 bg-[#3498db]/10">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-3xl font-bold text-center text-gray-900">
            Why Choose RasPREP?
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#3498db]/10 text-[#3498db] mb-4">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {feature.name}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  