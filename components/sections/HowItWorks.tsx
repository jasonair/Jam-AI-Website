import { Users, Network, Lightbulb } from 'lucide-react';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';

const steps = [
  {
    number: '1',
    icon: Users,
    title: 'Choose Your Team',
    description: 'Select specialist AI team members based on your project needs. Frontend Dev, UX Designer, Copywriter — pick the expertise you need.',
  },
  {
    number: '2',
    icon: Network,
    title: 'Work With Your Team',
    description: 'Chat with each team member in your visual workspace. See all their responses as nodes you can organize, compare, and build upon.',
  },
  {
    number: '3',
    icon: Lightbulb,
    title: 'Get Better Results',
    description: 'Multiple expert viewpoints lead to richer solutions. See your ideas evolve with input from specialists across different domains.',
  },
];

export default function HowItWorks() {
  return (
    <Section className="bg-gray-50 dark:bg-gray-900">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Chat with your whole team at once. It's that simple.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-accent to-accent/30" />
                )}

                <div className="text-center space-y-4">
                  {/* Step number and icon */}
                  <div className="relative inline-flex items-center justify-center">
                    <div className="w-32 h-32 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-accent flex items-center justify-center relative z-10">
                      <Icon className="w-12 h-12 text-accent" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-accent text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                      {step.number}
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-2xl font-bold mb-2">
                      Step {step.number} — {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
