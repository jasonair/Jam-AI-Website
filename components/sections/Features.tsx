import { ArrowDownRight, Sparkles, MessageCircle, StickyNote } from 'lucide-react';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import GridBackground from '@/components/ui/GridBackground';

const features = [
  {
    icon: ArrowDownRight,
    title: 'Continue the conversation',
    subtitle: 'Create a child',
    description: 'Keep the context and continue chatting in a new branch. Your conversation flows naturally while staying organized.',
    color: 'bg-blue-500',
  },
  {
    icon: Sparkles,
    title: 'Expand on specific ideas',
    subtitle: 'Expand on this',
    description: 'Select any text and dive deeper into that specific topic. Focus on what matters without losing the bigger picture.',
    color: 'bg-purple-500',
  },
  {
    icon: MessageCircle,
    title: 'Get different perspectives',
    subtitle: 'Jam with this',
    description: 'Select text and ask questions with full context. Switch AI team members to get fresh takes from different specialists.',
    color: 'bg-green-500',
  },
  {
    icon: StickyNote,
    title: 'Save important insights',
    subtitle: 'Make a note',
    description: 'Break off key sections as standalone notes you can edit and build on. Never lose track of what matters.',
    color: 'bg-orange-500',
  },
];

export default function Features() {
  return (
    <GridBackground className="bg-gray-50 dark:bg-gray-900" opacity="subtle" fadeEdges>
      <Section>
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Four powerful ways to organize your conversations
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Every chat becomes a visual card you can branch, expand, and organize. No more endless scrolling — just clear, structured conversations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-8 border border-gray-200 dark:border-gray-700 hover:border-accent dark:hover:border-accent transition-all duration-300 hover:shadow-xl"
              >
                {/* Icon */}
                <div className={`inline-flex w-14 h-14 ${feature.color} rounded-xl items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-accent mb-1">{feature.subtitle}</p>
                    <h3 className="text-2xl font-bold">{feature.title}</h3>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional info */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            <span className="font-semibold">Titles auto-generate</span> for every conversation, and everything is fully editable. Your workspace adapts to how you think.
          </p>
        </div>
      </Container>
      </Section>
    </GridBackground>
  );
}
