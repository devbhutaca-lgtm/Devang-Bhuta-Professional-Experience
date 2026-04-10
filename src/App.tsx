import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import { 
  Github, 
  Linkedin, 
  Mail, 
  Download, 
  ExternalLink, 
  ChevronRight, 
  Briefcase, 
  GraduationCap, 
  Code2, 
  Cpu, 
  Rocket, 
  Users, 
  BarChart3, 
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';

// --- Data ---

const EXPERIENCE = [
  {
    company: "TELUS",
    logo: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=400&auto=format&fit=crop",
    role: "Senior Technical Product Manager (Digital Strategy & AI)",
    period: "Mar 2019 – Present",
    location: "Greater Toronto Area, ON",
    achievements: [
      "Spearheaded the integration of strategic partners into the TELUS ecosystem; utilized aggregated customer data and behavioral patterns to align partner offerings, driving significant growth in corporate KPIs.",
      "Led the product strategy for Subscription on Demand and the Loyalty & Referral platforms, creating high-frequency engagement loops and personalized rewards for a multi-million subscriber base.",
      "Managed products that combine data from various internal and external sources; leveraged AI to build dynamic customer segments for hyper-targeted marketing and retention campaigns.",
      "Conceived and shipped a RAG-based Resolution Copilot; integrated real-time retrieval to surface policies and solutions, reducing customer friction and escalation volume by 85%.",
      "Designed and launched TELUS’s first unified subscription platform, generating $8M ARR in year one and $5M in annual cost savings.",
      "Re-engineered legacy systems into real-time microservices architecture, boosting productivity by 40% and cutting turnaround time from 24 hours to near-real-time."
    ]
  },
  {
    company: "Aurionpro",
    logo: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=400&auto=format&fit=crop",
    role: "Product Manager (Enterprise SaaS & Platforms)",
    period: "Jan 2012 – Jun 2018",
    location: "Asia, Europe, USA",
    achievements: [
      "Launched SCMProfit, a digital supply chain suite deployed in 15+ countries, streamlining global operations and generating $12M+ in revenue.",
      "Architected and shipped secure payment platforms and enterprise Cybersecurity Platforms, achieving a 94% transaction success rate and reducing security incident rates by 30%.",
      "Managed C-suite relationships across multiple geographies to define requirements and GTM strategy for global digital initiatives."
    ]
  },
  {
    company: "Infosys",
    logo: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=400&auto=format&fit=crop",
    role: "Software Engineer & Business Process Lead",
    period: "Jun 2006 – Sep 2007",
    location: "Pune, India",
    achievements: [
      "Developed end-to-end enterprise software solutions using Java, Oracle, C++, and SQL for large-scale financial and retail clients.",
      "Designed backend database schemas and optimized complex queries to improve system response times for high-volume transaction environments.",
      "Led business process analysis and optimization initiatives, identifying performance bottlenecks and delivering measurable system efficiency improvements."
    ]
  }
];

const PROJECTS = [
  {
    title: "Data Engineering Cleanroom",
    description: "Architected a secure data cleanroom solution for privacy-compliant data collaboration and advanced analytics.",
    tags: ["Data Engineering", "Privacy", "Security"],
    impact: "Enabled secure multi-party computation and insights while maintaining 100% data privacy compliance.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "AI-Driven Segmentation",
    description: "Developed an AI engine to aggregate multi-source behavioral data and generate hyper-targeted customer segments.",
    tags: ["AI/ML", "Big Data", "Personalization"],
    impact: "Drove significant uplift in marketing conversion rates and customer retention through precision targeting.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "Strategic Partnership Stream",
    description: "Integrated global partners like WestJet and TLC into the TELUS ecosystem using robust identity principles and MFA frameworks.",
    tags: ["Partnerships", "Identity", "Compliance"],
    impact: "Leveraged customer behaviors to drive key KPIs and established a secure, scalable framework for ecosystem growth.",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop"
  },
  {
    title: "Unified Subscription Platform",
    description: "Designed and launched TELUS’s first unified subscription platform, integrating complex billing and partner ecosystems.",
    tags: ["SaaS", "Payments", "Architecture"],
    impact: "Generated $8M ARR in year one and $5M in annual cost savings.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop"
  }
];

const VIBE_PROJECTS = [
  {
    title: "Personal Black Box",
    description: "An AI-powered safety app for children that triggers SOS alerts, shares real-time location with emergency contacts, and initiates automated video recording during safety events.",
    tags: ["AI", "Safety", "Real-time"],
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "The Wholesome Pantry",
    description: "AI-driven subscription health platform providing personalized, healthy meal choices based on user dietary preferences.",
    tags: ["AI", "HealthTech", "SaaS"],
    image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Warranted",
    description: "An intelligent customer warranty manager providing seamless, automated access to customer care and claims processing.",
    tags: ["AI", "Automation", "Customer Care"],
    image: "https://images.unsplash.com/photo-1586769852044-692d6e3703f0?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Nutri-Scan",
    description: "A mobile AI tool that scans product barcodes to provide a health score and suggests healthier alternatives in real-time.",
    tags: ["AI", "Vision", "Health"],
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Reviewed",
    description: "A high-value purchase platform that provides AI-aggregated reviews and connects prospective buyers with actual verified customers.",
    tags: ["AI", "E-commerce", "Trust"],
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "AI Course Builder",
    description: "A custom learning platform that generates tailored educational courses based on individual schedules and time commitments.",
    tags: ["AI", "EdTech", "Personalization"],
    image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Little Wizards",
    description: "An educational AI application helping children build basic financial literacy and money management skills.",
    tags: ["AI", "FinTech", "Education"],
    image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Expense Tracker",
    description: "An intelligent assistant that ingests bank statements to identify cost-saving opportunities and suggests budget-friendly alternatives.",
    tags: ["AI", "Finance", "Automation"],
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Krisun Events",
    description: "A streamlined management tool for micro-events, automating logistics and coordination for small-scale gatherings.",
    tags: ["AI", "Events", "Logistics"],
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=800&auto=format&fit=crop"
  }
];

const SKILLS = [
  {
    category: "AI/ML & Data Engineering",
    icon: <Cpu className="text-brand" />,
    items: [
      { name: "GenAI Orchestration", desc: "Shipped RAG-based Resolution Copilot reducing customer friction and escalation by 85%." },
      { name: "RAG Architecture", desc: "Integrated real-time retrieval to surface policies, cutting turnaround from 24h to near-real-time." },
      { name: "Data Cleanrooms", desc: "Architected secure environments for privacy-compliant collaboration with global partners." },
      { name: "AI-Driven Segmentation", desc: "Leveraged AI to build dynamic segments for hyper-targeted marketing and retention campaigns." },
      { name: "Data Pipeline Design", desc: "Re-engineered legacy systems into real-time microservices, boosting productivity by 40%." }
    ]
  },
  {
    category: "Product Strategy",
    icon: <Rocket className="text-brand" />,
    items: [
      { name: "0→1 Product Launches", desc: "Launched TELUS's first unified subscription platform, generating $8M ARR in year one." },
      { name: "Multi-year Roadmapping", desc: "Led strategy for Subscription on Demand and Loyalty platforms for a multi-million user base." },
      { name: "Partnership Ecosystems", desc: "Integrated strategic partners like WestJet and TLC to drive significant growth in corporate KPIs." },
      { name: "Pricing & Monetization", desc: "Optimized revenue models for global supply chain suites generating $12M+ in revenue." },
      { name: "OKR & KPI Alignment", desc: "Established strategic streams linking global partners with enterprise platforms to drive key metrics." }
    ]
  },
  {
    category: "Security & Compliance",
    icon: <ShieldCheck className="text-brand" />,
    items: [
      { name: "Identity Management", desc: "Implemented robust identity principles and MFA frameworks for secure partner integrations." },
      { name: "Security Frameworks", desc: "Architected secure payment and cybersecurity platforms achieving 94% transaction success." },
      { name: "Risk Mitigation", desc: "Reduced security incident rates by 30% through enterprise-grade compliance frameworks." },
      { name: "Data Privacy", desc: "Maintained 100% compliance in complex data products aggregating multi-source data." }
    ]
  },
  {
    category: "Technical Leadership",
    icon: <Users className="text-brand" />,
    items: [
      { name: "Cross-Functional Lead", desc: "Managed C-suite relationships across multiple geographies to define global GTM strategies." },
      { name: "Stakeholder Management", desc: "Led business process analysis and optimization initiatives for large-scale financial clients." },
      { name: "Change Management", desc: "Orchestrated large-scale digital shifts enhancing customer journeys and operational efficiency." },
      { name: "Operational Excellence", desc: "Cut system turnaround from 24 hours to near-real-time through architectural re-engineering." }
    ]
  }
];

// --- Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Skills', href: '#skills' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md border-b border-gray-100 py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        <a href="#" className="text-xl font-bold tracking-tighter text-charcoal">
          DB<span className="text-brand">.</span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-sm font-medium text-gray-600 hover:text-brand transition-colors"
            >
              {link.name}
            </a>
          ))}
          <a 
            href="#contact" 
            className="px-5 py-2 bg-charcoal text-white text-sm font-medium rounded-full hover:bg-brand transition-all"
          >
            Get in Touch
          </a>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-charcoal" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 p-6 md:hidden flex flex-col gap-4 shadow-xl"
          >
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-lg font-medium text-gray-600"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const SectionHeading = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="mb-12">
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="heading-md mb-2"
    >
      {title}
    </motion.h2>
    {subtitle && (
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-muted max-w-2xl"
      >
        {subtitle}
      </motion.p>
    )}
    <motion.div 
      initial={{ width: 0 }}
      whileInView={{ width: 40 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2, duration: 0.8 }}
      className="h-1 bg-brand mt-4"
    />
  </div>
);

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      await addDoc(collection(db, 'contactMessages'), {
        ...formData,
        createdAt: new Date().toISOString()
      });
      setFormData({ name: '', email: '', message: '' });
      setStatus('success');
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
    }
  };

  return (
    <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Name</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand transition-colors text-white" 
              placeholder="John Doe" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Email</label>
            <input 
              type="email" 
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand transition-colors text-white" 
              placeholder="john@example.com" 
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Message</label>
          <textarea 
            rows={4} 
            required
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand transition-colors text-white" 
            placeholder="Your message..."
          ></textarea>
        </div>
        <button 
          disabled={status === 'submitting'}
          className={`w-full py-4 rounded-xl font-bold transition-all shadow-lg ${
            status === 'success' ? 'bg-green-500' : status === 'error' ? 'bg-red-500' : 'bg-brand hover:bg-brand/90'
          } text-white disabled:opacity-50`}
        >
          {status === 'submitting' ? 'Sending...' : status === 'success' ? 'Message Sent!' : status === 'error' ? 'Error. Try again.' : 'Send Message'}
        </button>
      </form>
    </div>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 md:px-12 lg:px-24 overflow-hidden text-center">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-brand/5 rounded-full blur-[120px]"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, -45, 0],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-[10%] -right-[5%] w-[50%] h-[50%] bg-brand/10 rounded-full blur-[100px]"
          />
        </div>

        <div className="max-w-4xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand/10 text-brand rounded-full text-xs font-bold uppercase tracking-widest mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
              </span>
              Available for Strategic Leadership
            </div>
            <h1 className="heading-lg mb-6">
              Devang Bhuta
            </h1>
            <p className="text-xl md:text-3xl text-gray-600 mb-8 leading-relaxed font-light">
              Problem Solver | Product Leader | AI Ideator | Execution Focused
            </p>
            <p className="text-muted text-lg mb-12 max-w-2xl mx-auto">
              Results-driven AI Product Leader with over 15 years of experience building and scaling global SaaS, subscription, and payment ecosystems that have generated $20M+ in measurable impact.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="#projects" 
                className="px-8 py-4 bg-charcoal text-white rounded-full font-medium hover:bg-brand transition-all flex items-center gap-2 group"
              >
                View Portfolio
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a 
                href="/resume.pdf" 
                className="px-8 py-4 border border-gray-200 text-charcoal rounded-full font-medium hover:bg-gray-50 transition-all flex items-center gap-2"
              >
                Download Resume
                <Download size={18} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section-padding bg-off-white">
        <div className="max-w-7xl mx-auto">
          <SectionHeading 
            title="About Me" 
            subtitle="Bridging the gap between complex technology and business outcomes."
          />
          <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-6 text-lg text-muted">
              <p>
                I am a seasoned product leader with a deep technical foundation and a passion for building AI-driven solutions that solve real-world problems. With over 15 years of experience, I've navigated the evolution of SaaS from its early days to the current AI revolution.
              </p>
              <p>
                My expertise lies in managing complex data engineering products that aggregate multi-source data to create AI-driven segments for precision targeting and retention. I have a proven track record in establishing strategic partnership streams, linking global partners with enterprise platforms to drive key KPIs through behavioral insights.
              </p>
              <p>
                Currently at TELUS, I lead digital strategy and AI initiatives, focusing on GenAI integration, automation strategy, and large-scale digital shifts that enhance both customer journeys and operational efficiency.
              </p>
            </div>
            <div className="space-y-8">
              <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                <h4 className="font-bold text-charcoal mb-4 flex items-center gap-2">
                  <Cpu size={20} className="text-brand" />
                  AI Focus
                </h4>
                <p className="text-sm text-muted">
                  Specialized in GenAI integration, RAG architectures, and AI-driven customer segmentation.
                </p>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                <h4 className="font-bold text-charcoal mb-4 flex items-center gap-2">
                  <Rocket size={20} className="text-brand" />
                  Impact
                </h4>
                <p className="text-sm text-muted">
                  Generated $20M+ in measurable business impact through strategic product launches and optimizations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="section-padding">
        <div className="max-w-7xl mx-auto">
          <SectionHeading 
            title="Professional Experience" 
            subtitle="A timeline of leadership and technical excellence."
          />
          <div className="space-y-12">
            {EXPERIENCE.map((exp, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative pl-8 md:pl-0"
              >
                {/* Timeline line for mobile */}
                <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200 md:hidden"></div>
                <div className="absolute left-[-4px] top-2 w-2 h-2 rounded-full bg-brand md:hidden"></div>

                <div className="grid md:grid-cols-4 gap-4 md:gap-12">
                  <div className="md:text-right flex flex-col md:items-end items-start gap-4">
                    <div className="w-32 h-32 rounded-3xl overflow-hidden border border-gray-100 shadow-md">
                      <img 
                        src={exp.logo} 
                        alt={exp.company} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-charcoal">{exp.company}</h3>
                      <p className="text-brand font-medium text-sm">{exp.period}</p>
                      <p className="text-gray-400 text-xs mt-1">{exp.location}</p>
                    </div>
                  </div>
                  <div className="md:col-span-3">
                    <h4 className="font-semibold text-lg text-charcoal mb-4">{exp.role}</h4>
                    <ul className="space-y-3">
                      {exp.achievements.map((item, i) => (
                        <li key={i} className="flex gap-3 text-muted">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand shrink-0"></span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="section-padding bg-charcoal text-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Flagship Products</h2>
            <p className="text-gray-400 max-w-2xl">
              High-impact enterprise solutions that have driven significant business growth and operational efficiency.
            </p>
            <div className="h-1 bg-brand w-12 mt-4"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-24">
            {PROJECTS.map((project, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 transition-all"
              >
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-8">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-brand/20 text-brand rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{project.title}</h3>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="pt-6 border-t border-white/10">
                    <p className="text-xs font-bold text-brand uppercase tracking-widest mb-1">Impact</p>
                    <p className="text-sm font-medium">{project.impact}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">AI Innovation Portfolio</h2>
            <p className="text-gray-400 max-w-2xl">
              A collection of "Vibe Coding" projects exploring the frontiers of AI-driven automation and personalization.
            </p>
            <div className="h-1 bg-brand w-12 mt-4"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {VIBE_PROJECTS.map((project, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all flex flex-col h-full"
              >
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-white/10 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{project.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="section-padding bg-off-white">
        <div className="max-w-7xl mx-auto">
          <SectionHeading 
            title="Skills & Expertise" 
            subtitle="A comprehensive toolkit for modern product leadership, bridging technical depth with strategic vision."
          />
          <div className="grid md:grid-cols-2 gap-8">
            {SKILLS.map((skillGroup, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-10 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 bg-brand/5 rounded-2xl">
                    {skillGroup.icon}
                  </div>
                  <h4 className="font-bold text-xl text-charcoal">
                    {skillGroup.category}
                  </h4>
                </div>
                <div className="space-y-6">
                  {skillGroup.items.map((skill, i) => (
                    <div key={i} className="group">
                      <div className="flex items-center gap-3 mb-1">
                        <div className="h-1.5 w-1.5 rounded-full bg-brand group-hover:scale-150 transition-transform" />
                        <span className="font-bold text-charcoal text-sm">{skill.name}</span>
                      </div>
                      <p className="text-xs text-muted pl-4.5 leading-relaxed">
                        {skill.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section className="section-padding bg-off-white">
        <div className="max-w-7xl mx-auto">
          <SectionHeading title="Education & Certifications" />
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex gap-6 items-start">
              <div className="p-4 bg-brand/5 rounded-2xl text-brand">
                <GraduationCap size={32} />
              </div>
              <div>
                <h4 className="font-bold text-lg text-charcoal">MBA — Operations Management</h4>
                <p className="text-muted">Welingkar Institute of Management, Mumbai</p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex gap-6 items-start">
              <div className="p-4 bg-brand/5 rounded-2xl text-brand">
                <Code2 size={32} />
              </div>
              <div>
                <h4 className="font-bold text-lg text-charcoal">Bachelor of Engineering (BE)</h4>
                <p className="text-muted">Information Technology, University of Mumbai</p>
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {["CSPO", "Certified Product Manager", "Lean Six Sigma Green Belt", "Python for Data Science"].map(cert => (
              <span key={cert} className="px-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-600">
                {cert}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="bg-charcoal rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden">
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">Let's build the future of AI together.</h2>
                <p className="text-gray-400 text-lg mb-10">
                  I'm always open to discussing product strategy, AI innovation, or strategic leadership opportunities.
                </p>
                <div className="space-y-6">
                  <a href="mailto:devbhuta@gmail.com" className="flex items-center gap-4 text-xl hover:text-brand transition-colors">
                    <div className="p-3 bg-white/10 rounded-full">
                      <Mail size={24} />
                    </div>
                    devbhuta@gmail.com
                  </a>
                  <a href="https://linkedin.com/in/db-passionforproducts" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-xl hover:text-brand transition-colors">
                    <div className="p-3 bg-white/10 rounded-full">
                      <Linkedin size={24} />
                    </div>
                    LinkedIn Profile
                  </a>
                </div>
              </div>
              <ContactForm />
            </div>
            {/* Background glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand/20 rounded-full blur-[120px] -z-0"></div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} Devang Bhuta. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="https://linkedin.com/in/db-passionforproducts" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand transition-colors">
              <Linkedin size={20} />
            </a>
            <a href="mailto:devbhuta@gmail.com" className="text-gray-400 hover:text-brand transition-colors">
              <Mail size={20} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
