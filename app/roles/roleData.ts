import { 
  Users, Star, UserPlus, ClipboardList, DollarSign, BarChart3, Lightbulb, 
  Settings, TrendingUp, UserCheck, Cpu, Code, Brain, Apple, Link,
  Layers, LineChart, Server, Eye, MessageSquare, FlaskConical,
  Building, FileText, Book, Briefcase, Shield, Scale, Lock, CheckCircle,
  Hammer, Home, Palette, Image, Award, Play, Hand, Grid3X3, PenTool,
  Globe, Type, Box, Zap, Target, Package, GraduationCap, Heart,
  Activity, Wind, Sun, User, Sparkles, Camera, Film, Wand2, Mic,
  Search, Send, Mail, Monitor, Share2, Factory, Calculator, 
  TrendingDown, BookOpen, HelpCircle, Atom, Building2, Leaf, Moon
} from 'lucide-react';

interface Role {
  name: string;
  description: string;
  icon: any;
  color: string;
}

interface Category {
  name: string;
  roles: Role[];
}

export const roleData: Category[] = [
  {
    name: 'Business',
    roles: [
      { name: 'CEO (Chief Executive Officer)', description: 'Sets company vision, leads strategy, builds culture, and drives growth.', icon: UserCheck, color: 'purple' },
      { name: 'CPO (Chief Product Officer)', description: 'Owns product strategy, roadmap, and drives product-led growth.', icon: Star, color: 'orange' },
      { name: 'Co-Founder', description: 'Builds startup from ground up, shares vision, and wears multiple hats.', icon: Users, color: 'pink' },
      { name: 'Project Manager', description: 'Coordinates teams, manages timelines, and ensures successful project delivery.', icon: ClipboardList, color: 'indigo' },
      { name: 'Sales Representative', description: 'Builds relationships, identifies opportunities, and closes deals to drive revenue.', icon: DollarSign, color: 'green' },
      { name: 'Business Analyst', description: 'Analyzes business processes with Jam AI, gathers requirements, and bridges business and technical teams.', icon: BarChart3, color: 'blue' },
      { name: 'Strategy Consultant', description: 'Advises organizations on strategy using Jam AI, growth, and competitive positioning.', icon: Lightbulb, color: 'purple' },
      { name: 'Operations Manager', description: 'Manages operations, optimizes processes, and ensures efficient business execution.', icon: Settings, color: 'green' },
      { name: 'Business Development Manager', description: 'Identifies growth opportunities, builds partnerships, and drives business expansion.', icon: TrendingUp, color: 'orange' },
      { name: 'Customer Success Manager', description: 'Ensures customer satisfaction, drives adoption, and reduces churn through proactive support.', icon: UserCheck, color: 'cyan' },
    ]
  },
  {
    name: 'Technical',
    roles: [
      { name: 'CTO (Chief Technology Officer)', description: 'Leads technical strategy, architecture decisions, and engineering teams.', icon: Cpu, color: 'blue' },
      { name: 'PHP Developer', description: 'Builds web applications with PHP, Laravel, Symfony, and modern frameworks.', icon: Code, color: 'purple' },
      { name: 'AI/ML Engineer', description: 'Develops machine learning models, AI systems using Jam AI, and deploys ML solutions at scale.', icon: Brain, color: 'cyan' },
      { name: 'C++ Developer', description: 'Builds high-performance systems, game engines, and low-level software in C++.', icon: Code, color: 'blue' },
      { name: 'Swift/SwiftUI Developer', description: 'Develops iOS, macOS apps using Swift and SwiftUI with native Apple frameworks.', icon: Apple, color: 'orange' },
      { name: 'Python Developer', description: 'Builds applications, scripts, APIs, and data pipelines using Python.', icon: Code, color: 'green' },
      { name: 'Blockchain Developer', description: 'Builds decentralized applications, smart contracts, and blockchain solutions.', icon: Link, color: 'yellow' },
      { name: 'Full-Stack Engineer', description: 'Develops complete applications across frontend, backend, and databases using Jam AI.', icon: Layers, color: 'teal' },
      { name: 'Data Scientist', description: 'Analyzes data, builds models with Jam AI, and extracts insights using statistics and ML.', icon: LineChart, color: 'cyan' },
      { name: 'DevOps Engineer', description: 'Builds CI/CD pipelines with Jam AI, manages infrastructure, and ensures reliable deployments.', icon: Server, color: 'red' },
      { name: 'LLM Engineer', description: 'Builds and deploys LLM applications with Jam AI, integrates AI models, and optimizes inference.', icon: Brain, color: 'blue' },
      { name: 'MLOps Engineer', description: 'Builds ML infrastructure, automates model deployment, and ensures reliable ML operations.', icon: Settings, color: 'green' },
      { name: 'Computer Vision Engineer', description: 'Develops image and video AI systems using Jam AI for object detection, recognition, and visual understanding.', icon: Eye, color: 'cyan' },
      { name: 'NLP Engineer', description: 'Builds natural language processing systems with Jam AI for text understanding, generation, and analysis.', icon: MessageSquare, color: 'orange' },
      { name: 'AI Research Scientist', description: 'Conducts AI research using Jam AI, publishes papers, and advances the state of the art in machine learning.', icon: FlaskConical, color: 'indigo' },
      { name: 'ML Architect', description: 'Designs ML system architectures using Jam AI, selects technologies, and guides ML infrastructure strategy.', icon: Building, color: 'yellow' },
    ]
  },
  {
    name: 'Finance',
    roles: [
      { name: 'UK Accountant', description: 'Manages UK accounting, tax compliance, VAT, and financial reporting per UK GAAP.', icon: FileText, color: 'indigo' },
      { name: 'US Accountant', description: 'Manages US accounting, tax compliance, and financial reporting per US GAAP.', icon: FileText, color: 'blue' },
      { name: 'Personal Finance Advisor', description: 'Advises individuals on budgeting, saving, investing, and achieving personal financial goals.', icon: DollarSign, color: 'green' },
      { name: 'Startup CFO', description: 'Manages startup finances, fundraising, financial planning, and runway management.', icon: TrendingUp, color: 'purple' },
      { name: 'Investment Analyst', description: 'Analyzes investment opportunities, evaluates stocks, and provides investment recommendations.', icon: BarChart3, color: 'blue' },
      { name: 'Corporate Finance Manager', description: 'Manages corporate financial planning, analysis, budgeting, and strategic finance.', icon: Building2, color: 'indigo' },
      { name: 'Bookkeeper', description: 'Maintains financial records, manages accounts, and ensures accurate bookkeeping.', icon: Book, color: 'cyan' },
      { name: 'Tax Advisor', description: 'Provides tax planning, preparation, and optimization strategies for individuals and businesses.', icon: FileText, color: 'orange' },
      { name: 'Venture Capital Analyst', description: 'Evaluates startup investments, conducts due diligence, and supports venture capital decisions.', icon: Lightbulb, color: 'yellow' },
      { name: 'Financial Controller', description: 'Oversees accounting operations, financial reporting, and internal controls.', icon: Settings, color: 'red' },
      { name: 'Budget Analyst', description: 'Creates and manages budgets, forecasts financial needs, and monitors spending.', icon: Calculator, color: 'pink' },
      { name: 'Financial Planner', description: 'Helps clients plan for retirement, education, and long-term financial goals.', icon: Target, color: 'teal' },
    ]
  },
  {
    name: 'Legal',
    roles: [
      { name: 'Corporate Lawyer', description: 'Advises on corporate law, contracts, mergers & acquisitions, and business transactions.', icon: Briefcase, color: 'indigo' },
      { name: 'Startup Lawyer', description: 'Specializes in startup legal matters including formation, funding, equity, and compliance.', icon: Lightbulb, color: 'purple' },
      { name: 'Intellectual Property Lawyer', description: 'Protects intellectual property through patents, trademarks, copyrights, and IP litigation.', icon: Shield, color: 'blue' },
      { name: 'Employment Lawyer', description: 'Advises on employment law, workplace disputes, contracts, and labor compliance.', icon: Users, color: 'green' },
      { name: 'Contract Lawyer', description: 'Drafts, reviews, and negotiates contracts across various business contexts.', icon: FileText, color: 'orange' },
      { name: 'Privacy & Data Protection Lawyer', description: 'Advises on data privacy, GDPR, CCPA, and cybersecurity legal compliance.', icon: Lock, color: 'red' },
      { name: 'Compliance Officer', description: 'Ensures regulatory compliance, develops compliance programs, and manages risk.', icon: CheckCircle, color: 'cyan' },
      { name: 'Litigation Attorney', description: 'Represents clients in legal disputes, trials, and litigation proceedings.', icon: Hammer, color: 'yellow' },
      { name: 'General Counsel', description: 'Chief legal officer providing comprehensive legal oversight and strategic counsel.', icon: Building2, color: 'pink' },
      { name: 'Real Estate Lawyer', description: 'Handles real estate transactions, property law, leases, and real estate litigation.', icon: Home, color: 'teal' },
    ]
  },
  {
    name: 'Design',
    roles: [
      { name: 'UX Designer', description: 'Designs user-centered experiences through research, prototyping, and testing.', icon: Palette, color: 'pink' },
      { name: 'UI Designer', description: 'Designs beautiful user interfaces with focus on visual design, typography, and aesthetics.', icon: Image, color: 'blue' },
      { name: 'Product Designer', description: 'Designs end-to-end product experiences combining UX, UI, and interaction design.', icon: Layers, color: 'purple' },
      { name: 'Graphic Designer', description: 'Creates visual content for brands, marketing, print, and digital media.', icon: Image, color: 'pink' },
      { name: 'Brand Designer', description: 'Designs brand identities, logos, visual systems, and brand guidelines.', icon: Award, color: 'orange' },
      { name: 'Motion Designer', description: 'Creates animations, motion graphics, and dynamic visual content.', icon: Play, color: 'green' },
      { name: 'Interaction Designer', description: 'Designs interactive experiences focusing on user behavior, microinteractions, and flows.', icon: Hand, color: 'indigo' },
      { name: 'Design Systems Designer', description: 'Builds and maintains design systems, component libraries, and design standards.', icon: Grid3X3, color: 'cyan' },
      { name: 'Illustrator', description: 'Creates custom illustrations, icons, and visual storytelling elements.', icon: PenTool, color: 'red' },
      { name: 'Web Designer', description: 'Designs websites with focus on layout, responsive design, and web aesthetics.', icon: Globe, color: 'yellow' },
      { name: 'UX Writer', description: 'Crafts product copy, microcopy, and content that guides users through interfaces.', icon: Type, color: 'teal' },
      { name: '3D Designer', description: 'Creates 3D models, renders, and animations for products, games, and media.', icon: Box, color: 'purple' },
      { name: 'Animation Designer', description: 'Creates character and motion animations for games, films, and digital experiences.', icon: Play, color: 'green' },
      { name: 'UI Prototyper', description: 'Creates interactive prototypes, demonstrates user flows, and validates design concepts.', icon: Zap, color: 'orange' },
      { name: 'Accessibility Designer', description: 'Ensures inclusive design, implements accessibility standards, and advocates for all users.', icon: Users, color: 'blue' },
    ]
  },
  {
    name: 'Product',
    roles: [
      { name: 'Product Manager', description: 'Owns product roadmap, prioritizes features, and drives product strategy and execution.', icon: Star, color: 'blue' },
      { name: 'Technical Product Manager', description: 'Bridges product and engineering, manages technical products and platform features.', icon: Cpu, color: 'purple' },
      { name: 'Growth Product Manager', description: 'Focuses on user acquisition, activation, retention, and product-led growth.', icon: TrendingUp, color: 'green' },
      { name: 'AI Product Manager', description: 'Manages AI/ML products, understands model capabilities, and drives AI product strategy.', icon: Brain, color: 'cyan' },
      { name: 'Platform Product Manager', description: 'Builds platforms, APIs, and infrastructure products for developers and internal teams.', icon: Layers, color: 'orange' },
      { name: 'Data Product Manager', description: 'Manages data products, analytics tools, and data infrastructure for insights and decision-making.', icon: BarChart3, color: 'indigo' },
      { name: 'Consumer Product Manager', description: 'Builds consumer products focused on user experience, engagement, and delight.', icon: User, color: 'pink' },
      { name: 'B2B Product Manager', description: 'Manages enterprise and B2B products, understands business needs and complex workflows.', icon: Building2, color: 'red' },
      { name: 'Product Operations Manager', description: 'Optimizes product processes, tools, and operations to enable product teams.', icon: Settings, color: 'yellow' },
      { name: 'Product Analyst', description: 'Analyzes product data, provides insights, and supports data-driven product decisions.', icon: LineChart, color: 'teal' },
    ]
  },
  {
    name: 'AI',
    roles: [
      { name: 'Prompt Engineer', description: 'Designs and optimizes prompts for LLMs, creates prompt frameworks, and improves AI outputs.', icon: Type, color: 'purple' },
      { name: 'AI Safety Researcher', description: 'Researches AI alignment, safety, and robustness to ensure beneficial AI systems.', icon: Shield, color: 'red' },
      { name: 'AI Ethics Specialist', description: 'Ensures ethical AI development, addresses bias, fairness, and responsible AI practices.', icon: Scale, color: 'pink' },
      { name: 'AI Consultant', description: 'Advises organizations on AI strategy, identifies use cases, and guides AI transformation.', icon: UserCheck, color: 'teal' },
    ]
  },
  {
    name: 'Startup',
    roles: [
      { name: 'Startup Founder', description: 'Builds startups from zero to one, validates ideas, and achieves product-market fit.', icon: Lightbulb, color: 'purple' },
      { name: 'Venture Builder', description: 'Systematically builds and launches multiple startups, de-risks ideas, and creates ventures.', icon: Factory, color: 'blue' },
      { name: 'Startup Advisor', description: 'Advises startups on strategy, growth, fundraising, and helps founders avoid mistakes.', icon: UserCheck, color: 'green' },
      { name: 'Accelerator Mentor', description: 'Mentors startups in accelerators, provides guidance, and helps companies achieve milestones.', icon: TrendingUp, color: 'orange' },
      { name: 'Startup Growth Hacker', description: 'Drives rapid startup growth through creative experiments, viral loops, and growth tactics.', icon: TrendingUp, color: 'cyan' },
      { name: 'Startup Recruiter', description: 'Builds startup teams, recruits top talent, and helps companies hire in competitive markets.', icon: Users, color: 'pink' },
      { name: 'Pitch Deck Designer', description: 'Creates compelling pitch decks that help startups raise funding and communicate vision.', icon: Image, color: 'indigo' },
      { name: 'Startup Operations Manager', description: 'Manages startup operations, builds processes, and enables teams to execute efficiently.', icon: Settings, color: 'red' },
      { name: 'Early-Stage Investor', description: 'Invests in pre-seed and seed startups, evaluates founders, and supports portfolio companies.', icon: DollarSign, color: 'yellow' },
      { name: 'Startup Community Builder', description: 'Builds startup ecosystems, runs events, and connects founders with resources and networks.', icon: Users, color: 'teal' },
    ]
  },
  {
    name: 'Creative',
    roles: [
      { name: 'Content Writer', description: 'Creates engaging content for blogs, marketing, documentation, and social media using Jam AI.', icon: FileText, color: 'purple' },
      { name: 'Copywriter', description: 'Writes persuasive copy for ads, websites, emails, and marketing materials that drives action using Jam AI.', icon: PenTool, color: 'red' },
      { name: 'Video Editor', description: 'Edits videos for storytelling, creates engaging content, and produces polished video productions.', icon: Film, color: 'purple' },
      { name: 'Photographer', description: 'Captures compelling images, tells visual stories, and creates photography for brands and media.', icon: Camera, color: 'blue' },
      { name: 'Creative Director', description: 'Leads creative vision, directs campaigns, and oversees creative teams and projects.', icon: Wand2, color: 'orange' },
      { name: 'Screenwriter', description: 'Writes scripts for film, TV, and video content with compelling narratives and dialogue.', icon: FileText, color: 'green' },
      { name: 'Podcast Producer', description: 'Produces podcasts from concept to publication, handles audio production and storytelling.', icon: Mic, color: 'cyan' },
      { name: 'Art Director', description: 'Directs visual style and creative execution for campaigns, brands, and media projects.', icon: Palette, color: 'pink' },
      { name: 'Voice Actor', description: 'Performs voice work for commercials, animations, audiobooks, and multimedia projects.', icon: Mic, color: 'indigo' },
      { name: 'Music Producer', description: 'Creates, produces, and engineers music across genres for artists and media projects.', icon: Mic, color: 'yellow' },
    ]
  },
  {
    name: 'Research',
    roles: [
      { name: 'Research Analyst', description: 'Conducts in-depth research, analyzes data, and delivers actionable insights across various domains.', icon: Search, color: 'blue' },
      { name: 'Academic Researcher', description: 'Conducts scholarly research, publishes papers, and contributes to academic knowledge.', icon: GraduationCap, color: 'purple' },
      { name: 'Market Researcher', description: 'Studies market trends, consumer behavior, and competitive landscape to inform business strategy.', icon: BarChart3, color: 'green' },
      { name: 'UX Researcher', description: 'Studies user behavior, conducts usability testing, and provides insights to improve user experience.', icon: HelpCircle, color: 'orange' },
      { name: 'Competitive Intelligence Analyst', description: 'Monitors competitors, analyzes industry trends, and provides strategic intelligence.', icon: Eye, color: 'indigo' },
      { name: 'Scientific Researcher', description: 'Conducts scientific research, runs experiments, and advances knowledge in natural sciences.', icon: Atom, color: 'cyan' },
      { name: 'Policy Researcher', description: 'Analyzes policies, evaluates impacts, and provides evidence-based recommendations for policy making.', icon: Building, color: 'red' },
      { name: 'User Researcher', description: 'Studies user needs, behaviors, and motivations to inform product and service design.', icon: Users, color: 'pink' },
      { name: 'Trends Researcher', description: 'Identifies emerging trends, forecasts future developments, and provides trend insights.', icon: TrendingUp, color: 'yellow' },
      { name: 'Consumer Insights Researcher', description: 'Studies consumer behavior, conducts research, and provides actionable consumer insights.', icon: HelpCircle, color: 'teal' },
    ]
  },
  {
    name: 'Marketing',
    roles: [
      { name: 'Digital Marketer', description: 'Plans and executes digital marketing campaigns across channels.', icon: TrendingUp, color: 'orange' },
      { name: 'SEO Specialist', description: 'Optimizes websites for search engines, conducts keyword research, and improves organic rankings.', icon: Search, color: 'green' },
      { name: 'Content Marketer', description: 'Creates and distributes valuable content to attract and engage target audiences.', icon: FileText, color: 'purple' },
      { name: 'Social Media Manager', description: 'Manages social media presence, creates engaging content, and builds online communities.', icon: Share2, color: 'blue' },
      { name: 'Email Marketer', description: 'Creates email campaigns, nurtures leads, and drives conversions through email marketing.', icon: Mail, color: 'red' },
      { name: 'Growth Marketer', description: 'Drives rapid growth through experimentation, data analysis, and optimization across channels.', icon: TrendingUp, color: 'cyan' },
      { name: 'Brand Strategist', description: 'Defines brand positioning, messaging, and identity to differentiate in the market.', icon: Sparkles, color: 'yellow' },
      { name: 'Performance Marketer', description: 'Manages paid advertising campaigns focused on measurable ROI and performance metrics.', icon: Target, color: 'orange' },
      { name: 'Product Marketer', description: 'Positions products in market, launches new features, and enables sales with messaging and collateral.', icon: Package, color: 'pink' },
      { name: 'Community Manager', description: 'Builds and manages online communities, engages members, and fosters brand advocacy.', icon: Users, color: 'indigo' },
    ]
  },
  {
    name: 'Education',
    roles: [
      { name: 'Math Teacher', description: 'Teaches mathematics from basic arithmetic to advanced calculus and helps students understand mathematical concepts.', icon: Calculator, color: 'blue' },
      { name: 'Science Teacher', description: 'Teaches sciences including biology, chemistry, physics, and helps students explore scientific concepts.', icon: FlaskConical, color: 'green' },
      { name: 'English Teacher', description: 'Teaches English language arts, literature, writing, and reading comprehension.', icon: Book, color: 'purple' },
      { name: 'History Teacher', description: 'Teaches history, social studies, and helps students understand historical events and their context.', icon: Building, color: 'orange' },
      { name: 'Homework Tutor', description: 'Helps students with homework across all subjects, explains concepts, and guides learning.', icon: BookOpen, color: 'cyan' },
      { name: 'Test Prep Specialist', description: 'Prepares students for standardized tests like SAT, ACT, GRE, GMAT, and other exams.', icon: CheckCircle, color: 'red' },
      { name: 'Online Course Instructor', description: 'Creates and teaches online courses, develops digital learning content, and engages remote students.', icon: Monitor, color: 'pink' },
      { name: 'College Admissions Counselor', description: 'Guides students through college applications, essay writing, and admissions process.', icon: GraduationCap, color: 'indigo' },
      { name: 'Language Teacher', description: 'Teaches foreign languages and helps students achieve fluency through immersive learning.', icon: Globe, color: 'yellow' },
      { name: 'Special Education Teacher', description: 'Teaches students with special needs, creates individualized education plans, and provides adaptive learning.', icon: Heart, color: 'teal' },
    ]
  },
  {
    name: 'Healthcare',
    roles: [
      { name: 'Wellness Coach', description: 'Guides holistic wellness including mental, physical, and emotional health. Always recommends consulting qualified healthcare professionals for medical concerns.', icon: Heart, color: 'pink' },
      { name: 'Mental Health Coach', description: 'Supports mental wellbeing, stress management, and emotional health. Always recommends professional mental health services when appropriate.', icon: Brain, color: 'purple' },
      { name: 'Fitness Coach', description: 'Provides fitness guidance, workout plans, and exercise motivation. Always recommends medical clearance before starting new fitness programs.', icon: Activity, color: 'green' },
      { name: 'Nutrition Coach', description: 'Provides nutrition guidance, healthy eating advice, and dietary support. Always recommends consulting registered dietitians or nutritionists for personalized plans.', icon: Leaf, color: 'cyan' },
      { name: 'Sleep Coach', description: 'Provides sleep hygiene guidance and rest optimization strategies. Always recommends consulting sleep specialists for sleep disorders.', icon: Moon, color: 'indigo' },
      { name: 'Stress Management Coach', description: 'Teaches stress reduction techniques, mindfulness, and relaxation strategies. Always recommends professional help for chronic stress or anxiety.', icon: Wind, color: 'blue' },
      { name: 'Mindfulness Coach', description: 'Teaches mindfulness meditation, present-moment awareness, and contemplative practices for wellbeing.', icon: Sun, color: 'yellow' },
      { name: 'Life Coach', description: 'Supports personal growth, goal achievement, and life transitions. Always distinguishes coaching from therapy.', icon: User, color: 'orange' },
      { name: 'Yoga Instructor', description: 'Teaches yoga practice for physical flexibility, mental clarity, and overall wellbeing. Always recommends medical clearance for health conditions.', icon: Users, color: 'teal' },
      { name: 'Habit Coach', description: 'Helps build positive habits, break negative patterns, and create sustainable behavior change.', icon: CheckCircle, color: 'red' },
    ]
  },
];