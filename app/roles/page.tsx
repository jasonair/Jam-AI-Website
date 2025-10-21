'use client';

import { ArrowUp } from 'lucide-react';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import GridBackground from '@/components/ui/GridBackground';
import { roleData } from './roleData';

const colorClasses: { [key: string]: string } = {
  purple: 'bg-purple-500',
  orange: 'bg-orange-500',
  pink: 'bg-pink-500',
  indigo: 'bg-indigo-500',
  green: 'bg-green-500',
  blue: 'bg-blue-500',
  cyan: 'bg-cyan-500',
  teal: 'bg-teal-500',
  yellow: 'bg-yellow-500',
  red: 'bg-red-500',
};

export default function RolesPage() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <GridBackground className="min-h-screen" opacity="subtle" variant="dots">
        <Section className="py-20">
          <Container>
            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="text-5xl sm:text-6xl font-bold mb-6">
                Complete List of AI Team Member Roles
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed">
                Here is the complete list of all <span className="font-semibold text-gray-900 dark:text-gray-100">137 AI Team Member roles</span> available in the system, organized by category, along with their descriptions.
              </p>
              <p className="text-lg text-gray-500 dark:text-gray-500 mt-4">
                Each role has 4 experience levels (Junior, Intermediate, Senior, Expert) with tailored system prompts that define the AI's expertise and approach for that role.
              </p>
            </div>

            {/* Quick Navigation */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-center mb-8">Quick Navigation</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {roleData.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      const element = document.getElementById(category.name.toLowerCase());
                      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium border border-gray-200 dark:border-gray-700 hover:border-accent dark:hover:border-accent hover:bg-accent/10 transition-all cursor-pointer"
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-16">
              {roleData.map((category, categoryIndex) => (
                <div key={categoryIndex} className="scroll-mt-20" id={category.name.toLowerCase()}>
                  <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">
                    {category.name}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.roles.map((role, roleIndex) => {
                      const Icon = role.icon;
                      return (
                        <div
                          key={roleIndex}
                          className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-900 p-6 border border-gray-200 dark:border-gray-800 hover:border-accent dark:hover:border-accent transition-all duration-300 hover:shadow-lg"
                        >
                          <div className="flex items-start gap-4">
                            <div className={`flex-shrink-0 w-12 h-12 ${colorClasses[role.color]} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 leading-tight">
                                {role.name}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                {role.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

          </Container>
        </Section>
      </GridBackground>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 z-50 p-4 bg-accent text-white rounded-full shadow-lg hover:bg-accent/90 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
        aria-label="Back to top"
      >
        <ArrowUp className="w-6 h-6" />
      </button>
    </div>
  );
}