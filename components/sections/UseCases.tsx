'use client';

import { Rocket, BookOpen, Palette, TrendingUp } from 'lucide-react';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';

const useCases = [
  {
    icon: Rocket,
    title: 'Building a startup',
    team: ['Sarah (Senior CEO)', 'Alex (Expert Swift Developer)', 'Maria (Intermediate Marketing Strategist)'],
    description: 'Chat with Sarah about company vision, get iOS development guidance from Alex, and refine your go-to-market strategy with Maria — all in one canvas.',
    color: 'bg-blue-500',
  },
  {
    icon: BookOpen,
    title: 'Healthcare research',
    team: ['James (Senior Healthcare Research Analyst)', 'Emma (Expert Data Scientist)', 'Lisa (Intermediate Technical Writer)'],
    description: 'Work with James to gather medical insights, consult Emma for statistical analysis, and collaborate with Lisa to document your findings.',
    color: 'bg-green-500',
  },
  {
    icon: Palette,
    title: 'E-commerce campaign',
    team: ['Sophie (Senior E-commerce UX Designer)', 'Tom (Expert Copywriter)', 'Rachel (Intermediate Digital Marketer)'],
    description: 'Brainstorm checkout flows with Sophie, craft product descriptions with Tom, and plan your ad campaigns with Rachel — see all perspectives at once.',
    color: 'bg-purple-500',
  },
  {
    icon: TrendingUp,
    title: 'Finance expansion',
    team: ['David (Expert Finance Business Analyst)', 'Nina (Senior Marketing Strategist)', 'Chris (Senior CPO)'],
    description: 'Get market analysis from David, growth strategies from Nina, and product roadmap guidance from Chris — all specialized in the finance industry.',
    color: 'bg-orange-500',
  },
];

export default function UseCases() {
  return (
    <Section className="bg-gray-50 dark:bg-gray-900">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            See your team in action
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Different projects need different expertise. Build the perfect team for any challenge.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-8 border border-gray-200 dark:border-gray-700 hover:border-accent dark:hover:border-accent transition-all duration-300 hover:shadow-xl"
              >
                {/* Icon */}
                <div className={`inline-flex w-16 h-16 ${useCase.color} rounded-xl items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold">{useCase.title}</h3>
                  
                  {/* Team members */}
                  <div className="flex flex-wrap gap-2">
                    {useCase.team.map((member, memberIndex) => (
                      <span
                        key={memberIndex}
                        className="px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full border border-accent/20"
                      >
                        {member}
                      </span>
                    ))}
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {useCase.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional info */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Mix and match team members to create the perfect combination for your unique workflow. Every project is different — your AI team should be too.
          </p>
        </div>
      </Container>
    </Section>
  );
}
