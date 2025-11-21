import Image from 'next/image';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import GridBackground from '@/components/ui/GridBackground';

const steps = [
  {
    number: '1',
    image: '/images/step-1-choose-team.jpg',
    title: 'Choose Your Team',
    description: 'Select specialist AI team members based on your project needs. Frontend Dev, UX Designer, Copywriter — pick the expertise you need.',
  },
  {
    number: '2',
    image: '/images/step-2-work-with-your-team.jpg',
    title: 'Work With Your Team',
    description: 'Chat with each team member in your visual workspace. See all their responses as nodes you can organize, compare, and build upon.',
  },
  {
    number: '3',
    image: '/images/step-3-see-the-bigger-picture.jpg',
    title: 'See the Bigger Picture',
    description: 'Multiple expert perspectives help you maintain context and spatial awareness. Never lose track of your ideas — see how everything connects in one visual workspace.',
  },
];

export default function HowItWorks() {
  return (
    <GridBackground className="bg-gray-50 dark:bg-gray-900" opacity="subtle" variant="dots">
      <Section>
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Chat with your whole team at once. It&apos;s that simple.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => {
              return (
                <div key={index} className="relative">
                  {/* Connector line */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-accent to-accent/30" />
                  )}

                  <div className="text-center space-y-4">
                    {/* Step number and image */}
                    <div className="relative w-full">
                      <div className="relative w-full aspect-video bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-accent overflow-hidden">
                        <Image
                          src={step.image}
                          alt={step.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                        />
                      </div>
                      <div className="absolute -top-2 -right-2 w-10 h-10 bg-accent text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg z-20">
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
    </GridBackground>
  );
}
