'use client';

import { Code, ArrowRight, Palette, BarChart3, FileText, Brain, Cpu, Users, Megaphone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';

const teamMembers = [
  {
    icon: Code,
    name: 'Sarah',
    role: 'Frontend Dev',
    description: 'React, Vue, and modern web development',
    color: 'bg-blue-500',
    level: 'Expert',
  },
  {
    icon: Cpu,
    name: 'Marcus',
    role: 'Backend Dev',
    description: 'APIs, databases, and server architecture',
    color: 'bg-indigo-500',
    level: 'Sr',
  },
  {
    icon: Palette,
    name: 'Emma',
    role: 'UX Designer',
    description: 'User flows, wireframes, and interfaces',
    color: 'bg-pink-500',
    level: 'Expert',
  },
  {
    icon: FileText,
    name: 'Alex',
    role: 'Content Writer',
    description: 'Creates engaging content for blogs, marketing, documentation, and social media',
    color: 'bg-purple-500',
    level: 'Jr',
  },
  {
    icon: BarChart3,
    name: 'Jordan',
    role: 'Data Scientist',
    description: 'Analyzes data, builds models, and extracts insights using statistics and ML',
    color: 'bg-blue-400',
    level: 'Expert',
  },
  {
    icon: Brain,
    name: 'Priya',
    role: 'AI/ML Engineer',
    description: 'Develops machine learning models, AI systems, and deploys ML solutions at scale',
    color: 'bg-blue-300',
    level: 'Sr',
  },
  {
    icon: Megaphone,
    name: 'Tyler',
    role: 'Digital Marketer',
    description: 'Plans and executes digital marketing campaigns across channels',
    color: 'bg-orange-400',
    level: 'Int',
  },
  {
    icon: Users,
    name: 'Maya',
    role: 'Co-Founder',
    description: 'Builds startup from ground up, shares vision, and wears multiple hats',
    color: 'bg-pink-300',
    level: 'Expert',
  },
];

export default function Team() {
  const router = useRouter();

  return (
    <Section className="bg-white dark:bg-gray-950">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Meet your AI team
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Choose from <span className="font-semibold text-gray-900 dark:text-gray-100">137 specialist roles</span> across 13 categories. Name each team member, pick their experience level, and optionally specialize them by industry — like a Healthcare Software Engineer or Finance Marketing Strategist.
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-500 mt-4">
            4 experience levels: Junior → Intermediate → Senior → Expert (higher levels unlock as you upgrade)
          </p>
        </div>

        {/* Team member cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-12">
          {teamMembers.map((member, index) => {
            const Icon = member.icon;
            const levels = ['Jr', 'Int', 'Sr', 'Expert'];
            const activeLevelIndex = levels.indexOf(member.level);
            
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 border border-gray-200 dark:border-gray-700 hover:border-accent dark:hover:border-accent transition-all duration-300 hover:shadow-xl flex flex-col"
              >
                <div className="text-center space-y-3 flex-grow flex flex-col">
                  <div className={`inline-flex w-14 h-14 ${member.color} rounded-xl items-center justify-center group-hover:scale-110 transition-transform duration-300 mx-auto`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-semibold text-accent mb-1">{member.name}</p>
                    <h3 className="text-lg font-semibold mb-1">{member.role}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{member.description}</p>
                  </div>
                  <div className="flex items-center justify-center gap-1 text-xs text-gray-500 pt-2 mt-auto">
                    {levels.map((level, idx) => (
                      <span 
                        key={level}
                        className={`px-2 py-1 rounded text-xs ${
                          level === member.level
                            ? 'bg-accent text-white font-medium' 
                            : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      >
                        {level}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Categories */}
        <div className="mt-16 mb-12">
          <h3 className="text-2xl font-bold text-center mb-8">Across multiple fields and specialties</h3>
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {['Business', 'Creative', 'Technical', 'Research', 'Marketing', 'Design', 'Education', 'Healthcare', 'Legal', 'Finance', 'Product', 'AI', 'Startup'].map((category, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium border border-gray-200 dark:border-gray-700"
              >
                {category}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button size="lg" onClick={() => router.push('/roles')}>
            Explore All Roles <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </Container>
    </Section>
  );
}
