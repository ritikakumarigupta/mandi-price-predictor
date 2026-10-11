import React from 'react';
import { Database, AlertTriangle, Clock } from 'lucide-react';

/**
 * Calculates a friendly relative time in Hindi and English from an ISO or standard timestamp.
 */
export const getRelativeTimeIST = (timestampStr, lang = 'hi') => {
  if (!timestampStr) return '';
  const date = new Date(timestampStr);
  if (isNaN(date.getTime())) return timestampStr;

  const now = new Date();
  const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (lang === 'hi') {
    if (diffMinutes < 1) return 'अभी-अभी';
    if (diffMinutes < 60) return `${diffMinutes} मिनट पहले`;
    if (diffHours < 24) return `${diffHours} घंटे पहले`;
    return `${diffDays} दिन पहले`;
  } else if (lang === 'pa') {
    if (diffMinutes < 1) return 'ਹੁਣੇ-ਹੁਣੇ';
    if (diffMinutes < 60) return `${diffMinutes} ਮਿੰਟ ਪਹਿਲਾਂ`;
    if (diffHours < 24) return `${diffHours} ਘੰਟੇ ਪਹਿਲਾਂ`;
    return `${diffDays} ਦਿਨ ਪਹਿਲਾਂ`;
  } else if (lang === 'mr') {
    if (diffMinutes < 1) return 'आत्ताच';
    if (diffMinutes < 60) return `${diffMinutes} मिनिटांपूर्वी`;
    if (diffHours < 24) return `${diffHours} तासांपूर्वी`;
    return `${diffDays} दिवसांपूर्वी`;
  } else {
    if (diffMinutes < 1) return 'just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  }
};

/**
 * Checks if timestamp is older than 24 hours.
 */
export const isOlderThan24Hours = (timestampStr) => {
  if (!timestampStr) return false;
  const date = new Date(timestampStr);
  if (isNaN(date.getTime())) return false;
  const now = new Date();
  return (now.getTime() - date.getTime()) > (24 * 60 * 60 * 1000);
};

/**
 * Reusable DataSourceBadge component showcasing source + last updated IST relative time.
 */
export const DataSourceBadge = ({ 
  source = 'Agmarknet (data.gov.in)', 
  timestamp, 
  lang = 'hi',
  className = '' 
}) => {
  const relativeTime = getRelativeTimeIST(timestamp, lang);
  const isStale = isOlderThan24Hours(timestamp);

  return (
    <div className={`inline-flex flex-wrap items-center gap-2 ${className}`}>
      {/* Source Tag */}
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
        <Database className="w-3 h-3 text-emerald-400" />
        <span>{source}</span>
      </span>

      {/* Timestamp / Relative Time */}
      {relativeTime && (
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-300">
          <Clock className="w-3 h-3 text-slate-400" />
          <span>{relativeTime}</span>
        </span>
      )}

      {/* Stale Data Warning */}
      {isStale && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
          <AlertTriangle className="w-3 h-3" />
          <span>{lang === 'hi' ? 'पुराना डेटा (24h+)' : 'Data >24h old'}</span>
        </span>
      )}
    </div>
  );
};
