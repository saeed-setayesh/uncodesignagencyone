import { Eye, ShieldCheck } from 'lucide-react'

/** تأکید بر پرداخت پس از دیدن خروجیٔ اول — بدون پیام پیش‌پرداخت اولیه در بازاریابی */
export default function PayAfterPreviewSection() {
  return (
    <section className="py-14 bg-white border-t border-slate-100" aria-label="شرایط پرداخت">
      <div className="max-w-4xl mx-auto px-4">
        <div className="rounded-2xl border border-brand/20 bg-gradient-to-br from-brand-light/90 to-white p-6 md:p-10 shadow-sm shadow-brand/5">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand/15 text-brand">
              <Eye className="w-7 h-7" aria-hidden />
            </div>
            <div className="flex-1 text-right" dir="rtl">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                ابتدا نسخهٔ اول را می‌بینید، سپس پرداخت می‌کنید
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6 text-sm md:text-base">
                کار را بدون دریافت پیش‌پرداخت از شما آغاز می‌کنیم؛ پس از اینکه نسخهٔ اولیهٔ قابل‌بررسی (طرح، لندینگ
                اولیه یا خروجیٔ هم‌عرض شده) را دیدید و با ادامهٔ مسیر موافق بودید، تسویه و مراحل بعدی را رسمی
                می‌کنیم. هدف این است با خیال راحت تصمیم بگیرید، نه با فشار مالی قبل از دیدن کار.
              </p>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex gap-2 justify-start items-start">
                  <ShieldCheck className="w-5 h-5 text-brand shrink-0 mt-0.5" aria-hidden />
                  <span>شروع پروژه بدون پیش‌پرداخت؛ قرارداد و فازها قبل از پرداخت شفاف است.</span>
                </li>
                <li className="flex gap-2 justify-start items-start">
                  <ShieldCheck className="w-5 h-5 text-brand shrink-0 mt-0.5" aria-hidden />
                  <span>پس از تأیید شما روی نسخهٔ اول، هماهنگی مالی و تحویل مراحل بعدی انجام می‌شود.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
