import { Network, Users, Zap, Lock } from 'lucide-react';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';

const values = [
  {
    icon: Network,
    title: 'Map your thinking',
    description: 'Conversations become connected nodes you can see at once — a visual trail of your ideas.',
  },
  {
    icon: Users,
    title: 'Build your AI team',
    description: 'Choose from specialist AI team members with different experience levels. Work like you already do — just with infinite collaborators.',
  },
  {
    icon: Zap,
    title: 'Stay in flow',
    description: 'No clutter, no endless threads. Just a clean, visual workspace that keeps up with your pace of thought.',
  },
  {
    icon: Lock,
    title: 'Own your work',
    description: 'Your data stays yours. Choose light or dark mode, and maintain full control over your workspace and conversations.',
  },
];

export default function Value() {
  return (
    <Section id="value-section" className="bg-white dark:bg-gray-950">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Why Jam AI
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div
                key={index}
                className="group p-8 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-accent dark:hover:border-accent transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center group-hover:bg-accent group-hover:scale-110 transition-all duration-300">
                    <Icon className="w-6 h-6 text-accent group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {value.description}
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
