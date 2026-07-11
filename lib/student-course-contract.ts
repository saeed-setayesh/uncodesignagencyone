export const STUDENT_CONTRACT_VERSION = '2026-06-05-v1'

export const STUDENT_CONTRACT_FA = `قرارداد دوره آموزشی — آنکو دیزاین

۱. طرفین: ارائه‌دهنده آموزش («آنکو دیزاین») و دانشجو که با ورود به پنل دانشجو هویت خود را تأیید کرده است.

۲. موضوع: برگزاری دوره «{courseTitle}» به تعداد {sessionCount} جلسه، مطابق برنامه زمانی اعلام‌شده در پنل.

۳. مبلغ و پرداخت: مبلغ کل دوره {priceToman} تومان است. پرداخت طبق روش انتخابی (یک‌جا یا دو قسط) و از طریق کارت بانکی اعلام‌شده توسط مربی انجام می‌شود؛ فعال‌سازی دوره پس از تأیید پرداخت توسط مدیریت است.

۴. مربی: نام مربی دوره «{teacherName}» است. تماس و هماهنگی جلسات فقط از کانال‌های اعلام‌شده در پنل انجام می‌شود.

۵. حضور: غیبت یا تأخیر بیش از ۱۵ دقیقه بدون هماهندی قبلی، جلسه محسوب نمی‌شود و جبران آن در اختیار مربی است.

۶. لغو و استرداد: قبل از شروع دوره، درخواست لغو با هماهنگی پشتیبانی بررسی می‌شود. پس از شروع، استرداد جزئی یا کامل مطابق تصمیم مدیریت و قوانین جاری است.

۷. محرمانگی: مطالب آموزشی و اطلاعات طرف مقابل محرمانه است و بدون اجازه منتشر نمی‌شود.

۸. پذیرش الکترونیکی: با تأیید این متن در پنل، دانشجو اعلام می‌کند شرایط را مطالعه و می‌پذیرد.

این متن خلاصه قرارداد است؛ در صورت اختلاف، نسخه تأییدشده در سیستم معتبر است.
`

export function renderStudentContract(vars: {
  courseTitle: string
  sessionCount: number
  priceToman: number
  teacherName: string
}): string {
  const price = vars.priceToman.toLocaleString('fa-IR')
  return STUDENT_CONTRACT_FA.replace(/\{courseTitle\}/g, vars.courseTitle)
    .replace(/\{sessionCount\}/g, String(vars.sessionCount))
    .replace(/\{priceToman\}/g, price)
    .replace(/\{teacherName\}/g, vars.teacherName || '—')
}
