import React, { useState, useRef, useEffect } from 'react';
import {
  Download,
  Type,
  Square,
  Sparkles,
  Undo2,
  Redo2,
  Layers,
  Palette,
  Play,
  Pause,
  RotateCcw,
  Film,
  Image as ImageIcon,
  CheckCircle,
  FileBadge,
  Clock,
  Phone,
  Store,
  Sliders,
  MonitorPlay
} from 'lucide-react';
import { UserCafeSettings } from '../types';

interface StudioViewProps {
  settings: UserCafeSettings;
  initialTemplateData?: {
    title?: string;
    organization?: string;
    deadline?: string;
  };
}

interface CanvasElement {
  id: string;
  type: 'text' | 'badge' | 'watermark' | 'shape';
  text?: string;
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  fontSize: number;
  color: string;
  bgColor?: string;
  fontWeight: 'normal' | 'bold' | '900';
  badgeStyle?: 'urgent' | 'verified' | 'extended';
}

const ASPECT_RATIOS = [
  { id: 'sq1080', name: 'پست مربعی اینستاگرام (1:1)', width: 1080, height: 1080, ratio: '1:1' },
  { id: 'vert1350', name: 'پست عمودی اینستاگرام (4:5)', width: 1080, height: 1350, ratio: '4:5' },
  { id: 'story1920', name: 'استوری و ریلز (9:16)', width: 1080, height: 1920, ratio: '9:16' },
  { id: 'cover1920', name: 'کاور ویدئو و افقی (16:9)', width: 1920, height: 1080, ratio: '16:9' },
  { id: 'banner1200', name: 'بنر افقی سایت و وبلاگ', width: 1200, height: 630, ratio: '1.91:1' },
];

const PRESET_TEMPLATES = [
  {
    id: 'tpl-exam',
    title: 'اطلاعیه استخدامی سراسری',
    bgGradient: ['#f0fdf4', '#ccfbf1'],
    badge: 'استخدامی جدید',
    badgeBg: '#059669',
    badgeColor: '#ffffff',
    titleColor: '#064e3b',
    subColor: '#0f766e',
    deadlineColor: '#b45309',
    heading: 'آغاز ثبت‌نام آزمون استخدامی آموزش و پرورش',
    subheading: 'کلیه مقاطع دانشگاهی • مراجعه حضوری با مدارک کامل',
  },
  {
    id: 'tpl-loan',
    title: 'تسهیلات و وام ازدواج',
    bgGradient: ['#ecfdf5', '#e0e7ff'],
    badge: 'تسهیلات قرض‌الحسنه',
    badgeBg: '#2563eb',
    badgeColor: '#ffffff',
    titleColor: '#1e1b4b',
    subColor: '#3730a3',
    deadlineColor: '#047857',
    heading: 'ثبت‌نام و تعیین شعبه فوری وام ازدواج',
    subheading: 'بانک مرکزی و سامانه‌های شتاب • اولویت با مراجعین حضوری',
  },
  {
    id: 'tpl-auto',
    title: 'عرضه خودرو یکپارچه',
    bgGradient: ['#fffbeb', '#fef3c7'],
    badge: 'طرح سراسری خودرو',
    badgeBg: '#d97706',
    badgeColor: '#ffffff',
    titleColor: '#78350f',
    subColor: '#92400e',
    deadlineColor: '#b91c1c',
    heading: 'ثبت‌نام سامانه یکپارچه و اتونوین',
    subheading: 'وکالتی نمودن حساب بانکی و انتخاب اولویت محصولات',
  },
  {
    id: 'tpl-services',
    title: 'معرفی خدمات جامع کافی‌نت',
    bgGradient: ['#f8fafc', '#e2e8f0'],
    badge: 'خدمات الکترونیک دولت',
    badgeBg: '#0f172a',
    badgeColor: '#ffffff',
    titleColor: '#0f172a',
    subColor: '#334155',
    deadlineColor: '#059669',
    heading: 'کلیه امور اینترنتی و ثبتی در کمترین زمان',
    subheading: 'سامانه ثنا • سوابق بیمه تامین اجتماعی • مالیات • وام ودیعه',
  },
];

const MOTION_THEMES = [
  {
    id: 'emerald',
    name: 'زمردی پرانرژی (ویژه آزمون و استخدام)',
    gradStart: '#064e3b',
    gradMid: '#047857',
    gradEnd: '#10b981',
    accentColor: '#34d399',
    badgeBg: '#059669',
    titleColor: '#ffffff',
  },
  {
    id: 'ocean',
    name: 'اقیانوسی سرمه‌ای (ویژه تسهیلات و وام)',
    gradStart: '#0f172a',
    gradMid: '#1e3a8a',
    gradEnd: '#2563eb',
    accentColor: '#60a5fa',
    badgeBg: '#2563eb',
    titleColor: '#ffffff',
  },
  {
    id: 'amber',
    name: 'کهربایی و طلایی (ویژه طرح‌های خودرو)',
    gradStart: '#451a03',
    gradMid: '#78350f',
    gradEnd: '#d97706',
    accentColor: '#fbbf24',
    badgeBg: '#d97706',
    titleColor: '#ffffff',
  },
  {
    id: 'royal',
    name: 'بنفش ارغوانی مدرن (ویژه ریلز و استوری)',
    gradStart: '#2e1065',
    gradMid: '#581c87',
    gradEnd: '#9333ea',
    accentColor: '#c084fc',
    badgeBg: '#7c3aed',
    titleColor: '#ffffff',
  },
];

export const StudioView: React.FC<StudioViewProps> = ({ settings, initialTemplateData }) => {
  const [activeTab, setActiveTab] = useState<'image' | 'video'>('image');
  const [selectedRatio, setSelectedRatio] = useState(ASPECT_RATIOS[0]);

  // Poster Background state - modern light gradients by default
  const [bgType, setBgType] = useState<'gradient' | 'color' | 'image'>('gradient');
  const [gradientStart, setGradientStart] = useState('#f0fdf4');
  const [gradientEnd, setGradientEnd] = useState('#ccfbf1');
  const [solidColor, setSolidColor] = useState('#f8fafc');
  const [bgImage, setBgImage] = useState<string | null>(null);

  // Canvas elements state
  const [elements, setElements] = useState<CanvasElement[]>([
    {
      id: 'el-badge',
      type: 'badge',
      text: 'اطلاعیه رسمی و فوری',
      x: 50,
      y: 16,
      fontSize: 26,
      color: '#ffffff',
      bgColor: '#059669',
      fontWeight: 'bold',
      badgeStyle: 'urgent',
    },
    {
      id: 'el-title',
      type: 'text',
      text: initialTemplateData?.title || 'آغاز ثبت‌نام آزمون استخدامی آموزش و پرورش',
      x: 50,
      y: 36,
      fontSize: 44,
      color: '#064e3b',
      fontWeight: '900',
    },
    {
      id: 'el-subtitle',
      type: 'text',
      text: initialTemplateData?.organization
        ? `مرجع رسمی برگزارکننده: ${initialTemplateData.organization}`
        : 'پذیرش در سراسر کشور • کلیه رشته‌های دانشگاهی',
      x: 50,
      y: 52,
      fontSize: 24,
      color: '#0f766e',
      fontWeight: 'normal',
    },
    {
      id: 'el-deadline',
      type: 'text',
      text: initialTemplateData?.deadline
        ? `آخرین مهلت ثبت‌نام: ${initialTemplateData.deadline}`
        : 'آخرین مهلت ثبت‌نام: تا پایان هفته جاری (ظرفیت محدود)',
      x: 50,
      y: 68,
      fontSize: 26,
      color: '#b45309',
      fontWeight: 'bold',
    },
    {
      id: 'el-watermark',
      type: 'watermark',
      text: `انجام کلیه خدمات در: ${settings.cafeName} • تلفن: ${settings.phone}`,
      x: 50,
      y: 88,
      fontSize: 20,
      color: '#0f172a',
      bgColor: 'rgba(255, 255, 255, 0.92)',
      fontWeight: 'bold',
    },
  ]);

  const [selectedElementId, setSelectedElementId] = useState<string>('el-title');
  const [history, setHistory] = useState<CanvasElement[][]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ==========================================
  // Video Motion Reels Generator State & Refs
  // ==========================================
  const motionCanvasRef = useRef<HTMLCanvasElement>(null);
  const [videoTitle, setVideoTitle] = useState<string>(
    initialTemplateData?.title || 'ثبت‌نام وام ازدواج و فرزندآوری'
  );
  const [videoOrg, setVideoOrg] = useState<string>(
    initialTemplateData?.organization || 'سامانه رسمی تسهیلات قرض‌الحسنه بانک مرکزی'
  );
  const [videoDeadline, setVideoDeadline] = useState<string>(
    initialTemplateData?.deadline || 'فرصت محدود • اولویت با مراجعه حضوری'
  );
  const [videoTheme, setVideoTheme] = useState(MOTION_THEMES[0]);
  const [videoRatio, setVideoRatio] = useState(ASPECT_RATIOS[2]); // Default 9:16 Story/Reels
  const [videoDuration, setVideoDuration] = useState<number>(6); // seconds
  const [isPlayingMotion, setIsPlayingMotion] = useState<boolean>(true);
  const [isExportingVideo, setIsExportingVideo] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [exportedVideoUrl, setExportedVideoUrl] = useState<string | null>(null);

  const animFrameIdRef = useRef<number | null>(null);
  const animStartTimeRef = useRef<number>(Date.now());

  // Save history snapshot for Poster
  const pushHistory = (newElements: CanvasElement[]) => {
    const updatedHistory = history.slice(0, historyIndex + 1);
    updatedHistory.push(JSON.parse(JSON.stringify(newElements)));
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setElements(JSON.parse(JSON.stringify(prev)));
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setElements(JSON.parse(JSON.stringify(next)));
      setHistoryIndex(historyIndex + 1);
    }
  };

  // Render Poster Canvas
  useEffect(() => {
    if (activeTab !== 'image') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = selectedRatio.width;
    canvas.height = selectedRatio.height;

    // Draw Background
    if (bgType === 'gradient') {
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, gradientStart);
      grad.addColorStop(1, gradientEnd);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Subtle modern soft radial accents (attractive bright lighting, not dark checkered)
      const radGrad = ctx.createRadialGradient(
        canvas.width * 0.8,
        canvas.height * 0.15,
        10,
        canvas.width * 0.8,
        canvas.height * 0.15,
        canvas.width * 0.6
      );
      radGrad.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
      radGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (bgType === 'color') {
      ctx.fillStyle = solidColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (bgType === 'image' && bgImage) {
      const img = new Image();
      img.src = bgImage;
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        drawElements(ctx, canvas);
      };
      return;
    }

    drawElements(ctx, canvas);
  }, [selectedRatio, bgType, gradientStart, gradientEnd, solidColor, bgImage, elements, activeTab]);

  const drawElements = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Elegant soft modern card frame
    ctx.strokeStyle = 'rgba(5, 150, 105, 0.15)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(30, 30, canvas.width - 60, canvas.height - 60, 24);
    ctx.stroke();

    // Decorative corner accent circles
    ctx.fillStyle = 'rgba(5, 150, 105, 0.3)';
    ctx.beginPath();
    ctx.arc(45, 45, 6, 0, Math.PI * 2);
    ctx.arc(canvas.width - 45, 45, 6, 0, Math.PI * 2);
    ctx.arc(45, canvas.height - 45, 6, 0, Math.PI * 2);
    ctx.arc(canvas.width - 45, canvas.height - 45, 6, 0, Math.PI * 2);
    ctx.fill();

    // Draw elements
    elements.forEach((el) => {
      const posX = (el.x / 100) * canvas.width;
      const posY = (el.y / 100) * canvas.height;

      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `${el.fontWeight} ${el.fontSize}px 'Vazirmatn', sans-serif`;

      const text = el.text || '';
      const textMetrics = ctx.measureText(text);
      const textWidth = textMetrics.width;
      const textHeight = el.fontSize * 1.25;

      // Draw background if badge or watermark
      if (el.type === 'badge' && el.bgColor) {
        ctx.fillStyle = el.bgColor;
        const padX = 28;
        const padY = 12;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
        ctx.shadowBlur = 12;
        ctx.shadowOffsetY = 4;
        ctx.beginPath();
        ctx.roundRect(
          posX - textWidth / 2 - padX,
          posY - textHeight / 2 - padY,
          textWidth + padX * 2,
          textHeight + padY * 2,
          16
        );
        ctx.fill();
        ctx.shadowColor = 'transparent';
      } else if (el.type === 'watermark') {
        ctx.fillStyle = el.bgColor || 'rgba(255, 255, 255, 0.9)';
        const padX = 32;
        const padY = 16;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.06)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 2;
        ctx.beginPath();
        ctx.roundRect(
          posX - textWidth / 2 - padX,
          posY - textHeight / 2 - padY,
          textWidth + padX * 2,
          textHeight + padY * 2,
          12
        );
        ctx.fill();
        ctx.strokeStyle = 'rgba(203, 213, 225, 0.8)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.shadowColor = 'transparent';
      }

      ctx.fillStyle = el.color;
      ctx.fillText(text, posX, posY);
      ctx.restore();
    });
  };

  // ============================================================
  // ANIMATED MOTION REELS GENERATOR (Pure Content Generation)
  // ============================================================
  const renderMotionFrame = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    elapsedSeconds: number
  ) => {
    // Background dynamic mesh gradient
    const t = elapsedSeconds;
    const grad = ctx.createLinearGradient(
      Math.sin(t * 0.5) * width * 0.4 + width * 0.5,
      0,
      Math.cos(t * 0.5) * width * 0.4 + width * 0.5,
      height
    );
    grad.addColorStop(0, videoTheme.gradStart);
    grad.addColorStop(0.5, videoTheme.gradMid);
    grad.addColorStop(1, videoTheme.gradEnd);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Dynamic glowing floating particles & orbs
    ctx.save();
    for (let i = 0; i < 5; i++) {
      const orbX = width * (0.2 + 0.15 * i + Math.sin(t + i) * 0.1);
      const orbY = height * (0.2 + 0.12 * i + Math.cos(t * 0.8 + i) * 0.08);
      const orbRad = width * (0.15 + (i % 3) * 0.08);
      const orbGrad = ctx.createRadialGradient(orbX, orbY, 10, orbX, orbY, orbRad);
      orbGrad.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
      orbGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = orbGrad;
      ctx.beginPath();
      ctx.arc(orbX, orbY, orbRad, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Subtle modern animated border frame
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(24, 24, width - 48, height - 48, 28);
    ctx.stroke();
    ctx.restore();

    // 1. Animated Badge at top
    const badgePulse = 1 + Math.sin(t * 4) * 0.03;
    const badgeText = '⚡ اطلاعیه رسمی و ثبت‌نام فعال';
    ctx.save();
    ctx.translate(width / 2, height * 0.18);
    ctx.scale(badgePulse, badgePulse);
    ctx.font = `bold ${Math.round(width * 0.038)}px 'Vazirmatn', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const bMetrics = ctx.measureText(badgeText);
    const bW = bMetrics.width + 48;
    const bH = width * 0.07;
    ctx.fillStyle = videoTheme.badgeBg;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.roundRect(-bW / 2, -bH / 2, bW, bH, 20);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(badgeText, 0, 2);
    ctx.restore();

    // 2. Animated Headline (Title)
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `900 ${Math.round(width * 0.065)}px 'Vazirmatn', sans-serif`;
    ctx.fillStyle = videoTheme.titleColor;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 12;

    // Word wrapping for title
    const maxTextWidth = width * 0.85;
    const words = videoTitle.split(' ');
    let line = '';
    const lines: string[] = [];
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxTextWidth && n > 0) {
        lines.push(line);
        line = words[n] + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line);

    const titleCenterY = height * 0.38;
    const lineHeight = width * 0.085;
    const startY = titleCenterY - ((lines.length - 1) * lineHeight) / 2;
    lines.forEach((l, idx) => {
      ctx.fillText(l.trim(), width / 2, startY + idx * lineHeight);
    });
    ctx.restore();

    // 3. Organization info with glowing pill
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `bold ${Math.round(width * 0.036)}px 'Vazirmatn', sans-serif`;
    ctx.fillStyle = videoTheme.accentColor;
    ctx.fillText(videoOrg, width / 2, height * 0.54);
    ctx.restore();

    // 4. Deadline / Action alert card
    ctx.save();
    const alertW = width * 0.86;
    const alertH = height * 0.11;
    const alertY = height * 0.65;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect((width - alertW) / 2, alertY - alertH / 2, alertW, alertH, 20);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `bold ${Math.round(width * 0.038)}px 'Vazirmatn', sans-serif`;
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`⏳ ${videoDeadline}`, width / 2, alertY);
    ctx.restore();

    // 5. Watermark badge for Cafe
    ctx.save();
    const wmY = height * 0.86;
    const wmW = width * 0.88;
    const wmH = height * 0.09;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.beginPath();
    ctx.roundRect((width - wmW) / 2, wmY - wmH / 2, wmW, wmH, 18);
    ctx.fill();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#0f172a';
    ctx.font = `900 ${Math.round(width * 0.036)}px 'Vazirmatn', sans-serif`;
    ctx.fillText(`ثبت‌نام رسمی و فوری در: ${settings.cafeName}`, width / 2, wmY - 12);

    ctx.fillStyle = '#475569';
    ctx.font = `normal ${Math.round(width * 0.03)}px 'Vazirmatn', sans-serif`;
    ctx.fillText(`شماره تماس و پیام‌رسان: ${settings.phone}`, width / 2, wmY + 16);
    ctx.restore();

    // 6. Reel Progress Bar at very bottom
    const progress = (t % videoDuration) / videoDuration;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(24, height - 32, width - 48, 6);
    ctx.fillStyle = videoTheme.accentColor;
    ctx.fillRect(24, height - 32, (width - 48) * progress, 6);
  };

  // Animation Loop for Motion Preview
  useEffect(() => {
    if (activeTab !== 'video') {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      return;
    }

    const canvas = motionCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Use ratio size
    canvas.width = videoRatio.width;
    canvas.height = videoRatio.height;

    const render = () => {
      const now = Date.now();
      const elapsed = isPlayingMotion ? (now - animStartTimeRef.current) / 1000 : 0;
      renderMotionFrame(ctx, canvas.width, canvas.height, elapsed);
      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [
    activeTab,
    videoRatio,
    videoTheme,
    videoTitle,
    videoOrg,
    videoDeadline,
    videoDuration,
    isPlayingMotion,
    settings,
  ]);

  // Export Motion Video to WebM using MediaRecorder
  const handleExportMotionVideo = async () => {
    const canvas = motionCanvasRef.current;
    if (!canvas) return;

    setIsExportingVideo(true);
    setExportProgress(10);
    setExportedVideoUrl(null);

    try {
      // Capture canvas stream at 30 FPS
      const stream = canvas.captureStream(30);
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm';

      const recorder = new MediaRecorder(stream, { mimeType });
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setExportedVideoUrl(url);
        setIsExportingVideo(false);
        setExportProgress(100);
      };

      recorder.start();

      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        const pct = Math.min(95, Math.round((elapsed / videoDuration) * 90));
        setExportProgress(pct);
      }, 200);

      setTimeout(() => {
        clearInterval(interval);
        if (recorder.state !== 'inactive') {
          recorder.stop();
        }
      }, videoDuration * 1000);
    } catch (err) {
      console.error('Video generation error:', err);
      setIsExportingVideo(false);
      alert('خطا در تولید فایل ویدئو. لطفاً از مرورگر مدرن مانند کروم، اج یا فایرفاکس استفاده فرمایید.');
    }
  };

  // Poster element editing
  const currentElement = elements.find((el) => el.id === selectedElementId);

  const updateSelectedElement = (updates: Partial<CanvasElement>) => {
    const updated = elements.map((el) => (el.id === selectedElementId ? { ...el, ...updates } : el));
    setElements(updated);
    pushHistory(updated);
  };

  const applyTemplate = (tpl: (typeof PRESET_TEMPLATES)[0]) => {
    setBgType('gradient');
    setGradientStart(tpl.bgGradient[0]);
    setGradientEnd(tpl.bgGradient[1]);

    const newElements: CanvasElement[] = [
      {
        id: 'el-badge',
        type: 'badge',
        text: tpl.badge,
        x: 50,
        y: 16,
        fontSize: 26,
        color: tpl.badgeColor,
        bgColor: tpl.badgeBg,
        fontWeight: 'bold',
      },
      {
        id: 'el-title',
        type: 'text',
        text: tpl.heading,
        x: 50,
        y: 36,
        fontSize: 44,
        color: tpl.titleColor,
        fontWeight: '900',
      },
      {
        id: 'el-subtitle',
        type: 'text',
        text: tpl.subheading,
        x: 50,
        y: 52,
        fontSize: 24,
        color: tpl.subColor,
        fontWeight: 'normal',
      },
      {
        id: 'el-deadline',
        type: 'text',
        text: 'آخرین مهلت مراجعه: تا پایان مهلت رسمی سامانه',
        x: 50,
        y: 68,
        fontSize: 26,
        color: tpl.deadlineColor,
        fontWeight: 'bold',
      },
      {
        id: 'el-watermark',
        type: 'watermark',
        text: `انجام کلیه خدمات در: ${settings.cafeName} • تلفن: ${settings.phone}`,
        x: 50,
        y: 88,
        fontSize: 20,
        color: '#0f172a',
        bgColor: 'rgba(255, 255, 255, 0.92)',
        fontWeight: 'bold',
      },
    ];

    setElements(newElements);
    pushHistory(newElements);
  };

  const handleDownloadImage = (format: 'png' | 'jpeg') => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `poster-${Date.now()}.${format}`;
    link.href = canvas.toDataURL(`image/${format}`, 0.95);
    link.click();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBgImage(event.target?.result as string);
        setBgType('image');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Tool Selection */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
              استودیوی طراحی پوستر و تولید تیزر ویدئویی
            </h1>
            <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              تولید محتوای هوشمند بدون نیاز به آپلود ویدیو
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            ساخت تصاویر باکیفیت و کلیپ‌های انیمیشنی متحرک برای اینستاگرام (Reels)، تلگرام و پیام‌رسان‌ها با برند اختصاصی کافی‌نت
          </p>
        </div>

        {/* Tab switcher: Image vs Video Content Generator */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-start md:self-auto">
          <button
            onClick={() => setActiveTab('image')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'image'
                ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            طراحی پوستر و بنر
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'video'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Film className="w-4 h-4" />
            تولید ریلز و ویدیو متحرک
          </button>
        </div>
      </div>

      {activeTab === 'image' ? (
        /* =========================================
           IMAGE POSTER STUDIO
           ========================================= */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Canvas Preview Area (Col 7) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col items-center">
            {/* Aspect Ratio bar */}
            <div className="w-full flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-slate-800 overflow-x-auto gap-2">
              <div className="flex items-center gap-1.5 shrink-0">
                {ASPECT_RATIOS.map((ratio) => (
                  <button
                    key={ratio.id}
                    onClick={() => setSelectedRatio(ratio)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedRatio.id === ratio.id
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {ratio.name}
                  </button>
                ))}
              </div>

              {/* Undo / Redo */}
              <div className="flex items-center gap-1">
                <button
                  onClick={handleUndo}
                  disabled={historyIndex <= 0}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30"
                  title="بازگشت (Undo)"
                >
                  <Undo2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleRedo}
                  disabled={historyIndex >= history.length - 1}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30"
                  title="انجام مجدد (Redo)"
                >
                  <Redo2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Canvas Display Frame: Attractive Soft Modern Light Gradient Container (No Dark Checkered Pattern) */}
            <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center bg-gradient-to-br from-slate-100 via-emerald-50/40 to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 rounded-2xl overflow-hidden shadow-md p-4 border border-emerald-100/60 dark:border-slate-800">
              <canvas
                ref={canvasRef}
                className="max-h-full max-w-full object-contain rounded-xl shadow-xl transition-all"
              />
            </div>

            {/* Export buttons */}
            <div className="w-full flex items-center justify-between mt-5 pt-4 border-t border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-400">
                ابعاد خروجی: {selectedRatio.width} × {selectedRatio.height} پیکسل
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadImage('jpeg')}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 transition-colors"
                >
                  دانلود JPEG
                </button>
                <button
                  onClick={() => handleDownloadImage('png')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  دانلود پوستر باکیفیت PNG
                </button>
              </div>
            </div>
          </div>

          {/* Tools & Customization Controls (Col 5) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Pre-built Templates */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2.5 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                قالب‌های آماده اطلاعیه‌های پرکاربرد
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {PRESET_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => applyTemplate(tpl)}
                    className="p-2.5 text-right rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-xs font-medium bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50/50 dark:hover:bg-slate-800 transition-all truncate"
                  >
                    <span className="font-bold text-slate-800 dark:text-slate-200 block truncate">
                      {tpl.title}
                    </span>
                    <span className="text-[10px] text-slate-400">{tpl.badge}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Elements Layer Selector */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2.5 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-500" />
                لایه‌ها و متون روی پوستر
              </h3>
              <div className="space-y-1.5">
                {elements.map((el) => (
                  <button
                    key={el.id}
                    onClick={() => setSelectedElementId(el.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-medium text-right transition-colors ${
                      selectedElementId === el.id
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-bold'
                        : 'bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    <span className="truncate max-w-[200px]">{el.text || 'عنصر'}</span>
                    <span className="text-[10px] text-slate-400">
                      {el.type === 'badge' ? 'نشان' : el.type === 'watermark' ? 'واترمارک' : 'متن'}
                    </span>
                  </button>
                ))}
              </div>

              {/* Edit Selected Element Form */}
              {currentElement && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                      متن لایه انتخابی:
                    </label>
                    <textarea
                      rows={2}
                      value={currentElement.text || ''}
                      onChange={(e) => updateSelectedElement({ text: e.target.value })}
                      className="w-full p-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 block mb-1">
                        اندازه قلم: ({currentElement.fontSize}px)
                      </label>
                      <input
                        type="range"
                        min="16"
                        max="80"
                        value={currentElement.fontSize}
                        onChange={(e) => updateSelectedElement({ fontSize: Number(e.target.value) })}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-500 block mb-1">
                        موقعیت عمودی (Y):
                      </label>
                      <input
                        type="range"
                        min="5"
                        max="95"
                        value={currentElement.y}
                        onChange={(e) => updateSelectedElement({ y: Number(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <label className="text-[11px] font-bold text-slate-500">رنگ متن:</label>
                      <input
                        type="color"
                        value={currentElement.color}
                        onChange={(e) => updateSelectedElement({ color: e.target.value })}
                        className="w-7 h-7 rounded border-none cursor-pointer"
                      />
                    </div>

                    {currentElement.bgColor && (
                      <div className="flex items-center gap-1.5">
                        <label className="text-[11px] font-bold text-slate-500">رنگ کادر / نشان:</label>
                        <input
                          type="color"
                          value={currentElement.bgColor.startsWith('#') ? currentElement.bgColor : '#059669'}
                          onChange={(e) => updateSelectedElement({ bgColor: e.target.value })}
                          className="w-7 h-7 rounded border-none cursor-pointer"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Background Style Options */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-teal-500" />
                تنظیمات پس‌زمینه پوستر
              </h3>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setBgType('gradient')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                    bgType === 'gradient'
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950 text-emerald-700'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600'
                  }`}
                >
                  گرادیان مدرن روشن
                </button>
                <button
                  onClick={() => setBgType('color')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                    bgType === 'color'
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950 text-emerald-700'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600'
                  }`}
                >
                  رنگ تک‌رنگ
                </button>
                <label
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg border text-center cursor-pointer transition-all ${
                    bgType === 'image'
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950 text-emerald-700'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600'
                  }`}
                >
                  عکس پس‌زمینه
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>

              {bgType === 'gradient' && (
                <div className="flex items-center gap-3 pt-1">
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-slate-500 text-[11px]">رنگ گرادیان ۱:</span>
                    <input
                      type="color"
                      value={gradientStart}
                      onChange={(e) => setGradientStart(e.target.value)}
                      className="w-7 h-7 rounded border-none cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-slate-500 text-[11px]">رنگ گرادیان ۲:</span>
                    <input
                      type="color"
                      value={gradientEnd}
                      onChange={(e) => setGradientEnd(e.target.value)}
                      className="w-7 h-7 rounded border-none cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* =========================================
           ANIMATED MOTION REELS GENERATOR
           (Pure Automated Content Generation)
           ========================================= */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Animated Canvas Preview Box (Col 7) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col items-center">
            {/* Top Toolbar: Aspect Ratio & Play/Pause */}
            <div className="w-full flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-slate-800 overflow-x-auto gap-2">
              <div className="flex items-center gap-1.5">
                {[ASPECT_RATIOS[2], ASPECT_RATIOS[0], ASPECT_RATIOS[3]].map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setVideoRatio(r)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      videoRatio.id === r.id
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {r.name}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsPlayingMotion(!isPlayingMotion)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all"
                >
                  {isPlayingMotion ? (
                    <>
                      <Pause className="w-3.5 h-3.5 text-amber-500" />
                      توقف موقت
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 text-emerald-500" />
                      پخش زنده
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Motion Preview Canvas Frame */}
            <div className="relative w-full max-w-[360px] aspect-[9/16] flex items-center justify-center bg-slate-950 rounded-2xl overflow-hidden shadow-2xl p-2 border border-slate-800">
              <canvas
                ref={motionCanvasRef}
                className="max-h-full max-w-full object-contain rounded-xl shadow-lg"
              />
            </div>

            {/* Video Export Controls */}
            <div className="w-full mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-slate-500">
                مدت زمان ریلز: <span className="font-bold text-slate-800 dark:text-slate-200">{videoDuration} ثانیه</span> • با وضوح بالا
              </div>

              <div className="flex items-center gap-2">
                {!isExportingVideo ? (
                  <button
                    onClick={handleExportMotionVideo}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <MonitorPlay className="w-4 h-4" />
                    تولید فایل ویدئو (WebM / اینستاگرام)
                  </button>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold animate-pulse">
                    <Sparkles className="w-4 h-4 animate-spin text-emerald-600" />
                    در حال رندر و پردازش انیمیشن ({exportProgress}٪)...
                  </div>
                )}

                {exportedVideoUrl && (
                  <a
                    href={exportedVideoUrl}
                    download={`coffeenet-reels-${Date.now()}.webm`}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all"
                  >
                    <Download className="w-4 h-4" />
                    دانلود فایل ویدئو
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Video Parameters & Content Form (Col 5) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Visual Theme Selector */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-emerald-500" />
                استایل بصری و تم رنگی موشن‌گرافیک
              </h3>
              <div className="space-y-2">
                {MOTION_THEMES.map((thm) => (
                  <button
                    key={thm.id}
                    onClick={() => setVideoTheme(thm)}
                    className={`w-full p-2.5 rounded-xl border text-right transition-all flex items-center justify-between ${
                      videoTheme.id === thm.id
                        ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/50 shadow-xs font-bold'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-xs">{thm.name}</span>
                    <div className="flex items-center gap-1">
                      <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: thm.gradStart }} />
                      <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: thm.gradMid }} />
                      <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: thm.gradEnd }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Video Content Text Inputs */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Type className="w-4 h-4 text-teal-500" />
                محتوا و جزئیات ثبت‌نام در ویدیو
              </h3>

              <div>
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                  عنوان اصلی تیزر (تیتر ریلز):
                </label>
                <input
                  type="text"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                  نام سامانه و مرجع صادرکننده:
                </label>
                <input
                  type="text"
                  value={videoOrg}
                  onChange={(e) => setVideoOrg(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                  باکس هشدار مهلت و اقدام:
                </label>
                <input
                  type="text"
                  value={videoDeadline}
                  onChange={(e) => setVideoDeadline(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                  مدت زمان کلیپ (ثانیه):
                </label>
                <div className="flex items-center gap-2">
                  {[5, 8, 12].map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => setVideoDuration(sec)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        videoDuration === sec
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 font-bold'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {sec} ثانیه
                    </button>
                  ))}
                </div>
              </div>

              {/* Watermark preview note */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-emerald-500" />
                <span>واترمارک خودکار: <strong>{settings.cafeName}</strong> ({settings.phone})</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
