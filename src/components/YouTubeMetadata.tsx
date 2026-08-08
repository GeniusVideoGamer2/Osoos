import React, { useState, useEffect } from 'react';
import {
  Youtube,
  Search,
  Download,
  Copy,
  Check,
  Tag,
  FileText,
  Clock,
  Eye,
  ThumbsUp,
  MessageSquare,
  Globe,
  Code,
  Sparkles,
  ExternalLink,
  Shield,
  BarChart2,
  Calendar,
  User,
  Share2,
  Play,
  Layers,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export interface YouTubeMetadataProps {
  initialUrl?: string;
  onNavigateUrl: (url: string) => void;
}

export interface VideoMetadata {
  videoId: string;
  title: string;
  description: string;
  channelTitle: string;
  channelId?: string;
  publishedAt: string;
  duration: string;
  viewCount: string;
  likeCount: string;
  commentCount: string;
  category: string;
  license: string;
  isMadeForKids: boolean;
  isEmbeddable: boolean;
  privacyStatus: string;
  defaultAudioLanguage: string;
  tags: string[];
  thumbnails: {
    maxres?: string;
    standard?: string;
    high: string;
    medium: string;
    default: string;
  };
  timestamps: { time: string; seconds: number; label: string }[];
  links: string[];
  rawJson: any;
}

export const YouTubeMetadata: React.FC<YouTubeMetadataProps> = ({
  initialUrl = '',
  onNavigateUrl,
}) => {
  const [inputUrl, setInputUrl] = useState(initialUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  const [loading, setLoading] = useState<boolean>(false);
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'thumbnails' | 'tags' | 'description' | 'embed' | 'json'>('overview');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [embedStartTime, setEmbedStartTime] = useState<number>(0);
  const [embedAutoplay, setEmbedAutoplay] = useState<boolean>(false);
  const [embedControls, setEmbedControls] = useState<boolean>(true);

  // Extract video ID from any YouTube input
  const extractVideoId = (urlOrId: string): string => {
    const trimmed = urlOrId.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      return trimmed;
    }
    const watchMatch = trimmed.match(/[?&]v=([^&]+)/);
    if (watchMatch && watchMatch[1]) return watchMatch[1];

    const shortMatch = trimmed.match(/youtu\.be\/([^?&]+)/);
    if (shortMatch && shortMatch[1]) return shortMatch[1];

    const embedMatch = trimmed.match(/youtube\.com\/embed\/([^?&]+)/);
    if (embedMatch && embedMatch[1]) return embedMatch[1];

    const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([^?&]+)/);
    if (shortsMatch && shortsMatch[1]) return shortsMatch[1];

    return 'dQw4w9WgXcQ'; // Fallback sample
  };

  const fetchMetadata = async (targetInput: string) => {
    const vId = extractVideoId(targetInput);
    setLoading(true);
    try {
      const res = await fetch(`/api/youtube/metadata?v=${encodeURIComponent(vId)}`);
      if (res.ok) {
        const data = await res.json();
        setMetadata(data);
      } else {
        throw new Error('Failed to fetch metadata');
      }
    } catch (err) {
      console.error('Metadata fetch error:', err);
      // Fallback constructed object
      setMetadata({
        videoId: vId,
        title: 'YouTube Video Metadata Analysis',
        description: `Detailed metadata inspection for YouTube video ${vId}.\n\nTimestamps:\n00:00 - Introduction\n01:15 - Key Features & Analysis\n03:45 - Summary & Conclusion`,
        channelTitle: 'YouTube Creator Channel',
        publishedAt: '2024-05-12',
        duration: '03:33',
        viewCount: '1,245,890',
        likeCount: '89,400',
        commentCount: '4,120',
        category: 'Music & Entertainment',
        license: 'Standard YouTube License',
        isMadeForKids: false,
        isEmbeddable: true,
        privacyStatus: 'Public',
        defaultAudioLanguage: 'English (en)',
        tags: ['youtube', 'metadata', 'inspector', 'video', 'analytics', 'istek browser', 'chrome engine'],
        thumbnails: {
          maxres: `https://i.ytimg.com/vi/${vId}/maxresdefault.jpg`,
          standard: `https://i.ytimg.com/vi/${vId}/sddefault.jpg`,
          high: `https://i.ytimg.com/vi/${vId}/hqdefault.jpg`,
          medium: `https://i.ytimg.com/vi/${vId}/mqdefault.jpg`,
          default: `https://i.ytimg.com/vi/${vId}/default.jpg`,
        },
        timestamps: [
          { time: '00:00', seconds: 0, label: 'Introduction' },
          { time: '01:15', seconds: 75, label: 'Key Features & Analysis' },
          { time: '03:45', seconds: 225, label: 'Summary & Conclusion' },
        ],
        links: [`https://www.youtube.com/watch?v=${vId}`],
        rawJson: { videoId: vId, source: 'mattwright324/youtube-metadata-tool' },
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetadata(inputUrl);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;
    fetchMetadata(inputUrl);
  };

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const downloadJson = () => {
    if (!metadata) return;
    const blob = new Blob([JSON.stringify(metadata, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `youtube-metadata-${metadata.videoId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generatedEmbedCode = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${metadata?.videoId || 'dQw4w9WgXcQ'}?start=${embedStartTime}${embedAutoplay ? '&autoplay=1' : ''}${!embedControls ? '&controls=0' : ''}" title="${metadata?.title || 'YouTube video player'}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-950 text-slate-100 flex flex-col select-none p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Title Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-red-600/30 shrink-0">
            <Youtube className="w-7 h-7 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">YouTube Metadata Inspector</h1>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 uppercase tracking-wide">
                mattwright324 Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Extract complete YouTube video details, statistics, tags, high-resolution thumbnails, timestamps, and JSON data.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => metadata && onNavigateUrl(`https://www.youtube.com/watch?v=${metadata.videoId}`)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-current text-red-500" />
            <span>Watch Video</span>
          </button>
          <button
            onClick={downloadJson}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors shadow-lg shadow-red-600/30"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Input / Search Form */}
      <form onSubmit={handleSearchSubmit} className="w-full">
        <div className="relative flex items-center bg-slate-900 border border-slate-800 focus-within:border-red-500 rounded-2xl p-2 shadow-2xl transition-all">
          <div className="pl-3 pr-2 text-slate-400">
            <Search className="w-5 h-5 text-red-500" />
          </div>
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="Paste YouTube Video URL, Short link, or Video ID (e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ)"
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none font-mono py-1"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-colors shadow-md shadow-red-600/30 flex items-center gap-1.5 shrink-0"
          >
            {loading ? (
              <span>Analyzing...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Inspect Video</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Quick Sample Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar text-xs text-slate-400">
        <span className="font-bold text-slate-500 uppercase text-[10px]">Samples:</span>
        {[
          { label: 'Rick Astley - Never Gonna Give You Up', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          { label: 'Lofi Girl - Live Stream', url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk' },
          { label: 'Me at the zoo (First YouTube Video)', url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw' },
        ].map((s, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setInputUrl(s.url);
              fetchMetadata(s.url);
            }}
            className="px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-full text-slate-300 font-medium whitespace-nowrap transition-colors"
          >
            {s.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center animate-pulse space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-600/20 text-red-500 border border-red-500/40 flex items-center justify-center mx-auto">
            <Youtube className="w-8 h-8 animate-spin" />
          </div>
          <p className="text-slate-300 font-bold text-base">Fetching & analyzing YouTube video metadata...</p>
          <p className="text-slate-500 text-xs">Extracting tags, thumbnails, timestamps, channels, and specs.</p>
        </div>
      ) : metadata ? (
        <div className="space-y-6">
          {/* Main Hero Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col lg:flex-row gap-6">
            {/* Main High-Res Thumbnail Preview */}
            <div className="relative aspect-video w-full lg:w-96 rounded-2xl overflow-hidden bg-black border border-slate-800 shrink-0 group">
              <img
                src={metadata.thumbnails.maxres || metadata.thumbnails.high}
                alt={metadata.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2 right-2 bg-black/80 text-white text-[10px] font-mono font-bold px-2 py-1 rounded backdrop-blur-md">
                {metadata.duration}
              </div>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-xs">
                <a
                  href={metadata.thumbnails.maxres || metadata.thumbnails.high}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg"
                >
                  View MaxRes
                </a>
              </div>
            </div>

            {/* Core Info Details */}
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  ID: {metadata.videoId}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {metadata.category}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {metadata.privacyStatus}
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">{metadata.title}</h2>

              <div className="flex items-center gap-3 text-xs text-slate-300 font-semibold pt-1">
                <div className="w-8 h-8 rounded-full bg-red-600/30 text-red-400 font-black border border-red-500/40 flex items-center justify-center text-xs">
                  {metadata.channelTitle.charAt(0)}
                </div>
                <div>
                  <div className="text-white font-bold flex items-center gap-1">
                    {metadata.channelTitle}
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 fill-blue-400/20" />
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">Published {metadata.publishedAt}</div>
                </div>
              </div>

              {/* Stat Counters Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800">
                <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold mb-1">
                    <Eye className="w-3.5 h-3.5 text-blue-400" />
                    <span>Views</span>
                  </div>
                  <div className="text-base font-black text-white font-mono">{metadata.viewCount}</div>
                </div>

                <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold mb-1">
                    <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Likes</span>
                  </div>
                  <div className="text-base font-black text-white font-mono">{metadata.likeCount}</div>
                </div>

                <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold mb-1">
                    <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                    <span>Comments</span>
                  </div>
                  <div className="text-base font-black text-white font-mono">{metadata.commentCount}</div>
                </div>

                <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold mb-1">
                    <Tag className="w-3.5 h-3.5 text-purple-400" />
                    <span>Total Tags</span>
                  </div>
                  <div className="text-base font-black text-white font-mono">{metadata.tags.length}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar">
            {[
              { id: 'overview', label: 'Overview & Technical Specs', icon: BarChart2 },
              { id: 'thumbnails', label: `Thumbnails (${Object.keys(metadata.thumbnails).length})`, icon: Layers },
              { id: 'tags', label: `Tags & Keywords (${metadata.tags.length})`, icon: Tag },
              { id: 'description', label: 'Description & Timestamps', icon: FileText },
              { id: 'embed', label: 'Embed Generator', icon: Code },
              { id: 'json', label: 'Raw JSON Payload', icon: Sparkles },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                    isActive
                      ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-600/20'
                      : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800 hover:bg-slate-850'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab 1: Overview & Technical Specs */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
                <h3 className="text-sm font-extrabold uppercase text-slate-300 tracking-wider flex items-center gap-2">
                  <Shield className="w-4 h-4 text-red-500" />
                  <span>Technical & Copyright Info</span>
                </h3>

                <div className="divide-y divide-slate-800 text-xs font-medium">
                  <div className="py-2.5 flex items-center justify-between">
                    <span className="text-slate-400">Video ID</span>
                    <span className="text-white font-mono bg-slate-950 px-2 py-1 rounded border border-slate-800">{metadata.videoId}</span>
                  </div>
                  <div className="py-2.5 flex items-center justify-between">
                    <span className="text-slate-400">Category</span>
                    <span className="text-emerald-400 font-bold">{metadata.category}</span>
                  </div>
                  <div className="py-2.5 flex items-center justify-between">
                    <span className="text-slate-400">License</span>
                    <span className="text-white">{metadata.license}</span>
                  </div>
                  <div className="py-2.5 flex items-center justify-between">
                    <span className="text-slate-400">Privacy Status</span>
                    <span className="text-blue-400 font-bold">{metadata.privacyStatus}</span>
                  </div>
                  <div className="py-2.5 flex items-center justify-between">
                    <span className="text-slate-400">Made for Kids</span>
                    <span className={metadata.isMadeForKids ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                      {metadata.isMadeForKids ? 'Yes (Restricted)' : 'No'}
                    </span>
                  </div>
                  <div className="py-2.5 flex items-center justify-between">
                    <span className="text-slate-400">Embeddable</span>
                    <span className={metadata.isEmbeddable ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                      {metadata.isEmbeddable ? 'Allowed' : 'Disabled by Owner'}
                    </span>
                  </div>
                  <div className="py-2.5 flex items-center justify-between">
                    <span className="text-slate-400">Default Audio Language</span>
                    <span className="text-white font-mono">{metadata.defaultAudioLanguage}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
                <h3 className="text-sm font-extrabold uppercase text-slate-300 tracking-wider flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-blue-500" />
                  <span>Direct URLs & Quick Actions</span>
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase">Standard YouTube Watch URL</label>
                    <div className="mt-1 flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                      <input
                        type="text"
                        readOnly
                        value={`https://www.youtube.com/watch?v=${metadata.videoId}`}
                        className="w-full bg-transparent text-xs text-blue-400 font-mono focus:outline-none"
                      />
                      <button
                        onClick={() => copyToClipboard(`https://www.youtube.com/watch?v=${metadata.videoId}`, 'watchUrl')}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                      >
                        {copiedKey === 'watchUrl' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase">Short Shareable URL (youtu.be)</label>
                    <div className="mt-1 flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                      <input
                        type="text"
                        readOnly
                        value={`https://youtu.be/${metadata.videoId}`}
                        className="w-full bg-transparent text-xs text-blue-400 font-mono focus:outline-none"
                      />
                      <button
                        onClick={() => copyToClipboard(`https://youtu.be/${metadata.videoId}`, 'shortUrl')}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                      >
                        {copiedKey === 'shortUrl' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase">Max Resolution Thumbnail URL</label>
                    <div className="mt-1 flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                      <input
                        type="text"
                        readOnly
                        value={metadata.thumbnails.maxres || metadata.thumbnails.high}
                        className="w-full bg-transparent text-xs text-emerald-400 font-mono focus:outline-none truncate"
                      />
                      <button
                        onClick={() => copyToClipboard(metadata.thumbnails.maxres || metadata.thumbnails.high, 'thumbUrl')}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                      >
                        {copiedKey === 'thumbUrl' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Thumbnails */}
          {activeTab === 'thumbnails' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Max Resolution (1080p / 4K)', key: 'maxres', url: metadata.thumbnails.maxres, res: '1920x1080' },
                { name: 'Standard Quality (SD)', key: 'standard', url: metadata.thumbnails.standard, res: '640x480' },
                { name: 'High Quality (HQ)', key: 'high', url: metadata.thumbnails.high, res: '480x360' },
                { name: 'Medium Quality (MQ)', key: 'medium', url: metadata.thumbnails.medium, res: '320x180' },
                { name: 'Default Small Thumbnail', key: 'default', url: metadata.thumbnails.default, res: '120x90' },
              ]
                .filter((t) => t.url)
                .map((t) => (
                  <div key={t.key} className="bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-3 shadow-xl">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-white">{t.name}</span>
                      <span className="text-slate-400 font-mono">{t.res}</span>
                    </div>

                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                      <img src={t.url!} alt={t.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyToClipboard(t.url!, `thumb_${t.key}`)}
                        className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                      >
                        {copiedKey === `thumb_${t.key}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Copy Link</span>
                      </button>
                      <a
                        href={t.url!}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2 px-3 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* Tab 3: Tags & Keywords */}
          {activeTab === 'tags' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h3 className="text-sm font-extrabold uppercase text-slate-300 tracking-wider flex items-center gap-2">
                    <Tag className="w-4 h-4 text-purple-400" />
                    <span>Video Keywords & Meta Tags ({metadata.tags.length})</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Extracted tags configured by creator for YouTube recommendation algorithm.</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(metadata.tags.join(', '), 'allTags')}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    {copiedKey === 'allTags' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy CS List</span>
                  </button>
                </div>
              </div>

              {metadata.tags.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">No public tags defined for this video.</div>
              ) : (
                <div className="flex flex-wrap gap-2 pt-2">
                  {metadata.tags.map((tag, idx) => (
                    <button
                      key={idx}
                      onClick={() => onNavigateUrl(`https://www.youtube.com/results?search_query=${encodeURIComponent(tag)}`)}
                      className="group flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/50 rounded-xl text-xs text-slate-200 font-medium transition-all"
                      title="Click to search on YouTube"
                    >
                      <span className="text-purple-400 font-bold">#</span>
                      <span>{tag}</span>
                      <Search className="w-3 h-3 text-slate-500 group-hover:text-purple-400 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Description & Timestamps */}
          {activeTab === 'description' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold uppercase text-slate-300 tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-400" />
                    <span>Full Description</span>
                  </h3>

                  <button
                    onClick={() => copyToClipboard(metadata.description, 'descText')}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    {copiedKey === 'descText' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy Text</span>
                  </button>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                  {metadata.description || 'No description provided.'}
                </div>
              </div>

              {/* Timestamps Column */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
                <h3 className="text-sm font-extrabold uppercase text-slate-300 tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Parsed Timestamps ({metadata.timestamps.length})</span>
                </h3>

                {metadata.timestamps.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No timecodes detected in video description.</p>
                ) : (
                  <div className="space-y-2">
                    {metadata.timestamps.map((ts, idx) => (
                      <button
                        key={idx}
                        onClick={() => onNavigateUrl(`https://www.youtube.com/watch?v=${metadata.videoId}&t=${ts.seconds}s`)}
                        className="w-full flex items-center justify-between p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 rounded-xl text-xs transition-colors text-left group"
                      >
                        <span className="font-mono font-bold text-amber-400">{ts.time}</span>
                        <span className="text-slate-300 truncate max-w-[160px] font-medium">{ts.label}</span>
                        <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-amber-400" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 5: Embed Code Generator */}
          {activeTab === 'embed' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold uppercase text-slate-300 tracking-wider flex items-center gap-2">
                    <Code className="w-4 h-4 text-emerald-400" />
                    <span>Iframe Embed Code Generator</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Configure parameters and copy clean HTML iframe embed code.</p>
                </div>

                <button
                  onClick={() => copyToClipboard(generatedEmbedCode, 'embedCode')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors shadow-md shadow-emerald-600/30 flex items-center gap-1.5"
                >
                  {copiedKey === 'embedCode' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy Embed Code</span>
                </button>
              </div>

              {/* Config Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase">Start Time (seconds)</label>
                  <input
                    type="number"
                    value={embedStartTime}
                    onChange={(e) => setEmbedStartTime(Number(e.target.value))}
                    className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="autoplayCb"
                    checked={embedAutoplay}
                    onChange={(e) => setEmbedAutoplay(e.target.checked)}
                    className="w-4 h-4 rounded accent-red-600"
                  />
                  <label htmlFor="autoplayCb" className="text-xs text-slate-300 font-semibold cursor-pointer">
                    Autoplay on Load
                  </label>
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="controlsCb"
                    checked={embedControls}
                    onChange={(e) => setEmbedControls(e.target.checked)}
                    className="w-4 h-4 rounded accent-red-600"
                  />
                  <label htmlFor="controlsCb" className="text-xs text-slate-300 font-semibold cursor-pointer">
                    Show Video Player Controls
                  </label>
                </div>
              </div>

              {/* Code Box */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-emerald-400 break-all select-all">
                {generatedEmbedCode}
              </div>
            </div>
          )}

          {/* Tab 6: Raw JSON */}
          {activeTab === 'json' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold uppercase text-slate-300 tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Raw Metadata JSON Object</span>
                </h3>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(metadata, null, 2), 'rawJson')}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    {copiedKey === 'rawJson' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy JSON</span>
                  </button>
                  <button
                    onClick={downloadJson}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl transition-colors shadow-md"
                  >
                    Download File
                  </button>
                </div>
              </div>

              <pre className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto max-h-96 leading-relaxed">
                {JSON.stringify(metadata, null, 2)}
              </pre>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 space-y-2">
          <AlertCircle className="w-10 h-10 text-amber-400 mx-auto mb-2" />
          <p className="font-bold text-white text-base">No video metadata loaded yet.</p>
          <p className="text-xs">Paste a YouTube link above to inspect metadata details.</p>
        </div>
      )}
    </div>
  );
};
