
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
const testimonials = [
  {
    name: "Priya Sharma",
    role: "UPSC 2022 AIR 5",
    content:
      "RasPREP was instrumental in my UPSC success. The comprehensive study material, daily current affairs updates, and mock tests were spot on! The personalized feedback helped me focus on my weak areas and improve rapidly.",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    name: "Rahul Verma",
    role: "IAS 2023 AIR 12",
    content:
      "I owe my success to RasPREP. The structured study plan and video lectures by experienced faculty made complex topics easy to understand. The doubt clearing sessions were particularly helpful in my preparation journey.",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    name: "Ananya Patel",
    role: "RAS 2023 Rank 8",
    content:
      "RasPREP's Rajasthan-specific content and mock interview sessions gave me an edge in the RAS exam. The current affairs magazine and daily quizzes kept me updated with the latest happenings. Highly recommended for all RAS aspirants!",
    image: "/placeholder.svg?height=100&width=100",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-3xl font-bold text-center text-gray-900">
          Success Stories
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="rounded-lg bg-white p-6 shadow-md"
            >
              <p className="mb-4 text-gray-600 italic">
                &quot;{testimonial.content}&quot;
              </p>
              <div className="flex items-center">
                <Avatar>
                  <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="ml-4">
                  <p className="font-semibold text-gray-900">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-[#3498db]">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
