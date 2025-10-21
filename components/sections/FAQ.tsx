'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import { cn } from '@/lib/utils';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'What are "credits"?',
    answer: 'Credits measure AI tokens used — each message, generation, or analysis consumes tokens based on length and complexity. They refresh monthly.',
  },
  {
    question: 'Do unused credits roll over?',
    answer: 'No. Each month brings a fresh batch.',
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Absolutely. Manage billing directly in your dashboard — no emails, no friction.',
  },
  {
    question: 'Does Jam AI work offline?',
    answer: 'Not currently, but we plan to add support for local models in the future, which will enable offline functionality.',
  },
  {
    question: 'What platforms are supported?',
    answer: 'macOS now. Windows and web coming soon.',
  },
];

function FAQAccordion({ faq, isOpen, onClick }: { faq: FAQItem; isOpen: boolean; onClick: () => void }) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <button
        onClick={onClick}
        className="w-full py-6 flex items-center justify-between text-left hover:text-accent transition-colors duration-200"
      >
        <span className="text-lg font-semibold pr-8">{faq.question}</span>
        <ChevronDown
          className={cn(
            'w-5 h-5 text-accent flex-shrink-0 transition-transform duration-300',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      <div
        className={cn(
          'overflow-hidden transition-all duration-300',
          isOpen ? 'max-h-96 pb-6' : 'max-h-0'
        )}
      >
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          {faq.answer}
        </p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <Section className="bg-white dark:bg-gray-950">
      <Container size="md">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-0">
          {faqs.map((faq, index) => (
            <FAQAccordion
              key={index}
              faq={faq}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
