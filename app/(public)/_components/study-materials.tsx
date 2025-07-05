import Image from "next/image";
import { Button } from "@/components/ui/button";

const studyMaterials = [
  {
    title: "Comprehensive Study Guides",
    description:
      "In-depth coverage of all subjects with easy-to-understand explanations and examples.",
    image:
      "https://images.pexels.com/photos/3808060/pexels-photo-3808060.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    title: "Video Lectures",
    description:
      "Engaging video content delivered by expert educators, covering complex topics in detail.",
    image:
      "https://images.pexels.com/photos/4491461/pexels-photo-4491461.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    title: "Practice Question Banks",
    description:
      "Extensive collection of practice questions with detailed solutions and explanations.",
    image:
      "https://imgs.search.brave.com/ouiDDcP-HaRnQ9tX-P8fP9r7PfDfnMBu0RAOuhQKTb0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTEz/NjU5MTAwNC9waG90/by9vbXItc2hlZXQt/YW5zd2VyLXNoZWV0/LmpwZz9iPTEmcz0x/NzA2NjdhJnc9MCZr/PTIwJmM9cWRtSFlv/bGwwRlBpQTVkS040/Mno3U3hlWjFxbGhO/YnNWNEVPYzQtUmxf/cz0",
  },
  {
    title: "Current Affairs Magazines",
    description:
      "Monthly compilations of important current events and their analysis for exam perspective.",
    image:
      "https://imgs.search.brave.com/BPhFWy_-hIVHQ4z6zmrV54uzai0GS3y7W3gEvYEEhnU/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvNTg5/OTcxMTg2L3Bob3Rv/L3BvbGl0aWNhbC1y/ZXBvcnQuanBnP3M9/NjEyeDYxMiZ3PTAm/az0yMCZjPWZTb1Rf/cXZwUjlNZWpIR2di/Ni1aakQzblQ2TmdH/RTVCd2tCNExTRkps/eDQ9",
  },
];

export default function StudyMaterials() {
  return (
    <section id="materials" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-3xl font-bold text-center text-gray-900">
          Our Study Materials
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {studyMaterials.map((material, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden"
            >
              <Image
                src={material.image}
                alt={material.title}
                width={300}
                height={200}
                className="w-full md:w-1/3 object-cover"
              />
              <div className="p-6 md:w-2/3">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {material.title}
                </h3>
                <p className="text-gray-600 mb-4">{material.description}</p>
                <Button
                  variant="outline"
                  className="text-[#3498db] border-[#3498db] hover:bg-[#3498db]/50"
                >
                  Learn More
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
