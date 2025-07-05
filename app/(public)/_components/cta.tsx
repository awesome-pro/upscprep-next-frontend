import { Button } from "@/components/ui/button";

export default function CTA() {
  return (
    <section className="bg-[#3498db] py-20 text-center text-white">
      <div className="container mx-auto px-4">
        <h2 className="mb-4 text-3xl font-bold">
          Ready to Start Your Success Journey?
        </h2>
        <p className="mb-8 text-xl max-w-2xl mx-auto">
          Join RasPREP today and take the first step towards your dream career
          in civil services. Start your free trial now and experience the
          difference our expert-led, comprehensive preparation can make in your
          exam success.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            size="lg"
            variant="secondary"
            className="text-lg border-2 border-white text-white bg-[#3498db] hover:bg-rose-100"
          >
            Start Free Trial
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="text-lg border-white text-[#3498db] hover:bg-[#3498db]"
          >
            Schedule a Demo
          </Button>
        </div>
      </div>
    </section>
  );
}
