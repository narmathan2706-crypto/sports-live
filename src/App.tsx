import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { 
  Trophy, Users, Flame, TrendingUp, Tv, Search, Bell, User, Heart, Settings, 
  ChevronRight, ChevronLeft, Plus, Check, Activity, Clock, ArrowUpRight, 
  BarChart2, Share2, LogOut, AlertCircle, Shuffle, Smartphone, Mail, Lock, 
  Compass, Filter, CheckCircle2, Shield, Globe, Calendar, Zap, Play, Sparkles, 
  RefreshCw, Award, MessageSquare, FlameKindling, Info, Download, Camera
} from 'lucide-react';

// ==========================================
// TYPES & SCHEMAS
// ==========================================
interface Player {
  id: string;
  name: string;
  sport: string;
  team: string;
  country: string;
  image: string;
  position: string;
  number: string;
  age: number;
  height: string;
  stats: { label: string; value: string }[];
  performance: number[];
  achievements: string[];
  socials: { platform: string; handle: string }[];
}

interface Match {
  id: string;
  sport: string;
  league: string;
  teamA: { name: string; logo: string; score: number };
  teamB: { name: string; logo: string; score: number };
  status: 'LIVE' | 'UPCOMING' | 'FINISHED';
  time: string;
  elapsed?: string;
  isLive: boolean;
  prediction: { teamA: number; draw: number; teamB: number; text: string };
  stats: { label: string; teamA: number; teamB: number }[];
  lineup: { teamA: string[]; teamB: string[] };
  commentary: { time: string; event: string; type: 'goal' | 'card' | 'info' | 'incident' }[];
  timeline: { time: string; player: string; team: 'A' | 'B'; event: string; icon: string }[];
}

// ==========================================
// MOCK DATA
// ==========================================
const MOCK_PLAYERS: Player[] = [
  {
    id: 'p1',
    name: 'Jude Bellingham',
    sport: 'Football',
    team: 'Real Madrid',
    country: 'England',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=200',
    position: 'Midfielder',
    number: '5',
    age: 22,
    height: '1.86 m',
    stats: [
      { label: 'Goals (Ssn)', value: '18' },
      { label: 'Assists', value: '11' },
      { label: 'Pass Accuracy', value: '89.5%' },
      { label: 'Matches Played', value: '34' }
    ],
    performance: [7, 8, 9, 8, 10, 9, 8],
    achievements: ['UEFA Champions League 2024', 'La Liga Player of the Season', 'Golden Boy Award'],
    socials: [{ platform: 'Instagram', handle: '@judebellingham' }, { platform: 'Twitter', handle: '@jude_bell' }]
  },
  {
    id: 'p2',
    name: 'Virat Kohli',
    sport: 'Cricket',
    team: 'India',
    country: 'India',
    image: 'https://images.unsplash.com/photo-1540747737956-378724044453?auto=format&fit=crop&q=80&w=200',
    position: 'Batsman',
    number: '18',
    age: 37,
    height: '1.75 m',
    stats: [
      { label: 'ODI Runs', value: '13,848' },
      { label: 'ODI Centuries', value: '50' },
      { label: 'Average', value: '58.6' },
      { label: 'Strike Rate', value: '93.5' }
    ],
    performance: [9, 10, 6, 8, 9, 10, 9],
    achievements: ['ICC Cricketer of the Decade', 'CWC Winner 2011', 'Most ODI Centuries in History'],
    socials: [{ platform: 'Instagram', handle: '@virat.kohli' }, { platform: 'Twitter', handle: '@imVkohli' }]
  }
];

const MOCK_MATCHES: Match[] = [
  {
    id: 'm1',
    sport: 'Football',
    league: 'La Liga',
    teamA: { name: 'Real Madrid', logo: '⚪', score: 2 },
    teamB: { name: 'Barcelona', logo: '🔵', score: 1 },
    status: 'LIVE',
    time: '21:00',
    elapsed: '73\'',
    isLive: true,
    prediction: { teamA: 55, draw: 20, teamB: 25, text: "Real Madrid is dominant at home, with Bellingham creating spaces. Barcelona is dangerous on counter-attacks but displays defensive weaknesses." },
    stats: [
      { label: 'Possession', teamA: 58, teamB: 42 },
      { label: 'Shots (on Target)', teamA: 14, teamB: 9 },
      { label: 'Fouls', teamA: 8, teamB: 12 },
      { label: 'Yellow Cards', teamA: 1, teamB: 3 },
      { label: 'Corners', teamA: 6, teamB: 4 }
    ],
    lineup: {
      teamA: ['Courtois', 'Carvajal', 'Militao', 'Rudiger', 'Mendy', 'Valverde', 'Tchouameni', 'Kroos', 'Bellingham', 'Vinicius Jr', 'Rodrygo'],
      teamB: ['Ter Stegen', 'Kounde', 'Araujo', 'Cubarsi', 'Cancelo', 'Gundogan', 'Christensen', 'De Jong', 'Yamal', 'Lewandowski', 'Raphinha']
    },
    commentary: [
      { time: '72\'', event: 'Yellow card for Araujo after a cynical pull on Vinicius Jr.', type: 'card' },
      { time: '67\'', event: 'Substitution: Luka Modric comes on for Toni Kroos.', type: 'info' },
      { time: '59\'', event: 'GOAL! Jude Bellingham scores with a stunning volley inside the box!', type: 'goal' },
      { time: '45\'', event: 'Second half kick-off. No changes for either squad.', type: 'info' }
    ],
    timeline: [
      { time: '14\'', player: 'Lewandowski', team: 'B', event: 'Goal', icon: '⚽' },
      { time: '38\'', player: 'Vinicius Jr', team: 'A', event: 'Goal (Pen)', icon: '⚽' },
      { time: '59\'', player: 'Jude Bellingham', team: 'A', event: 'Goal', icon: '⚽' },
      { time: '72\'', player: 'Araujo', team: 'B', event: 'Yellow Card', icon: '🟨' }
    ]
  },
  {
    id: 'm2',
    sport: 'Cricket',
    league: 'T20 World Cup',
    teamA: { name: 'India', logo: '🇮🇳', score: 182 },
    teamB: { name: 'Australia', logo: '🇦🇺', score: 145 },
    status: 'LIVE',
    time: '15:30',
    elapsed: '17.2 Ov',
    isLive: true,
    prediction: { teamA: 72, draw: 3, teamB: 25, text: "India's spinners are squeezing the middle overs perfectly. Australia requires a miracle partnership at 12.5 runs per over." },
    stats: [
      { label: 'Run Rate', teamA: 9.1, teamB: 8.4 },
      { label: 'Sixes Hit', teamA: 12, teamB: 8 },
      { label: 'Dot Balls', teamA: 42, teamB: 35 },
      { label: 'Wickets Lost', teamA: 5, teamB: 7 }
    ],
    lineup: {
      teamA: ['Rohit Sharma', 'Yashasvi Jaiswal', 'Virat Kohli', 'Suryakumar Yadav', 'Rishabh Pant', 'Hardik Pandya', 'Ravindra Jadeja', 'Axar Patel', 'Kuldeep Yadav', 'Jasprit Bumrah', 'Arshdeep Singh'],
      teamB: ['Travis Head', 'David Warner', 'Mitchell Marsh', 'Glenn Maxwell', 'Marcus Stoinis', 'Tim David', 'Matthew Wade', 'Pat Cummins', 'Mitchell Starc', 'Adam Zampa', 'Josh Hazlewood']
    },
    commentary: [
      { time: '17.2', event: 'OUT! Glenn Maxwell is clean bowled by a beautiful Kuldeep Yadav googly!', type: 'goal' },
      { time: '16.5', event: 'Sixer! Tim David launches a massive strike over deep mid-wicket.', type: 'info' },
      { time: '15.1', event: 'Jasprit Bumrah returns to the attack and concedes only 3 runs.', type: 'info' }
    ],
    timeline: [
      { time: '3.2 Ov', player: 'Rohit Sharma', team: 'A', event: '50 Runs', icon: '🏏' },
      { time: '19.4 Ov', player: 'Suryakumar', team: 'A', event: 'Wicket', icon: '☝️' },
      { time: '9.2 Ov', player: 'Travis Head', team: 'B', event: '50 Runs', icon: '🏏' },
      { time: '17.2 Ov', player: 'Glenn Maxwell', team: 'B', event: 'Wicket', icon: '☝️' }
    ]
  },
  {
    id: 'm3',
    sport: 'Basketball',
    league: 'NBA Finals',
    teamA: { name: 'LA Lakers', logo: '🟡', score: 104 },
    teamB: { name: 'Boston Celtics', logo: '🟢', score: 108 },
    status: 'LIVE',
    time: '19:30',
    elapsed: 'Q4 2:14',
    isLive: true,
    prediction: { teamA: 40, draw: 5, teamB: 55, text: "Celtics hold a critical 4-point lead with clutch free throws. Lakers have team fouls exhausted, giving Boston high leverage." },
    stats: [
      { label: 'Field Goal %', teamA: 47.2, teamB: 49.1 },
      { label: 'Rebounds', teamA: 41, teamB: 44 },
      { label: 'Turnovers', teamA: 11, teamB: 8 },
      { label: '3-Pointers Made', teamA: 14, teamB: 18 }
    ],
    lineup: {
      teamA: ['D. Russell', 'A. Reaves', 'R. Hachimura', 'LeBron James', 'Anthony Davis'],
      teamB: ['J. Holiday', 'D. White', 'Jaylen Brown', 'Jayson Tatum', 'K. Porzingis']
    },
    commentary: [
      { time: '2:14', event: 'Jayson Tatum sinks a contested step-back 3-pointer! Timeout Lakers.', type: 'goal' },
      { time: '3:05', event: 'LeBron James drives hard and completes the and-one play!', type: 'goal' }
    ],
    timeline: [
      { time: 'Q1', player: 'LeBron James', team: 'A', event: 'Dunk', icon: '🏀' },
      { time: 'Q3', player: 'Jaylen Brown', team: 'B', event: '3-Pointer', icon: '🏀' }
    ]
  },
  {
    id: 'm4',
    sport: 'Tennis',
    league: 'Wimbledon',
    teamA: { name: 'C. Alcaraz', logo: '🇪🇸', score: 2 },
    teamB: { name: 'N. Djokovic', logo: '🇷🇸', score: 2 },
    status: 'LIVE',
    time: '14:00',
    elapsed: 'Set 5 - 4-3',
    isLive: true,
    prediction: { teamA: 51, draw: 0, teamB: 49, text: "Alcaraz is serving for a 5-3 lead. Tension is high; the momentum is slightly with the Spaniard but Djokovic is the tiebreak king." },
    stats: [
      { label: 'First Serve %', teamA: 68, teamB: 71 },
      { label: 'Aces', teamA: 11, teamB: 8 },
      { label: 'Double Faults', teamA: 4, teamB: 2 },
      { label: 'Unforced Errors', teamA: 31, teamB: 24 }
    ],
    lineup: {
      teamA: ['Carlos Alcaraz'],
      teamB: ['Novak Djokovic']
    },
    commentary: [
      { time: 'Set 5', event: 'Incredible cross-court forehand winner from Alcaraz! 30-15.', type: 'info' },
      { time: 'Set 5', event: 'Djokovic hits an uncharacteristic unforced error wide.', type: 'incident' }
    ],
    timeline: [
      { time: 'Set 1', player: 'Alcaraz', team: 'A', event: 'Won Set 6-4', icon: '🎾' },
      { time: 'Set 2', player: 'Djokovic', team: 'B', event: 'Won Set 7-6', icon: '🎾' }
    ]
  }
];

const LEAGUE_STANDINGS = [
  { pos: 1, team: 'Real Madrid', mp: 38, w: 29, d: 8, l: 1, gf: 87, ga: 26, gd: 61, pts: 95 },
  { pos: 2, team: 'Barcelona', mp: 38, w: 26, d: 7, l: 5, gf: 79, ga: 44, gd: 35, pts: 85 },
  { pos: 3, team: 'Girona', mp: 38, w: 25, d: 6, l: 7, gf: 85, ga: 46, gd: 39, pts: 81 },
  { pos: 4, team: 'Atletico Madrid', mp: 38, w: 24, d: 4, l: 10, gf: 70, ga: 43, gd: 27, pts: 76 }
];

const LEAGUE_STATS = [
  { label: 'Top Scorer', value: 'Artem Dovbyk (Girona) - 24' },
  { label: 'Most Assists', value: 'Alex Baena (Villarreal) - 14' },
  { label: 'Clean Sheets', value: 'Unai Simón (Athletic Club) - 16' },
  { label: 'Average Goals/Match', value: '2.84' }
];

const LEAGUE_FIXTURES = [
  { date: 'Tomorrow, 18:00', teamA: 'Real Sociedad', teamB: 'Valencia', status: 'UPCOMING' },
  { date: 'Tomorrow, 21:00', teamA: 'Sevilla', teamB: 'Real Betis', status: 'UPCOMING' },
  { date: 'Yesterday', teamA: 'Mallorca', teamB: 'Almeria', score: '2 - 2', status: 'FINISHED' }
];

const SPORTS_CATEGORIES = [
  { name: 'Football', icon: '⚽' },
  { name: 'Cricket', icon: '🏏' },
  { name: 'Basketball', icon: '🏀' },
  { name: 'Tennis', icon: '🎾' },
  { name: 'Baseball', icon: '⚾' },
  { name: 'Hockey', icon: '🏒' },
  { name: 'Formula 1', icon: '🏎️' },
  { name: 'Volleyball', icon: '🏐' }
];

const NEWS_ITEMS = [
  { id: 'n1', category: 'Breaking', title: 'Mbappe completes medical for blockbuster transfer!', time: '10m ago', source: 'ESPN', reads: '142k' },
  { id: 'n2', category: 'Cricket', title: 'Kohli hints at T20 international strategy shifts ahead of home series', time: '42m ago', source: 'Cricinfo', reads: '98k' },
  { id: 'n3', category: 'Formula 1', title: 'Monaco GP: Hamilton claims pole position in stunning wet session', time: '2h ago', source: 'Sky Sports', reads: '65k' },
  { id: 'n4', category: 'NBA', title: 'Lakers lock in 4-year contract extension with veteran head coach', time: '5h ago', source: 'SofaScore', reads: '120k' }
];

// ==========================================
// D3 MOMENTUM SPARKLINE COMPONENT
// ==========================================
interface MomentumPoint {
  time: number;
  value: number;
}

function MatchMomentumSparkline({ match, depth }: { match: Match; depth: 'standard' | 'enhanced' | 'maximum' }) {
  const [pulse, setPulse] = useState(0);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Set up live fluctuation for live matches
  useEffect(() => {
    if (!match.isLive) return;
    const interval = setInterval(() => {
      setPulse(p => p + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, [match.isLive]);

  // Generate deterministic but dynamic data points based on match ID, score, and timeline
  const points: MomentumPoint[] = React.useMemo(() => {
    // Generate a pseudo-random seed based on match.id
    let seed = match.id.charCodeAt(0) + (match.id.charCodeAt(match.id.length - 1) || 5);
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    const count = 18;
    const data: MomentumPoint[] = [];
    
    // Initial point
    data.push({ time: 0, value: 0 });

    let currentVal = 0;
    // Base trend based on score difference
    const scoreDiff = match.teamA.score - match.teamB.score;
    const trend = scoreDiff * 15;

    for (let i = 1; i <= count; i++) {
      const time = Math.floor((i / count) * (match.isLive ? 75 : 90));
      
      // Calculate fluctuations
      let step = (rand() - 0.5) * 45;
      
      // Pull toward trend / timeline events
      const bracketEvents = match.timeline.filter(e => {
        const t = parseInt(e.time);
        return isNaN(t) ? false : t <= time && t > (time - 5);
      });

      bracketEvents.forEach(e => {
        if (e.team === 'A') step += 30;
        if (e.team === 'B') step -= 30;
      });

      currentVal += step;
      // Cap at -90 and 90 to look nice inside charts
      currentVal = Math.min(85, Math.max(-85, currentVal));
      data.push({ time, value: currentVal });
    }

    // For live matches, introduce slight live dynamic offset on the final point based on pulse state
    if (match.isLive && data.length > 0) {
      const last = data[data.length - 1];
      const liveOffset = Math.sin(pulse) * 12;
      last.value = Math.min(90, Math.max(-90, last.value + liveOffset));
    }

    return data;
  }, [match.id, match.teamA.score, match.teamB.score, match.timeline, match.isLive, pulse]);

  // Dimensions of sparkline
  const width = 360;
  const height = 80;
  const margin = { top: 10, right: 10, bottom: 10, left: 10 };

  // D3 Scales
  const xScale = d3.scaleLinear()
    .domain([0, d3.max(points, p => p.time) || 90])
    .range([margin.left, width - margin.right]);

  const yScale = d3.scaleLinear()
    .domain([-100, 100]) // -100 is Team B dominant, +100 is Team A dominant
    .range([height - margin.bottom, margin.top]);

  // D3 Line Generator
  const lineGenerator = d3.line<MomentumPoint>()
    .x(d => xScale(d.time))
    .y(d => yScale(d.value))
    .curve(d3.curveMonotoneX);

  // D3 Area Generators
  const areaAboveGenerator = d3.area<MomentumPoint>()
    .x(d => xScale(d.time))
    .y0(yScale(0))
    .y1(d => yScale(Math.max(0, d.value)))
    .curve(d3.curveMonotoneX);

  const areaBelowGenerator = d3.area<MomentumPoint>()
    .x(d => xScale(d.time))
    .y0(yScale(0))
    .y1(d => yScale(Math.min(0, d.value)))
    .curve(d3.curveMonotoneX);

  const linePath = lineGenerator(points) || '';
  const areaAbovePath = areaAboveGenerator(points) || '';
  const areaBelowPath = areaBelowGenerator(points) || '';

  // Get current dominance descriptor
  const lastPoint = points[points.length - 1];
  const currentDominance = lastPoint.value;
  const dominantTeam = currentDominance > 0 ? match.teamA.name : match.teamB.name;
  const dominancePercent = Math.abs(Math.round(currentDominance));

  const downloadTelemetryCSV = () => {
    // Construct CSV content
    const headers = ["Match ID", "Sport", "Home Team", "Away Team", "Timestamp (Minutes)", "Momentum Value (A-B Dominance)"];
    const rows = points.map(p => [
      match.id,
      match.sport,
      match.teamA.name,
      match.teamB.name,
      p.time,
      p.value.toFixed(2)
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(val => `"${val}"`).join(","))
    ].join("\n");
    
    // Create blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `telemetry_momentum_${match.id}_${match.sport.toLowerCase().replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadSnapshot = () => {
    if (!svgRef.current) return;

    // Dimensions of the high-res social media share card
    const canvasWidth = 1200;
    const canvasHeight = 630; // Perfect standard 1.91:1 aspect ratio for social sharing platforms
    
    const canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Draw solid dark background with subtle sleek dual-gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
    gradient.addColorStop(0, '#090E1D');
    gradient.addColorStop(1, '#03050B');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // 2. Cyber grid pattern lines for a hyper-modern data dashboard vibe
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.02)';
    ctx.lineWidth = 1;
    const gridSpacing = 40;
    for (let x = 0; x < canvasWidth; x += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasHeight);
      ctx.stroke();
    }
    for (let y = 0; y < canvasHeight; y += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasWidth, y);
      ctx.stroke();
    }

    // Outer cyber border accent
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.15)';
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 10, canvasWidth - 20, canvasHeight - 20);

    // 3. Draw Brand and Metadata Header
    ctx.fillStyle = '#00E5FF';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('APEX MATCH MOMENTUM ENGINE', 50, 70);

    ctx.fillStyle = '#94A3B8';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('REAL-TIME ANALYTICAL TELEMETRY FEED', 50, 95);

    // Live state status text
    ctx.fillStyle = match.isLive ? '#10B981' : '#64748B';
    ctx.fillRect(50, 115, 60, 22);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(match.isLive ? '• LIVE' : 'FT MATCH', 60, 130);

    // Category Badge
    ctx.fillStyle = 'rgba(0, 229, 255, 0.1)';
    const sportStr = match.sport.toUpperCase();
    ctx.font = 'bold 11px sans-serif';
    const sportStrWidth = ctx.measureText(sportStr).width;
    ctx.fillRect(120, 115, sportStrWidth + 18, 22);
    ctx.fillStyle = '#00E5FF';
    ctx.fillText(sportStr, 129, 130);

    // Match Teams matchup and scores in high emphasis
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 36px sans-serif';
    ctx.fillText(`${match.teamA.name.toUpperCase()}  ${match.teamA.score} - ${match.teamB.score}  ${match.teamB.name.toUpperCase()}`, 50, 190);

    // 4. Current Dominance Summary Block (Top Right)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '12px sans-serif';
    ctx.fillText('DOMINANCE STATUS INDEX', canvasWidth - 450, 70);

    ctx.fillStyle = currentDominance > 0 ? '#00E5FF' : '#FF4D6D';
    ctx.font = 'bold 28px sans-serif';
    const teamString = `${dominancePercent}% ${currentDominance > 0 ? match.teamA.name.toUpperCase() : match.teamB.name.toUpperCase()}`;
    ctx.fillText(teamString, canvasWidth - 450, 105);

    ctx.fillStyle = '#64748B';
    ctx.font = '9px monospace';
    ctx.fillText(`Ingested Data Volume: ${points.length * 184} datapoints`, canvasWidth - 450, 125);

    // 5. Render SVG into canvas at high fidelity
    const clonedSvg = svgRef.current.cloneNode(true) as SVGSVGElement;
    clonedSvg.setAttribute('width', '1100');
    clonedSvg.setAttribute('height', '320');

    const svgString = new XMLSerializer().serializeToString(clonedSvg);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.src = url;
    img.onload = () => {
      // Draw cloned SVG to canvas
      ctx.drawImage(img, 50, 230, 1100, 320);

      // Footers
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.font = '11px monospace';
      ctx.fillText('POWERED BY GEMINI AI MODEL CO-PROCESSING FEED', 50, 580);

      const webOrigin = window.location.origin;
      ctx.fillText(`URL: ${webOrigin}`, canvasWidth - 50 - ctx.measureText(`URL: ${webOrigin}`).width, 580);

      // Trigger direct download
      try {
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.setAttribute('href', dataUrl);
        link.setAttribute('download', `momentum_snapshot_${match.id}_${match.sport.toLowerCase().replace(/\s+/g, '_')}.png`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        console.error('Failed to export canvas as PNG', err);
      }

      // Cleanup
      URL.revokeObjectURL(url);
    };
  };

  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3.5 space-y-3 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> Live Momentum Index
          </span>
          <p className="text-xs font-semibold text-white mt-0.5">
            {dominancePercent < 15 ? (
              <span className="text-slate-400">Match is highly balanced (Neutral)</span>
            ) : (
              <span>
                <span className={currentDominance > 0 ? 'text-[#00E5FF]' : 'text-[#FF4D6D]'}>
                  {dominantTeam}
                </span>{' '}
                dominating (+{dominancePercent}%)
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={downloadTelemetryCSV}
            className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold text-slate-300 bg-white/5 border border-white/10 hover:border-[#00E5FF]/40 hover:text-[#00E5FF] hover:bg-[#00E5FF]/10 rounded-lg transition-all cursor-pointer shadow-sm active:scale-95"
            title="Download CSV of Raw Telemetry Data"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          
          <button
            onClick={downloadSnapshot}
            className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold text-slate-300 bg-white/5 border border-white/10 hover:border-emerald-400/40 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-all cursor-pointer shadow-sm active:scale-95"
            title="Download PNG Social Sharing Snapshot"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Snapshot</span>
          </button>

          <span className="text-[8px] bg-cyan-500/10 text-[#00E5FF] px-2 py-1 rounded-full font-bold uppercase tracking-widest font-mono">
            D3 RENDERED
          </span>
        </div>
      </div>

      {/* SVG Container */}
      <div className="relative w-full overflow-hidden rounded-lg bg-[#070b14]/50 border border-white/5 py-1">
        <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" className="overflow-visible">
          <defs>
            {/* Gradient for Team A dominance area (Above midline) */}
            <linearGradient id="gradient-above" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.0" />
            </linearGradient>
            
            {/* Gradient for Team B dominance area (Below midline) */}
            <linearGradient id="gradient-below" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF4D6D" stopOpacity="0.0" />
              <stop offset="100%" stopColor="#FF4D6D" stopOpacity="0.25" />
            </linearGradient>

            {/* Glowing filter for main momentum line */}
            <filter id="glow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#00E5FF" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Neutral midline */}
          <line
            x1={margin.left}
            y1={yScale(0)}
            x2={width - margin.right}
            y2={yScale(0)}
            stroke="rgba(255,255,255,0.12)"
            strokeDasharray="4,4"
          />

          {/* Area above (Team A) */}
          <path d={areaAbovePath} fill="url(#gradient-above)" />

          {/* Area below (Team B) */}
          <path d={areaBelowPath} fill="url(#gradient-below)" />

          {/* Multi-colored line path */}
          <path
            d={linePath}
            fill="none"
            stroke="url(#line-grad)"
            strokeWidth="1.75"
            strokeLinecap="round"
            className="transition-all duration-300"
          />

          {/* Linear gradient for stroke line to transition nicely between cyan & hot pink */}
          <linearGradient id="line-grad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={height}>
            <stop offset="25%" stopColor="#00E5FF" />
            <stop offset="50%" stopColor="#E2E8F0" />
            <stop offset="75%" stopColor="#FF4D6D" />
          </linearGradient>

          {/* Markers/Circles for key moments */}
          {points.map((p, i) => {
            const hasEvent = i > 0 && i < points.length - 1 && Math.abs(p.value) > 40 && i % 4 === 0;
            if (!hasEvent) return null;
            
            return (
              <g key={i}>
                <circle
                  cx={xScale(p.time)}
                  cy={yScale(p.value)}
                  r="3.5"
                  fill={p.value > 0 ? '#00E5FF' : '#FF4D6D'}
                />
                <circle
                  cx={xScale(p.time)}
                  cy={yScale(p.value)}
                  r="7"
                  fill="none"
                  stroke={p.value > 0 ? '#00E5FF' : '#FF4D6D'}
                  strokeWidth="1"
                  strokeOpacity="0.4"
                />
              </g>
            );
          })}

          {/* Last Pulse circle indicator */}
          <circle
            cx={xScale(lastPoint.time)}
            cy={yScale(lastPoint.value)}
            r="4.5"
            fill={lastPoint.value > 0 ? '#00E5FF' : '#FF4D6D'}
          />
          <circle
            cx={xScale(lastPoint.time)}
            cy={yScale(lastPoint.value)}
            r="9"
            fill="none"
            stroke={lastPoint.value > 0 ? '#00E5FF' : '#FF4D6D'}
            strokeWidth="1.5"
            strokeOpacity="0.5"
          />
        </svg>

        {/* Labels overlay inside the sparkline box */}
        <div className="absolute top-1 left-2 text-[8px] font-mono text-slate-500 uppercase flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" /> {match.teamA.name} Zone
        </div>
        <div className="absolute bottom-1 left-2 text-[8px] font-mono text-slate-500 uppercase flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D6D]" /> {match.teamB.name} Zone
        </div>
        <div className="absolute bottom-1 right-2 text-[8px] font-mono text-slate-500">
          Time ({match.isLive ? `${lastPoint.time}'` : 'FT'})
        </div>
      </div>

      <div className="flex justify-between items-center text-[9px] text-slate-500 font-mono">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Real-time Telemetry Feedback
        </span>
        <span>Resolution: {depth === 'standard' ? 'Standard 5m' : depth === 'enhanced' ? 'Sub-minute' : 'Hi-Res Telemetry'}</span>
      </div>
    </div>
  );
}

export default function App() {
  // ==========================================
  // NAVIGATION & DEMO CONTROL STATE
  // ==========================================
  const [currentScreen, setCurrentScreen] = useState<string>('splash');
  const [onboardingStep, setOnboardingStep] = useState<number>(0);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [activeTab, setActiveTab] = useState<'home' | 'live' | 'news' | 'favorites' | 'profile'>('home');
  
  // Custom navigation parameters
  const [selectedMatchId, setSelectedMatchId] = useState<string>('m1');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>('p1');
  const [matchDetailsTab, setMatchDetailsTab] = useState<'overview' | 'stats' | 'lineups' | 'commentary' | 'standings'>('overview');
  
  // App data state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSport, setSelectedSport] = useState<string>('Football');
  const [isLiveOnly, setIsLiveOnly] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [favoriteTeams, setFavoriteTeams] = useState<string[]>(['Real Madrid', 'India', 'LA Lakers']);
  const [favoritePlayers, setFavoritePlayers] = useState<string[]>(['Jude Bellingham', 'Virat Kohli']);
  const [userProfile, setUserProfile] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@apexscores.com',
    phone: '+1 555-0199',
    language: 'English',
    notifications: true,
    darkMode: true,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    sportsPrefs: ['Football', 'Cricket', 'Basketball']
  });

  // AI Prediction Assistant state
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isGeneratingPrediction, setIsGeneratingPrediction] = useState<boolean>(false);
  const [customAiQuery, setCustomAiQuery] = useState<string>('');
  const [telemetryDepth, setTelemetryDepth] = useState<'standard' | 'enhanced' | 'maximum'>('enhanced');

  // Live score dynamic updates
  const [matches, setMatches] = useState<Match[]>(MOCK_MATCHES);
  const [scoreFlash, setScoreFlash] = useState<string | null>(null);

  // Authentication states
  const [loginEmail, setLoginEmail] = useState<string>('alex.johnson@apexscores.com');
  const [loginPassword, setLoginPassword] = useState<string>('********');
  const [regName, setRegName] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regPrefs, setRegPrefs] = useState<string[]>([]);

  // ==========================================
  // EFFECT LOOPS & SIMULATIONS
  // ==========================================
  // 1. Splash Screen Auto Dismiss (set to 2.5s, but manual selector always works)
  useEffect(() => {
    if (currentScreen === 'splash') {
      const timer = setTimeout(() => {
        setCurrentScreen('onboarding');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  // 2. Real-time Match Scores Simulation (Updates every 8 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setMatches(prevMatches => {
        return prevMatches.map(match => {
          if (match.isLive && Math.random() > 0.4) {
            const teamToScore = Math.random() > 0.5 ? 'teamA' : 'teamB';
            const scoreIncrement = match.sport === 'Basketball' ? Math.floor(Math.random() * 3) + 2 : 1;
            
            // Flash notification
            const scoringTeamName = teamToScore === 'teamA' ? match.teamA.name : match.teamB.name;
            setScoreFlash(`GOAL/SCORE! ${scoringTeamName} has scored in the ${match.sport} match!`);
            setTimeout(() => setScoreFlash(null), 4000);

            return {
              ...match,
              [teamToScore]: {
                ...match[teamToScore],
                score: match[teamToScore].score + scoreIncrement
              },
              elapsed: match.sport === 'Football' 
                ? `${Math.min(90, parseInt(match.elapsed || '73') + 1)}'` 
                : match.elapsed
            };
          }
          return match;
        });
      });
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // 3. Pull to Refresh Simulator
  const triggerRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1200);
  };

  // 4. Smart AI prediction trigger
  const generateAIPrediction = (match: Match) => {
    setIsGeneratingPrediction(true);
    setAiAnalysis('');
    
    setTimeout(() => {
      const response = `🔮 [GEMINI SMART PREDICTION]
Our AI model analyzed 25,000 data points for ${match.teamA.name} vs ${match.teamB.name}.
      
📊 Key Analytics:
- Head-to-Head win rate favors ${match.teamA.name} at ${match.prediction.teamA}%.
- Average team form indicates ${match.teamA.name} is on an unbeaten 5-match home streak.
- ${match.teamB.name} is lacking key players in defense which increases vulnerability.

📈 Strategic Recommendation:
We predict a high-probability outcome of over 2.5 total points. The optimal tactical bet remains backing ${match.teamA.name} to win ${match.sport === 'Football' ? '2-1' : 'by a tight margin'}. Watch the transition phase closely as the live momentum is key!`;
      
      setAiAnalysis(response);
      setIsGeneratingPrediction(false);
    }, 1500);
  };

  const handleCustomAiAsk = (match: Match) => {
    if (!customAiQuery.trim()) return;
    setIsGeneratingPrediction(true);
    
    setTimeout(() => {
      setAiAnalysis(`🤖 [Gemini AI Engine responding to: "${customAiQuery}"]
Based on live telemetry, the pace of play for ${match.teamA.name} vs ${match.teamB.name} is accelerating. 

Our deep neural networks suggest that:
1. The field pressure ratio is 1.4x in favor of ${match.teamA.name}.
2. Counter-pressing metrics indicate a 73% probability of another score event within 15 minutes.
3. Live tactical shifts suggest the underdogs are moving into a high-press defensive structure.`);
      setIsGeneratingPrediction(false);
      setCustomAiQuery('');
    }, 1200);
  };

  const toggleFavoriteTeam = (teamName: string) => {
    if (favoriteTeams.includes(teamName)) {
      setFavoriteTeams(favoriteTeams.filter(t => t !== teamName));
    } else {
      setFavoriteTeams([...favoriteTeams, teamName]);
    }
  };

  const toggleFavoritePlayer = (playerName: string) => {
    if (favoritePlayers.includes(playerName)) {
      setFavoritePlayers(favoritePlayers.filter(p => p !== playerName));
    } else {
      setFavoritePlayers([...favoritePlayers, playerName]);
    }
  };

  // Get active match or fallback
  const activeMatch = matches.find(m => m.id === selectedMatchId) || matches[0];
  const activePlayer = MOCK_PLAYERS.find(p => p.id === selectedPlayerId) || MOCK_PLAYERS[0];

  // Helper to compute live telemetry points and AI confidence scores
  const getTelemetryData = (match: Match) => {
    let multiplier = 1.0;
    if (telemetryDepth === 'standard') multiplier = 0.6;
    if (telemetryDepth === 'maximum') multiplier = 1.6;

    // Ingest stats points: Shots, wickets, possession, rebounds, set history etc.
    const statsFactor = match.stats ? match.stats.reduce((acc, s) => acc + s.teamA + s.teamB, 0) * 140 : 1500;
    const timelineFactor = match.timeline ? match.timeline.length * 720 : 1000;
    const liveFactor = match.isLive ? 5200 : 1800;
    const processingSpike = isGeneratingPrediction ? 8420 : 0;
    
    // Total raw telemetric data points analyzed
    const baseVolume = 18000 + Math.floor(statsFactor * multiplier) + Math.floor(timelineFactor * multiplier) + liveFactor + processingSpike;
    
    // Confidence score based on data volume & status
    const baseConfidence = 65;
    const volumeBonus = Math.min(22, Math.floor((baseVolume - 18000) / 680));
    const statusModifier = match.isLive ? 6 : 10; // completed matches are deterministic, live matches have dynamic delta
    const depthBonus = telemetryDepth === 'standard' ? -6 : telemetryDepth === 'maximum' ? 7 : 0;
    
    const confidence = Math.min(99, Math.max(52, baseConfidence + volumeBonus + statusModifier + depthBonus));
    
    return {
      volume: baseVolume,
      confidence: confidence
    };
  };

  // Filter matches based on category, search & live settings
  const filteredMatches = matches.filter(match => {
    const matchesSport = match.sport.toLowerCase() === selectedSport.toLowerCase();
    const matchesSearch = match.teamA.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          match.teamB.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          match.league.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLive = !isLiveOnly || match.isLive;
    return matchesSport && matchesSearch && matchesLive;
  });

  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100 flex flex-col relative overflow-x-hidden">
      
      {/* ================= MOCK NOTIFICATION FLASH BANNER ================= */}
      {scoreFlash && (
        <div id="score-flash-toast" className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-sm w-11/12 bg-gradient-to-r from-[#00E5FF] to-[#FF4D6D] p-[1px] rounded-xl shadow-2xl animate-bounce">
          <div className="bg-[#0B1020] p-4 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#00E5FF]/20 flex items-center justify-center text-[#00E5FF]">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#00E5FF] tracking-wider uppercase">Live Goal Alert</p>
              <p className="text-xs text-white font-semibold">{scoreFlash}</p>
            </div>
          </div>
        </div>
      )}

      {/* ================= PREMIUM DEMO SWITCH PANEL ================= */}
      <div className="fixed right-4 bottom-24 lg:top-4 z-40">
        <div className="group relative">
          <button id="demo-console-btn" className="bg-[#00E5FF] text-[#0B1020] p-3 rounded-full font-bold shadow-lg flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer">
            <Sparkles className="w-5 h-5" />
            <span className="hidden group-hover:inline text-xs">Direct Screen Portal</span>
          </button>
          
          <div className="absolute right-0 bottom-12 lg:bottom-auto lg:top-12 bg-slate-900/95 border border-white/10 rounded-2xl p-4 w-72 shadow-2xl hidden group-hover:block glass-premium">
            <h4 className="text-xs font-bold text-[#00E5FF] uppercase tracking-wider mb-2 flex items-center gap-1">
              <Compass className="w-4 h-4" /> Inspect All 10 Screens
            </h4>
            <p className="text-[10px] text-slate-400 mb-3">Jump directly to review individual screen designs requested in the spec.</p>
            
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <button onClick={() => setCurrentScreen('splash')} className={`p-1.5 rounded text-left ${currentScreen === 'splash' ? 'bg-[#00E5FF]/20 text-[#00E5FF] font-bold' : 'hover:bg-white/5'}`}>
                1. Splash Screen
              </button>
              <button onClick={() => { setCurrentScreen('onboarding'); setOnboardingStep(0); }} className={`p-1.5 rounded text-left ${currentScreen === 'onboarding' ? 'bg-[#00E5FF]/20 text-[#00E5FF] font-bold' : 'hover:bg-white/5'}`}>
                2. Onboarding
              </button>
              <button onClick={() => { setCurrentScreen('auth'); setAuthMode('login'); }} className={`p-1.5 rounded text-left ${currentScreen === 'auth' && authMode === 'login' ? 'bg-[#00E5FF]/20 text-[#00E5FF] font-bold' : 'hover:bg-white/5'}`}>
                3A. Auth Login
              </button>
              <button onClick={() => { setCurrentScreen('auth'); setAuthMode('register'); }} className={`p-1.5 rounded text-left ${currentScreen === 'auth' && authMode === 'register' ? 'bg-[#00E5FF]/20 text-[#00E5FF] font-bold' : 'hover:bg-white/5'}`}>
                3B. Auth Register
              </button>
              <button onClick={() => { setCurrentScreen('home'); setActiveTab('home'); }} className={`p-1.5 rounded text-left ${currentScreen === 'home' && activeTab === 'home' ? 'bg-[#00E5FF]/20 text-[#00E5FF] font-bold' : 'hover:bg-white/5'}`}>
                4. Home Dashboard
              </button>
              <button onClick={() => { setCurrentScreen('match-details'); }} className={`p-1.5 rounded text-left ${currentScreen === 'match-details' ? 'bg-[#00E5FF]/20 text-[#00E5FF] font-bold' : 'hover:bg-white/5'}`}>
                5. Match Details
              </button>
              <button onClick={() => { setCurrentScreen('league'); }} className={`p-1.5 rounded text-left ${currentScreen === 'league' ? 'bg-[#00E5FF]/20 text-[#00E5FF] font-bold' : 'hover:bg-white/5'}`}>
                6. League Screen
              </button>
              <button onClick={() => { setCurrentScreen('player'); }} className={`p-1.5 rounded text-left ${currentScreen === 'player' ? 'bg-[#00E5FF]/20 text-[#00E5FF] font-bold' : 'hover:bg-white/5'}`}>
                7. Player Profile
              </button>
              <button onClick={() => { setCurrentScreen('notifications'); }} className={`p-1.5 rounded text-left ${currentScreen === 'notifications' ? 'bg-[#00E5FF]/20 text-[#00E5FF] font-bold' : 'hover:bg-white/5'}`}>
                8. Alerts/Notif
              </button>
              <button onClick={() => { setCurrentScreen('home'); setActiveTab('favorites'); }} className={`p-1.5 rounded text-left ${currentScreen === 'home' && activeTab === 'favorites' ? 'bg-[#00E5FF]/20 text-[#00E5FF] font-bold' : 'hover:bg-white/5'}`}>
                9. Favorites
              </button>
              <button onClick={() => { setCurrentScreen('home'); setActiveTab('profile'); }} className={`p-1.5 rounded text-left ${currentScreen === 'home' && activeTab === 'profile' ? 'bg-[#00E5FF]/20 text-[#00E5FF] font-bold' : 'hover:bg-white/5'}`}>
                10. Settings & Acc
              </button>
            </div>
            
            <div className="border-t border-white/5 mt-3 pt-2 flex justify-between items-center text-[11px]">
              <span className="text-slate-400">Offline Cache Simulation</span>
              <button onClick={() => setIsOffline(!isOffline)} className={`px-2 py-0.5 rounded font-bold ${isOffline ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                {isOffline ? 'OFFLINE' : 'ONLINE'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MAIN OUTDOOR CONTAINER ================= */}
      <main className="flex-1 w-full max-w-md mx-auto bg-[#070B16] min-h-screen shadow-2xl relative flex flex-col border-x border-white/5">
        
        {/* Offline Mode Alert banner if cached mode is on */}
        {isOffline && (
          <div id="offline-banner" className="bg-red-500/90 text-white py-1 px-4 text-center text-xs font-semibold flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>Offline Mode Enabled. Showing cached scores.</span>
          </div>
        )}

        {/* ==========================================
            SCREEN 1: SPLASH SCREEN
            ========================================== */}
        {currentScreen === 'splash' && (
          <div id="screen-splash" className="flex-1 flex flex-col items-center justify-between p-8 relative overflow-hidden bg-gradient-to-b from-[#0B1020] via-[#070B16] to-[#04060c]">
            {/* Visual background sports collage overlays */}
            <div className="absolute inset-0 opacity-15 mix-blend-overlay bg-[url('https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=600')] bg-cover bg-center"></div>
            
            {/* Decorative glows */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-[#00E5FF] filter blur-[100px] opacity-30"></div>
            <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-[#FF4D6D] filter blur-[100px] opacity-20"></div>

            <div className="w-full flex justify-end pt-2">
              <button onClick={() => setCurrentScreen('onboarding')} className="text-xs text-[#00E5FF] font-semibold border border-[#00E5FF]/20 px-3 py-1 rounded-full bg-white/5 flex items-center gap-1 cursor-pointer">
                Skip Splash <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Animated Center Logo */}
            <div className="flex flex-col items-center justify-center text-center my-auto relative z-10">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#00E5FF] to-[#FF4D6D] p-[3px] shadow-[0_0_40px_rgba(0,229,255,0.25)] mb-6 animate-pulse">
                <div className="w-full h-full bg-[#0B1020] rounded-[21px] flex items-center justify-center">
                  <Zap className="w-12 h-12 text-[#00E5FF] filter drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]" />
                </div>
              </div>
              
              <h1 className="text-4xl font-extrabold tracking-tight mb-2">
                APEX<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#FF4D6D]">SCORES</span>
              </h1>
              <p className="text-[#00E5FF] font-medium tracking-widest text-xs uppercase">Live Every Moment of Sports</p>
            </div>

            {/* Loading Indicator and footer */}
            <div className="w-full flex flex-col items-center gap-6 pb-8 relative z-10">
              <div className="w-12 h-12 rounded-full border-4 border-white/5 border-t-[#00E5FF] animate-spin"></div>
              
              <div className="flex gap-2 text-[10px] text-slate-500 uppercase tracking-widest">
                <span>Cricket</span> • <span>Football</span> • <span>NBA</span> • <span>F1</span> • <span>Tennis</span>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            SCREEN 2: ONBOARDING SCREEN (3 Stages)
            ========================================== */}
        {currentScreen === 'onboarding' && (
          <div id="screen-onboarding" className="flex-1 flex flex-col justify-between p-6 bg-[#0B1020] relative">
            
            {/* Top skipped bar */}
            <div className="flex justify-between items-center pt-2">
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${onboardingStep === i ? 'w-6 bg-[#00E5FF]' : 'w-2 bg-white/20'}`} />
                ))}
              </div>
              <button onClick={() => setCurrentScreen('auth')} className="text-xs text-slate-400 hover:text-white font-medium cursor-pointer">
                Skip
              </button>
            </div>

            {/* Onboarding content dynamically swapping based on step */}
            <div className="my-auto py-8 text-center flex flex-col items-center">
              {onboardingStep === 0 && (
                <div className="animate-fadeIn">
                  <div className="w-56 h-56 rounded-full bg-gradient-to-b from-[#00E5FF]/20 to-transparent flex items-center justify-center mb-8 relative">
                    <Trophy className="w-28 h-28 text-[#00E5FF] drop-shadow-[0_0_15px_rgba(0,229,255,0.4)]" />
                    <span className="absolute top-4 right-4 text-3xl">⚽</span>
                    <span className="absolute bottom-4 left-4 text-3xl">🏏</span>
                  </div>
                  <h2 className="text-2xl font-bold mb-3">Follow Your Favorites</h2>
                  <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">
                    Choose your champion teams and elite players to construct a personalized feed that filters out the noise.
                  </p>
                </div>
              )}

              {onboardingStep === 1 && (
                <div className="animate-fadeIn">
                  <div className="w-56 h-56 rounded-full bg-gradient-to-b from-[#FF4D6D]/20 to-transparent flex items-center justify-center mb-8 relative">
                    <Bell className="w-28 h-28 text-[#FF4D6D] drop-shadow-[0_0_15px_rgba(255,77,109,0.4)]" />
                    <span className="absolute top-6 left-6 text-3xl">🏀</span>
                    <span className="absolute bottom-6 right-6 text-3xl">🏎️</span>
                  </div>
                  <h2 className="text-2xl font-bold mb-3">Real-Time Fast Alerts</h2>
                  <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">
                    Get instant microsecond push notifications for goals, wickets, key wickets, breaking news, and full-time events.
                  </p>
                </div>
              )}

              {onboardingStep === 2 && (
                <div className="animate-fadeIn">
                  <div className="w-56 h-56 rounded-full bg-gradient-to-b from-[#00C853]/20 to-transparent flex items-center justify-center mb-8 relative">
                    <Activity className="w-28 h-28 text-[#00C853] drop-shadow-[0_0_15px_rgba(0,200,83,0.4)]" />
                    <span className="absolute top-6 right-4 text-3xl">🎾</span>
                    <span className="absolute bottom-6 left-6 text-3xl">🏐</span>
                  </div>
                  <h2 className="text-2xl font-bold mb-3">AI Predictions & Stats</h2>
                  <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">
                    Access elite level deep team analytics, interactive lineups, live commentaries, and state-of-the-art AI match forecasts.
                  </p>
                </div>
              )}
            </div>

            {/* Bottom buttons */}
            <div className="pb-4">
              {onboardingStep < 2 ? (
                <button 
                  onClick={() => setOnboardingStep(prev => prev + 1)}
                  className="w-full bg-white/10 hover:bg-white/15 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  Next Screen <ChevronRight className="w-4 h-4 text-[#00E5FF]" />
                </button>
              ) : (
                <button 
                  onClick={() => setCurrentScreen('auth')}
                  className="w-full bg-gradient-to-r from-[#00E5FF] to-[#FF4D6D] hover:opacity-95 text-[#0B1020] py-4 rounded-2xl font-bold transition-all shadow-[0_0_30px_rgba(0,229,255,0.3)] cursor-pointer"
                >
                  Get Started Now
                </button>
              )}
            </div>
          </div>
        )}

        {/* ==========================================
            SCREEN 3: AUTHENTICATION (Login / Register)
            ========================================== */}
        {currentScreen === 'auth' && (
          <div id="screen-auth" className="flex-1 flex flex-col justify-between p-6 bg-[#0B1020] relative">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-[#00E5FF] filter blur-[80px] opacity-20"></div>

            {/* Header */}
            <div className="text-center pt-6 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#00E5FF] to-[#FF4D6D] p-[2px] mx-auto mb-4">
                <div className="w-full h-full bg-[#0B1020] rounded-[14px] flex items-center justify-center">
                  <Zap className="w-6 h-6 text-[#00E5FF]" />
                </div>
              </div>
              <h2 className="text-2xl font-bold">
                {authMode === 'login' ? 'Welcome Back!' : 'Create Account'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">Join millions of sport fans worldwide</p>
            </div>

            {/* Login Mode */}
            {authMode === 'login' ? (
              <div className="my-auto py-6 space-y-4 relative z-10 animate-fadeIn">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                    <input 
                      type="email" 
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#00E5FF] transition-colors"
                      placeholder="name@domain.com"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Password</label>
                    <button onClick={() => alert('Password reset link sent to your email!')} className="text-xs text-[#00E5FF] hover:underline">Forgot?</button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                    <input 
                      type="password" 
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#00E5FF] transition-colors"
                      placeholder="Enter password"
                    />
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setUserProfile(prev => ({ ...prev, email: loginEmail }));
                    setCurrentScreen('home');
                    setActiveTab('home');
                  }}
                  className="w-full bg-[#00E5FF] hover:bg-[#00E5FF]/90 text-[#0B1020] py-3.5 rounded-xl font-bold transition-all mt-4 cursor-pointer"
                >
                  Sign In
                </button>

                {/* Third party logins */}
                <div className="space-y-2 pt-4">
                  <p className="text-center text-[11px] text-slate-500 uppercase tracking-widest font-semibold">Or continue with</p>
                  <div className="grid grid-cols-3 gap-2">
                    <button onClick={() => { setCurrentScreen('home'); }} className="bg-white/5 border border-white/10 py-2.5 rounded-lg text-xs font-bold hover:bg-white/10 flex items-center justify-center gap-1.5 cursor-pointer">
                      Google
                    </button>
                    <button onClick={() => { setCurrentScreen('home'); }} className="bg-white/5 border border-white/10 py-2.5 rounded-lg text-xs font-bold hover:bg-white/10 flex items-center justify-center gap-1.5 cursor-pointer">
                      Apple
                    </button>
                    <button onClick={() => { setCurrentScreen('home'); }} className="bg-white/5 border border-white/10 py-2.5 rounded-lg text-xs font-bold hover:bg-white/10 flex items-center justify-center gap-1.5 cursor-pointer">
                      Facebook
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Register Mode with Favorite Sports Chips */
              <div className="my-auto py-6 space-y-4 max-h-[420px] overflow-y-auto no-scrollbar relative z-10 animate-fadeIn">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Full Name</label>
                  <input 
                    type="text" 
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#00E5FF] transition-colors"
                    placeholder="E.g., Narmathan"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Email Address</label>
                  <input 
                    type="email" 
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#00E5FF] transition-colors"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Phone Number</label>
                  <input 
                    type="tel" 
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#00E5FF] transition-colors"
                    placeholder="+94 77 123 4567"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1 uppercase tracking-wider">Password</label>
                  <input 
                    type="password" 
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#00E5FF] transition-colors"
                    placeholder="Min 8 characters"
                  />
                </div>

                {/* Favorite Sports Chips */}
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-2 uppercase tracking-wider">Favorite Sports Selection</label>
                  <div className="flex flex-wrap gap-1.5">
                    {SPORTS_CATEGORIES.map(sport => {
                      const isSelected = regPrefs.includes(sport.name);
                      return (
                        <button
                          key={sport.name}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setRegPrefs(regPrefs.filter(p => p !== sport.name));
                            } else {
                              setRegPrefs([...regPrefs, sport.name]);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                            isSelected ? 'bg-[#00E5FF] text-[#0B1020] font-bold shadow-lg' : 'bg-white/5 text-slate-300 border border-white/5 hover:bg-white/10'
                          }`}
                        >
                          <span>{sport.icon}</span>
                          <span>{sport.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setUserProfile({
                      ...userProfile,
                      name: regName || 'Alex Johnson',
                      email: regEmail || 'narmathan2706@gmail.com',
                      phone: regPhone || '+1 555-0199',
                      sportsPrefs: regPrefs.length > 0 ? regPrefs : ['Football', 'Cricket']
                    });
                    setCurrentScreen('home');
                    setActiveTab('home');
                  }}
                  className="w-full bg-gradient-to-r from-[#00E5FF] to-[#FF4D6D] text-[#0B1020] py-3 rounded-xl font-bold transition-all shadow-lg mt-2 cursor-pointer"
                >
                  Create Account
                </button>
              </div>
            )}

            {/* Switch authentication modes */}
            <div className="text-center pt-4 border-t border-white/5">
              <p className="text-xs text-slate-400">
                {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
                <button 
                  onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                  className="text-[#00E5FF] font-semibold hover:underline"
                >
                  {authMode === 'login' ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
          </div>
        )}

        {/* ==========================================
            HOME CONTAINER (Home, Live, News, Favorites, Profile)
            ========================================== */}
        {currentScreen === 'home' && (
          <div className="flex-1 flex flex-col min-h-0 bg-[#070B16]">
            
            {/* STICKY TOP BAR */}
            <header className="sticky top-0 z-20 bg-[#0B1020]/95 backdrop-blur-md border-b border-white/5 px-4 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#00E5FF] to-[#FF4D6D] p-[1.5px]">
                  <div className="w-full h-full bg-[#0B1020] rounded-[10px] flex items-center justify-center">
                    <Zap className="w-4 h-4 text-[#00E5FF]" />
                  </div>
                </div>
                <h3 className="font-extrabold text-base tracking-wide uppercase">
                  APEX<span className="text-[#00E5FF]">SCORES</span>
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setCurrentScreen('notifications')}
                  className="relative p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors text-slate-300"
                >
                  <Bell className="w-4.5 h-4.5" />
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF4D6D]"></span>
                </button>

                <button 
                  onClick={() => setActiveTab('profile')}
                  className="w-8 h-8 rounded-full overflow-hidden border border-[#00E5FF]/40 cursor-pointer"
                >
                  <img src={userProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
                </button>
              </div>
            </header>

            {/* PULL TO REFRESH INDICATION */}
            {isRefreshing && (
              <div className="bg-slate-950/80 py-2.5 flex items-center justify-center gap-2 text-xs text-[#00E5FF] font-medium border-b border-white/5">
                <RefreshCw className="w-4.5 h-4.5 animate-spin" />
                <span>Simulating database sync...</span>
              </div>
            )}

            {/* TAB CONTAINER: HOME */}
            {activeTab === 'home' && (
              <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-5">
                
                {/* SEARCH BAR */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search teams, players, leagues..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-10 text-xs focus:outline-none focus:border-[#00E5FF] transition-colors"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold hover:text-white">✕</button>
                  )}
                </div>

                {/* HORIZONTAL SPORTS CATEGORIES */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <FlameKindling className="w-4 h-4 text-[#FF4D6D]" /> Categories
                    </h4>
                    <button onClick={triggerRefresh} className="text-[11px] text-[#00E5FF] font-medium flex items-center gap-1">
                      <RefreshCw className="w-3 h-3" /> Refresh Feed
                    </button>
                  </div>
                  
                  <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {SPORTS_CATEGORIES.map(sport => {
                      const isSelected = selectedSport === sport.name;
                      return (
                        <button
                          key={sport.name}
                          onClick={() => {
                            setSelectedSport(sport.name);
                            // Highlight the corresponding player when changing sports
                            if (sport.name === 'Cricket') setSelectedPlayerId('p2');
                            else setSelectedPlayerId('p1');
                          }}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                            isSelected 
                              ? 'bg-gradient-to-r from-[#00E5FF] to-[#00B0FF] text-[#0B1020] border-transparent shadow-[0_4px_12px_rgba(0,229,255,0.25)]' 
                              : 'bg-white/5 text-slate-300 border-white/5 hover:bg-white/10'
                          }`}
                        >
                          <span className="text-sm">{sport.icon}</span>
                          <span>{sport.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* FEATURED LIVE MATCH CAROUSEL */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-[#00E5FF]" /> Featured Live
                  </h4>
                  
                  <div className="bg-gradient-to-br from-[#0B1020] to-[#121A30] border border-white/10 rounded-2xl p-4 relative overflow-hidden shadow-xl">
                    <div className="absolute top-0 right-0 bg-[#FF4D6D] text-[#0B1020] text-[9px] font-extrabold px-3 py-1 rounded-bl-xl uppercase tracking-wider flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span> Live Blockbuster
                    </div>

                    <div className="text-[10px] text-[#00E5FF] font-bold uppercase tracking-widest flex items-center gap-1 mb-2">
                      <Shield className="w-3.5 h-3.5" /> El Clásico • La Liga
                    </div>

                    {/* Team Display */}
                    <div className="flex items-center justify-between py-2">
                      <div className="flex flex-col items-center flex-1 text-center">
                        <span className="text-3xl mb-1 filter drop-shadow">⚪</span>
                        <span className="text-xs font-bold">Real Madrid</span>
                        <span className="text-[10px] text-slate-400">Home</span>
                      </div>

                      <div className="flex flex-col items-center px-4">
                        <div className="text-2xl font-black tracking-widest text-[#00E5FF]">2 - 1</div>
                        <div className="bg-white/5 border border-white/5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-[#FF4D6D] mt-2 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> 73'
                        </div>
                      </div>

                      <div className="flex flex-col items-center flex-1 text-center">
                        <span className="text-3xl mb-1 filter drop-shadow">🔵</span>
                        <span className="text-xs font-bold">Barcelona</span>
                        <span className="text-[10px] text-slate-400">Away</span>
                      </div>
                    </div>

                    {/* Bottom action */}
                    <div className="border-t border-white/5 mt-3 pt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#00E5FF]" />
                        <span className="text-[10px] text-slate-300 font-medium">Predictor favors Madrid (55%)</span>
                      </div>

                      <button 
                        onClick={() => {
                          setSelectedMatchId('m1');
                          setCurrentScreen('match-details');
                        }}
                        className="bg-[#00E5FF] hover:bg-[#00E5FF]/90 text-[#0B1020] text-xs font-bold px-4 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer transition-all hover:scale-105"
                      >
                        Enter Match <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* FILTERS & LIVE MATCHES LIST */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {selectedSport} Fixtures ({filteredMatches.length})
                    </h4>
                    
                    {/* Live Only Filter */}
                    <button 
                      onClick={() => setIsLiveOnly(!isLiveOnly)}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all flex items-center gap-1 border cursor-pointer ${
                        isLiveOnly 
                          ? 'bg-[#FF4D6D]/15 text-[#FF4D6D] border-[#FF4D6D]/30' 
                          : 'bg-white/5 text-slate-300 border-white/5 hover:bg-white/10'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full bg-[#FF4D6D] ${isLiveOnly ? 'animate-pulse' : ''}`}></span>
                      Live Only
                    </button>
                  </div>

                  {filteredMatches.length === 0 ? (
                    <div className="bg-white/5 rounded-xl p-8 text-center border border-white/5">
                      <AlertCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                      <p className="text-slate-400 text-xs">No active {isLiveOnly ? 'live' : ''} matches for {selectedSport}.</p>
                      <button onClick={() => { setIsLiveOnly(false); setSearchQuery(''); }} className="text-[#00E5FF] text-xs font-bold underline mt-2">Reset filters</button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredMatches.map(match => (
                        <div 
                          key={match.id}
                          onClick={() => {
                            setSelectedMatchId(match.id);
                            setCurrentScreen('match-details');
                          }}
                          className="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-xl p-3.5 transition-all cursor-pointer flex flex-col gap-2"
                        >
                          <div className="flex justify-between items-center text-[10px] text-slate-400">
                            <span className="font-semibold">{match.league}</span>
                            {match.isLive ? (
                              <div className="flex items-center gap-1 bg-[#FF4D6D]/10 px-2 py-0.5 rounded-full text-[#FF4D6D] font-bold">
                                <span className="w-1 h-1 rounded-full bg-[#FF4D6D] animate-ping"></span>
                                <span>LIVE • {match.elapsed}</span>
                              </div>
                            ) : (
                              <span>{match.time}</span>
                            )}
                          </div>

                          {/* Live score lines */}
                          <div className="grid grid-cols-12 gap-2 items-center">
                            <div className="col-span-5 flex items-center gap-2">
                              <span className="text-lg">{match.teamA.logo}</span>
                              <span className="text-xs font-semibold truncate">{match.teamA.name}</span>
                              {favoriteTeams.includes(match.teamA.name) && <Heart className="w-3 h-3 text-[#FF4D6D] fill-[#FF4D6D]" />}
                            </div>

                            <div className="col-span-2 text-center font-bold text-xs bg-black/25 rounded-md py-1 text-[#00E5FF]">
                              {match.teamA.score} - {match.teamB.score}
                            </div>

                            <div className="col-span-5 flex items-center justify-end gap-2 text-right">
                              {favoriteTeams.includes(match.teamB.name) && <Heart className="w-3 h-3 text-[#FF4D6D] fill-[#FF4D6D]" />}
                              <span className="text-xs font-semibold truncate">{match.teamB.name}</span>
                              <span className="text-lg">{match.teamB.logo}</span>
                            </div>
                          </div>

                          <div className="border-t border-white/5 pt-2 flex justify-between items-center text-[10px] text-slate-400">
                            <div className="flex items-center gap-1 text-[#00E5FF] font-medium">
                              <Sparkles className="w-3.5 h-3.5" /> Prediction: {match.prediction.teamA}% Home Win
                            </div>
                            <span className="hover:text-white flex items-center gap-0.5">Details <ChevronRight className="w-3 h-3" /></span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* POPULAR LEAGUES QUICK BRIDGE */}
                <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-[#FFC107]" /> Featured Leagues
                    </h4>
                    <button onClick={() => setCurrentScreen('league')} className="text-xs text-[#00E5FF] hover:underline flex items-center gap-1">
                      Standings <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div onClick={() => setCurrentScreen('league')} className="p-3 bg-white/5 rounded-xl text-center border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
                      <span className="text-2xl block mb-1">🇪🇸</span>
                      <p className="text-xs font-bold">La Liga</p>
                      <p className="text-[9px] text-slate-400">Spain Primera</p>
                    </div>
                    <div onClick={() => setCurrentScreen('league')} className="p-3 bg-white/5 rounded-xl text-center border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
                      <span className="text-2xl block mb-1">🇬🇧</span>
                      <p className="text-xs font-bold">Premier League</p>
                      <p className="text-[9px] text-slate-400">England Division</p>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB CONTAINER: LIVE FOCUS */}
            {activeTab === 'live' && (
              <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-4">
                <div className="bg-gradient-to-r from-[#FF4D6D]/20 to-transparent p-4 rounded-xl border border-[#FF4D6D]/20">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF4D6D] animate-ping"></span>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Apex Arena Live Monitor</h4>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Showing real-time matches across worldwide servers. High-latency optimization active.</p>
                </div>

                <div className="space-y-3">
                  {matches.filter(m => m.isLive).map(match => (
                    <div 
                      key={match.id}
                      onClick={() => {
                        setSelectedMatchId(match.id);
                        setCurrentScreen('match-details');
                      }}
                      className="bg-white/5 border border-white/5 rounded-2xl p-4 hover:bg-white/10 transition-all cursor-pointer"
                    >
                      <div className="flex justify-between items-center text-[10px] text-slate-400 mb-2">
                        <span className="text-[#00E5FF] font-semibold tracking-wider">{match.sport} • {match.league}</span>
                        <span className="bg-[#FF4D6D]/10 px-2 py-0.5 rounded-full text-[#FF4D6D] font-bold flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-[#FF4D6D] animate-ping"></span>
                          <span>LIVE • {match.elapsed}</span>
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{match.teamA.logo}</span>
                          <span className="text-xs font-bold">{match.teamA.name}</span>
                        </div>
                        <span className="text-sm font-black text-[#00E5FF]">{match.teamA.score}</span>
                      </div>

                      <div className="flex justify-between items-center mt-2.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{match.teamB.logo}</span>
                          <span className="text-xs font-bold">{match.teamB.name}</span>
                        </div>
                        <span className="text-sm font-black text-[#00E5FF]">{match.teamB.score}</span>
                      </div>

                      <div className="border-t border-white/5 mt-3 pt-2.5 flex items-center justify-between text-[11px] text-slate-400">
                        <span className="flex items-center gap-1 text-[#00C853]"><Activity className="w-3.5 h-3.5" /> High telemetry match</span>
                        <span className="text-[#00E5FF] font-semibold flex items-center gap-0.5">Explore Commentary <ChevronRight className="w-3.5 h-3.5" /></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTAINER: NEWS */}
            {activeTab === 'news' && (
              <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Trending Sports News</h4>
                
                {NEWS_ITEMS.map(item => (
                  <div key={item.id} className="bg-white/5 border border-white/5 rounded-xl p-3.5 hover:bg-white/10 transition-all cursor-pointer space-y-2">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-[#00E5FF] font-bold uppercase tracking-widest">{item.category}</span>
                      <span className="text-slate-400">{item.time}</span>
                    </div>
                    <h5 className="text-xs font-bold text-white line-clamp-2 leading-snug">{item.title}</h5>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
                      <span>Source: {item.source}</span>
                      <span>📈 {item.reads} reads</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB CONTAINER: FAVORITES */}
            {activeTab === 'favorites' && (
              <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-5">
                
                {/* FAVORITE TEAMS */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
                    <span>Favorite Teams ({favoriteTeams.length})</span>
                    <button onClick={() => {
                      const t = prompt("Enter team name to add:");
                      if (t) setFavoriteTeams([...favoriteTeams, t]);
                    }} className="text-[#00E5FF] text-xs font-bold flex items-center gap-1">
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </h4>

                  <div className="grid grid-cols-2 gap-2">
                    {favoriteTeams.map(team => (
                      <div key={team} className="bg-white/5 border border-white/5 p-3.5 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-base">⭐</span>
                          <span className="text-xs font-bold">{team}</span>
                        </div>
                        <button onClick={() => toggleFavoriteTeam(team)} className="text-[#FF4D6D] hover:scale-110 transition-transform">
                          <Heart className="w-4 h-4 fill-current" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FAVORITE PLAYERS */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
                    <span>Favorite Players ({favoritePlayers.length})</span>
                    <button onClick={() => setCurrentScreen('player')} className="text-[#00E5FF] text-xs font-bold">
                      Explore Profiles
                    </button>
                  </h4>

                  <div className="space-y-2">
                    {MOCK_PLAYERS.map(player => (
                      <div 
                        key={player.id} 
                        onClick={() => {
                          setSelectedPlayerId(player.id);
                          setCurrentScreen('player');
                        }}
                        className="bg-white/5 border border-white/5 p-3 rounded-xl flex items-center justify-between hover:bg-white/10 transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <img src={player.image} alt={player.name} className="w-10 h-10 rounded-lg object-cover" />
                          <div>
                            <p className="text-xs font-bold text-white">{player.name}</p>
                            <p className="text-[10px] text-slate-400">{player.team} • {player.position}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-[#00E5FF]">#{player.number}</span>
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* LIVE MATCH BRIDGE QUICK ACCESS */}
                <div className="bg-gradient-to-r from-[#00E5FF]/10 to-transparent border border-[#00E5FF]/20 p-4 rounded-xl">
                  <h5 className="text-xs font-bold text-white mb-1 flex items-center gap-1.5">
                    <Tv className="w-4 h-4 text-[#00E5FF]" /> Favorite Match Monitoring
                  </h5>
                  <p className="text-[10px] text-slate-400 leading-relaxed mb-3">Your preferred matches are flagged inside the live pipeline automatically for score notifications.</p>
                  <button onClick={() => setActiveTab('live')} className="bg-[#00E5FF] text-[#0B1020] text-xs font-bold px-4 py-1.5 rounded-lg w-full">
                    Enter Live TV Arena
                  </button>
                </div>
              </div>
            )}

            {/* TAB CONTAINER: PROFILE (Settings, Languages, Dark/Light Sim) */}
            {activeTab === 'profile' && (
              <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-5">
                
                {/* Profile Header */}
                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-center relative">
                  <div className="w-20 h-20 rounded-full overflow-hidden mx-auto border-2 border-[#00E5FF] mb-3">
                    <img src={userProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <h4 className="text-sm font-bold text-white">{userProfile.name}</h4>
                  <p className="text-[10px] text-slate-400">{userProfile.email}</p>
                  <span className="inline-block bg-[#00E5FF]/15 text-[#00E5FF] text-[9px] font-bold px-3 py-1 rounded-full uppercase mt-2 tracking-wider">Premium Fan Club</span>
                </div>

                {/* Simulated Dark / Light Toggle */}
                <div className="bg-white/5 border border-white/5 rounded-xl p-3 space-y-2">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-xs font-bold text-slate-300">Dark / Light Mode Toggle</span>
                    <button 
                      onClick={() => setUserProfile({ ...userProfile, darkMode: !userProfile.darkMode })}
                      className="w-12 h-6 bg-white/10 rounded-full p-0.5 transition-colors duration-300 flex items-center"
                    >
                      <div className={`w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${userProfile.darkMode ? 'translate-x-6 bg-[#00E5FF]' : 'translate-x-0 bg-slate-400'}`} />
                    </button>
                  </div>

                  <div className="flex justify-between items-center py-1 border-t border-white/5">
                    <span className="text-xs font-bold text-slate-300">Push Notifications</span>
                    <button 
                      onClick={() => setUserProfile({ ...userProfile, notifications: !userProfile.notifications })}
                      className="w-12 h-6 bg-white/10 rounded-full p-0.5 transition-colors duration-300 flex items-center"
                    >
                      <div className={`w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${userProfile.notifications ? 'translate-x-6 bg-[#00C853]' : 'translate-x-0 bg-slate-400'}`} />
                    </button>
                  </div>

                  {/* Language Selection */}
                  <div className="flex justify-between items-center py-2.5 border-t border-white/5">
                    <span className="text-xs font-bold text-slate-300">Language preference</span>
                    <select 
                      value={userProfile.language}
                      onChange={(e) => setUserProfile({ ...userProfile, language: e.target.value })}
                      className="bg-[#0B1020] border border-white/10 rounded px-2 py-1 text-xs focus:outline-none focus:border-[#00E5FF] text-white"
                    >
                      <option>English</option>
                      <option>Español</option>
                      <option>Français</option>
                      <option>Deutsch</option>
                      <option>日本語</option>
                    </select>
                  </div>
                </div>

                {/* Account Details Form */}
                <div className="bg-white/5 border border-white/5 rounded-xl p-4 space-y-3">
                  <h5 className="text-xs font-bold text-[#00E5FF] uppercase tracking-wider">Account Information</h5>
                  
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase">Registered Mobile</label>
                    <input 
                      type="text" 
                      value={userProfile.phone}
                      onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
                      className="w-full bg-white/5 border border-white/5 rounded-lg py-2 px-3 text-xs focus:outline-none text-white mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 uppercase">Favorite Sports Selection</label>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {userProfile.sportsPrefs.map(pref => (
                        <span key={pref} className="bg-white/5 border border-white/10 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-full">{pref}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sign out */}
                <button 
                  onClick={() => {
                    setCurrentScreen('auth');
                    setAuthMode('login');
                  }}
                  className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 py-3 rounded-xl text-xs font-bold border border-red-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" /> Sign Out from Account
                </button>
              </div>
            )}

            {/* PERSISTENT BOTTOM NAVIGATION BAR */}
            <nav className="bg-[#0B1020] border-t border-white/5 px-2 py-2 flex justify-around items-center">
              <button 
                onClick={() => setActiveTab('home')}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'home' ? 'text-[#00E5FF]' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Compass className="w-5 h-5" />
                <span className="text-[9px] font-bold">Home</span>
              </button>

              <button 
                onClick={() => setActiveTab('live')}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all relative cursor-pointer ${
                  activeTab === 'live' ? 'text-[#FF4D6D]' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Tv className="w-5 h-5" />
                <span className="text-[9px] font-bold">Live</span>
                <span className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-[#FF4D6D] animate-ping"></span>
              </button>

              <button 
                onClick={() => setActiveTab('news')}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'news' ? 'text-[#00C853]' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Activity className="w-5 h-5" />
                <span className="text-[9px] font-bold">News</span>
              </button>

              <button 
                onClick={() => setActiveTab('favorites')}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'favorites' ? 'text-[#FFC107]' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Heart className="w-5 h-5" />
                <span className="text-[9px] font-bold">Favorites</span>
              </button>

              <button 
                onClick={() => setActiveTab('profile')}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'profile' ? 'text-[#00E5FF]' : 'text-slate-400 hover:text-white'
                }`}
              >
                <User className="w-5 h-5" />
                <span className="text-[9px] font-bold">Profile</span>
              </button>
            </nav>

          </div>
        )}

        {/* ==========================================
            SCREEN 5: MATCH DETAILS SCREEN
            ========================================== */}
        {currentScreen === 'match-details' && (
          <div id="screen-match-details" className="flex-1 flex flex-col justify-between bg-[#070B16] overflow-y-auto no-scrollbar">
            
            {/* Header Scoreboard */}
            <div className="bg-gradient-to-b from-[#0B1020] to-[#121A30] border-b border-white/5 p-4 relative">
              <div className="flex justify-between items-center mb-4">
                <button 
                  onClick={() => { setCurrentScreen('home'); setActiveTab('home'); }}
                  className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-slate-300 hover:text-white cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-[10px] font-bold text-[#00E5FF] bg-white/5 border border-white/5 px-3 py-1 rounded-full uppercase tracking-wider">{activeMatch.sport} • {activeMatch.league}</span>
                <button 
                  onClick={() => alert('Link copied to clipboard! Share live telecasts.')}
                  className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-slate-300 hover:text-white cursor-pointer"
                >
                  <Share2 className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Large Scoreboard Displays */}
              <div className="flex items-center justify-around py-3">
                <div className="text-center w-1/3">
                  <span className="text-4xl block mb-2 filter drop-shadow">⚪</span>
                  <p className="text-xs font-bold leading-tight">{activeMatch.teamA.name}</p>
                </div>

                <div className="text-center px-4 w-1/3 flex flex-col items-center">
                  <p className="text-4.5xl font-black tracking-widest text-[#00E5FF] text-shadow-cyan">{activeMatch.teamA.score} - {activeMatch.teamB.score}</p>
                  
                  {activeMatch.isLive ? (
                    <div className="bg-[#FF4D6D]/15 text-[#FF4D6D] border border-[#FF4D6D]/20 px-3 py-0.5 rounded-full text-[10px] font-bold mt-2 flex items-center gap-1.5 uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D6D] animate-ping"></span>
                      <span>LIVE • {activeMatch.elapsed}</span>
                    </div>
                  ) : (
                    <span className="text-slate-400 text-xs font-semibold mt-2">{activeMatch.status}</span>
                  )}
                </div>

                <div className="text-center w-1/3">
                  <span className="text-4xl block mb-2 filter drop-shadow">🔵</span>
                  <p className="text-xs font-bold leading-tight">{activeMatch.teamB.name}</p>
                </div>
              </div>
            </div>

            {/* TAB SELECTOR INSIDE MATCH DETAILS */}
            <div className="bg-[#0B1020] border-b border-white/5 flex gap-1 overflow-x-auto no-scrollbar px-2 py-2">
              {(['overview', 'stats', 'lineups', 'commentary', 'standings'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setMatchDetailsTab(tab)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border cursor-pointer ${
                    matchDetailsTab === tab 
                      ? 'bg-[#00E5FF] text-[#0B1020] border-transparent shadow-md' 
                      : 'bg-white/5 text-slate-300 border-white/5 hover:bg-white/10'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* CONTENT AREA BASED ON TAB */}
            <div className="flex-1 p-4 space-y-4">
              
              {/* SUB TAB: OVERVIEW */}
              {matchDetailsTab === 'overview' && (
                <div className="space-y-4 animate-fadeIn">
                  
                  {/* AI Prediction module inside Overview */}
                  <div className="bg-gradient-to-br from-[#0B1020]/90 to-transparent p-4 rounded-xl border border-white/5 space-y-4">
                    
                    {/* Header */}
                    <div className="flex justify-between items-center pb-2.5 border-b border-white/5">
                      <h5 className="text-xs font-extrabold uppercase tracking-widest text-[#00E5FF] flex items-center gap-1.5">
                        <Sparkles className="w-4.5 h-4.5 text-[#00E5FF] animate-pulse" /> Gemini AI Engine
                      </h5>
                      <span className="bg-[#00E5FF]/10 text-[#00E5FF] text-[9px] font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                        <span>Active Feed</span>
                      </span>
                    </div>

                    {/* TWO COLUMN / BENTO LAYOUT FOR METRICS AND CONFIDENCE */}
                    {(() => {
                      const telemetry = getTelemetryData(activeMatch);
                      
                      return (
                        <div className="space-y-3.5">
                          {/* Segmented confidence meter and telemetry volume */}
                          <div className="bg-white/5 border border-white/5 p-3.5 rounded-xl space-y-3">
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">AI Confidence Score</span>
                                <div className="flex items-baseline gap-1.5 mt-0.5">
                                  <span className="text-xl font-black text-white">{telemetry.confidence}%</span>
                                  <span className={`text-[10px] font-bold uppercase ${
                                    telemetry.confidence >= 85 ? 'text-emerald-400' : telemetry.confidence >= 70 ? 'text-cyan-400' : 'text-amber-400'
                                  }`}>
                                    {telemetry.confidence >= 85 ? '• High Certainty' : telemetry.confidence >= 70 ? '• Moderate' : '• Low Certainty'}
                                  </span>
                                </div>
                              </div>

                              <div className="text-right">
                                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Telemetry Stream</span>
                                <div className="text-xs font-mono font-bold text-[#00E5FF] mt-1 flex items-center gap-1 justify-end">
                                  <Activity className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                                  <span>{telemetry.volume.toLocaleString()} points</span>
                                </div>
                              </div>
                            </div>

                            {/* Confidence Score Bar Visualizer */}
                            <div className="space-y-1">
                              <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden relative">
                                {/* Segmented background ticks */}
                                <div className="absolute inset-0 flex justify-between px-1 pointer-events-none">
                                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                                    <div key={i} className="w-[1px] h-full bg-black/40" />
                                  ))}
                                </div>
                                <div 
                                  style={{ width: `${telemetry.confidence}%` }} 
                                  className={`h-full rounded-full transition-all duration-500 ease-out ${
                                    telemetry.confidence >= 85 
                                      ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' 
                                      : 'bg-gradient-to-r from-blue-500 to-cyan-400'
                                  }`}
                                />
                              </div>
                              <div className="flex justify-between text-[8px] text-slate-500 font-mono">
                                <span>50% (MIN DATA)</span>
                                <span>75% (ROBUST)</span>
                                <span>100% (ABSOLUTE)</span>
                              </div>
                            </div>
                          </div>

                          {/* Interactive Telemetry Processing Depth Controls */}
                          <div className="bg-white/5 border border-white/5 p-3 rounded-xl space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Telemetry Analysis Depth</span>
                              <span className="text-[9px] text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded font-mono uppercase">
                                {telemetryDepth} mode
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-1.5">
                              {(['standard', 'enhanced', 'maximum'] as const).map((depth) => (
                                <button
                                  key={depth}
                                  onClick={() => setTelemetryDepth(depth)}
                                  className={`py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all border cursor-pointer ${
                                    telemetryDepth === depth
                                      ? 'bg-gradient-to-r from-[#00E5FF]/20 to-[#00B0FF]/20 text-[#00E5FF] border-[#00E5FF]/40 shadow-inner'
                                      : 'bg-white/5 text-slate-400 border-transparent hover:bg-white/10'
                                  }`}
                                >
                                  {depth}
                                </button>
                              ))}
                            </div>

                            {/* Telemetry feed checklist */}
                            <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-1.5 border-t border-white/5 text-[9px] text-slate-400 font-mono">
                              <div className="flex items-center gap-1 text-slate-300">
                                <Check className="w-3 h-3 text-emerald-400" /> Playback matrix: {telemetryDepth === 'standard' ? 'Draft' : 'Analyzed'}
                              </div>
                              <div className="flex items-center gap-1 text-slate-300">
                                <Check className="w-3 h-3 text-emerald-400" /> Ball-tracking 3D: {telemetryDepth === 'standard' ? 'Low-res' : 'High-res'}
                              </div>
                              <div className="flex items-center gap-1 text-slate-300">
                                <Check className="w-3 h-3 text-emerald-400" /> Head-to-Head: Ingested
                              </div>
                              <div className="flex items-center gap-1 text-slate-300">
                                <Check className={`w-3 h-3 ${telemetryDepth === 'maximum' ? 'text-emerald-400' : 'text-slate-600'}`} /> Biometric Form: {telemetryDepth === 'maximum' ? 'Real-time' : 'Cached'}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Dynamic Bar chart predictor */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-bold text-slate-300">
                        <span>{activeMatch.teamA.name} ({activeMatch.prediction.teamA}%)</span>
                        <span>Draw ({activeMatch.prediction.draw}%)</span>
                        <span>{activeMatch.teamB.name} ({activeMatch.prediction.teamB}%)</span>
                      </div>
                      
                      <div className="h-3.5 w-full rounded-full overflow-hidden flex bg-white/10">
                        <div style={{ width: `${activeMatch.prediction.teamA}%` }} className="bg-gradient-to-r from-[#00E5FF] to-[#00B0FF]" />
                        <div style={{ width: `${activeMatch.prediction.draw}%` }} className="bg-slate-500" />
                        <div style={{ width: `${activeMatch.prediction.teamB}%` }} className="bg-gradient-to-r from-[#FF4D6D] to-[#E91E63]" />
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed mt-3 bg-black/25 p-2.5 rounded-lg border border-white/5">
                      {aiAnalysis ? aiAnalysis : activeMatch.prediction.text}
                    </p>

                    {/* D3 Momentum Sparkline */}
                    <MatchMomentumSparkline match={activeMatch} depth={telemetryDepth} />

                    <div className="mt-3.5 pt-3 border-t border-white/5 flex gap-2">
                      <input 
                        type="text"
                        placeholder="Ask AI Predictor about statistics, tactics..."
                        value={customAiQuery}
                        onChange={(e) => setCustomAiQuery(e.target.value)}
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#00E5FF]"
                      />
                      <button 
                        onClick={() => handleCustomAiAsk(activeMatch)}
                        disabled={isGeneratingPrediction}
                        className="bg-[#00E5FF] text-[#0B1020] px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        {isGeneratingPrediction ? 'Thinking...' : 'Ask AI'}
                      </button>
                    </div>

                    {!aiAnalysis && (
                      <button 
                        onClick={() => generateAIPrediction(activeMatch)}
                        disabled={isGeneratingPrediction}
                        className="w-full bg-[#00E5FF] text-[#0B1020] py-2 rounded-lg text-xs font-bold mt-2 hover:opacity-90 cursor-pointer flex items-center justify-center gap-1"
                      >
                        {isGeneratingPrediction ? 'Processing Data...' : 'Run Deep Generative Analysis'}
                      </button>
                    )}
                  </div>

                  {/* Highlights Video Simulator */}
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                      <Play className="w-4.5 h-4.5 text-[#00C853]" /> Match Highlights Reel
                    </h5>
                    
                    <div className="relative rounded-xl overflow-hidden aspect-video bg-black flex items-center justify-center border border-white/10">
                      <img src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=400" alt="Highlights Thumbnail" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                      
                      <button onClick={() => alert('Streaming Highlight Reel... (Simulated player active)')} className="relative z-10 w-14 h-14 rounded-full bg-[#00E5FF] text-[#0B1020] flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg cursor-pointer">
                        <Play className="w-7 h-7 fill-current ml-1" />
                      </button>
                      
                      <span className="absolute bottom-2.5 left-2.5 bg-black/60 px-2 py-0.5 rounded text-[10px] font-bold">1:42 Min HD</span>
                      <span className="absolute bottom-2.5 right-2.5 bg-[#FF4D6D] px-2 py-0.5 rounded text-[10px] font-bold">REPLAY</span>
                    </div>
                  </div>

                  {/* Timeline Events with icons */}
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                      <Clock className="w-4.5 h-4.5 text-[#00E5FF]" /> Key Timeline Events
                    </h5>
                    
                    <div className="relative border-l border-white/10 pl-4 ml-2 space-y-4">
                      {activeMatch.timeline.map((evt, idx) => (
                        <div key={idx} className="relative">
                          <span className="absolute -left-6 top-1.5 w-4.5 h-4.5 rounded-full bg-slate-900 border-2 border-[#00E5FF] flex items-center justify-center text-[10px]">
                            {evt.icon}
                          </span>
                          <span className="text-[10px] text-[#00E5FF] font-bold">{evt.time}</span>
                          <p className="text-xs font-bold">{evt.player}</p>
                          <p className="text-[10px] text-slate-400">{evt.event} • Team {evt.team}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* SUB TAB: STATS */}
              {matchDetailsTab === 'stats' && (
                <div className="space-y-4 animate-fadeIn">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                    <BarChart2 className="w-4.5 h-4.5 text-[#00E5FF]" /> Team Comparison Metrics
                  </h5>

                  <div className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-4">
                    {activeMatch.stats.map((stat, idx) => {
                      const total = stat.teamA + stat.teamB;
                      const percentA = total > 0 ? (stat.teamA / total) * 100 : 50;
                      const percentB = total > 0 ? (stat.teamB / total) * 100 : 50;
                      
                      return (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex justify-between items-center text-xs font-bold text-slate-300">
                            <span>{stat.teamA}</span>
                            <span className="text-slate-400 uppercase tracking-widest text-[10px]">{stat.label}</span>
                            <span>{stat.teamB}</span>
                          </div>

                          {/* Possession Bar representation */}
                          <div className="h-2 w-full rounded-full overflow-hidden flex bg-white/10">
                            <div style={{ width: `${percentA}%` }} className="bg-[#00E5FF]" />
                            <div style={{ width: `${percentB}%` }} className="bg-[#FF4D6D]" />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-center gap-3">
                    <Info className="w-5 h-5 text-[#FFC107]" />
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Tactical possession maps indicate high activity in the middle third. Counter attacking conversion rate is 1.2x average.
                    </p>
                  </div>
                </div>
              )}

              {/* SUB TAB: LINEUPS */}
              {matchDetailsTab === 'lineups' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
                    <div className="grid grid-cols-2 gap-4">
                      
                      {/* Team A Lineup */}
                      <div>
                        <h6 className="text-xs font-bold text-[#00E5FF] mb-2.5 uppercase tracking-wider pb-1 border-b border-white/5">{activeMatch.teamA.name}</h6>
                        <ul className="space-y-2">
                          {activeMatch.lineup.teamA.map((player, idx) => (
                            <li key={idx} className="text-xs flex items-center gap-1.5">
                              <span className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-[9px] text-[#00E5FF]">{idx + 1}</span>
                              <span className="font-semibold text-slate-200">{player}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Team B Lineup */}
                      <div>
                        <h6 className="text-xs font-bold text-[#FF4D6D] mb-2.5 uppercase tracking-wider pb-1 border-b border-white/5">{activeMatch.teamB.name}</h6>
                        <ul className="space-y-2 text-right">
                          {activeMatch.lineup.teamB.map((player, idx) => (
                            <li key={idx} className="text-xs flex items-center justify-end gap-1.5">
                              <span className="font-semibold text-slate-200">{player}</span>
                              <span className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-[9px] text-[#FF4D6D]">{idx + 1}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                    </div>
                  </div>
                </div>
              )}

              {/* SUB TAB: COMMENTARY */}
              {matchDetailsTab === 'commentary' && (
                <div className="space-y-3 animate-fadeIn">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Live Commentary stream</h5>
                  
                  {activeMatch.commentary.map((comm, idx) => (
                    <div 
                      key={idx} 
                      className={`p-3.5 rounded-xl border flex gap-3 ${
                        comm.type === 'goal' 
                          ? 'bg-[#00C853]/10 border-[#00C853]/20 text-white' 
                          : comm.type === 'card' 
                          ? 'bg-[#FFC107]/10 border-[#FFC107]/20 text-white' 
                          : 'bg-white/5 border-white/5'
                      }`}
                    >
                      <span className="text-xs font-black text-[#00E5FF] tracking-wider">{comm.time}</span>
                      <div className="space-y-1">
                        <p className="text-xs leading-relaxed">{comm.event}</p>
                        <span className="text-[9px] text-slate-400 uppercase tracking-widest">{comm.type}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* SUB TAB: STANDINGS */}
              {matchDetailsTab === 'standings' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
                    <div className="bg-white/5 px-4 py-2 text-xs font-bold text-slate-300">
                      Primary League Standing
                    </div>
                    
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-white/5 text-slate-400 text-left">
                          <th className="p-2.5 pl-4">Pos</th>
                          <th className="p-2.5">Team</th>
                          <th className="p-2.5 text-center">MP</th>
                          <th className="p-2.5 text-center">GD</th>
                          <th className="p-2.5 text-right pr-4">Pts</th>
                        </tr>
                      </thead>
                      <tbody>
                        {LEAGUE_STANDINGS.map(row => (
                          <tr key={row.pos} className="border-b border-white/5 hover:bg-white/5">
                            <td className="p-2.5 pl-4 font-bold">{row.pos}</td>
                            <td className="p-2.5 font-semibold text-white">{row.team}</td>
                            <td className="p-2.5 text-center">{row.mp}</td>
                            <td className="p-2.5 text-center">{row.gd}</td>
                            <td className="p-2.5 text-right pr-4 font-bold text-[#00E5FF]">{row.pts}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Back To Dashboard */}
            <div className="p-4 bg-[#0B1020] border-t border-white/5">
              <button 
                onClick={() => { setCurrentScreen('home'); setActiveTab('home'); }}
                className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Return to Dashboard Home
              </button>
            </div>
          </div>
        )}

        {/* ==========================================
            SCREEN 6: LEAGUE SCREEN
            ========================================== */}
        {currentScreen === 'league' && (
          <div id="screen-league" className="flex-1 flex flex-col justify-between bg-[#070B16] overflow-y-auto no-scrollbar">
            
            {/* Header */}
            <div className="bg-gradient-to-b from-[#0B1020] to-[#121A30] border-b border-white/5 p-4">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => { setCurrentScreen('home'); setActiveTab('home'); }}
                  className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-slate-300 hover:text-white cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-wider">La Liga Tournament Hub</h4>
                  <p className="text-[10px] text-slate-400">Spain Division • Men's Championship</p>
                </div>
              </div>
            </div>

            {/* League Metrics / Statistics Panel */}
            <div className="p-4 space-y-4">
              <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
                <h5 className="text-xs font-bold text-[#00E5FF] uppercase tracking-wider mb-3">La Liga Statistics Summary</h5>
                <div className="grid grid-cols-2 gap-2">
                  {LEAGUE_STATS.map((stat, idx) => (
                    <div key={idx} className="p-3 bg-black/25 rounded-xl border border-white/5">
                      <p className="text-[9px] text-slate-400 uppercase tracking-widest">{stat.label}</p>
                      <p className="text-xs font-bold text-white mt-1 leading-tight">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Standings Table */}
              <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
                <div className="bg-white/5 px-4 py-2.5 text-xs font-bold text-slate-300">
                  Standings Table (Primary Block)
                </div>
                
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-white/5 text-slate-400 text-left">
                      <th className="p-2.5 pl-4">Pos</th>
                      <th className="p-2.5">Team</th>
                      <th className="p-2.5 text-center">MP</th>
                      <th className="p-2.5 text-center">W</th>
                      <th className="p-2.5 text-center">Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {LEAGUE_STANDINGS.map(row => (
                      <tr key={row.pos} className="border-b border-white/5 hover:bg-white/5">
                        <td className="p-2.5 pl-4 font-bold">{row.pos}</td>
                        <td className="p-2.5 font-bold text-white flex items-center gap-1">
                          <span>⚪</span>
                          <span>{row.team}</span>
                        </td>
                        <td className="p-2.5 text-center">{row.mp}</td>
                        <td className="p-2.5 text-center">{row.w}</td>
                        <td className="p-2.5 text-center font-bold text-[#00E5FF]">{row.pts}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* League Fixtures & Results */}
              <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
                <h5 className="text-xs font-bold text-[#FF4D6D] uppercase tracking-wider mb-3">Fixtures & Results</h5>
                
                <div className="space-y-2.5">
                  {LEAGUE_FIXTURES.map((fix, idx) => (
                    <div key={idx} className="p-3 bg-black/25 rounded-xl border border-white/5 flex justify-between items-center text-xs">
                      <div className="space-y-0.5">
                        <p className="text-[10px] text-slate-400 font-medium">{fix.date}</p>
                        <p className="font-bold text-slate-200">{fix.teamA} vs {fix.teamB}</p>
                      </div>

                      <div>
                        {fix.status === 'UPCOMING' ? (
                          <span className="bg-white/5 px-2.5 py-1 rounded text-[10px] text-slate-400 font-bold border border-white/5">UPCOMING</span>
                        ) : (
                          <span className="bg-[#00C853]/15 text-[#00C853] px-2.5 py-1 rounded text-[10px] font-extrabold border border-[#00C853]/20">{fix.score}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom exit */}
            <div className="p-4 bg-[#0B1020] border-t border-white/5">
              <button 
                onClick={() => { setCurrentScreen('home'); setActiveTab('home'); }}
                className="w-full bg-[#00E5FF] text-[#0B1020] py-3 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Return to Home Dashboard
              </button>
            </div>
          </div>
        )}

        {/* ==========================================
            SCREEN 7: PLAYER PROFILE SCREEN
            ========================================== */}
        {currentScreen === 'player' && (
          <div id="screen-player-profile" className="flex-1 flex flex-col justify-between bg-[#070B16] overflow-y-auto no-scrollbar">
            
            {/* Main Header Card with Large Image */}
            <div className="relative bg-gradient-to-b from-[#0B1020] to-[#121A30] border-b border-white/5 pb-6">
              
              <div className="flex justify-between items-center p-4">
                <button 
                  onClick={() => { setCurrentScreen('home'); setActiveTab('home'); }}
                  className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-slate-300 hover:text-white cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-xs font-black text-[#00E5FF]">Player Profile</span>
                <button 
                  onClick={() => toggleFavoritePlayer(activePlayer.name)}
                  className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-slate-300 hover:text-white cursor-pointer"
                >
                  <Heart className={`w-4.5 h-4.5 ${favoritePlayers.includes(activePlayer.name) ? 'text-[#FF4D6D] fill-[#FF4D6D]' : ''}`} />
                </button>
              </div>

              {/* Player Image and Bio */}
              <div className="flex flex-col items-center text-center mt-2 px-4">
                <div className="relative">
                  <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#00E5FF]/40 shadow-xl">
                    <img src={activePlayer.image} alt={activePlayer.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="absolute bottom-1 right-1 bg-gradient-to-r from-[#00E5FF] to-[#FF4D6D] text-[#0B1020] text-xs font-black px-2 py-0.5 rounded-full shadow-lg">#{activePlayer.number}</span>
                </div>

                <h3 className="text-xl font-extrabold text-white mt-4">{activePlayer.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{activePlayer.team} • {activePlayer.position}</p>
                <p className="text-[10px] text-[#00E5FF] font-semibold uppercase tracking-wider mt-1">{activePlayer.country} International</p>
              </div>

              {/* Small physical details */}
              <div className="grid grid-cols-3 gap-1 mx-4 mt-5 p-2 bg-black/20 border border-white/5 rounded-xl text-center">
                <div>
                  <p className="text-[9px] text-slate-400 uppercase">Age</p>
                  <p className="text-xs font-bold text-white mt-0.5">{activePlayer.age} Yrs</p>
                </div>
                <div className="border-x border-white/5">
                  <p className="text-[9px] text-slate-400 uppercase">Height</p>
                  <p className="text-xs font-bold text-white mt-0.5">{activePlayer.height}</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-400 uppercase">Sport</p>
                  <p className="text-xs font-bold text-[#00E5FF] mt-0.5">{activePlayer.sport}</p>
                </div>
              </div>
            </div>

            {/* Career Statistics & Achievements */}
            <div className="p-4 space-y-4">
              
              {/* Career stats blocks */}
              <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
                <h5 className="text-xs font-bold text-[#00E5FF] uppercase tracking-wider mb-3">Season Career Statistics</h5>
                
                <div className="grid grid-cols-2 gap-2.5">
                  {activePlayer.stats.map((st, idx) => (
                    <div key={idx} className="p-3 bg-black/25 rounded-xl border border-white/5">
                      <span className="text-[10px] text-slate-400 uppercase block tracking-wider">{st.label}</span>
                      <span className="text-lg font-black text-white mt-1 block">{st.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Performance Graph Simulator */}
              <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
                <h5 className="text-xs font-bold text-[#FF4D6D] uppercase tracking-wider mb-3">Recent Matches Rating (H2H)</h5>
                
                {/* Visual bar graph representation */}
                <div className="flex justify-between items-end h-28 pt-4 px-2 bg-black/15 rounded-xl border border-white/5">
                  {activePlayer.performance.map((val, idx) => (
                    <div key={idx} className="flex flex-col items-center flex-1 space-y-1.5">
                      <span className="text-[9px] font-bold text-[#00E5FF]">{val}</span>
                      <div 
                        style={{ height: `${val * 8}px` }} 
                        className="w-4 bg-gradient-to-t from-[#00E5FF]/60 to-[#00E5FF] rounded-t-sm"
                      />
                      <span className="text-[9px] text-slate-500">M{idx + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievements & Trophies */}
              <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
                <h5 className="text-xs font-bold text-[#FFC107] uppercase tracking-wider mb-3 flex items-center gap-1">
                  <Award className="w-4 h-4 text-[#FFC107]" /> Achievements & Trophies
                </h5>

                <ul className="space-y-2">
                  {activePlayer.achievements.map((ach, idx) => (
                    <li key={idx} className="text-xs flex items-center gap-2">
                      <span className="text-sm">🏆</span>
                      <span className="font-semibold text-slate-200">{ach}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Social Media Links */}
              <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Verified Social Media Profiles</h5>
                <div className="flex gap-2">
                  {activePlayer.socials.map((soc, idx) => (
                    <a 
                      key={idx} 
                      href="#" 
                      onClick={(e) => { e.preventDefault(); alert(`Opening ${soc.platform} channel...`); }}
                      className="flex-1 bg-white/5 hover:bg-white/10 p-2.5 rounded-xl text-center border border-white/5 text-xs font-bold text-[#00E5FF]"
                    >
                      {soc.platform}: {soc.handle}
                    </a>
                  ))}
                </div>
              </div>

            </div>

            {/* Bottom return */}
            <div className="p-4 bg-[#0B1020] border-t border-white/5">
              <button 
                onClick={() => { setCurrentScreen('home'); setActiveTab('home'); }}
                className="w-full bg-[#00E5FF] text-[#0B1020] py-3 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Return to Dashboard Home
              </button>
            </div>
          </div>
        )}

        {/* ==========================================
            SCREEN 8: NOTIFICATION CENTER
            ========================================== */}
        {currentScreen === 'notifications' && (
          <div id="screen-notifications" className="flex-1 flex flex-col justify-between bg-[#070B16]">
            
            {/* Header */}
            <div className="bg-gradient-to-b from-[#0B1020] to-[#121A30] border-b border-white/5 p-4">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => { setCurrentScreen('home'); setActiveTab('home'); }}
                  className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-slate-300 hover:text-white cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-wider">Apex Live Notification Hub</h4>
                  <p className="text-[10px] text-slate-400">Personalized microsecond goal alerts</p>
                </div>
              </div>
            </div>

            {/* Main Notifications */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto no-scrollbar">
              
              <div className="p-3 bg-white/5 border border-[#FF4D6D]/30 rounded-xl flex gap-3 relative overflow-hidden">
                <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#FF4D6D]"></div>
                <div className="w-8 h-8 rounded-full bg-[#FF4D6D]/15 flex items-center justify-center text-[#FF4D6D] shrink-0 text-xs">⚽</div>
                <div className="space-y-0.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-[#FF4D6D] uppercase">GOAL EVENT ALERT</span>
                    <span className="text-[9px] text-slate-400">1m ago</span>
                  </div>
                  <p className="text-xs font-bold text-white leading-snug">Jude Bellingham volley secures Real Madrid 2 - 1 lead against Barcelona!</p>
                  <p className="text-[10px] text-slate-400">Match Ref: El Clásico • 73' Time Elapsed</p>
                </div>
              </div>

              <div className="p-3 bg-white/5 border border-white/5 rounded-xl flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#00E5FF]/15 flex items-center justify-center text-[#00E5FF] shrink-0 text-xs">🏏</div>
                <div className="space-y-0.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-[#00E5FF] uppercase">MATCH STARTING</span>
                    <span className="text-[9px] text-slate-400">1h ago</span>
                  </div>
                  <p className="text-xs font-bold text-slate-200 leading-snug">India vs Australia T20 International championship is about to commence!</p>
                  <p className="text-[10px] text-slate-400">Warm-up begins. Spinners expected to benefit from pitch condition.</p>
                </div>
              </div>

              <div className="p-3 bg-white/5 border border-white/5 rounded-xl flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#00C853]/15 flex items-center justify-center text-[#00C853] shrink-0 text-xs">📰</div>
                <div className="space-y-0.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-[#00C853] uppercase">BREAKING TRANSFER NEWS</span>
                    <span className="text-[9px] text-slate-400">3h ago</span>
                  </div>
                  <p className="text-xs font-bold text-slate-200 leading-snug">Kylian Mbappe completes medical for blockbuster Madrid move!</p>
                  <p className="text-[10px] text-slate-400">ESPN confirms personal terms fully executed. 5-year contract signed.</p>
                </div>
              </div>

            </div>

            {/* Bottom exit */}
            <div className="p-4 bg-[#0B1020] border-t border-white/5">
              <button 
                onClick={() => { setCurrentScreen('home'); setActiveTab('home'); }}
                className="w-full bg-[#00E5FF] text-[#0B1020] py-3 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Return to Dashboard Home
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
