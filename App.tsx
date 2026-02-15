
import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import ProfileCard from './components/ProfileCard';
import SearchHeader from './components/SearchHeader';
import AnimatedSection from './components/AnimatedSection';
import ModernSkillCard from './components/ModernSkillCard';
import { PROFILE, SKILLS, PROJECTS, WORK_EXPERIENCE, EDUCATION } from './constants';
import { SectionId } from './types';
import { ArrowUpRight, FolderGit2, Sparkles, Zap, Mail, Hexagon, MapPin, Navigation, Share2, Star, Search, Plus, Minus, Maximize, X, GraduationCap, Briefcase } from 'lucide-react';

// --- TYPEWRITER HOOK & COMPONENT ---
const useTypewriter = (textArray: string[], speed = 100, pause = 2000) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (index >= textArray.length) return;

    const currentWord = textArray[index];

    const handleType = () => {
      setDisplayedText(currentWord.substring(0, subIndex));

      if (!isDeleting && subIndex < currentWord.length) {
        setSubIndex(subIndex + 1);
      } else if (isDeleting && subIndex > 0) {
        setSubIndex(subIndex - 1);
      } else if (!isDeleting && subIndex === currentWord.length) {
        setTimeout(() => setIsDeleting(true), pause);
      } else if (isDeleting && subIndex === 0) {
        setIsDeleting(false);
        setIndex((prev) => (prev + 1) % textArray.length);
      }
    };

    const timeout = setTimeout(
      handleType,
      isDeleting ? speed / 2 : speed
    );

    return () => clearTimeout(timeout);
  }, [subIndex, index, isDeleting, speed, pause, textArray]);

  return displayedText;
};

const TypewriterText: React.FC<{ words: string[], className?: string }> = ({ words, className }) => {
  const text = useTypewriter(words);
  // Find longest word to reserve space and prevent layout shift
  const longestWord = words.reduce((a, b) => a.length > b.length ? a : b, "");

  return (
    <span className={`inline-grid grid-cols-1 grid-rows-1 items-center ${className}`}>
      {/* Invisible spacer defines the width/height based on longest word */}
      <span className="invisible col-start-1 row-start-1">{longestWord}</span>

      {/* Actual animated text overlay */}
      <span className="col-start-1 row-start-1">
        {text}
        <span className="animate-pulse ml-0.5 inline-block w-[2px] h-[1em] bg-current align-middle"></span>
      </span>
    </span>
  );
};

// --- COUNT UP HOOK & COMPONENT ---
const useCountUp = (end: number, duration = 2000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = currentTime - startTime;

      // Calculate percentage (0 to 1)
      const percentage = Math.min(progress / duration, 1);

      // Ease Out Quart function: 1 - (1 - t)^4 for smooth "slow down" at end
      const easeOut = 1 - Math.pow(1 - percentage, 4);

      setCount(Math.floor(easeOut * end));

      if (progress < duration) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [end, duration]);

  return count;
};

const AnimatedCounter: React.FC<{ value: number }> = ({ value }) => {
  const count = useCountUp(value);
  return <span>{count}</span>;
};

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SectionId>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [skillCategory, setSkillCategory] = useState('All');

  // Map Interaction State
  const [showMapDetails, setShowMapDetails] = useState(false);

  // Initialize theme based on system preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true; // Default fallbacl
  });

  // Intro animation
  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  // Theme toggle logic
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const mainContentRef = useRef<HTMLElement>(null);

  const scrollToSection = (id: SectionId) => {
    setActiveSection(id);
    const element = document.getElementById(id);

    if (element) {
      // Check if we are on desktop (lg breakpoint is 1024px)
      const isDesktop = window.matchMedia('(min-width: 1024px)').matches;

      if (isDesktop && mainContentRef.current) {
        // Desktop: Scroll the main container
        const mainRect = mainContentRef.current.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();

        // Calculate relative position inside the scrolling container
        // currentScrollTop + (elementTop - containerTop)
        const offsetTop = elementRect.top - mainRect.top + mainContentRef.current.scrollTop;

        // Subtract header height/padding (approx 100px for safety)
        const headerOffset = 100;

        mainContentRef.current.scrollTo({
          top: offsetTop - headerOffset,
          behavior: 'smooth'
        });
      } else {
        // Mobile: Scroll the window/body
        const yOffset = -80; // Offset for fixed navbar/header if any
        const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  const getFilteredSkills = () => {
    if (skillCategory === 'All') return SKILLS;
    if (skillCategory === 'Tools') return SKILLS.filter(s => s.category === 'tool');
    return SKILLS.filter(s => s.category === skillCategory.toLowerCase());
  };

  const filteredSkills = getFilteredSkills();
  const skillTabs = ['All', 'Technical', 'Tools', 'General'];

  // Search filtering logic
  const searchLower = searchQuery.toLowerCase().trim();

  const filteredProjects = PROJECTS.filter(project => {
    if (!searchLower) return true;
    return (
      project.title.toLowerCase().includes(searchLower) ||
      project.category.toLowerCase().includes(searchLower) ||
      project.description.toLowerCase().includes(searchLower)
    );
  });

  const searchFilteredSkills = filteredSkills.filter(skill => {
    if (!searchLower) return true;
    return (
      skill.name.toLowerCase().includes(searchLower) ||
      skill.category.toLowerCase().includes(searchLower)
    );
  });

  const filteredExperience = WORK_EXPERIENCE.filter(exp => {
    if (!searchLower) return true;
    return (
      exp.role.toLowerCase().includes(searchLower) ||
      exp.company.toLowerCase().includes(searchLower) ||
      exp.description.toLowerCase().includes(searchLower)
    );
  });

  const filteredEducation = EDUCATION.filter(edu => {
    if (!searchLower) return true;
    return (
      edu.degree.toLowerCase().includes(searchLower) ||
      edu.institution.toLowerCase().includes(searchLower) ||
      edu.description.toLowerCase().includes(searchLower)
    );
  });

  const hasSearchResults = searchLower && (
    filteredProjects.length > 0 ||
    searchFilteredSkills.length > 0 ||
    filteredExperience.length > 0 ||
    filteredEducation.length > 0
  );

  const noResults = searchLower && !hasSearchResults;


  // --- MAP INTERACTION HANDLERS ---


  if (loading) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center z-[9999]">
        <div className="flex gap-2">
          <div className="w-4 h-4 rounded-full bg-googleBlue animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-4 h-4 rounded-full bg-googleRed animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-4 h-4 rounded-full bg-googleYellow animate-bounce"></div>
          <div className="w-4 h-4 rounded-full bg-googleGreen animate-bounce [animation-delay:0.15s]"></div>
        </div>
      </div>
    );
  }

  return (
    // Changed overflow-hidden to lg:overflow-hidden to allow window scroll on mobile
    <div className="min-h-screen text-textMain p-4 md:p-6 lg:p-5 flex flex-col lg:flex-row gap-6 lg:gap-5 max-w-[1600px] mx-auto lg:overflow-hidden bg-background transition-colors duration-300">

      {/* 1. Left Sidebar Navigation */}
      <div className="flex-shrink-0 z-[9999]">
        <Sidebar activeSection={activeSection} onNavigate={scrollToSection} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      </div>

      {/* 2. Profile Card (Sticky on Desktop, Adaptive on Tablet/Mobile) */}
      {/* Removed margin-top on mobile since navbar is now at bottom */}
      <div className="w-full lg:w-[350px] xl:w-[400px] flex-shrink-0 lg:h-[calc(100vh-40px)] lg:sticky lg:top-5 mt-4 lg:mt-0">
        <ProfileCard onNavigate={scrollToSection} />
      </div>

      {/* Mobile Search Header (appears between ProfileCard and Main on mobile) */}
      <div className="block lg:hidden w-full mb-4 px-4 overflow-visible">
        <SearchHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>

      {/* 3. Main Content Area (Scrollable) - Increased padding-bottom for mobile bottom nav */}
      <main ref={mainContentRef} className="flex-1 h-full lg:h-[calc(100vh-40px)] lg:overflow-y-auto rounded-[2rem] no-scrollbar pb-24 lg:pb-0 relative">

        {/* Search Header */}
        {/* Removed sticky from mobile to avoid clutter, kept sticky on desktop inside the scrollable area */}
        <div className="hidden lg:block sticky top-0 z-40 pt-6 pb-6 px-4 transition-colors duration-300 overflow-visible">
          <SearchHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>

        {/* Search Results Indicator */}
        {searchLower && (
          <div className="mb-6 px-2">
            <div className="flex items-center justify-between bg-surfaceHighlight p-4 rounded-2xl border border-borderColor">
              <div className="flex items-center gap-2">
                <Search size={16} className="text-primary" />
                <span className="text-sm text-textMain">
                  Searching: <span className="font-semibold text-primary">"{searchQuery}"</span>
                </span>
              </div>
              {!noResults && (
                <span className="text-xs text-textMuted">
                  {filteredProjects.length + searchFilteredSkills.length + filteredExperience.length + filteredEducation.length} results
                </span>
              )}
            </div>
          </div>
        )}

        {/* No Results Message */}
        {noResults && (
          <div className="mb-8 px-2">
            <div className="bg-surface p-12 rounded-[2rem] border border-borderColor text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-surfaceHighlight flex items-center justify-center">
                <Search size={32} className="text-textMuted" />
              </div>
              <h3 className="text-2xl font-bold text-textMain mb-2">No results found</h3>
              <p className="text-textMuted max-w-md mx-auto mb-4">
                We couldn't find anything matching "<span className="font-semibold text-primary">{searchQuery}</span>"
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="px-6 py-3 bg-primary text-black rounded-2xl font-medium hover:bg-primary/80 transition-colors"
              >
                Clear Search
              </button>
            </div>
          </div>
        )}

        {/* --- HERO SECTION --- */}
        <section id="home" className="mb-16">
          <AnimatedSection animation="zoom-in" duration={800}>
            <div className="bg-surface rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden border border-borderColor transition-colors duration-300">
              <div className="relative z-10">
                <h4 className="text-textMain/80 font-medium mb-4 flex items-center gap-2">
                  <Sparkles size={18} className="text-googleYellow" />
                  <span>
                    Hello, I'm <TypewriterText words={["Suntree", "Maruf", "a Dev", "a Creator"]} className="text-textMain font-bold" />
                  </span>
                </h4>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-textMain">
                  <span className="">Junior Software Enginer and </span>
                  <span className="text-textMain relative inline-block">
                    <span className="relative z-10">
                      <TypewriterText words={["Data Scientist", "UI/UX Designer", "Frontend Dev", "Desain Grafis"]} />
                    </span>
                    <div className="absolute bottom-1 left-0 w-full h-3 bg-primary/50 -z-0"></div>
                  </span> <br />
                  Based in {PROFILE.location.split(',')[0]}.
                </h1>
                <p className="text-textMuted max-w-2xl text-lg leading-relaxed mb-10">
                  {PROFILE.bio}
                </p>

                <div className="flex flex-wrap gap-8 md:gap-16">
                  {[
                    { value: PROFILE.stats.projects, label: "Completed Projects" },
                    { value: PROFILE.stats.years, label: "Years Experience" },
                    { value: PROFILE.stats.awards, suffix: "+", label: "Awards Winning" },
                  ].map((stat, i) => (
                    <div key={i} className="flex flex-col">
                      <span className="text-4xl font-bold text-textMain mb-1">
                        <AnimatedCounter value={stat.value} />{stat.suffix}
                      </span>
                      <span className="text-xs text-textMuted uppercase tracking-wider">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>
        </section>

        {/* --- SKILLS SECTION --- */}
        <section id="skills" className="mb-16">
          <AnimatedSection animation="fade-right" delay={100}>
            <div className="flex items-center justify-between mb-8 px-2">
              <div>
                <h3 className="text-3xl md:text-4xl font-bold text-textMain mb-2">Technical Proficiency</h3>
                <p className="text-textMuted">A comprehensive overview of my technical skills and tools.</p>
              </div>
              <div className="hidden md:block">
                <Sparkles className="text-googleYellow w-8 h-8 animate-pulse" />
              </div>
            </div>
          </AnimatedSection>
          {/* Filter Tabs */}
          <AnimatedSection animation="fade-left" delay={200}>
            <div className="flex gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar px-2">
              {skillTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSkillCategory(tab)}
                  className={`
                  px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap border
                  ${skillCategory === tab
                      ? 'bg-textMain text-background border-textMain shadow-lg scale-105'
                      : 'bg-surface hover:bg-surfaceHighlight text-textMuted border-borderColor hover:border-textMuted/50'
                    }
                `}
                >
                  {tab}
                </button>
              ))}
            </div>
          </AnimatedSection>

          <div key={skillCategory} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 animate-fade-in">
            {searchFilteredSkills.map((skill, index) => (
              <AnimatedSection key={index} animation="blur-in" delay={index * 50} duration={600}>
                <ModernSkillCard
                  name={skill.name}
                  level={skill.level}
                  icon={skill.icon}
                  category={skill.category}
                  index={index}
                />
              </AnimatedSection>
            ))}
          </div>
        </section>

        {/* --- PROJECTS SECTION --- */}
        <section id="projects" className="mb-16">
          <AnimatedSection animation="fade-right">
            <div className="flex items-center justify-between mb-8 px-2">
              <div>
                <h3 className="text-3xl md:text-4xl font-bold text-textMain mb-2">Featured Projects</h3>
                <p className="text-textMuted">A selection of my recent work and experiments.</p>
              </div>
              <a href={PROFILE.social.github} target="_blank" rel="noopener noreferrer" className="hidden md:flex items-center gap-2 text-textMain hover:text-primary transition-colors group">
                <span>View Github</span>
                <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
            </div>
          </AnimatedSection>

          <div className="space-y-32">
            {filteredProjects.map((project, index) => (
              <AnimatedSection key={project.id} animation="fade-up" delay={index * 100}>
                <div className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-8 lg:gap-16 group`}>
                  {/* ... existing project content ... */}
                  <div className="w-full lg:w-3/5 relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-[2rem] transform translate-y-4 lg:translate-x-4 transition-transform duration-500 group-hover:translate-y-2 group-hover:translate-x-2"></div>
                    <div className="relative rounded-[2rem] overflow-hidden border border-borderColor shadow-2xl bg-surface aspect-video group-hover:scale-[1.02] transition-transform duration-500">
                      <img src={project.image} alt={project.title} className="object-cover w-full h-full" />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <a href={project.link} target="_blank" rel="noreferrer" className="bg-white/10 backdrop-blur-md p-4 rounded-full text-white transform scale-0 group-hover:scale-100 transition-all duration-300 hover:bg-white/20">
                          <ArrowUpRight size={32} />
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="w-full lg:w-2/5 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surfaceHighlight border border-borderColor mb-4">
                      <Zap size={14} className="text-googleYellow" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-textMain">{project.category}</span>
                    </div>

                    <h3 className="text-3xl md:text-4xl font-bold text-textMain mb-4 leading-tight group-hover:text-primary transition-colors">{project.title}</h3>
                    <p className="text-textMuted text-lg leading-relaxed mb-6">{project.description}</p>

                    <a href={project.link} className="inline-flex items-center gap-2 text-textMain font-medium border-b-2 border-primary pb-1 hover:text-primary transition-colors">
                      View Case Study <ArrowUpRight size={18} />
                    </a>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>

        {/* --- EXPERIENCE SECTION --- */}
        <section id="experience" className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* 1. WORK EXPERIENCE */}
            <AnimatedSection animation="fade-up" delay={0} className="h-full">
              <div className="bg-surface rounded-[2.5rem] p-6 md:p-8 border border-borderColor transition-colors duration-300 h-full">
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-googleBlue/10 p-2 rounded-lg text-googleBlue">
                    <Briefcase size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-textMain">Experience</h3>
                </div>

                {/* Timeline: Linear Layout Fix */}
                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:w-0.5 before:-translate-x-px before:h-full before:bg-gradient-to-b before:from-transparent before:via-surfaceElevated before:to-transparent">
                  {filteredExperience.map((exp, i) => (
                    <div key={exp.id} className="relative flex items-start gap-4 group">

                      {/* Timeline Dot */}
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-surface bg-surfaceElevated group-hover:bg-googleBlue transition-colors shrink-0 z-10 shadow-xl mt-1">
                        <Briefcase size={16} className="text-textMain group-hover:text-white" />
                      </div>

                      {/* Content Card */}
                      <div className="flex-1 bg-surfaceHighlight p-6 rounded-[1.5rem] border border-borderColor hover:border-textMuted/20 transition-all w-full">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                          <h5 className="font-bold text-lg text-textMain">{exp.role}</h5>
                          <span className="text-xs text-black bg-primary px-2 py-1 rounded-md w-fit mt-1 md:mt-0 font-medium whitespace-nowrap">{exp.period}</span>
                        </div>
                        <p className="text-sm font-medium text-textMuted mb-2">{exp.company}</p>
                        <p className="text-sm text-textMuted leading-relaxed">{exp.description}</p>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            {/* 2. EDUCATION SECTION */}
            <AnimatedSection animation="fade-up" delay={200} className="h-full">
              <div className="bg-surface rounded-[2.5rem] p-6 md:p-8 border border-borderColor transition-colors duration-300 h-full">
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-googleRed/10 p-2 rounded-lg text-googleRed">
                    <GraduationCap size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-textMain">Education</h3>
                </div>

                {/* Timeline: Linear Layout Fix */}
                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:w-0.5 before:-translate-x-px before:h-full before:bg-gradient-to-b before:from-transparent before:via-surfaceElevated before:to-transparent">
                  {filteredEducation.map((edu, i) => (
                    <div key={edu.id} className="relative flex items-start gap-4 group">

                      {/* Timeline Dot */}
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-surface bg-surfaceElevated group-hover:bg-googleRed transition-colors shrink-0 z-10 shadow-xl mt-1">
                        <GraduationCap size={16} className="text-textMain group-hover:text-white" />
                      </div>

                      {/* Content Card */}
                      <div className="flex-1 bg-surfaceHighlight p-6 rounded-[1.5rem] border border-borderColor hover:border-textMuted/20 transition-all w-full">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                          <h5 className="font-bold text-lg text-textMain">{edu.degree}</h5>
                          <span className="text-xs text-black bg-secondary px-2 py-1 rounded-md w-fit mt-1 md:mt-0 font-medium whitespace-nowrap">{edu.period}</span>
                        </div>
                        <p className="text-sm font-medium text-textMuted mb-2">{edu.institution}</p>
                        <p className="text-sm text-textMuted leading-relaxed">{edu.description}</p>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
        {/* --- MAPS SECTION (INTERACTIVE) --- */}
        <section id="maps" className="mb-16">
          <AnimatedSection animation="zoom-in" duration={1000} threshold={0.2}>
            <div className="bg-surface rounded-[2.5rem] overflow-hidden border border-borderColor relative group select-none">

              {/* Header / Search Bar Lookalike */}
              <div className="absolute top-4 left-4 right-4 md:left-6 md:right-auto md:w-80 z-20 pointer-events-none">
                <div className="glass-panel rounded-full p-3 flex items-center shadow-lg pointer-events-auto">
                  <Search size={18} className="text-textMuted ml-1" />
                  <span className="ml-3 text-textMain font-medium text-sm">Suntree Art HQ, Depok</span>
                  <div className="ml-auto flex gap-2">
                    <div className="p-1 rounded-full hover:bg-surfaceHighlight cursor-pointer">
                      <div className="w-6 h-6 rounded-full bg-googleBlue text-white flex items-center justify-center text-xs font-bold">S</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Map Container */}
              <div className="h-[400px] md:h-[500px] w-full relative bg-surfaceElevated overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  title="Suntree Location"
                  scrolling="no"
                  marginHeight={0}
                  marginWidth={0}
                  src="https://maps.google.com/maps?q=Jl.+Lingkar,+Pondok+Cina,+Kecamatan+Beji,+Kota+Depok,+Jawa+Barat+16424&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full grayscale-[50%] hover:grayscale-0 transition-all duration-700 opacity-90 hover:opacity-100"
                ></iframe>

                {/* Interactive Location Pin Overlay (Decorative only now, map has its own pin) */}
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-12 flex flex-col items-center gap-1 cursor-pointer z-10 pointer-events-none"
                >
                  <div className="relative group/pin pointer-events-auto" onClick={() => setShowMapDetails(!showMapDetails)}>
                    <span className="absolute inline-flex h-full w-full rounded-full bg-googleRed opacity-75 animate-ping"></span>
                    <div className={`relative p-2 ${showMapDetails ? 'bg-textMain' : 'bg-googleRed'} text-white rounded-full shadow-lg transform hover:scale-110 transition-all duration-300`}>
                      <MapPin size={24} fill="currentColor" />
                    </div>
                  </div>
                </div>

                {/* Map Overlay Gradient for better integration */}
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent pointer-events-none"></div>
              </div>



              {/* Bottom Info Card (Revealed on Click) */}
              <div
                className={`
                absolute bottom-4 left-4 right-4 md:right-auto md:w-96 bg-surface rounded-[1.5rem] p-5 shadow-2xl border border-borderColor z-20 
                transition-all duration-500 cubic-bezier(0.175, 0.885, 0.32, 1.275)
                ${showMapDetails ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}
              `}
              >
                {/* Close Button for Mobile convenience */}
                <button
                  onClick={() => setShowMapDetails(false)}
                  className="absolute top-2 right-2 p-1 rounded-full hover:bg-surfaceHighlight text-textMuted"
                >
                  <X size={16} />
                </button>

                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-xl font-bold text-textMain">Suntree Art HQ</h4>
                    <p className="text-sm text-textMuted">Creative Engineering Studio</p>
                  </div>
                  <div className="bg-surfaceElevated p-2 rounded-full mr-6">
                    <Hexagon size={20} className="text-googleBlue" />
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-4">
                  <span className="text-textMain font-bold">4.9</span>
                  <div className="flex text-googleYellow">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} fill="currentColor" />)}
                  </div>
                  <span className="text-textMuted text-sm ml-1">(128 reviews)</span>
                </div>

                <p className="text-sm text-textMuted mb-4 border-t border-borderColor pt-3">
                  Jl. Lingkar, Pondok Cina, Kecamatan Beji, Kota Depok, Jawa Barat 16424 <br />
                  <span className="text-googleGreen font-medium">Open now • Closes 6 PM</span>
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => window.open('https://www.google.com/maps/search/?api=1&query=Jl.+Lingkar,+Pondok+Cina,+Kecamatan+Beji,+Kota+Depok,+Jawa+Barat+16424', '_blank')}
                    className="flex-1 bg-googleBlue text-white py-2 rounded-full text-sm font-medium hover:bg-googleBlue/90 transition-colors shadow-lg shadow-googleBlue/20"
                  >
                    Directions
                  </button>
                  <button className="flex-1 bg-surfaceHighlight text-googleBlue py-2 rounded-full text-sm font-medium hover:bg-secondary transition-colors border border-borderColor">
                    Save
                  </button>
                  <button className="p-2 rounded-full border border-borderColor hover:bg-surfaceHighlight text-textMuted transition-colors">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>

              {/* Hint to click the pin (visible when card is hidden) */}
              <div
                className={`absolute bottom-8 left-1/2 -translate-x-1/2 bg-surface/80 backdrop-blur px-4 py-2 rounded-full text-xs font-medium shadow-lg pointer-events-none transition-opacity duration-300 ${showMapDetails ? 'opacity-0' : 'opacity-100'}`}
              >
                Click the pin for details
              </div>

            </div>
          </AnimatedSection>
        </section>

        {/* --- CONTACT SECTION --- */}
        <section id="contact" className="mb-16">
          <AnimatedSection animation="fade-up" threshold={0.3}>
            <div className="bg-surface rounded-[2.5rem] p-8 md:p-12 border border-borderColor relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 transition-colors duration-300">
              <div className="relative z-10">
                <h3 className="text-3xl font-bold mb-3 text-textMain">Let's work together</h3>
                <p className="text-textMuted max-w-md">
                  Interested in collaborating or have a project in mind?
                  Let's build something amazing.
                </p>
              </div>
              <a
                href={PROFILE.social.email}
                className="bg-textMain text-background px-8 py-4 rounded-2xl font-bold hover:bg-textMain/80 transition-colors flex items-center gap-2 whitespace-nowrap z-10"
              >
                <Mail size={20} />
                Say Hello
              </a>

              {/* Decorative BG */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-transparent via-surfaceHighlight to-transparent opacity-50 transform -skew-x-12"></div>
            </div>
          </AnimatedSection>
        </section>

        {/* Footer - Google Labs Style */}
        <footer className="bg-surface rounded-[2.5rem] mt-20 pt-12 pb-8 px-6 md:px-12 border border-borderColor">

          {/* Top Section */}
          <div className="flex flex-col xl:flex-row justify-between gap-12 xl:gap-20 mb-16">

            {/* Left: Newsletter & Social */}
            <div className="flex-1 max-w-lg">
              <h3 className="text-2xl md:text-3xl font-medium text-textMain mb-8 leading-snug">
                Stay connected for early access to our newest tools and local events
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                {/* Social Circles */}
                <a href="#" className="w-12 h-12 rounded-full border border-borderColor flex items-center justify-center text-textMain hover:bg-textMain hover:text-background transition-colors" aria-label="Discord">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037 13.46 13.46 0 0 0-.616 1.268 18.297 18.297 0 0 0-5.474 0 13.568 13.568 0 0 0-.618-1.268.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.086 2.157 2.419 0 1.334-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.086 2.157 2.419 0 1.334-.946 2.419-2.157 2.419z" /></svg>
                </a>
                <a href="#" className="w-12 h-12 rounded-full border border-borderColor flex items-center justify-center text-textMain hover:bg-textMain hover:text-background transition-colors" aria-label="Reddit">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm5.74-6.194a3.176 3.176 0 0 0-1.253-1.321 4.109 4.109 0 0 0 .614-2.174c0-2.288-1.854-3.79-5.1-3.79s-5.1 1.502-5.1 3.79a4.12 4.12 0 0 0 .61 2.173 3.187 3.187 0 0 0-1.259 1.325c-.23.634-.061 1.378.413 1.84.453.442 1.156.494 1.677.168.966.604 2.115.932 3.321.954l.564-2.653 1.859.398a1.69 1.69 0 0 0 1.664-1.294l.215-.815c1.205-.018 2.355-.348 3.323-.954.522.327 1.226.274 1.68-.168.473-.462.641-1.206.41-1.84zm-9.395-2.58a1.272 1.272 0 1 1 1.272-1.27 1.272 1.272 0 0 1-1.272 1.27zm6.65 3.354a2.91 2.91 0 0 1-4.022.003.553.553 0 0 1 .03-.783.552.552 0 0 1 .78.03 1.805 1.805 0 0 0 2.404 0 .553.553 0 0 1 .781.028.552.552 0 0 1 .028.783zm.643-2.083a1.272 1.272 0 1 1 1.272-1.272 1.272 1.272 0 0 1-1.272 1.27z" /></svg>
                </a>
                <a href="#" className="w-12 h-12 rounded-full border border-borderColor flex items-center justify-center text-textMain hover:bg-textMain hover:text-background transition-colors" aria-label="X">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                </a>

                <button className="h-12 px-6 rounded-full border border-borderColor text-textMain font-medium hover:bg-surfaceHighlight transition-colors whitespace-nowrap">
                  Sign up for our newsletter
                </button>
              </div>
            </div>

            {/* Right: Links */}
            <div className="flex flex-col sm:flex-row gap-12 xl:gap-24 text-sm">
              <div>
                <h4 className="font-bold text-textMain mb-4">Navigation</h4>
                <ul className="space-y-3 text-textMuted font-medium">
                  <li><a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }} className="hover:text-textMain transition-colors">About</a></li>
                  <li><a href="#projects" onClick={(e) => { e.preventDefault(); scrollToSection('projects'); }} className="hover:text-textMain transition-colors">Experiments</a></li>
                  <li><a href="#experience" onClick={(e) => { e.preventDefault(); scrollToSection('experience'); }} className="hover:text-textMain transition-colors">Sessions</a></li>
                  <li><a href="#maps" onClick={(e) => { e.preventDefault(); scrollToSection('maps'); }} className="hover:text-textMain transition-colors">Maps</a></li>
                  <li><a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }} className="hover:text-textMain transition-colors">Community</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-textMain mb-4">Other teams and product areas</h4>
                <ul className="space-y-3 text-textMuted font-medium">
                  <li><a href="#" className="hover:text-textMain transition-colors">Suntree AI</a></li>
                  <li><a href="#" className="hover:text-textMain transition-colors">Suntree Cloud</a></li>
                  <li><a href="#" className="hover:text-textMain transition-colors">Suntree Research</a></li>
                  <li><a href="#" className="hover:text-textMain transition-colors">Suntree DeepMind</a></li>
                  <li><a href="#" className="hover:text-textMain transition-colors">Search Labs</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Big Typography */}
          <div className="w-full text-center border-b border-borderColor leading-none pb-6 mb-8">
            <h1 className="text-[13vw] font-bold tracking-tighter text-textMain select-none">
              Suntree Art
            </h1>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between text-[10px] md:text-xs font-bold text-textMuted uppercase tracking-widest gap-6">
            <div className="flex items-center gap-2 text-textMain">
              <Hexagon size={18} className="fill-current" />
              <span>SUNTREE</span>
            </div>

            <div className="flex flex-wrap justify-center gap-6 md:gap-8">
              <a href="#" className="hover:text-textMain transition-colors">About Suntree</a>
              <a href="#" className="hover:text-textMain transition-colors">Suntree Products</a>
              <a href="#" className="hover:text-textMain transition-colors">Privacy</a>
              <a href="#" className="hover:text-textMain transition-colors">Terms</a>
              <a href="#" className="hover:text-textMain transition-colors">Help</a>
            </div>
          </div>
        </footer>

      </main>
    </div >
  );
};

export default App;
