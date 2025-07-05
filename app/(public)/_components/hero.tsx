import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center">
        <div className="lg:w-1/2 lg:pr-10">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Master Government Exams with{" "}
            <span className="text-[#3498db]">RasPREP</span>
          </h1>
          <p className="mb-8 max-w-2xl text-xl text-gray-600">
            Comprehensive preparation for UPSC, IAS, RAS, and other competitive
            exams. Join thousands of successful candidates who achieved their
            dreams with RasPREP&lsquo;s expert guidance and cutting-edge learning
            platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="text-lg bg-[#3498db] hover:bg-[#2980b9]"
            >
              Start Free Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg border-[#3498db] text-[#3498db] hover:bg-[#ecf6fc]"
            >
              Explore Courses
            </Button>
          </div>
        </div>
        <div className="lg:w-1/2 mt-10 lg:mt-0">
          <Image
            src="https://images.pexels.com/photos/249360/pexels-photo-249360.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="Students preparing for government exams"
            width={600}
            height={400}
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}
