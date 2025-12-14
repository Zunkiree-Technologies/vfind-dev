"use client";
import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "Is it really free?",
    answer: "Yes, 100% free for nurses. Forever. Employers pay to access our talent network—nurses never pay anything.",
  },
  {
    question: "What if there aren't many jobs in my area yet?",
    answer: "VFind is growing fast. By creating your profile now, you'll be discoverable when employers in your area join. Early profiles get more visibility.",
  },
  {
    question: "Do I have to be actively job hunting?",
    answer: "Not at all. Many nurses create profiles just to stay visible to opportunities. You control when and how you respond to employer interest.",
  },
  {
    question: "Can my current employer see my profile?",
    answer: "You're in full control. You can hide your profile from specific employers or set it to private until you're ready.",
  },
  {
    question: "I'm an international nurse. Will employers find me?",
    answer: "Yes! When you create your profile, you can indicate you need visa sponsorship. Employers looking to sponsor international nurses will find you in their searches.",
  },
  {
    question: "How long does signup take?",
    answer: "About 5 minutes. No resume upload required—you build your profile directly with your qualifications, experience, and preferences.",
  },
];

export const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 sm:py-20 bg-[#f5f5f7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Left side - Header */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-gray-400"></span>
              <span className="font-secondary text-sm text-gray-500">FAQ</span>
            </div>
            <h2 className="font-primary text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              Answers to your frequently
              <br />
              <span className="text-gray-400">asked questions</span>
            </h2>
          </div>

          {/* Right side - FAQ Accordion */}
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center gap-4 p-5 sm:p-6 text-left transition-colors duration-200"
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 ${
                    openIndex === index
                      ? "border-gray-300 bg-gray-50"
                      : "border-gray-200"
                  }`}>
                    {openIndex === index ? (
                      <Minus className="w-4 h-4 text-gray-500" />
                    ) : (
                      <Plus className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <span className="font-primary text-base sm:text-lg font-semibold text-gray-900">
                    {faq.question}
                  </span>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 pl-[4.5rem] font-secondary text-gray-500 text-sm sm:text-base leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
