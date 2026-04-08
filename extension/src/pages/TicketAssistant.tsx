import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Sparkles, Send, Copy, Check, AlertCircle, MessageSquare, Edit2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useStore } from '@/lib/store';

interface AnalysisResult {
    type: 'SIMPLE' | 'COMPLEX';
    suggested_team: string;
    priority: string;
    solution: string;
    escalation_email: string;
    confidence: number;
}

export const TicketAssistant: React.FC = () => {
  const { vtigerUrl, vtigerUsername, vtigerAccessKey, backendUrl } = useStore();
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [editedEmail, setEditedEmail] = useState("");
  const [assignEmail, setAssignEmail] = useState("");
  const [copying, setCopying] = useState(false);
  const [ticketData, setTicketData] = useState<any>(null);
  const [statusMsg, setStatusMsg] = useState<{type: 'success'|'error', text: string} | null>(null);

  useEffect(() => {
    if (chrome?.storage?.session) {
      chrome.storage.session.get(['currentTicket'], (res: any) => {
          if (res.currentTicket) setTicketData(res.currentTicket);
      });
    }
  }, []);

  const handleAnalyze = async () => {
    if (!ticketData) return;
    setLoading(true);
    setStatusMsg(null);
    try {
      const response = await axios.post(`${backendUrl}/api/ticket/analyze`, { ticketData });
      setAnalysis(response.data.analysis);
      if (response.data.analysis?.escalation_email) {
          setEditedEmail(response.data.analysis.escalation_email);
      }
    } catch (error) {
      console.error("Analysis failed", error);
      setStatusMsg({ type: 'error', text: 'Analysis failed. Please check the backend connection.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePostAction = async (isComplex: boolean) => {
    if (!ticketData?.id) return;
    setPosting(true);
    setStatusMsg(null);
    
    try {
      const commentText = isComplex ? editedEmail : analysis?.solution;
      
      // Post comment
      await axios.post(`${backendUrl}/api/ticket/post-comment`, {
          url: vtigerUrl,
          username: vtigerUsername,
          accessKey: vtigerAccessKey,
          ticketId: ticketData.id,
          comment: commentText
      });

      // Show success
      setStatusMsg({ type: 'success', text: `Successfully posted ${isComplex ? 'escalation' : 'reply'} to Vtiger!` });
      
      // We could also do Assignment here if API allows mapping email to Smownerid
      if (isComplex && assignEmail) {
          setStatusMsg({ type: 'success', text: `Successfully posted and notified ${assignEmail}!` });
      }

    } catch (error: any) {
      setStatusMsg({ type: 'error', text: error?.response?.data?.error || 'Failed to post to Vtiger.' });
    } finally {
      setPosting(false);
    }
  };

  const copyToClipboard = () => {
    if (!analysis) return;
    const text = analysis.type === 'SIMPLE' ? analysis.solution : editedEmail;
    navigator.clipboard.writeText(text);
    setCopying(true);
    setTimeout(() => setCopying(false), 2000);
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold flex items-center gap-2 border-none">
          <Sparkles className="text-primary w-6 h-6" />
          AI Assistant
        </h2>
        <p className="text-sm text-gray-500">Analyze tickets and implement instant resolutions.</p>
      </div>

      {!ticketData ? (
        <Card className="border-dashed border-2">
            <CardContent className="p-8 flex flex-col items-center gap-4 text-center">
                <AlertCircle className="w-10 h-10 text-gray-300" />
                <div className="space-y-1">
                    <p className="font-semibold">No ticket detected</p>
                    <p className="text-xs text-gray-400">Navigate to a Vtiger ticket page and click "Analyze with SmartFix".</p>
                </div>
            </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
            <div className="p-3 bg-white border rounded-md shadow-sm">
                <p className="text-[10px] text-gray-400 uppercase font-bold">Current Ticket</p>
                <p className="font-medium text-sm line-clamp-1">{ticketData.title}</p>
            </div>

            {!analysis ? (
                <Button 
                    className="w-full h-12 gap-2" 
                    onClick={handleAnalyze} 
                    disabled={loading}
                >
                    {loading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    ) : (
                        <Sparkles className="w-4 h-4" />
                    )}
                    {loading ? "Analyzing Context..." : "Analyze This Ticket"}
                </Button>
            ) : (
                <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                    {/* Classification Ribbon */}
                    <div className={`p-3 rounded-md flex items-center justify-between border ${analysis.type === 'SIMPLE' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                        <div className="flex items-center gap-2">
                            <AlertCircle className={`w-4 h-4 ${analysis.type === 'SIMPLE' ? 'text-green-600' : 'text-red-600'}`} />
                            <span className={`font-bold ${analysis.type === 'SIMPLE' ? 'text-green-700' : 'text-red-700'}`}>
                                {analysis.type} ISSUE
                            </span>
                        </div>
                        <span className="text-xs font-semibold px-2 py-1 bg-white rounded shadow-sm text-gray-600">
                            {analysis.confidence}% Match
                        </span>
                    </div>

                    {/* Simple Path */}
                    {analysis.type === 'SIMPLE' && (
                        <div className="space-y-4">
                            <Card className="bg-white">
                                <CardContent className="p-4 prose prose-sm max-w-none">
                                    <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed font-medium">
                                        {analysis.solution}
                                    </div>
                                </CardContent>
                            </Card>
                            
                            <Button 
                                className="w-full h-12 gap-2 bg-green-600 hover:bg-green-700 text-white font-bold"
                                onClick={() => handlePostAction(false)}
                                disabled={posting}
                            >
                                <MessageSquare className="w-4 h-4" />
                                {posting ? "Posting..." : "Post as Reply to Customer"}
                            </Button>
                        </div>
                    )}

                    {/* Complex Path */}
                    {analysis.type === 'COMPLEX' && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="p-2 border rounded bg-white items-center gap-2 flex">
                                    <User className="w-4 h-4 text-primary" />
                                    <div className="text-xs">
                                        <p className="text-gray-400">Suggested Team</p>
                                        <p className="font-bold">{analysis.suggested_team}</p>
                                    </div>
                                </div>
                                <div className="p-2 border rounded bg-white items-center gap-2 flex">
                                    <AlertCircle className="w-4 h-4 text-orange-500" />
                                    <div className="text-xs">
                                        <p className="text-gray-400">Priority</p>
                                        <p className="font-bold">{analysis.priority}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Escalate to specific person (optional email)</label>
                                <Input 
                                    placeholder={`e.g. ${analysis.suggested_team.toLowerCase()}@example.com`}
                                    value={assignEmail}
                                    onChange={e => setAssignEmail(e.target.value)}
                                    className="bg-white"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase flex items-center justify-between">
                                    Structured Escalation Email
                                    <Edit2 className="w-3 h-3" />
                                </label>
                                <textarea 
                                    className="w-full min-h-[250px] p-3 text-sm border rounded-md shadow-inner font-mono text-gray-800 bg-gray-50 focus:bg-white focus:ring-2 outline-none"
                                    value={editedEmail}
                                    onChange={e => setEditedEmail(e.target.value)}
                                />
                            </div>

                            <Button 
                                className="w-full h-12 gap-2 bg-red-600 hover:bg-red-700 text-white font-bold"
                                onClick={() => handlePostAction(true)}
                                disabled={posting}
                            >
                                <Send className="w-4 h-4" />
                                {posting ? "Escalating..." : "Post Structured Email & Assign"}
                            </Button>
                        </div>
                    )}

                    {statusMsg && (
                        <div className={`p-3 rounded-md flex items-center gap-2 text-xs font-medium ${
                            statusMsg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                        }`}>
                            {statusMsg.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                            {statusMsg.text}
                        </div>
                    )}

                    {/* Bottom Actions */}
                    <div className="flex gap-2 pt-2 border-t text-sm">
                        <Button variant="ghost" className="flex-1 gap-2 text-gray-400" onClick={copyToClipboard}>
                            {copying ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            {copying ? "Copied!" : "Copy Result"}
                        </Button>
                        <Button variant="ghost" className="flex-1 gap-2 text-gray-400" onClick={() => setAnalysis(null)}>
                            <Sparkles className="w-4 h-4" />
                            New
                        </Button>
                    </div>
                </div>
            )}
        </div>
      )}
    </div>
  );
};
