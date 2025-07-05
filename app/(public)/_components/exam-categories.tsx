import { CheckCircle } from "lucide-react";

const examCategories = [
  {
    name: "UPSC Civil Services",
    exams: ["IAS", "IPS", "IFS", "Central Services"],
  },
  {
    name: "State Civil Services",
    exams: ["RAS", "State PSC", "State Administrative Services"],
  },
  {
    name: "Banking & Insurance",
    exams: ["IBPS PO", "SBI PO", "RBI Grade B", "NABARD"],
  },
  {
    name: "SSC & Railways",
    exams: ["SSC CGL", "SSC CHSL", "RRB NTPC", "RRB Group D"],
  },
];

export default function ExamCategories() {
  return (
    <section id="exams" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-3xl font-bold text-center text-gray-900">
          Exams We Cover
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {examCategories.map((category) => (
            <div
              key={category.name}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h3 className="text-xl font-semibold text-[#3498db] mb-4">
                {category.name}
              </h3>
              <ul className="space-y-2">
                {category.exams.map((exam) => (
                  <li key={exam} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>{exam}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
