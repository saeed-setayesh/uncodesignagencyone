import Link from 'next/link'
import { eq } from 'drizzle-orm'
import { notFound, redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { contractAcceptance, customerOrder, db } from '@/lib/db'
import { CONTRACT_TERMS_FA } from '@/lib/contract-terms'
import { ContractForm } from './ContractForm'

export default async function ContractPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  const [order] = await db
    .select()
    .from(customerOrder)
    .where(eq(customerOrder.id, id))
    .limit(1)
  if (!order || order.customerId !== session!.user!.id) notFound()
  if (order.status !== 'paid') {
    redirect(`/customer/orders/${id}`)
  }

  const [existing] = await db
    .select({ id: contractAcceptance.id })
    .from(contractAcceptance)
    .where(eq(contractAcceptance.orderId, id))
    .limit(1)
  if (existing) {
    redirect(`/customer/orders/${id}`)
  }

  return (
    <div dir="rtl" className="max-w-2xl">
      <Link href={`/customer/orders/${id}`} className="text-sm text-brand hover:underline mb-4 inline-block">
        ← بازگشت به سفارش
      </Link>
      <h2 className="text-xl font-bold text-gray-900 mb-4">قرارداد و شرایط</h2>
      <div className="bg-white rounded-xl border border-gray-100 p-6 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap max-h-[60vh] overflow-y-auto mb-2">
        {CONTRACT_TERMS_FA}
      </div>
      <ContractForm orderId={id} />
    </div>
  )
}
