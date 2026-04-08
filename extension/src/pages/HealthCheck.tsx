import React, { useState } from 'react';
import axios from 'axios';
import { ShieldCheck, Play, RefreshCw, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useStore } from '@/lib/store';

export const HealthCheck: React.FC = () => {
  const { backendUrl } = useStore();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);

  const runCheck = async () => {
    setLoading(true);
    setResults(null);
    try {
      const response = await axios.post(`${backendUrl}/api/health`, {});
      // Simulate progress
      setTimeout(() => {
        setResults(response.data.checks);
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Health check failed", error);
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'danger': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold flex items-center gap-2 border-none">
          <ShieldCheck className="text-green-500 w-6 h-6" />
          Health Check
        </h2>
        <p className="text-sm text-gray-500">Run diagnostics on your Vtiger instance.</p>
      </div>

      {!results && !loading ? (
        <Card className="bg-white">
            <CardContent className="p-8 flex flex-col items-center gap-6 text-center">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                    <ShieldCheck className="w-8 h-8 text-green-500" />
                </div>
                <div className="space-y-2">
                    <p className="font-semibold text-lg">System Integrity Test</p>
                    <p className="text-xs text-gray-400">Check for API connectivity, common bugs after updates, performance issues, and broken workflows.</p>
                </div>
                <Button onClick={runCheck} className="w-full gap-2 bg-green-600 hover:bg-green-700">
                    <Play className="w-4 h-4 fill-current" />
                    Start Full Scan
                </Button>
            </CardContent>
        </Card>
      ) : loading ? (
        <div className="space-y-8 animate-pulse p-4">
            <div className="space-y-4">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="flex items-center gap-4">
                        <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                            <div className="h-2 bg-gray-100 rounded w-ful"></div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex flex-col items-center gap-2">
                <p className="text-xs font-medium text-gray-400 animate-bounce">Scanning system files...</p>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-green-500 h-full w-1/2 animate-infinite-scroll"></div>
                </div>
            </div>
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in duration-500">
            {results?.map((res) => (
                <Card key={res.id}>
                    <CardContent className="p-4 flex items-start gap-4">
                        <div className="shrink-0 mt-0.5">
                            {getStatusIcon(res.status)}
                        </div>
                        <div className="space-y-1">
                            <p className="font-semibold text-sm">{res.name}</p>
                            <p className="text-xs text-gray-500">{res.detail}</p>
                        </div>
                        {res.status !== 'success' && (
                            <Button size="sm" variant="ghost" className="ml-auto text-primary text-[10px] h-7 px-2">
                                Fix
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ))}
            <Button onClick={runCheck} variant="outline" className="w-full gap-2 border-green-200 text-green-700 hover:bg-green-50">
                <RefreshCw className="w-4 h-4" />
                Run Again
            </Button>
        </div>
      )}
    </div>
  );
};
