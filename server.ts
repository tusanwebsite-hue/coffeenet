import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { isAllowedSystemUrl } from './src/utils/security';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI client on server
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// 1. SSRF-Protected System Probe Endpoint
app.post('/api/system-status/check', async (req, res) => {
  const { url, id, name } = req.body;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'آدرس سامانه نامعتبر است.' });
  }

  // SSRF Validation
  const validation = isAllowedSystemUrl(url);
  if (!validation.allowed) {
    return res.status(403).json({
      id,
      name,
      url,
      status: 'down',
      statusCode: null,
      latencyMs: null,
      message: validation.reason || 'دسترسی به این آدرس مجاز نیست (حفاظت SSRF).',
      lastChecked: new Date().toISOString(),
    });
  }

  const startTime = Date.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) CoffeenetPlus-Monitor/1.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'fa,en-US;q=0.7,en;q=0.3',
      },
      signal: controller.signal,
      redirect: 'follow',
    });

    clearTimeout(timeoutId);
    const latencyMs = Date.now() - startTime;
    const statusCode = response.status;

    let status: 'up' | 'degraded' | 'down' | 'needs_check' = 'up';
    let message = 'سامانه با موفقیت پاسخ داد و در دسترس است.';

    if (statusCode >= 200 && statusCode < 300) {
      if (latencyMs > 3500) {
        status = 'degraded';
        message = `پاسخ دریافت شد اما سرعت کند است (${latencyMs} میلی‌ثانیه).`;
      } else {
        status = 'up';
        message = `سامانه در دسترس و پایدار است (${latencyMs} میلی‌ثانیه).`;
      }
    } else if (statusCode >= 300 && statusCode < 400) {
      status = 'up';
      message = `انتقال به نشانی جدید (کد ${statusCode}).`;
    } else if (statusCode === 403 || statusCode === 401) {
      status = 'needs_check';
      message = `نیازمند احراز هویت یا دسترسی داخلی (کد ${statusCode}).`;
    } else if (statusCode >= 500) {
      status = 'down';
      message = `خطای سرور سامانه دولتی (کد ${statusCode}).`;
    } else {
      status = 'degraded';
      message = `پاسخ با کد ${statusCode} دریافت شد.`;
    }

    return res.json({
      id,
      name,
      url,
      status,
      statusCode,
      latencyMs,
      message,
      lastChecked: new Date().toISOString(),
    });
  } catch (err: any) {
    const latencyMs = Date.now() - startTime;
    let message = 'خطای ارتباط با سامانه یا انقضای زمان پاسخ (Timeout).';
    if (err.name === 'AbortError') {
      message = 'عدم دریافت پاسخ در مدت مجاز (بیش از ۷ ثانیه).';
    } else if (err.code === 'ENOTFOUND') {
      message = 'عدم شناسایی نام دامنه یا قطعی موقت DNS.';
    } else if (err.code === 'ECONNREFUSED') {
      message = 'ارتباط توسط سرور سامانه مقصد رد شد.';
    }

    return res.json({
      id,
      name,
      url,
      status: 'down',
      statusCode: null,
      latencyMs,
      message,
      lastChecked: new Date().toISOString(),
    });
  }
});

// 2. Server-side Gemini Generation Endpoint
app.post('/api/gemini/generate', async (req, res) => {
  try {
    const { prompt, contentType, tone, cafeName, registrationTitle } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        error: 'کلید API هوش مصنوعی در سرور پیکربندی نشده است. می‌توانید از تولیدکننده محتوای آفلاین و قالب‌های آماده برنامه استفاده فرمایید.',
      });
    }

    if (!prompt) {
      return res.status(400).json({ error: 'متن درخواست الزامی است.' });
    }

    const systemInstruction = `تو یک کارشناس ارشد تولید محتوای شبکه‌های اجتماعی، سئو و خدمات اداری صنف کافی‌نت‌ها و دفاتر پیشخوان دولت در ایران هستی.
نام کسب‌وکار: ${cafeName || 'کافی‌نت پلاس'}
نوع محتوا درخواستی: ${contentType || 'پست تلگرام یا اینستاگرام'}
لحن: ${tone || 'رسمی و ترغیب‌کننده'}
${registrationTitle ? `عنوان خدمت یا ثبت‌نام مدنظر: ${registrationTitle}` : ''}

قوانین مهم:
۱. تمام خروجی باید به زبان فارسی فاخر، بدون غلط املایی و با علائم نگارشی استاندارد باشد.
۲. تاریخ‌ها، ارقام و مبالغ را از خود اختراع نکن؛ اگر در ورودی نبود، به «طبق آخرین بخشنامه رسمی» اشاره کن.
۳. از شکلک‌ها (ایموجی‌ها) به جا و حرفه‌ای استفاده کن.
۴. در انتهای متن هشتگ‌های پربازدید مرتبط با دفاتر پیشخوان، استخدامی و ثبت‌نام‌ها قرار بده.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return res.json({
      text: response.text,
      model: 'gemini-3.8-flash',
      createdAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({
      error: error.message || 'خطا در ارتباط با هوش مصنوعی. لطفاً دوباره تلاش کنید یا از بخش آفلاین استفاده نمایید.',
    });
  }
});

// 3. Mount Vite Dev Server in Development or Serve Static in Production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const http = await import('http');
  const server = http.createServer(app);

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: {
          server,
        },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Coffeenet Plus server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
