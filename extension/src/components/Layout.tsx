import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, MessageSquare, ShieldCheck, Search, Settings, HelpCircle } from 'lucide-react';
import { cn } from './ui/button';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: MessageSquare, label: 'Ticket Assistant', path: '/ticket' },
    { icon: ShieldCheck, label: 'Health Check', path: '/health' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="flex flex-col h-screen w-[400px] bg-neutral overflow-hidden">
      <header className="flex items-center justify-between p-4 bg-white border-b shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <ShieldCheck className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-lg text-primary">SmartFix</span>
        </div>
        <button className="text-secondary hover:text-primary transition-colors">
          <HelpCircle className="w-5 h-5" />
        </button>
      </header>
      
      <main className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {children}
      </main>

      <nav className="flex justify-around items-center p-2 bg-white border-t">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              cn(
                "flex flex-col items-center gap-1 p-2 rounded-md transition-all",
                isActive ? "text-primary bg-primary/10" : "text-secondary hover:text-primary hover:bg-neutral"
              )
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
