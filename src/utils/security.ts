/**
 * Security & SSRF Protection Utilities for Iranian Government System Checker
 */

// Whitelist of allowed domains for government and public services in Iran
export const ALLOWED_GOVERNMENT_DOMAINS = [
  'sanjesh.org',
  'my.gov.ir',
  'iran.gov.ir',
  'tamin.ir',
  'sso.tamin.ir',
  'eservices.tamin.ir',
  'adliran.ir',
  'eblagh.adliran.ir',
  'sana.adliran.ir',
  'nobat.adliran.ir',
  'sakha.epolice.ir',
  'epolice.ir',
  'nobatdehi.epolice.ir',
  'ssaa.ir',
  'amlak.mrud.ir',
  'saman.mrud.ir',
  'mrud.ir',
  'g4b.ir',
  'mojavez.ir',
  'tax.gov.ir',
  'my.tax.gov.ir',
  'register.tax.gov.ir',
  'tp.tax.gov.ir',
  'medu.ir',
  'my.medu.ir',
  'dipcode.medu.ir',
  'emtiaz.medu.ir',
  'eskan.mrud.ir',
  'cbi.ir',
  've.cbi.ir',
  'post.ir',
  'ihio.gov.ir',
  'sabteahval.ir',
  'ncr.ir',
  'mporg.ir',
  'aro.gov.ir',
  'sanabad.ir',
  'ikco.ir',
  'esale.ikco.ir',
  'saipacorp.com',
  'saipa.iranecar.com',
  'iranecar.com',
  'autonovin.com',
  'hrtc.ir', // مرکز آزمون جهاد دانشگاهی
  'acecr.ac.ir', // جهاد دانشگاهی
  'azmoon.org', // مرکز سنجش و پذیرش دانشگاه آزاد
  'iau.ir',
  'amozeshyar.iau.ir',
  'pnu.ac.ir',
  'reg.pnu.ac.ir',
  'uast.ac.ir',
  'saorg.ir', // سامانه سجاد وزارت علوم
  'portal.saorg.ir',
  'csdiran.ir',
  'sejam.ir',
  'ntsw.ir', // سامانه جامع تجارت
  'dolat.ir', // پایگاه اطلاع‌رسانی دولت
  'mcls.gov.ir', // وزارت کار
  'tek.mporg.ir', // سامانه تک تسهیلات اشتغال
  'gov.ir'
];

/**
 * Validates whether a target URL is safe and permitted for server-side probing.
 * Blocks private IP ranges, localhost, metadata IP (169.254.169.254), non-http/https protocols,
 * and domains outside the Iranian government whitelist.
 */
export function isAllowedSystemUrl(urlString: string): { allowed: boolean; reason?: string; hostname?: string } {
  try {
    const url = new URL(urlString);

    // Only allow HTTP/HTTPS
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return { allowed: false, reason: 'تنها پروتکل‌های HTTP و HTTPS مجاز هستند.' };
    }

    // Disallow non-standard ports (e.g. 22, 25, 3306, 6379, etc.)
    if (url.port && url.port !== '80' && url.port !== '443') {
      return { allowed: false, reason: 'پورت‌های غیرمعمول مسدود هستند.' };
    }

    const hostname = url.hostname.toLowerCase();

    // Block localhost, loopbacks, and common private IP addresses
    if (
      hostname === 'localhost' ||
      hostname.endsWith('.localhost') ||
      hostname === '127.0.0.1' ||
      hostname === '::1' ||
      hostname === '0.0.0.0' ||
      hostname === '169.254.169.254' || // Cloud metadata IP
      hostname.startsWith('10.') ||
      hostname.startsWith('192.168.') ||
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname)
    ) {
      return { allowed: false, reason: 'دسترسی به آدرس‌های داخلی و خصوصی غیرمجاز است.' };
    }

    // Check if domain or top-level parent matches whitelist
    const isWhitelisted = ALLOWED_GOVERNMENT_DOMAINS.some(
      (allowed) => hostname === allowed || hostname.endsWith('.' + allowed)
    );

    if (!isWhitelisted) {
      return {
        allowed: false,
        reason: 'فقط دامنه‌های رسمی دولتی و خدمات عمومی مجاز در پایگاه داده قابل پایش هستند.',
        hostname,
      };
    }

    return { allowed: true, hostname };
  } catch {
    return { allowed: false, reason: 'آدرس وارد شده معتبر نیست.' };
  }
}
