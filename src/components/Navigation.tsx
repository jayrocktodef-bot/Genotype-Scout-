import React from 'react';
import { motion } from 'motion/react';
import { LayoutGrid, Globe, HeartPulse, History, FlaskConical, Search, Menu, X, User } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: any) => void;
  onUploadNew: () => void;
  hasResults: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ 
  activeTab, 
  onTabChange, 
  onUploadNew,
  hasResults
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'summary', label: 'Profile', icon: User },
    { id: 'oracle', label: 'Ancestry', icon: Globe },
    { id: 'wellness', label: 'Wellness', icon: HeartPulse },
    { id: 'haplogroups', label: 'Lineages', icon: History },
    { id: 'autosomal', label: 'Markers', icon: FlaskConical },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => onTabChange('dashboard')}>
          <img 
            src="https://jequandavis.wpcomstaging.com/wp-content/uploads/2026/03/1000055020-e1773637919503.webp" 
            alt="Genotype Scout Logo"
            className="w-10 h-10 rounded-xl shadow-lg ring-4 ring-slate-100"
          />
          <div className="hidden sm:block">
            <h2 className="text-lg font-black tracking-tighter text-slate-800 leading-none">Genotype Scout</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">v3.4 Premium</p>
          </div>
        </div>

        {/* Desktop Tabs */}
        {hasResults && (
          <div className="hidden lg:flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                  activeTab === tab.id 
                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-200 scale-105' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-teal-400' : ''}`} />
                {tab.label}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4">
          <button 
            onClick={onUploadNew}
            className="px-6 py-2.5 bg-teal-600 text-white rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-teal-100 hover:bg-teal-700 hover:shadow-xl transition-all"
          >
            {hasResults ? 'New Analysis' : 'Get Started'}
          </button>
          
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-500 rounded-full hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden bg-white border-b border-slate-100 p-6 space-y-4"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                onTabChange(tab.id);
                setMobileMenuOpen(false);
              }}
              className={`flex items-center gap-4 w-full p-4 rounded-2xl text-base font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-slate-900 text-white' 
                  : 'text-slate-500 bg-slate-50'
              }`}
            >
              <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-teal-400' : ''}`} />
              {tab.label}
            </button>
          ))}
          
          <div className="pt-6 border-t border-slate-100 space-y-2">
            <a href="https://WrittenInTheGenome.blog" target="_blank" rel="noopener noreferrer" className="block p-3 text-sm font-bold text-slate-600 hover:text-teal-600">Blog</a>
            <a href="https://www.facebook.com/share/g/1EFyWD35tB/" target="_blank" rel="noopener noreferrer" className="block p-3 text-sm font-bold text-slate-600 hover:text-teal-600">Facebook Group</a>
            <a href="https://www.paypal.me/jequandavis" target="_blank" rel="noopener noreferrer" className="block p-3 text-sm font-bold text-slate-600 hover:text-teal-600">Support / Donate</a>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navigation;
