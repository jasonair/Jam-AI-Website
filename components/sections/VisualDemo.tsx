import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';

export default function VisualDemo() {
  return (
    <Section className="bg-gray-50 dark:bg-gray-900">
      <Container>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image Placeholder */}
            <div className="relative order-2 lg:order-1">
              <div className="aspect-video bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center shadow-xl">
                <p className="text-gray-400 dark:text-gray-500 text-sm">
                  Add your visual demo image here
                </p>
              </div>
            </div>

            {/* Text Content */}
            <div className="space-y-6 order-1 lg:order-2">
              <h2 className="text-3xl sm:text-4xl font-bold">
                Every conversation becomes a node
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Chat messages transform into visual nodes you can organize, branch, and connect. See your entire thought process laid out in front of you — no more endless scrolling.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
