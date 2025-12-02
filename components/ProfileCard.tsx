import React from 'react';
import { Download, Send, Github, Linkedin, Twitter, Globe } from 'lucide-react';
import { PROFILE } from '../constants';
import { SectionId } from '../types';

interface ProfileCardProps {
  onNavigate?: (section: SectionId) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ onNavigate }) => {
  return (
    <div className="bg-surface rounded-[2rem] p-6 lg:p-6 flex flex-col sm:flex-row lg:flex-col items-center sm:items-start lg:items-center text-center sm:text-left lg:text-center h-full border border-borderColor relative overflow-hidden group transition-colors duration-300">
      
      {/* Abstract Background Decoration */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700"></div>
      <div className="absolute top-40 -left-20 w-40 h-40 bg-secondary/10 rounded-full blur-3xl"></div>

      {/* Image */}
      <div className="relative mb-6 sm:mb-0 sm:mr-8 lg:mr-0 lg:mb-6 z-10 shrink-0">
        <div className="w-40 h-40 md:w-32 md:h-32 lg:w-56 lg:h-56 rounded-[2rem] overflow-hidden border-4 border-surfaceHighlight shadow-2xl mx-auto sm:mx-0">
          <img 
            src="https://picsum.photos/seed/suntree/800/800" 
            alt="Profile" 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <div className="absolute bottom-2 right-2 lg:right-4 w-4 h-4 bg-primary rounded-full border-2 border-surface animate-pulse"></div>
      </div>

      {/* Text Info */}
      <div className="z-10 w-full flex flex-col h-full justify-center">
        <h2 className="text-3xl font-bold text-textMain mb-1 tracking-tight">{PROFILE.name}</h2>
        
        <div className="flex flex-col sm:flex-row lg:flex-col items-center sm:items-start lg:items-center gap-2 mb-6 sm:mb-4 lg:mb-6">
           <span className="text-textMuted text-sm">{PROFILE.role}</span>
           <div className="inline-flex items-center gap-2 bg-surfaceElevated px-3 py-1 rounded-full text-xs font-medium text-textMuted">
            <span className="w-2 h-2 rounded-full bg-googleGreen"></span>
            Available
          </div>
        </div>

        {/* Social Row */}
        <div className="flex justify-center sm:justify-start lg:justify-center gap-3 mb-8 sm:mb-6 lg:mb-8">
          {[
            { icon: <Github size={18} />, href: PROFILE.social.github },
            { icon: <Linkedin size={18} />, href: PROFILE.social.linkedin },
            { icon: <Twitter size={18} />, href: PROFILE.social.twitter },
            { icon: <Globe size={18} />, href: "#" }
          ].map((social, idx) => (
            <a 
              key={idx} 
              href={social.href}
              className="w-10 h-10 rounded-full bg-surfaceElevated flex items-center justify-center text-textMuted hover:bg-textMain hover:text-background hover:scale-110 transition-all duration-300"
            >
              {social.icon}
            </a>
          ))}
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-3 w-full mt-auto sm:mt-0 lg:mt-auto">
          <button className="flex items-center justify-center gap-2 bg-surfaceElevated hover:bg-surfaceHighlight text-textMain py-4 rounded-2xl transition-all font-medium text-sm group/btn border border-borderColor">
            <Download size={16} className="group-hover/btn:-translate-y-1 transition-transform" />
            <span>CV</span>
          </button>
          <button 
            onClick={() => onNavigate && onNavigate('contact')}
            className="flex items-center justify-center gap-2 bg-textMain hover:bg-textMain/80 text-background py-4 rounded-2xl transition-all font-medium text-sm"
          >
            <Send size={16} />
            <span>Contact</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;