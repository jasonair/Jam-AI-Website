'use client';

import { Code, PenTool, Search, ArrowRight } from 'lucide-react';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';

const teamMembers = [
  {
    icon: Code,
    role: 'Frontend Dev',
    color: 'bg-blue-500',
  },
  {
    icon: PenTool,
    role: 'UX Writer',
    color: 'bg-purple-500',
  },
  {
    icon: Search,
    role: 'Research Analyst',
    color: 'bg-green-500',
  },
];

export default function Team() {
  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing-section');
    pricingSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Section className="bg-white dark:bg-gray-950">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Meet your AI team
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Every node can have a <span className="font-semibold text-accent">Team Member</span> — a focused AI with a role like Frontend Dev, UX Writer, or Research Analyst.
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-500 mt-4">
            Experience levels (Junior → Senior → Lead) unlock as you upgrade.
          </p>
        </div>

        {/* Team member cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          {teamMembers.map((member, index) => {
            const Icon = member.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8 border border-gray-200 dark:border-gray-700 hover:border-accent dark:hover:border-accent transition-all duration-300 hover:shadow-xl"
              >
                <div className="text-center space-y-4">
                  <div className={`inline-flex w-16 h-16 ${member.color} rounded-xl items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold">{member.role}</h3>
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                    <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Junior</span>
                    <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Senior</span>
                    <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Lead</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button size="lg" onClick={scrollToPricing}>
            Explore Roles <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </Container>
    </Section>
  );
}
