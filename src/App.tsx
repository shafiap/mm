/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, ChangeEvent, FormEvent, InputHTMLAttributes } from 'react';
import { 
  Menu, 
  Search, 
  UserPlus, 
  Edit2, 
  Trash2, 
  ArrowRight, 
  ClipboardList, 
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Personnel, Role, Stats } from './types';

const INITIAL_PERSONNEL: Personnel[] = [
  {
    id: '1',
    fullName: 'Sarah Mitchell',
    email: 'sarah.m@kinetic.edu',
    role: 'Admin',
    department: 'Faculty of Design',
    initials: 'SM',
    bgColor: 'bg-emerald-100 text-primary',
  },
  {
    id: '2',
    fullName: 'Robert Kovic',
    email: 'r.kovic@kinetic.edu',
    role: 'Faculty',
    department: 'Department of Engineering',
    initials: 'RK',
    bgColor: 'bg-orange-100 text-tertiary',
  },
  {
    id: '3',
    fullName: 'Elena Laurent',
    email: 'e.laurent@kinetic.edu',
    role: 'Faculty',
    department: 'Liberal Arts',
    initials: 'EL',
    bgColor: 'bg-blue-100 text-blue-700',
  },
];

const INITIAL_STATS: Stats = {
  totalUsers: 1284,
  activeFaculty: 82,
  pendingInvites: 14,
};

export default function App() {
  const [personnel, setPersonnel] = useState<Personnel[]>(INITIAL_PERSONNEL);
  const [stats, setStats] = useState<Stats>(INITIAL_STATS);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: 'Faculty' as Role,
    department: '',
  });

  const filteredPersonnel = useMemo(() => {
    return personnel.filter(p => 
      p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [personnel, searchQuery]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) return;

    const initials = formData.fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const newPerson: Personnel = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      initials,
      bgColor: formData.role === 'Admin' ? 'bg-emerald-100 text-primary' : 'bg-blue-100 text-blue-700',
    };

    setPersonnel(prev => [newPerson, ...prev]);
    setStats(prev => ({ ...prev, totalUsers: prev.totalUsers + 1 }));
    setFormData({ fullName: '', email: '', role: 'Faculty', department: '' });
  };

  const handleDelete = (id: string) => {
    setPersonnel(prev => prev.filter(p => p.id !== id));
    setStats(prev => ({ ...prev, totalUsers: prev.totalUsers - 1 }));
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-50/80 backdrop-blur-md px-6 py-4 flex justify-between items-center border-b border-slate-200/50">
        <div className="flex items-center gap-4">
          <button className="p-1 hover:bg-slate-200 rounded-lg transition-colors">
            <Menu className="w-6 h-6 text-primary" />
          </button>
          <h1 className="text-xl font-extrabold tracking-tighter text-emerald-800 headline-font">
            Kinetic Workspace
          </h1>
        </div>
        <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white shadow-sm">
          <img 
            alt="User Profile" 
            src="https://picsum.photos/seed/professional/100/100" 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Stats Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard label="Total Users" value={stats.totalUsers.toLocaleString()} color="text-primary" />
          <StatCard label="Active Faculty" value={stats.activeFaculty.toLocaleString()} color="text-primary" />
          <StatCard label="Pending Invites" value={stats.pendingInvites.toLocaleString()} color="text-tertiary" highlight />
        </section>

        {/* Add User Form */}
        <section className="bg-surface-container-low p-8 rounded-[2rem] shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <UserPlus className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-extrabold headline-font tracking-tight">Add New User/Faculty</h2>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputGroup 
              label="Full Name" 
              name="fullName" 
              placeholder="e.g. Dr. Julian Voss" 
              value={formData.fullName} 
              onChange={handleInputChange} 
            />
            <InputGroup 
              label="Email Address" 
              name="email" 
              type="email" 
              placeholder="julian.v@kinetic.edu" 
              value={formData.email} 
              onChange={handleInputChange} 
            />
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant px-1">Role</label>
              <div className="relative">
                <select 
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full bg-surface-container-lowest border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 transition-all text-on-surface appearance-none cursor-pointer"
                >
                  <option value="Faculty">Faculty</option>
                  <option value="Admin">Admin</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
              </div>
            </div>
            <InputGroup 
              label="Department / Faculty Name" 
              name="department" 
              placeholder="e.g. Applied Sciences" 
              value={formData.department} 
              onChange={handleInputChange} 
            />
            <div className="md:col-span-2 pt-4">
              <motion.button 
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full md:w-auto px-10 py-4 bg-gradient-to-b from-primary to-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-primary/10 hover:opacity-95 transition-all"
              >
                Create User Identity
              </motion.button>
            </div>
          </form>
        </section>

        {/* Personnel List */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-2xl font-extrabold headline-font tracking-tight">Current Personnel</h2>
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
              <input 
                type="text"
                placeholder="Search by name, faculty or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-surface-container-high border-none rounded-full focus:ring-2 focus:ring-primary/10 transition-all text-sm"
              />
            </div>
          </div>

          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredPersonnel.map((person) => (
                <motion.div 
                  key={person.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group bg-surface-container-lowest p-4 rounded-full flex items-center gap-4 hover:bg-emerald-50 transition-colors border border-transparent hover:border-emerald-100"
                >
                  <div className={`w-12 h-12 ${person.bgColor} rounded-xl flex items-center justify-center font-bold headline-font`}>
                    {person.initials}
                  </div>
                  <div className="flex-grow">
                    <div className="font-bold text-on-surface headline-font">{person.fullName}</div>
                    <div className="text-xs text-on-surface-variant">
                      {person.department} • {person.email}
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <span className="px-3 py-1 bg-surface-container rounded-full text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                      {person.role}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <button className="p-2 text-primary hover:bg-white rounded-full transition-colors active:scale-90">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(person.id)}
                      className="p-2 text-red-500 hover:bg-white rounded-full transition-colors active:scale-90"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {filteredPersonnel.length === 0 && (
              <div className="text-center py-12 text-on-surface-variant italic">
                No personnel found matching your search.
              </div>
            )}
          </div>

          <div className="flex justify-center pt-4">
            <button className="text-primary font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:underline transition-all">
              View All Personnel
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-3 bg-white/80 backdrop-blur-xl border-t border-slate-100 rounded-t-[2.5rem] shadow-[0_-4px_24px_rgba(0,109,60,0.06)]">
        <button className="flex flex-col items-center justify-center text-slate-400 px-6 py-2 hover:text-primary transition-colors">
          <ClipboardList className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Tasks</span>
        </button>
        <button className="flex flex-col items-center justify-center bg-emerald-50 text-primary rounded-2xl px-8 py-2 shadow-sm">
          <ShieldCheck className="w-6 h-6 mb-1 fill-primary/10" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Admin</span>
        </button>
      </nav>
    </div>
  );
}

function StatCard({ label, value, color, highlight }: { label: string, value: string, color: string, highlight?: boolean }) {
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className={`bg-surface-container-lowest p-6 rounded-[2.5rem] shadow-sm flex flex-col items-center justify-center text-center border-2 ${highlight ? 'border-primary/5' : 'border-transparent'}`}
    >
      <span className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-1 font-bold">{label}</span>
      <span className={`text-4xl font-extrabold headline-font ${color}`}>{value}</span>
    </motion.div>
  );
}

function InputGroup({ label, ...props }: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant px-1">{label}</label>
      <input 
        className="w-full bg-surface-container-lowest border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 transition-all text-on-surface placeholder:text-slate-300" 
        {...props} 
      />
    </div>
  );
}
