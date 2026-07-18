import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { TrainingCertificateVerifyForm } from '@/components/certificate/TrainingCertificateVerifyForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Verify Certificate — Uncodesign',
  description: 'Verify Uncodesign training certificates online using the certificate ID or QR code.',
}

export default function CertificateVerifyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-[70vh] bg-gray-50 py-16" dir="ltr" lang="en">
        <div className="max-w-xl mx-auto px-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-10 space-y-8">
            <div className="space-y-3">
              <h1 className="text-2xl font-extrabold text-gray-900">Certificate Verification</h1>
              <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                Enter the certificate ID printed on the PDF (format{' '}
                <span className="font-mono text-gray-700">UCD-2026-XXXXXXXX</span>) or scan the QR
                code on the certificate to confirm it is valid.
              </p>
            </div>
            <TrainingCertificateVerifyForm />
            <p className="text-xs text-gray-400 leading-relaxed">
              This verifies official Uncodesign admin-issued training certificates only.
            </p>
          </div>
          <p className="text-center mt-8 text-sm text-gray-500">
            <Link href="/" className="text-brand hover:text-brand-dark">
              Back to home
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
