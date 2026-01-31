import { useState } from 'react';
import useSWR from 'swr';
import { motion, AnimatePresence } from 'framer-motion';
import { Laptop, Smartphone, Globe, MapPin, Trash2, Shield, AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Session {
  id: string;
  sessionToken: string;
  device: string;
  browser: string;
  location: string;
  ip: string;
  lastActive: string;
  current: boolean;
}

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function ActiveSessions() {
  const { data, error, mutate } = useSWR('/api/user/sessions', fetcher);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [revokingAll, setRevokingAll] = useState(false);

  const sessions: Session[] = data?.sessions || [];
  const isLoading = !data && !error;

  const handleRevoke = async (sessionId: string) => {
    setRevokingId(sessionId);
    try {
      const res = await fetch('/api/user/sessions/revoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });
      if (res.ok) {
        toast.success("Session revoked successfully");
        mutate(); // Refresh list
      } else {
        toast.error("Failed to revoke session");
      }
    } catch (e) {
      toast.error("Error revoking session");
    } finally {
      setRevokingId(null);
    }
  };

  const handleRevokeAll = async () => {
    if (!confirm("Are you sure you want to log out of all other devices?")) return;
    setRevokingAll(true);
    try {
      const res = await fetch('/api/user/sessions/revoke-all', {
        method: 'POST'
      });
      if (res.ok) {
        toast.success("All other sessions revoked");
        mutate();
      } else {
        toast.error("Failed to revoke sessions");
      }
    } catch (e) {
      toast.error("Error revoking sessions");
    } finally {
      setRevokingAll(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-[#00f2ea]" /></div>;
  }

  if (error) {
    return <div className="p-4 text-red-400 bg-red-500/10 rounded-xl">Error loading sessions</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#00f2ea]" /> Active Sessions
          </h3>
          <p className="text-sm text-gray-500">Manage device access to your account.</p>
        </div>
        {sessions.length > 1 && (
          <button
            onClick={handleRevokeAll}
            disabled={revokingAll}
            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-xs font-bold transition-all flex items-center gap-2"
          >
            {revokingAll ? <Loader2 className="w-3 h-3 animate-spin"/> : <Trash2 className="w-3 h-3" />}
            Revoke All
          </button>
        )}
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {sessions.map((session) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`p-4 rounded-xl border transition-all ${
                session.current 
                  ? 'bg-[#00f2ea]/5 border-[#00f2ea]/30' 
                  : 'bg-white/5 border-white/5 hover:border-white/10'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className={`p-3 rounded-full ${session.current ? 'bg-[#00f2ea]/20 text-[#00f2ea]' : 'bg-white/10 text-gray-400'}`}>
                    {session.device.toLowerCase().includes('mobile') ? <Smartphone size={20} /> : <Laptop size={20} />}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-white font-medium text-sm">
                        {session.device} <span className="text-gray-500 font-normal">• {session.browser}</span>
                      </h4>
                      {session.current && (
                        <span className="px-2 py-0.5 bg-[#00f2ea]/20 text-[#00f2ea] text-[10px] font-bold rounded-full border border-[#00f2ea]/30">
                          THIS DEVICE
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-1 text-xs text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={12} className="text-gray-500" />
                        {session.location} <span className="text-gray-600">({session.ip})</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Globe size={12} className="text-gray-500" />
                        Last active: {new Date(session.lastActive).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                {!session.current && (
                  <button
                    onClick={() => handleRevoke(session.sessionToken)}
                    disabled={revokingId === session.sessionToken}
                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Revoke Access"
                  >
                    {revokingId === session.sessionToken ? <Loader2 className="w-4 h-4 animate-spin"/> : <Trash2 className="w-4 h-4" />}
                  </button>
                )}
              </div>
            </motion.div>
          ))}

          {sessions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No active sessions found.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
