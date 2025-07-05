import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion";
  
  const faqs = [
    {
      question: "How does RasPREP differ from other online learning platforms?",
      answer:
        "RasPREP specializes in government exam preparation, offering a comprehensive approach with expert-curated content, personalized study plans, and advanced performance analytics. Our focus on current affairs and exam-specific strategies sets us apart.",
    },
    {
      question: "Can I access RasPREP content on mobile devices?",
      answer:
        "Yes, RasPREP is fully responsive and can be accessed on smartphones and tablets. We also offer a mobile app for both Android and iOS devices, allowing you to study on-the-go.",
    },
    {
      question: "How often is the study material updated?",
      answer:
        "Our study material is regularly updated to reflect the latest exam patterns and syllabus changes. Current affairs are updated daily, and other content is reviewed and refreshed on a monthly basis.",
    },
    {
      question: "Do you offer any free resources or trial period?",
      answer:
        "Yes, we offer a 7-day free trial that gives you access to select study materials and features. Additionally, we provide some free resources like daily current affairs quizzes and basic study guides.",
    },
    {
      question:
        "What kind of support do you offer if I have questions or face issues?",
      answer:
        "We offer 24/7 customer support via chat and email. For academic queries, we have regular doubt clearing sessions with our expert faculty. Premium and Ultimate plan subscribers also get access to one-on-one mentoring sessions.",
    },
  ];
  
  export default function FAQ() {
    return (
      <section id="faq" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-3xl font-bold text-center text-gray-900">
            Frequently Asked Questions
          </h2>
          <Accordion
            type="single"
            collapsible
            className="w-full max-w-3xl mx-auto"
          >
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    );
  }
  