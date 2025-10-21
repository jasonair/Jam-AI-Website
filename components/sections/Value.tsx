import { Users, Brain, Network, Lightbulb } from 'lucide-react';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import GridBackground from '@/components/ui/GridBackground';

const values = [
  {
    icon: Users,
    title: 'Name your specialists',
    description: 'Give each AI team member a unique name to keep track of who you\'re working with. Choose from 137 specialist roles and optionally specialize by industry.',
  },
  {
    icon: Brain,
    title: 'Multiple perspectives',
    description: 'Different team members bring different viewpoints. See your challenges from every angle and discover solutions you wouldn\'t find alone.',
  },
  {
    icon: Network,
    title: 'All in one workspace',
    description: 'Chat with your entire team in a shared visual canvas. Drag, organize, and compare responses from different experts side by side.',
  },
  {
    icon: Lightbulb,
    title: 'Customize expertise',
    description: 'Choose experience levels from Junior to Expert. Specialize roles by industry — create a Healthcare Software Engineer or Finance Marketing Strategist.',
  },
];

export default function Value() {
  return (
    <GridBackground className="bg-white dark:bg-gray-950" opacity="subtle" variant="dots">
      <Section id="value-section">
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
    </GridBackground>
  );
}
