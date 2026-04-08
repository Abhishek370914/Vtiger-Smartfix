import React, { useState } from 'react';
import axios from 'axios';
import { Search, Send, BookOpen, ExternalLink, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useStore } from '@/lib/store';

export const KnowledgeBase: React.FC = () => {
  const { backendUrl } = useStore();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setErrorMsg(null);
    setAnswer(null);
    try {
      const response = await axios.post(`${backendUrl}/api/knowledge/search`, { query });
      setAnswer(response.data.answer);
    } catch (error: any) {
      console.error("Search failed", error);
      setErrorMsg(error?.response?.data?.error || "Search failed. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold flex items-center gap-2 border-none">
          <BookOpen className="text-yellow-500 w-6 h-6" />
          Smart Search
        </h2>
        <p className="text-sm text-gray-500">Find answers from docs and past instances.</p>
      </div>

      <form onSubmit={handleSearch} className="relative">
        <Input
          placeholder="Ask anything about Vtiger..."
          className="pr-10 h-12 shadow-sm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button 
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
          disabled={loading}
        >
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
          ) : (
            <Search className="w-5 h-5" />
          )}
        </button>
      </form>

      {errorMsg && (
        <div className="p-3 rounded-md flex items-center gap-2 text-xs font-medium bg-red-50 text-red-700 border border-red-100 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <p>{errorMsg}</p>
        </div>
      )}

      {!answer && !loading && !errorMsg && (
        <div className="grid grid-cols-2 gap-3">
          {['How to fix email sync?', 'Setup worklfows', 'REST API guide', 'Duplicate leads'].map(q => (
            <button 
                key={q}
                onClick={() => { setQuery(q); handleSearch(); }}
                className="text-[10px] text-left p-2 bg-white border rounded hover:border-primary hover:text-primary transition-all overflow-hidden text-ellipsis whitespace-nowrap"
            >
                {q}
            </button>
          ))}
        </div>
      )}

      {answer && (
        <div className="space-y-4 animate-in zoom-in-95 duration-300">
            <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-xs font-bold text-primary uppercase">AI Answer</span>
                    </div>
                    <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {answer}
                    </div>
                    <div className="pt-2 flex items-center gap-2">
                        <Button variant="link" className="p-0 h-auto text-[10px] gap-1">
                            Official Docs <ExternalLink className="w-3 h-3" />
                        </Button>
                        <Button variant="link" className="p-0 h-auto text-[10px] gap-1">
                            Community Forum <ExternalLink className="w-3 h-3" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
            <Button variant="ghost" className="w-full text-xs" onClick={() => setAnswer(null)}>
                Clear Search
            </Button>
        </div>
      )}
    </div>
  );
};
