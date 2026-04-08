import React from 'react';
import { ArrowRight, MessageSquare, ShieldCheck, Search, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isConfigured, vtigerUrl } = useStore();

  const features = [
    {
      title: "Ticket Assistant",
      description: "AI-powered analysis and reply templates for Vtiger tickets.",
      icon: MessageSquare,
      color: "bg-blue-500",
      path: "/ticket"
    },
    {
      title: "Health Check",
      description: "Diagnostic tools to ensure your CRM is running smoothly.",
      icon: ShieldCheck,
      color: "bg-green-500",
      path: "/health"
    },
    {
      title: "KB Search",
      description: "Smart AI search across docs and instance knowledge.",
      icon: Search,
      color: "bg-yellow-500",
      path: "/search"
    }
  ];

  if (!isConfigured) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-6">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
            <Zap className="text-primary w-10 h-10" />
        </div>
        <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 border-none">Welcome to SmartFix</h2>
            <p className="text-gray-500">Connect your Vtiger instance to unlock AI-powered features.</p>
        </div>
        <Button onClick={() => navigate('/settings')} className="w-full h-12 text-lg">
            Connect to Vtiger <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-gray-900 border-none">Dashboard</h2>
        <p className="text-sm text-gray-500 truncate">Instance: {vtigerUrl}</p>
      </div>

      <div className="grid gap-4">
        {features.map((f) => (
          <Card 
            key={f.path} 
            className="cursor-pointer hover:shadow-md transition-all active:scale-[0.98]"
            onClick={() => navigate(f.path)}
          >
            <CardHeader className="flex flex-row items-center gap-4 p-4">
              <div className={`w-10 h-10 ${f.color} rounded-lg flex items-center justify-center shrink-0`}>
                <f.icon className="text-white w-5 h-5" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-base">{f.title}</CardTitle>
                <CardDescription className="text-xs line-clamp-1">{f.description}</CardDescription>
              </div>
              <ArrowRight className="ml-auto w-4 h-4 text-gray-400" />
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 space-y-2">
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full animate-ping"></div>
            <span className="text-xs font-semibold text-primary uppercase">Status</span>
        </div>
        <p className="text-sm font-medium">All systems operational</p>
        <p className="text-[10px] text-gray-400 italic">Last checked: Just now</p>
      </div>
    </div>
  );
};
