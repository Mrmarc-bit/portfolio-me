
import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import ProfileCard from './components/ProfileCard';
import SearchHeader from './components/SearchHeader';
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
  return (
    <span className={className}>
      {text}
      <span className="animate-pulse ml-0.5 inline-block w-[2px] h-[1em] bg-current align-middle"></span>
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
  const [mapZoom, setMapZoom] = useState(1);
  const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showMapDetails, setShowMapDetails] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

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

  const scrollToSection = (id: SectionId) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      // Adjust offset for the fixed navbar on mobile
      const yOffset = -80; 
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({top: y, behavior: 'smooth'});
    }
  };

  const getFilteredSkills = () => {
    if (skillCategory === 'All') return SKILLS;
    if (skillCategory === 'Tools') return SKILLS.filter(s => s.category === 'tool');
    return SKILLS.filter(s => s.category === skillCategory.toLowerCase());
  };

  const filteredSkills = getFilteredSkills();
  const skillTabs = ['All', 'Technical', 'Tools', 'General'];

  // --- MAP INTERACTION HANDLERS ---
  const handleZoomIn = () => setMapZoom(prev => Math.min(prev + 0.5, 4));
  const handleZoomOut = () => setMapZoom(prev => Math.max(prev - 0.5, 1));
  const handleResetMap = () => {
    setMapZoom(1);
    setMapPosition({ x: 0, y: 0 });
    setShowMapDetails(false);
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    setDragStart({ x: clientX - mapPosition.x, y: clientY - mapPosition.y });
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    
    // Calculate new position
    const newX = clientX - dragStart.x;
    const newY = clientY - dragStart.y;
    
    // Optional: Add boundaries so user can't drag map infinitely away (simplified)
    setMapPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

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
      <div className="flex-shrink-0 z-50">
        <Sidebar activeSection={activeSection} onNavigate={scrollToSection} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      </div>

      {/* 2. Profile Card (Sticky on Desktop, Adaptive on Tablet/Mobile) */}
      {/* Added margin-top on mobile to account for fixed navbar */}
      <div className="w-full lg:w-[350px] xl:w-[400px] flex-shrink-0 lg:h-[calc(100vh-40px)] lg:sticky lg:top-5 mt-20 lg:mt-0">
        <ProfileCard onNavigate={scrollToSection} />
      </div>

      {/* 3. Main Content Area (Scrollable) */}
      <main className="flex-1 h-full lg:h-[calc(100vh-40px)] lg:overflow-y-auto rounded-[2rem] no-scrollbar pb-10 lg:pb-0 relative">
        
        {/* Search Header */}
        {/* Removed sticky from mobile to avoid clutter, kept sticky on desktop inside the scrollable area */}
        <div className="hidden lg:block sticky top-0 bg-background/90 backdrop-blur-xl z-40 pt-2 pb-2 transition-colors duration-300">
          <SearchHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>
        
        {/* Mobile Search Header (Not sticky) */}
        <div className="block lg:hidden mb-4">
           <SearchHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>

        {/* --- HERO SECTION --- */}
        <section id="home" className="mb-16 animate-slide-up">
          <div className="bg-surface rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden border border-borderColor transition-colors duration-300">
             <div className="relative z-10">
              <h4 className="text-textMain/80 font-medium mb-4 flex items-center gap-2">
                <Sparkles size={18} className="text-googleYellow" />
                <span>
                  Hello, I'm <TypewriterText words={["Suntree", "Andrew", "a Dev", "a Creator"]} className="text-textMain font-bold" />
                </span>
              </h4>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-textMain">
                <span className="">Senior Data Engineer and </span>
                <span className="text-textMain relative inline-block">
                  <span className="relative z-10">
                    <TypewriterText words={["Data Scientist", "UI/UX Designer", "Frontend Dev", "Cloud Architect"]} />
                  </span>
                  <div className="absolute bottom-1 left-0 w-full h-3 bg-primary/50 -z-0"></div>
                </span> <br/>
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
        </section>

        {/* --- SKILLS SECTION --- */}
        <section id="skills" className="mb-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 px-2 gap-4">
            <h3 className="text-2xl font-bold text-textMain">Tool Stack</h3>
            
            {/* Category Tabs */}
            <div className="flex p-1 bg-surfaceHighlight rounded-full border border-borderColor self-start md:self-auto overflow-x-auto max-w-full transition-colors duration-300">
                {skillTabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setSkillCategory(tab)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                            skillCategory === tab 
                            ? 'bg-surface text-textMain shadow-md' 
                            : 'text-textMuted hover:text-textMain'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
          </div>

          <div key={skillCategory} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 animate-fade-in">
            {filteredSkills.map((skill, i) => (
              <div key={i} className="bg-surface p-6 rounded-[2rem] border border-borderColor flex flex-col items-center justify-center gap-4 hover:bg-surfaceHighlight transition-colors group cursor-default">
                <div className="w-14 h-14 rounded-full bg-surfaceHighlight flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg border border-borderColor">
                  {skill.icon}
                </div>
                <div className="text-center w-full">
                  <h5 className="font-semibold text-sm truncate px-2 text-textMain">{skill.name}</h5>
                  <div className="w-full h-1 bg-surfaceHighlight rounded-full mt-3 w-16 mx-auto overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${skill.level}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- PROJECTS SECTION --- */}
        <section id="projects" className="mb-16">
           <div className="flex items-center justify-between mb-6 px-2">
            <h3 className="text-2xl font-bold text-textMain">Recent Works</h3>
            <button 
              onClick={() => scrollToSection('projects')}
              className="text-sm flex items-center gap-1 text-googleBlue hover:underline cursor-pointer"
            >
              View All <ArrowUpRight size={14}/>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PROJECTS.map((project, i) => (
              <a 
                key={project.id}
                href={project.link || '#'}
                target={project.link ? "_blank" : undefined}
                rel={project.link ? "noopener noreferrer" : undefined}
                className={`group relative block bg-surface rounded-[2rem] overflow-hidden border border-borderColor hover:border-googleBlue/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl cursor-pointer ${project.featured ? 'md:col-span-2' : ''}`}
              >
                <div className={`w-full ${project.featured ? 'h-64 md:h-80' : 'h-64 md:h-64'} overflow-hidden`}>
                   <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90"></div>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-primary text-xs font-bold tracking-wider uppercase mb-2 block">{project.category}</span>
                      <h4 className="text-xl md:text-2xl font-bold mb-2 text-white">{project.title}</h4>
                      <p className="text-gray-300 text-sm line-clamp-2 max-w-md">{project.description}</p>
                    </div>
                    {/* Changed button to div because nested buttons in anchors are invalid HTML */}
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center text-black group-hover:bg-primary transition-colors transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 duration-300 shadow-lg">
                      <ArrowUpRight size={20} />
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* --- EXPERIENCE & EDUCATION WRAPPER --- */}
        <div id="experience" className="flex flex-col gap-8 mb-16">
          
          {/* 1. WORK EXPERIENCE SECTION */}
          <section>
            <div className="bg-surface rounded-[2.5rem] p-6 md:p-8 border border-borderColor transition-colors duration-300">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-primary/20 p-2 rounded-lg text-textMain">
                  <Briefcase size={24} />
                </div>
                <h3 className="text-2xl font-bold text-textMain">Work Experience</h3>
              </div>

              {/* Timeline: Single column on mobile/tablet, Zig-zag on Desktop (lg) */}
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:w-0.5 before:-translate-x-px lg:before:mx-auto lg:before:translate-x-0 before:h-full before:bg-gradient-to-b before:from-transparent before:via-surfaceElevated before:to-transparent">
                {WORK_EXPERIENCE.map((exp, i) => (
                  <div key={exp.id} className="relative flex items-center justify-between lg:justify-normal lg:odd:flex-row-reverse group">
                    
                    {/* Timeline Dot */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-surface bg-surfaceElevated group-hover:bg-primary transition-colors shrink-0 lg:order-1 lg:group-odd:-translate-x-1/2 lg:group-even:translate-x-1/2 z-10 shadow-xl">
                      <Briefcase size={16} className="text-textMain group-hover:text-black" />
                    </div>

                    {/* Content Card */}
                    <div className="w-[calc(100%-4rem)] lg:w-[calc(50%-2.5rem)] bg-surfaceHighlight p-6 rounded-[1.5rem] border border-borderColor hover:border-textMuted/20 transition-all">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                        <h5 className="font-bold text-lg text-textMain">{exp.role}</h5>
                        <span className="text-xs text-black bg-primary px-2 py-1 rounded-md w-fit mt-1 md:mt-0 font-medium">{exp.period}</span>
                      </div>
                      <p className="text-sm font-medium text-textMuted mb-2">{exp.company}</p>
                      <p className="text-sm text-textMuted leading-relaxed">{exp.description}</p>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 2. EDUCATION SECTION */}
          <section>
            <div className="bg-surface rounded-[2.5rem] p-6 md:p-8 border border-borderColor transition-colors duration-300">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-secondary/40 p-2 rounded-lg text-textMain">
                  <GraduationCap size={24} />
                </div>
                <h3 className="text-2xl font-bold text-textMain">Education</h3>
              </div>

              {/* Timeline: Using same zig-zag structure for consistency */}
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:w-0.5 before:-translate-x-px lg:before:mx-auto lg:before:translate-x-0 before:h-full before:bg-gradient-to-b before:from-transparent before:via-surfaceElevated before:to-transparent">
                {EDUCATION.map((edu, i) => (
                  <div key={edu.id} className="relative flex items-center justify-between lg:justify-normal lg:odd:flex-row-reverse group">
                    
                    {/* Timeline Dot */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-surface bg-surfaceElevated group-hover:bg-secondary transition-colors shrink-0 lg:order-1 lg:group-odd:-translate-x-1/2 lg:group-even:translate-x-1/2 z-10 shadow-xl">
                      <GraduationCap size={16} className="text-textMain group-hover:text-black" />
                    </div>

                    {/* Content Card */}
                    <div className="w-[calc(100%-4rem)] lg:w-[calc(50%-2.5rem)] bg-surfaceHighlight p-6 rounded-[1.5rem] border border-borderColor hover:border-textMuted/20 transition-all">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                        <h5 className="font-bold text-lg text-textMain">{edu.degree}</h5>
                        <span className="text-xs text-black bg-secondary px-2 py-1 rounded-md w-fit mt-1 md:mt-0 font-medium">{edu.period}</span>
                      </div>
                      <p className="text-sm font-medium text-textMuted mb-2">{edu.institution}</p>
                      <p className="text-sm text-textMuted leading-relaxed">{edu.description}</p>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* --- MAPS SECTION (INTERACTIVE) --- */}
        <section id="maps" className="mb-16">
          <div className="bg-surface rounded-[2.5rem] overflow-hidden border border-borderColor relative group select-none">
            
            {/* Header / Search Bar Lookalike */}
            <div className="absolute top-4 left-4 right-4 md:left-6 md:right-auto md:w-80 z-20 pointer-events-none">
              <div className="glass-panel rounded-full p-3 flex items-center shadow-lg pointer-events-auto">
                <Search size={18} className="text-textMuted ml-1" />
                <span className="ml-3 text-textMain font-medium text-sm">Suntree Art HQ, Jakarta</span>
                <div className="ml-auto flex gap-2">
                  <div className="p-1 rounded-full hover:bg-surfaceHighlight cursor-pointer">
                    <div className="w-6 h-6 rounded-full bg-googleBlue text-white flex items-center justify-center text-xs font-bold">S</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Map Container */}
            <div 
              ref={mapRef}
              className={`h-[400px] md:h-[500px] w-full relative bg-surfaceElevated overflow-hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchMove={handleMouseMove}
              onTouchEnd={handleMouseUp}
            >
               {/* Transformed Content (Map Layer) */}
               <div 
                  className="w-full h-full absolute top-0 left-0 transition-transform duration-100 ease-linear origin-center"
                  style={{ 
                    transform: `translate(${mapPosition.x}px, ${mapPosition.y}px) scale(${mapZoom})`,
                    willChange: 'transform'
                  }}
               >
                 {/* Grayscale Map Image */}
                 <img 
                  src="https://picsum.photos/seed/jakarta_map/1200/800" 
                  alt="Map Location" 
                  className="w-[120%] h-[120%] max-w-none object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-700 -translate-x-[10%] -translate-y-[10%]"
                  draggable={false}
                 />
                 
                 {/* Interactive Location Pin */}
                 <div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 cursor-pointer z-30"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMapDetails(!showMapDetails);
                    }}
                 >
                    <div className="relative group/pin">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-googleRed opacity-75 animate-ping"></span>
                      <div className={`relative p-2 ${showMapDetails ? 'bg-textMain' : 'bg-googleRed'} text-white rounded-full shadow-lg transform hover:scale-110 transition-all duration-300`}>
                        <MapPin size={24} fill="currentColor" />
                      </div>
                    </div>
                    
                    {!showMapDetails && (
                      <div className="bg-surface px-3 py-1 rounded-lg shadow-md text-xs font-bold text-textMain translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                        Click me
                      </div>
                    )}
                 </div>
               </div>
               
               {/* Controls UI */}
               <div className="absolute bottom-6 right-4 flex flex-col gap-2 z-20">
                 <button 
                    onClick={handleResetMap}
                    className="bg-surface p-2.5 rounded-full shadow-md hover:bg-surfaceHighlight text-textMuted hover:text-textMain transition-colors border border-borderColor" 
                    title="Reset View"
                 >
                   <Maximize size={18} />
                 </button>
                 <div className="flex flex-col gap-1 bg-surface rounded-full shadow-md border border-borderColor overflow-hidden">
                    <button 
                      onClick={handleZoomIn}
                      className="p-2.5 hover:bg-surfaceHighlight text-textMuted hover:text-textMain transition-colors border-b border-borderColor" 
                      title="Zoom In"
                    >
                      <Plus size={18} />
                    </button>
                    <button 
                      onClick={handleZoomOut}
                      className="p-2.5 hover:bg-surfaceHighlight text-textMuted hover:text-textMain transition-colors" 
                      title="Zoom Out"
                    >
                      <Minus size={18} />
                    </button>
                 </div>
               </div>
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
                   {[1,2,3,4,5].map(s => <Star key={s} size={14} fill="currentColor" />)}
                 </div>
                 <span className="text-textMuted text-sm ml-1">(128 reviews)</span>
               </div>
               
               <p className="text-sm text-textMuted mb-4 border-t border-borderColor pt-3">
                 Located in the heart of Jakarta. Open for visits by appointment. <br/>
                 <span className="text-googleGreen font-medium">Open now • Closes 6 PM</span>
               </p>

               <div className="flex gap-2">
                 <button className="flex-1 bg-googleBlue text-white py-2 rounded-full text-sm font-medium hover:bg-googleBlue/90 transition-colors shadow-lg shadow-googleBlue/20">
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
        </section>

        {/* --- CONTACT SECTION --- */}
        <section id="contact" className="mb-16">
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
                   <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037 13.46 13.46 0 0 0-.616 1.268 18.297 18.297 0 0 0-5.474 0 13.568 13.568 0 0 0-.618-1.268.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.086 2.157 2.419 0 1.334-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.086 2.157 2.419 0 1.334-.946 2.419-2.157 2.419z"/></svg>
                </a>
                <a href="#" className="w-12 h-12 rounded-full border border-borderColor flex items-center justify-center text-textMain hover:bg-textMain hover:text-background transition-colors" aria-label="Reddit">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm5.74-6.194a3.176 3.176 0 0 0-1.253-1.321 4.109 4.109 0 0 0 .614-2.174c0-2.288-1.854-3.79-5.1-3.79s-5.1 1.502-5.1 3.79a4.12 4.12 0 0 0 .61 2.173 3.187 3.187 0 0 0-1.259 1.325c-.23.634-.061 1.378.413 1.84.453.442 1.156.494 1.677.168.966.604 2.115.932 3.321.954l.564-2.653 1.859.398a1.69 1.69 0 0 0 1.664-1.294l.215-.815c1.205-.018 2.355-.348 3.323-.954.522.327 1.226.274 1.68-.168.473-.462.641-1.206.41-1.84zm-9.395-2.58a1.272 1.272 0 1 1 1.272-1.27 1.272 1.272 0 0 1-1.272 1.27zm6.65 3.354a2.91 2.91 0 0 1-4.022.003.553.553 0 0 1 .03-.783.552.552 0 0 1 .78.03 1.805 1.805 0 0 0 2.404 0 .553.553 0 0 1 .781.028.552.552 0 0 1 .028.783zm.643-2.083a1.272 1.272 0 1 1 1.272-1.272 1.272 1.272 0 0 1-1.272 1.27z"/></svg>
                </a>
                <a href="#" className="w-12 h-12 rounded-full border border-borderColor flex items-center justify-center text-textMain hover:bg-textMain hover:text-background transition-colors" aria-label="X">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
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
    </div>
  );
};

export default App;
