import test from 'node:test';
import assert from 'node:assert/strict';
import { isWithinLast20Days, getDeadlineStatus, toPersianDigits, getDaysDiff } from './dateUtils';
import { isAllowedSystemUrl } from './security';
import { generateOfflineContent } from './contentTemplates';

test('toPersianDigits converts ASCII digits to Persian digits', () => {
  assert.equal(toPersianDigits(1403), '۱۴۰۳');
  assert.equal(toPersianDigits('2026-10-22'), '۲۰۲۶-۱۰-۲۲');
});

test('strict 20-day rule filters older content accurately', () => {
  const referenceNow = new Date('2026-10-22T00:00:00Z');

  // 5 days ago: should be valid
  const fiveDaysAgo = new Date('2026-10-17T00:00:00Z').toISOString();
  assert.equal(isWithinLast20Days(fiveDaysAgo, referenceNow), true);

  // Exactly 19 days ago: valid
  const nineteenDaysAgo = new Date('2026-10-03T00:00:00Z').toISOString();
  assert.equal(isWithinLast20Days(nineteenDaysAgo, referenceNow), true);

  // 25 days ago: must be REJECTED per rule
  const twentyFiveDaysAgo = new Date('2026-09-27T00:00:00Z').toISOString();
  assert.equal(isWithinLast20Days(twentyFiveDaysAgo, referenceNow), false);

  // Invalid date: must be rejected
  assert.equal(isWithinLast20Days('', referenceNow), false);
  assert.equal(isWithinLast20Days('invalid-date', referenceNow), false);
});

test('deadline calculation produces correct status labels', () => {
  const referenceNow = new Date('2026-10-22T00:00:00Z');

  // No deadline
  const noDeadline = getDeadlineStatus(null, referenceNow);
  assert.equal(noDeadline.status, 'no_deadline');
  assert.equal(noDeadline.label, 'مهلت رسمی مشخص نشده است');

  // Expired deadline (yesterday)
  const expired = getDeadlineStatus('2026-10-21T00:00:00Z', referenceNow);
  assert.equal(expired.status, 'expired');
  assert.equal(expired.label, 'پایان یافته');

  // Ending soon (2 days left)
  const soon = getDeadlineStatus('2026-10-24T00:00:00Z', referenceNow);
  assert.equal(soon.status, 'ending_soon');

  // Active (10 days left)
  const active = getDeadlineStatus('2026-11-01T00:00:00Z', referenceNow);
  assert.equal(active.status, 'active');
});

test('SSRF validator permits whitelisted government portals and blocks internal/malicious destinations', () => {
  // Allowed government domains
  assert.equal(isAllowedSystemUrl('https://sanjesh.org/search').allowed, true);
  assert.equal(isAllowedSystemUrl('https://my.gov.ir/api/health').allowed, true);
  assert.equal(isAllowedSystemUrl('https://sso.tamin.ir/login').allowed, true);
  assert.equal(isAllowedSystemUrl('https://sakha.epolice.ir').allowed, true);

  // Blocked SSRF vectors
  assert.equal(isAllowedSystemUrl('http://localhost:3000').allowed, false);
  assert.equal(isAllowedSystemUrl('http://127.0.0.1:80').allowed, false);
  assert.equal(isAllowedSystemUrl('http://169.254.169.254/computeMetadata/v1/').allowed, false);
  assert.equal(isAllowedSystemUrl('http://192.168.1.1').allowed, false);
  assert.equal(isAllowedSystemUrl('http://10.0.0.1/admin').allowed, false);
  assert.equal(isAllowedSystemUrl('ftp://sanjesh.org').allowed, false);
  assert.equal(isAllowedSystemUrl('https://random-untrusted-site.com').allowed, false);
});

test('generateOfflineContent formats telegram and instagram templates with custom variables', () => {
  const text = generateOfflineContent('telegram_notice', {
    title: 'استخدام آموزش و پرورش',
    org: 'وزارت آموزش و پرورش',
    deadline: '۱۴۰۵/۰۸/۱۰',
    cafeName: 'کافی‌نت طلایی',
    phone: '۰۲۱۸۸۸۸۸۸۸۸',
  });

  assert.ok(text.includes('استخدام آموزش و پرورش'));
  assert.ok(text.includes('وزارت آموزش و پرورش'));
  assert.ok(text.includes('کافی‌نت طلایی'));
});
