import React from 'react';
import { motion } from 'motion/react';
import { LayoutGrid, Globe, HeartPulse, History, FlaskConical, Database, Menu, X, User, Compass, BookOpen, Droplet } from 'lucide-react';

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

  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'summary', label: 'Profile', icon: User },
    { id: 'ancestry', label: 'Ancestry & Pop', icon: Globe },
    { id: 'history', label: 'Lineages & History', icon: History },
    { id: 'health_traits', label: 'Health & Traits', icon: HeartPulse },
    { id: 'autosomal', label: 'Markers', icon: Database },
    { id: 'methodology', label: 'Methodology', icon: BookOpen }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => {
          onTabChange('dashboard');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}>
          <img 
            src="https://writteninthegenome.blog/wp-content/uploads/2026/03/cropped-1000055020-e1773637919503.webp" 
            alt="Genotype Scout Logo"
            className="w-10 h-10 rounded-xl shadow-lg ring-4 ring-slate-100"
          />
          <div className="hidden sm:block">
            <h2 className="text-lg font-black tracking-tighter text-slate-800 leading-none">Genotype Scout</h2>
            <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest mt-1 flex items-center gap-1.5">
              V4.0 BETA
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span>
            </p>
          </div>
        </div>

        {/* Desktop Tabs */}
        {hasResults && (
          <div className="hidden xl:flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  onTabChange(tab.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-[11px] font-black uppercase tracking-wider transition-all ${
                  activeTab === tab.id 
                    ? 'bg-slate-900 text-white shadow-md scale-105' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <tab.icon className={`w-3.5 h-3.5 ${activeTab === tab.id ? 'text-teal-400' : ''}`} />
                {tab.label}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3">
          {hasResults && (
            <button 
              onClick={onUploadNew}
              className="hidden sm:inline-flex px-5 py-2.5 bg-teal-600 text-white rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-teal-100 hover:bg-teal-700 hover:shadow-xl transition-all"
            >
              New Analysis
            </button>
          )}
          
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2.5 text-slate-650 rounded-xl hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="xl:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
            onClick={() => setMobileMenuOpen(false)}
          />
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="xl:hidden fixed top-20 left-0 right-0 bottom-0 bg-white border-t border-slate-100 z-40 flex flex-col"
          >
            <div className="flex-1 overflow-y-auto p-4 pb-6 space-y-2">
              {hasResults && tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    onTabChange(tab.id);
                    setMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`flex items-center gap-4 w-full p-4 rounded-2xl text-base font-bold transition-all ${
                    activeTab === tab.id 
                      ? 'bg-slate-900 text-white shadow-md' 
                      : 'text-slate-600 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-teal-400' : ''}`} />
                  {tab.label}
                </button>
              ))}

              {hasResults && (
                <button
                  onClick={() => {
                    onUploadNew();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-4 w-full p-4 rounded-2xl text-base font-bold bg-teal-50 text-teal-700 hover:bg-teal-100 transition-all mt-2"
                >
                  <FlaskConical className="w-5 h-5" />
                  New Analysis
                </button>
              )}
            </div>

            <div className="p-4 pt-3 border-t border-slate-100 space-y-1 shrink-0 bg-white">
              <a href="https://WrittenInTheGenome.blog" target="_blank" rel="noopener noreferrer" className="block p-3 text-sm font-bold text-slate-650 hover:text-teal-600 transition-colors rounded-xl hover:bg-slate-50">Blog</a>
              <a href="https://www.facebook.com/share/g/1EFyWD35tB/" target="_blank" rel="noopener noreferrer" className="block p-3 text-sm font-bold text-slate-650 hover:text-teal-600 transition-colors rounded-xl hover:bg-slate-50">Facebook Group</a>
              <a href="https://www.paypal.me/jequandavis" target="_blank" rel="noopener noreferrer" className="block p-3 text-sm font-bold text-slate-650 hover:text-teal-600 transition-colors rounded-xl hover:bg-slate-50">Support / Donate</a>
            </div>
          </motion.div>
        </>
      )}
    </nav>
  );
};

export default Navigation;
