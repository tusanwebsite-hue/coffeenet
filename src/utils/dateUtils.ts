/**
 * Persian (Jalali / Shamsi) Date & Verification Utilities
 * Supports native Intl formatting for Asia/Tehran timezone
 */

// Convert English digits to Persian digits
export function toPersianDigits(input: string | number): string {
  const str = String(input);
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.replace(/[0-9]/g, (w) => persianDigits[+w]);
}

// Convert Persian digits to English digits
export function toEnglishDigits(str: string): string {
  const persianDigits = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
  const arabicDigits = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
  let result = str;
  for (let i = 0; i < 10; i++) {
    result = result.replace(persianDigits[i], String(i)).replace(arabicDigits[i], String(i));
  }
  return result;
}

/**
 * Formats a JavaScript Date or ISO string into Jalali formatted date string (e.g. ۱۴۰۳/۰۸/۰۱)
 */
export function formatJalaliDate(dateInput: Date | string | number): string {
  try {
    const d = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) return 'نامشخص';

    const formatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
      timeZone: 'Asia/Tehran',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formatter.format(d);
  } catch {
    return 'نامشخص';
  }
}

/**
 * Formats Jalali Date with Month Name (e.g. ۲ آبان ۱۴۰۳)
 */
export function formatJalaliFull(dateInput: Date | string | number): string {
  try {
    const d = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) return 'نامشخص';

    const formatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
      timeZone: 'Asia/Tehran',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    return formatter.format(d);
  } catch {
    return 'نامشخص';
  }
}

/**
 * Calculates days difference between target date and base date (defaulting to now)
 */
export function getDaysDiff(targetDateStr: string, baseDate: Date = new Date()): number {
  const target = new Date(targetDateStr);
  if (isNaN(target.getTime())) return 999;
  const diffMs = baseDate.getTime() - target.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Strict 20-day rule check:
 * Returns true only if publication/update date is within the last 20 days.
 */
export function isWithinLast20Days(publishedDateStr: string, currentDate: Date = new Date()): boolean {
  if (!publishedDateStr) return false;
  const publishedDate = new Date(publishedDateStr);
  if (isNaN(publishedDate.getTime())) return false;

  const diffDays = getDaysDiff(publishedDateStr, currentDate);
  // Valid if published in the last 20 days and not in the far future (diffDays >= -1)
  return diffDays >= -1 && diffDays <= 20;
}

/**
 * Determine Registration Deadline status:
 * 'active' | 'ending_soon' | 'expired' | 'no_deadline'
 */
export function getDeadlineStatus(
  deadlineDateStr?: string | null,
  currentDate: Date = new Date()
): {
  status: 'active' | 'ending_soon' | 'expired' | 'no_deadline';
  daysRemaining: number | null;
  label: string;
} {
  if (!deadlineDateStr) {
    return {
      status: 'no_deadline',
      daysRemaining: null,
      label: 'مهلت رسمی مشخص نشده است',
    };
  }

  const deadline = new Date(deadlineDateStr);
  if (isNaN(deadline.getTime())) {
    return {
      status: 'no_deadline',
      daysRemaining: null,
      label: 'مهلت نامعتبر',
    };
  }

  // Calculate days remaining until deadline
  const diffMs = deadline.getTime() - currentDate.getTime();
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (days < 0) {
    return {
      status: 'expired',
      daysRemaining: days,
      label: 'پایان یافته',
    };
  } else if (days <= 3) {
    return {
      status: 'ending_soon',
      daysRemaining: days,
      label: days === 0 ? 'امروز آخرین مهلت' : `${toPersianDigits(days)} روز تا پایان مهلت`,
    };
  } else {
    return {
      status: 'active',
      daysRemaining: days,
      label: `${toPersianDigits(days)} روز مهلت باقی‌مانده`,
    };
  }
}
