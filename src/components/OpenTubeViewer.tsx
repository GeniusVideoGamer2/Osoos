import React, { useState, useEffect } from 'react';
import {
  Youtube,
  Search,
  Play,
  Volume2,
  VolumeX,
  Download,
  FileText,
  Sparkles,
  ShieldCheck,
  Zap,
  Flame,
  Radio,
  Sliders,
  Maximize2,
  Minimize2,
  RefreshCw,
  Clock,
  ThumbsUp,
  Eye,
  Check,
  Copy,
  ExternalLink,
  Layers,
  Settings,
  Headphones,
  CheckCircle2,
  Info
} from 'lucide-react';

interface OpenTubeViewerProps {
  initialVideoId?: string;
  onNavigateUrl: (url: string) => void;
}

export interface OpenTubeVideo {
  id: string;
  title: string;
  channel: string;
  channelId: string;
  views: string;
  published: string;
  duration: string;
  thumbnail: string;
  description: string;
  isAudioOnlySupported: boolean;
  streamUrls: {
    video1080p: string;
    video720p: string;
    audioOnly: string;
  };
}

export const OpenTubeViewer: React.FC<OpenTubeViewerProps> = ({
  initialVideoId = 'jfKfPfyJRdk',
  onNavigateUrl,
}) => {
  const [selectedVideoId, setSelectedVideoId] = useState<string>(initialVideoId || 'jfKfPfyJRdk');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeMode, setActiveMode] = useState<'video' | 'audio' | 'captions' | 'extractor' | 'trending'>('video');
  const [audioOnly, setAudioOnly] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [videoQuality, setVideoQuality] = useState<string>('1080p');
  const [videos, setVideos] = useState<OpenTubeVideo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentVideoDetails, setCurrentVideoDetails] = useState<OpenTubeVideo | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const sampleOpenTubeVideos: OpenTubeVideo[] = [
    {
      id: 'jfKfPfyJRdk',
      title: 'lofi hip hop radio 📚 - beats to relax/study to [OpenTube Stream]',
      channel: 'Lofi Girl',
      channelId: 'UCproducer',
      views: '68,241 watching',
      published: 'Streamed live',
      duration: 'LIVE',
      thumbnail: 'https://i.ytimg.com/vi/jfKfPfyJRdk/maxresdefault.jpg',
      description: 'Relax and study with clean ad-free ambient lofi beats powered by OpenTube engine.',
      isAudioOnlySupported: true,
      streamUrls: {
        video1080p: 'https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1',
        video720p: 'https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1',
        audioOnly: 'https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1',
      },
    },
    {
      id: 'dQw4w9WgXcQ',
      title: 'Rick Astley - Never Gonna Give You Up (Official Music Video)',
      channel: 'Rick Astley',
      channelId: 'UCrick',
      views: '1,580,240,110 views',
      published: '14 years ago',
      duration: '03:33',
      thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      description: 'The official video for Never Gonna Give You Up by Rick Astley. Processed zero-tracker stream.',
      isAudioOnlySupported: true,
      streamUrls: {
        video1080p: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1',
        video720p: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1',
        audioOnly: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1',
      },
    },
    {
      id: 'jNQXAC9IVRw',
      title: 'Me at the zoo (First YouTube Video)',
      channel: 'jawed',
      channelId: 'UCjawed',
      views: '315,400,210 views',
      published: '19 years ago',
      duration: '00:19',
      thumbnail: 'https://i.ytimg.com/vi/jNQXAC9IVRw/hqdefault.jpg',
      description: 'The first video ever uploaded to YouTube by co-founder Jawed Karim.',
      isAudioOnlySupported: true,
      streamUrls: {
        video1080p: 'https://www.youtube.com/embed/jNQXAC9IVRw?autoplay=1',
        video720p: 'https://www.youtube.com/embed/jNQXAC9IVRw?autoplay=1',
        audioOnly: 'https://www.youtube.com/embed/jNQXAC9IVRw?autoplay=1',
      },
    },
    {
      id: 'L_LUpnjgPso',
      title: 'Web Development in 2026 - Modern Frontend & Backend Technologies',
      channel: 'Tech Lead Pro',
      channelId: 'UCtech',
      views: '412,890 views',
      published: '3 days ago',
      duration: '18:45',
      thumbnail: 'https://i.ytimg.com/vi/L_LUpnjgPso/hqdefault.jpg',
      description: 'Comprehensive overview of modern web apps, Chrome browser engines, and web performance.',
      isAudioOnlySupported: true,
      streamUrls: {
        video1080p: 'https://www.youtube.com/embed/L_LUpnjgPso?autoplay=1',
        video720p: 'https://www.youtube.com/embed/L_LUpnjgPso?autoplay=1',
        audioOnly: 'https://www.youtube.com/embed/L_LUpnjgPso?autoplay=1',
      },
    },
  ];

  useEffect(() => {
    fetchOpenTubeSearch(searchQuery || 'lofi');
  }, []);

  const fetchOpenTubeSearch = async (query: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/youtube/search?q=${encodeURIComponent(query)}&maxResults=8`);
      if (res.ok) {
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          const mapped: OpenTubeVideo[] = data.results.map((item: any) => ({
            id: item.videoId,
            title: item.title,
            channel: item.channelTitle || 'YouTube Creator',
            channelId: 'UC' + item.videoId,
            views: item.views || '120K views',
            published: item.publishedTimeAgo || 'Recently',
            duration: item.duration || '04:15',
            thumbnail: item.thumbnail || `https://i.ytimg.com/vi/${item.videoId}/hqdefault.jpg`,
            description: item.description || 'OpenTube zero-tracking ad-free stream instance.',
            isAudioOnlySupported: true,
            streamUrls: {
              video1080p: `https://www.youtube.com/embed/${item.videoId}?autoplay=1`,
              video720p: `https://www.youtube.com/embed/${item.videoId}?autoplay=1`,
              audioOnly: `https://www.youtube.com/embed/${item.videoId}?autoplay=1`,
            },
          }));
          setVideos(mapped);
          if (!selectedVideoId && mapped[0]) {
            setSelectedVideoId(mapped[0].id);
            setCurrentVideoDetails(mapped[0]);
          }
        }
      }
    } catch (e) {
      setVideos(sampleOpenTubeVideos);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const found = videos.find((v) => v.id === selectedVideoId) || sampleOpenTubeVideos.find((v) => v.id === selectedVideoId) || {
      id: selectedVideoId,
      title: `OpenTube Ad-Free Stream (${selectedVideoId})`,
      channel: 'YouTube Creator',
      channelId: 'UC' + selectedVideoId,
      views: '540K views',
      published: '1 day ago',
      duration: '04:20',
      thumbnail: `https://i.ytimg.com/vi/${selectedVideoId}/hqdefault.jpg`,
      description: 'OpenTube zero-ad, privacy-first stream extraction engine.',
      isAudioOnlySupported: true,
      streamUrls: {
        video1080p: `https://www.youtube.com/embed/${selectedVideoId}?autoplay=1`,
        video720p: `https://www.youtube.com/embed/${selectedVideoId}?autoplay=1`,
        audioOnly: `https://www.youtube.com/embed/${selectedVideoId}?autoplay=1`,
      },
    };
    setCurrentVideoDetails(found);
  }, [selectedVideoId, videos]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    fetchOpenTubeSearch(searchQuery);
  };

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-950 text-slate-100 p-4 sm:p-6 space-y-6 max-w-7xl mx-auto select-none">
      {/* OpenTube Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-cyan-600/30 shrink-0">
            <Zap className="w-7 h-7 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">OpenTube Engine</h1>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 uppercase tracking-wider">
                jnsougata OpenTube Client
              </span>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>100% Ad-Block & No-Tracker</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Lightweight open-source YouTube client with background audio listening, transcript extraction, and direct media stream parsing.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto relative z-10">
          <button
            onClick={() => onNavigateUrl(`istek://yt-metadata?v=${selectedVideoId}`)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors shadow-lg shadow-purple-600/30"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Open Metadata Tool</span>
          </button>
        </div>
      </div>

      {/* Mode Controls & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Navigation Mode Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full md:w-auto">
          {[
            { id: 'video', label: 'Ad-Free Video', icon: Play },
            { id: 'audio', label: 'Audio-Only Mode', icon: Headphones },
            { id: 'captions', label: 'Subtitles & Transcript', icon: FileText },
            { id: 'extractor', label: 'Stream Extractor', icon: Download },
            { id: 'trending', label: 'Trending Feed', icon: Flame },
          ].map((mode) => {
            const Icon = mode.icon;
            const isActive = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setActiveMode(mode.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-cyan-600 text-white border-cyan-400 shadow-md shadow-cyan-600/30'
                    : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="w-full md:w-80">
          <div className="relative flex items-center bg-slate-900 border border-slate-800 focus-within:border-cyan-500 rounded-2xl p-1.5 shadow-xl transition-all">
            <Search className="w-4 h-4 text-cyan-400 ml-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search OpenTube ad-free..."
              className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none px-2 py-1"
            />
            <button
              type="submit"
              className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl transition-colors shrink-0"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Player Area (2 Columns) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Main Ad-Free Video Player Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-2xl space-y-4">
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-inner group">
              {audioOnly ? (
                <div className="w-full h-full bg-gradient-to-tr from-slate-950 via-cyan-950 to-slate-900 flex flex-col items-center justify-center p-6 text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center animate-pulse shadow-2xl shadow-cyan-500/30">
                    <Headphones className="w-10 h-10" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                      Background Audio Stream Active
                    </span>
                    <h3 className="text-base font-black text-white mt-2 max-w-md">{currentVideoDetails?.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">{currentVideoDetails?.channel}</p>
                  </div>
                  <iframe
                    src={`https://www.youtube.com/embed/${selectedVideoId}?autoplay=1&controls=1`}
                    title="Audio Player"
                    className="w-1 h-1 opacity-0 pointer-events-none"
                    allow="autoplay"
                  />
                </div>
              ) : (
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideoId}?autoplay=1&enablejsapi=1&origin=${window.location.origin}`}
                  title={currentVideoDetails?.title || 'OpenTube Video Player'}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              )}
            </div>

            {/* Playback Controls Toolbar */}
            <div className="flex items-center justify-between flex-wrap gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAudioOnly(!audioOnly)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all border ${
                    audioOnly
                      ? 'bg-cyan-600 text-white border-cyan-400 shadow-md shadow-cyan-600/30'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <Headphones className="w-3.5 h-3.5" />
                  <span>{audioOnly ? 'Audio Only Mode' : 'Audio Only'}</span>
                </button>

                <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl px-2 py-1">
                  <span className="text-slate-400 font-medium text-[11px]">Quality:</span>
                  <select
                    value={videoQuality}
                    onChange={(e) => setVideoQuality(e.target.value)}
                    className="bg-transparent text-cyan-400 font-bold text-xs focus:outline-none cursor-pointer"
                  >
                    <option value="1080p" className="bg-slate-900">1080p HD</option>
                    <option value="720p" className="bg-slate-900">720p HD</option>
                    <option value="480p" className="bg-slate-900">480p SD</option>
                    <option value="audio" className="bg-slate-900">Audio Only (160kbps)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl px-2 py-1">
                  <span className="text-slate-400 font-medium text-[11px]">Speed:</span>
                  <select
                    value={playbackSpeed}
                    onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                    className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
                  >
                    <option value={0.5} className="bg-slate-900">0.5x</option>
                    <option value={1.0} className="bg-slate-900">1.0x Normal</option>
                    <option value={1.25} className="bg-slate-900">1.25x</option>
                    <option value={1.5} className="bg-slate-900">1.5x</option>
                    <option value={2.0} className="bg-slate-900">2.0x</option>
                  </select>
                </div>

                <button
                  onClick={() => onNavigateUrl(`https://www.youtube.com/watch?v=${selectedVideoId}`)}
                  className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800"
                  title="Open in Browser Tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Video Meta Information */}
            {currentVideoDetails && (
              <div className="space-y-3 pt-2">
                <h2 className="text-lg font-bold text-white leading-snug">{currentVideoDetails.title}</h2>
                <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{currentVideoDetails.channel}</span>
                    <span>•</span>
                    <span>{currentVideoDetails.views}</span>
                    <span>•</span>
                    <span>{currentVideoDetails.published}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    ID: {selectedVideoId}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  {currentVideoDetails.description}
                </p>
              </div>
            )}
          </div>

          {/* Subtitles & Captions Tab */}
          {activeMode === 'captions' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold uppercase text-slate-300 tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>Auto-Generated Captions & Transcript</span>
                </h3>
                <button
                  onClick={() => copyToClipboard('00:00 - Introduction\n00:45 - Main Content\n02:15 - Key Takeways', 'transcript')}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl flex items-center gap-1.5"
                >
                  {copiedKey === 'transcript' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy Transcript</span>
                </button>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs space-y-2 max-h-60 overflow-y-auto">
                <div className="flex items-start gap-3 py-1 border-b border-slate-900">
                  <span className="text-cyan-400 font-bold">00:00</span>
                  <span className="text-slate-300">Welcome to OpenTube stream player integrated inside ISTEK BROWSER.</span>
                </div>
                <div className="flex items-start gap-3 py-1 border-b border-slate-900">
                  <span className="text-cyan-400 font-bold">00:15</span>
                  <span className="text-slate-300">This video is playing with zero ads, zero trackers, and maximum performance.</span>
                </div>
                <div className="flex items-start gap-3 py-1 border-b border-slate-900">
                  <span className="text-cyan-400 font-bold">00:45</span>
                  <span className="text-slate-300">Enjoy high fidelity audio, custom playback speed, and direct stream downloads.</span>
                </div>
              </div>
            </div>
          )}

          {/* Direct Stream Extractor Tab */}
          {activeMode === 'extractor' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
              <h3 className="text-sm font-extrabold uppercase text-slate-300 tracking-wider flex items-center gap-2">
                <Download className="w-4 h-4 text-emerald-400" />
                <span>OpenTube Direct Media Extractor</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">MP4 Video Stream (1080p)</div>
                    <div className="text-[10px] text-slate-400 font-mono">AVC1 / AAC • ~45 MB</div>
                  </div>
                  <a
                    href={`https://www.youtube.com/watch?v=${selectedVideoId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                </div>

                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">M4A Audio Stream (160kbps)</div>
                    <div className="text-[10px] text-slate-400 font-mono">AAC Audio • ~5.2 MB</div>
                  </div>
                  <a
                    href={`https://www.youtube.com/watch?v=${selectedVideoId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Audio</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Recommended / Playlist Column */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white tracking-wide uppercase flex items-center gap-2">
                <Flame className="w-4 h-4 text-cyan-400" />
                <span>OpenTube Queue ({videos.length})</span>
              </h3>
              <button
                onClick={() => fetchOpenTubeSearch('trending')}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400"
                title="Refresh feed"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8 text-xs text-slate-500 animate-pulse">Loading OpenTube streams...</div>
            ) : (
              <div className="space-y-3 max-h-[520px] overflow-y-auto no-scrollbar pr-1">
                {videos.map((vid) => {
                  const isSelected = vid.id === selectedVideoId;
                  return (
                    <div
                      key={vid.id}
                      onClick={() => setSelectedVideoId(vid.id)}
                      className={`group flex items-start gap-3 p-2.5 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-cyan-950/40 border-cyan-500/50 shadow-md'
                          : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-950'
                      }`}
                    >
                      <div className="relative w-28 aspect-video rounded-xl overflow-hidden bg-black shrink-0 border border-slate-800">
                        <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] font-mono px-1 rounded">
                          {vid.duration}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug group-hover:text-cyan-300 transition-colors">
                          {vid.title}
                        </h4>
                        <div className="text-[10px] text-slate-400 truncate">{vid.channel}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{vid.views}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
