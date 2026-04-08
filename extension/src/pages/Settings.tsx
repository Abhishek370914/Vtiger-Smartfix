import React, { useState } from 'react';
import axios from 'axios';
import { Settings as SettingsIcon, Save, Globe, User, Key, Server, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStore } from '@/lib/store';

export const Settings: React.FC = () => {
  const { vtigerUrl, vtigerUsername, vtigerAccessKey, backendUrl, setVtigerConfig, setBackendUrl } = useStore();
  
  const [url, setUrl] = useState(vtigerUrl);
  const [username, setUsername] = useState(vtigerUsername);
  const [key, setKey] = useState(vtigerAccessKey);
  const [bUrl, setBUrl] = useState(backendUrl);
  
  const [testing, setTesting] = useState(false);
  const [status, setStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);

  const handleSave = async () => {
    setTesting(true);
    setStatus(null);
    try {
      const response = await axios.post(`${bUrl}/api/settings/test-vtiger-connection`, {
        url, username, accessKey: key
      });
      
      if (response.data.success) {
        setVtigerConfig(url, username, key);
        setBackendUrl(bUrl);
        setStatus({ type: 'success', message: 'Connection successful and settings saved!' });
      }
    } catch (error: any) {
      setStatus({ type: 'error', message: error.response?.data?.error || 'Failed to connect to Vtiger.' });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold flex items-center gap-2 border-none">
          <SettingsIcon className="text-gray-600 w-6 h-6" />
          Settings
        </h2>
        <p className="text-sm text-gray-500">Configure your Vtiger & SmartFix connection.</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
                <Globe className="w-3 h-3" /> Vtiger Instance URL
            </label>
            <Input 
                placeholder="https://instance.vtiger.com" 
                value={url} 
                onChange={e => setUrl(e.target.value)}
            />
        </div>

        <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
                <User className="w-3 h-3" /> Vtiger Username
            </label>
            <Input 
                placeholder="admin" 
                value={username} 
                onChange={e => setUsername(e.target.value)}
            />
        </div>

        <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
                <Key className="w-3 h-3" /> Access Key / API Token
            </label>
            <Input 
                type="password" 
                placeholder="••••••••••••" 
                value={key} 
                onChange={e => setKey(e.target.value)}
            />
        </div>

        <div className="space-y-2 pt-4 border-t">
            <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
                <Server className="w-3 h-3" /> SmartFix Backend URL
            </label>
            <Input 
                placeholder="http://localhost:3001" 
                value={bUrl} 
                onChange={e => setBUrl(e.target.value)}
            />
            <p className="text-[10px] text-gray-400 italic">Advanced: Change this if using a custom server.</p>
        </div>

        {status && (
            <div className={`p-3 rounded-md flex items-center gap-2 text-xs font-medium ${
                status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
            }`}>
                {status.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                {status.message}
            </div>
        )}

        <Button className="w-full h-12 gap-2 mt-4" onClick={handleSave} disabled={testing}>
            {testing ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            ) : (
                <Save className="w-4 h-4" />
            )}
            {testing ? "Testing Connection..." : "Test & Save Config"}
        </Button>
      </div>
    </div>
  );
};
