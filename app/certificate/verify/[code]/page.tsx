import Link from 'next/link'
import type { ReactNode } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import {
  getTrainingCertificateByTrackingNumber,
  getTrainingCertificateVerifyUrl,
  UNCODesign_CERT_REFERENCE,
} from '@/lib/training-certificate'
import type { Metadata } from 'next'

function formatDateEn(d: Date): string {
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>
}): Promise<Metadata> {
  const { code } = await params
  const cert = await getTrainingCertificateByTrackingNumber(decodeURIComponent(code))
  return {
    title: cert
      ? `Valid Certificate — ${cert.trackingNumber}`
      : 'Certificate Not Found — Uncodesign',
  }
}

function DetailItem({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <dt className="text-xs font-semibold uppercase tracking-wide text-green-800/70">{label}</dt>
      <dd className="font-semibold text-green-950 leading-relaxed">{children}</dd>
    </div>
  )
}

export default async function CertificateVerifyCodePage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params
  const decodedCode = decodeURIComponent(code)
  const cert = await getTrainingCertificateByTrackingNumber(decodedCode)

  return (
    <>
      <Navbar />
      <main className="min-h-[70vh] bg-gray-50 py-16" dir="ltr" lang="en">
        <div className="max-w-3xl mx-auto px-4">
          <div
            className={`rounded-2xl border shadow-sm p-8 md:p-10 ${
              cert ? 'bg-green-50 border-green-200' : 'bg-white border-gray-100'
            }`}
          >
            {cert ? (
              <div className="space-y-10">
                <div className="flex items-start gap-4">
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-600 text-white text-xl shrink-0">
                    ✓
                  </span>
                  <div className="space-y-2 min-w-0">
                    <h1 className="text-2xl md:text-3xl font-extrabold text-green-900">
                      Valid Certificate
                    </h1>
                    <p className="text-green-800 text-sm md:text-base leading-relaxed">
                      This Uncodesign training certificate is authentic and registered in our system.
                    </p>
                  </div>
                </div>

                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8 text-sm md:text-base">
                  <DetailItem label="Student">{cert.studentName}</DetailItem>
                  <DetailItem label="Instructor">{cert.teacherName}</DetailItem>
                  <DetailItem label="Course">{cert.courseTitle}</DetailItem>
                  <DetailItem label="Issue Date">
                    {formatDateEn(new Date(cert.issuedAt))}
                  </DetailItem>
                  <div className="sm:col-span-2">
                    <DetailItem label="Duration & Schedule">{cert.durationText}</DetailItem>
                  </div>
                  <div className="sm:col-span-2">
                    <DetailItem label="Certificate ID">
                      <span className="font-mono tracking-wide">{cert.trackingNumber}</span>
                    </DetailItem>
                  </div>
                  <div className="sm:col-span-2">
                    <DetailItem label="Skill / Specialization">
                      <span className="break-words">{cert.skillTitle}</span>
                    </DetailItem>
                  </div>
                </dl>

                <div className="pt-8 border-t border-green-200/80 space-y-4">
                  <p className="text-sm font-medium text-green-900">Verification link</p>
                  <a
                    href={getTrainingCertificateVerifyUrl(cert.trackingNumber)}
                    className="block rounded-xl border border-green-300 bg-white/80 px-5 py-4 text-sm font-mono font-semibold text-brand break-all hover:bg-white transition-colors"
                  >
                    {getTrainingCertificateVerifyUrl(cert.trackingNumber)}
                  </a>
                </div>

                <div className="pt-8 border-t border-green-200/80 space-y-4">
                  <p className="text-sm font-semibold text-green-900">Issued by Uncodesign</p>
                  <div className="rounded-xl bg-white/70 border border-green-100 px-5 py-5 space-y-3 text-sm text-green-900/85 leading-relaxed">
                    <p className="font-semibold text-green-950">{UNCODesign_CERT_REFERENCE.legalName}</p>
                    <p>Phone: {UNCODesign_CERT_REFERENCE.phone}</p>
                    <p>Telegram: {UNCODesign_CERT_REFERENCE.telegram}</p>
                    <p>Postal Code: {UNCODesign_CERT_REFERENCE.postalCode}</p>
                    <p>{UNCODesign_CERT_REFERENCE.address}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <h1 className="text-2xl font-extrabold text-gray-900">Certificate Not Found</h1>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                  No certificate matches ID{' '}
                  <span className="font-mono font-semibold">{decodedCode}</span>. Please check the
                  ID and try again.
                </p>
                <Link
                  href="/certificate/verify"
                  className="inline-flex text-brand font-semibold hover:text-brand-dark text-sm"
                >
                  Search again
                </Link>
              </div>
            )}
          </div>

          <p className="text-center mt-8 text-sm text-gray-500">
            <Link href="/certificate/verify" className="text-brand hover:text-brand-dark">
              Verify another certificate
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
