export type RegistrationCategory =
  | 'employment' // استخدامی و جذب نیرو
  | 'exam' // آزمون‌های استخدامی و عمومی
  | 'university' // ثبت‌نام دانشگاه‌ها و پذیرش دانشجو
  | 'konkur' // کنکور سراسری و ارشد و دکتری
  | 'loan' // تسهیلات و وام‌های دولتی
  | 'social_support' // طرح‌های حمایتی و معیشتی
  | 'social_security' // تأمین اجتماعی و سوابق
  | 'auto' // ثبت‌نام خودرو و فروش یکپارچه
  | 'identity' // خدمات هویتی و ثبت احوال
  | 'pensioner' // خدمات بازنشستگان
  | 'provincial' // استانی و محلی
  | 'other'; // سایر امور کافی‌نت

export interface RegistrationOpportunity {
  id: string;
  title: string;
  organization: string;
  category: RegistrationCategory;
  summary: string;
  requirements: string[];
  publishedAt: string; // ISO date
  deadlineAt: string | null; // ISO date or null
  officialUrl: string;
  sourceName: string; // e.g. ایران استخدام، سنجش، هیوا، آموزش و پرورش
  sourceUrl: string;
  isVerified: boolean;
  isBookmarked?: boolean;
  feeEstimated?: string;
  tags?: string[];
  imageUrl?: string;
}

export type SystemHealthStatus = 'up' | 'degraded' | 'down' | 'needs_check' | 'untested';

export interface GovernmentSystem {
  id: string;
  name: string;
  organization: string;
  category: string;
  url: string;
  status: SystemHealthStatus;
  latencyMs?: number | null;
  statusCode?: number | null;
  lastChecked?: string | null;
  description: string;
  message?: string;
  userReports?: string; // گزارش‌ها و نظرات کاربران صنف کافی‌نت در مورد وضعیت لاگین و خدمات
  ssoStatus?: 'active' | 'degraded' | 'maintenance'; // وضعیت ورود و پنجره واحد دولت
  reliabilityScore?: number; // شاخص پایداری عملکردی از ۱۰۰
  isPinned?: boolean;
}

export interface GuildNewsItem {
  id: string;
  title: string;
  category: 'rates' | 'circular' | 'tax' | 'general' | 'technical';
  publishedAt: string;
  sourceName: string; // منبع رسمی، اتحادیه، بخشنامه صنف کافی‌نت
  sourceUrl?: string;
  summary: string;
  isUrgent?: boolean;
  isVerified: boolean;
}

export interface SystemLinkBankItem {
  id: string;
  title: string;
  organization: string;
  category: string;
  subCategory?: string;
  url: string;
  description: string;
  shortcutCode?: string;
  isFavorite?: boolean;
}

export interface UserCafeSettings {
  cafeName: string;
  ownerName: string;
  phone: string;
  address: string;
  primaryColor: string;
  theme: 'light' | 'dark';
  logoUrl?: string;
  isLoggedIn: boolean;
  userEmail: string;
  userRole: 'admin' | 'user';
  useGeminiAi: boolean;
}

export interface StudioLayer {
  id: string;
  type: 'text' | 'badge' | 'shape' | 'image' | 'watermark';
  content: string; // text or image src
  x: number;
  y: number;
  fontSize?: number;
  color?: string;
  bgColor?: string;
  fontWeight?: string;
  fontFamily?: string;
  rotation?: number;
  opacity?: number;
  isLocked?: boolean;
  width?: number;
  height?: number;
}

export interface ContentDraft {
  id: string;
  title: string;
  content: string;
  channel: string;
  date: string;
  imageUrl?: string;
}
