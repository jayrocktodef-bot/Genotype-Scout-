import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  Legend, RadialBarChart, RadialBar, PolarAngleAxis 
} from 'recharts';
import { 
  Droplet, Eye, Activity, Map, ArrowRight, 
  Wind, Heart, Shield, Fingerprint, Zap
} from 'lucide-react';

interface DashboardProps {
  oracleResults: any;
  populationProximity: any[];
  dataset: any;
  userSnps: Record<string, string>;
  onNavigateToTab: (tab: any) => void;
  onReset: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  oracleResults, 
  populationProximity, 
  dataset, 
  userSnps,
  onNavigateToTab,
  onReset
}) => {
  const primaryAncestry = oracleResults?.primary?.continentalScores || {};
  
  const chartData = useMemo(() => {
    return Object.entries(primaryAncestry)
      .map(([name, value]) => ({ 
        name, 
        value: Math.round(Number(value) * 10) / 10 
      }))
      .sort((a, b) => b.value - a.value);
  }, [primaryAncestry]);

  const COLORS = ['#0d9488', '#6366f1', '#f43f5e', '#f59e0b', '#8b5cf6', '#10b981'];

  const greeting = useMemo(() => {
    const hours = new Date().getHours();
    if (hours < 12) return "Good Morning";
    if (hours < 18) return "Good Afternoon";
    return "Good Evening";
  }, []);

  const topRegionsCount = chartData.filter(d => d.value > 1).length;
  const healthMarkersCount = dataset?.results?.filter((r: any) => 
    r.category === 'Health' && (r.status === 'matched' || r.status === 'partial')
  ).length || 0;

  return (
    <div className="space-y-8 animate-fade-up pb-20">
      {/* Hero Header */}
      <section className="pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-800 mb-4">
            {greeting}, Explorer.
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl leading-relaxed">
            Welcome to Genotype Scout. Your genomic analysis is complete, revealing deep roots across 
            <span className="text-teal-600 font-bold mx-1">{topRegionsCount} global regions</span> 
            and <span className="text-teal-600 font-bold mx-1">{healthMarkersCount} optimized health markers</span>.
          </p>
        </motion.div>
      </section>

      {/* Main Ancestry Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="premium-card p-8 sm:p-12 overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-50/50 rounded-full blur-3xl -mr-32 -mt-32"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="h-[350px] relative min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={350} debounce={1}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  animationBegin={500}
                  animationDuration={1500}
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '1.5rem', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    padding: '12px 16px'
                  }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Global Roots</span>
              <span className="text-4xl font-black text-slate-800">{chartData[0]?.value || 0}%</span>
              <span className="text-[10px] font-bold text-slate-500 truncate max-w-[120px]">{chartData[0]?.name}</span>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-slate-800 mb-2">Ancestry Overview</h2>
              <p className="text-slate-500 font-medium">Tracing your lineage through continental admixture modeling.</p>
            </div>

            <div className="space-y-4">
              {chartData.slice(0, 3).map((item, idx) => (
                <div key={item.name} className="flex flex-col gap-1">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-bold text-slate-700">{item.name}</span>
                    <span className="text-sm font-black text-teal-600">{item.value}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ duration: 1.5, delay: 0.5 + idx * 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => onNavigateToTab('oracle')}
              className="group flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm transition-all hover:bg-slate-800 hover:shadow-xl shadow-slate-200"
            >
              Dive into Regional Genetics
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Wellness & Traits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Nutrition Card */}
        <motion.div 
          onClick={() => onNavigateToTab('wellness')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="premium-card p-8 group cursor-pointer"
        >
          <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 mb-6 transition-transform group-hover:scale-110">
            <Activity className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Nutrition & Vitality</h3>
          <p className="text-sm text-slate-500 leading-relaxed mb-6">
            Explore how your body processes vitamins, minerals, and dietary compounds based on metabolic variants.
          </p>
          <div className="flex items-center text-teal-600 text-xs font-black uppercase tracking-widest gap-2">
            Explore Markers <ArrowRight className="w-3 h-3" />
          </div>
        </motion.div>

        {/* Physical Traits Card */}
        <motion.div 
          onClick={() => onNavigateToTab('autosomal')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="premium-card p-8 group cursor-pointer"
        >
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6 transition-transform group-hover:scale-110">
            <Eye className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Physical Traits</h3>
          <p className="text-sm text-slate-500 leading-relaxed mb-6">
            From eye color to hair texture, understand the phenotypic clusters linked to your genetic signature.
          </p>
          <div className="flex items-center text-indigo-600 text-xs font-black uppercase tracking-widest gap-2">
            View Phenotype <ArrowRight className="w-3 h-3" />
          </div>
        </motion.div>

        {/* Ancestral Migration */}
        <motion.div 
          onClick={() => onNavigateToTab('haplogroups')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="premium-card p-8 group cursor-pointer"
        >
          <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 mb-6 transition-transform group-hover:scale-110">
            <Map className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Ancestral Migration</h3>
          <p className="text-sm text-slate-500 leading-relaxed mb-6">
            Trace your deep maternal and paternal lines through thousands of years of human movement.
          </p>
          <div className="flex items-center text-rose-600 text-xs font-black uppercase tracking-widest gap-2">
            Trace Odyssey <ArrowRight className="w-3 h-3" />
          </div>
        </motion.div>

        {/* Blood Type & Identity */}
        <motion.div 
          onClick={() => onNavigateToTab('blood')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="premium-card p-8 group cursor-pointer"
        >
          <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-red-600 mb-6 transition-transform group-hover:scale-110">
            <Droplet className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Genetic Identity</h3>
          <p className="text-sm text-slate-500 leading-relaxed mb-6">
            Determine your likely blood type and unique genetic identifiers captured in your raw data.
          </p>
          <div className="flex items-center text-red-600 text-xs font-black uppercase tracking-widest gap-2">
            View Identity <ArrowRight className="w-3 h-3" />
          </div>
        </motion.div>

        {/* Famous Matches */}
        <motion.div 
          onClick={() => onNavigateToTab('summary')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="premium-card p-8 group cursor-pointer"
        >
          <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 mb-6 transition-transform group-hover:scale-110">
            <Shield className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Famous Comparisons</h3>
          <p className="text-sm text-slate-500 leading-relaxed mb-6">
            See how your genetic profile compares against historical figures and ancient genomic samples.
          </p>
          <div className="flex items-center text-amber-600 text-xs font-black uppercase tracking-widest gap-2">
            View Matches <ArrowRight className="w-3 h-3" />
          </div>
        </motion.div>

        {/* System & Markers */}
        <motion.div 
          onClick={() => onNavigateToTab('markers')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="premium-card p-8 group cursor-pointer"
        >
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6 transition-transform group-hover:scale-110">
            <Fingerprint className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Diagnostic Data</h3>
          <p className="text-sm text-slate-500 leading-relaxed mb-6">
            Review technical call rates, chip manufacturers, and raw SNP density used for this analysis.
          </p>
          <div className="flex items-center text-blue-600 text-xs font-black uppercase tracking-widest gap-2">
            Technical Data <ArrowRight className="w-3 h-3" />
          </div>
        </motion.div>
      </div>

      {/* Danger Zone / Reset */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="pt-12 pb-8 flex flex-col items-center justify-center border-t border-slate-100"
      >
        <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Session Management</p>
        <button 
          onClick={onReset}
          className="px-10 py-4 bg-rose-50 text-rose-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-100 transition-all border border-rose-100"
        >
          Reset Analysis & Clear Cache
        </button>
      </motion.div>
    </div>
  );
};

export default Dashboard;
