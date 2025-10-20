import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';

export default function Problem() {
  return (
    <Section className="bg-white dark:bg-gray-950">
      <Container>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold">
                Lost in endless threads?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Traditional AI chat apps trap your ideas in long, linear conversations. Endlessly scrolling back through threads. No way to break off important sections, gather insights across multiple chats, or make sense of it all in one space.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Jam AI lets you break conversations into nodes, organize what matters, and see everything laid out visually — no more getting lost in the scroll.
              </p>
            </div>

            {/* Image Placeholder */}
            <div className="relative">
              <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center">
                <p className="text-gray-400 dark:text-gray-500 text-sm">
                  Add your image here
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
