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
                Traditional AI chat apps trap your ideas in long, linear conversations. Endlessly scrolling back through threads or searching for that one chat you had weeks ago. No way to break off important sections, gather insights across multiple chats, or make sense of it all in one space.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                <span className="font-bold text-blue-600 dark:text-blue-400">Jam AI</span> lets you break conversations into nodes, organize what matters, and see everything laid out visually — no more getting lost in the scroll.
              </p>
            </div>

            {/* Video */}
            <div className="relative">
              <div className="aspect-video rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-lg">
                <video
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                >
                  <source src="/videos/long-gpt-threads.mov" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
