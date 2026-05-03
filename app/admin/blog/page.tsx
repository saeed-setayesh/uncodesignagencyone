import Link from 'next/link'
import { desc, eq } from 'drizzle-orm'
import { blogPost, db, service as serviceTable } from '@/lib/db'

export const revalidate = 0

export default async function AdminBlogPage() {
  const [posts, services] = await Promise.all([
    db.select().from(blogPost).orderBy(desc(blogPost.updatedAt)),
    db
      .select({ slug: serviceTable.slug, fa: serviceTable.fa })
      .from(serviceTable)
      .where(eq(serviceTable.active, true)),
  ])
  const serviceFa = Object.fromEntries(services.map((s) => [s.slug, s.fa]))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">وبلاگ</h2>
          <p className="text-sm text-gray-500 mt-1">{posts.length} مطلب</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-dark transition-colors"
        >
          + مطلب جدید
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-right px-5 py-3 text-gray-600 font-medium">عنوان</th>
              <th className="text-right px-5 py-3 text-gray-600 font-medium">دسته</th>
              <th className="text-right px-5 py-3 text-gray-600 font-medium">اسلاگ</th>
              <th className="text-right px-5 py-3 text-gray-600 font-medium">وضعیت</th>
              <th className="text-right px-5 py-3 text-gray-600 font-medium">به‌روزرسانی</th>
              <th className="text-right px-5 py-3 text-gray-600 font-medium">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50">
                <td className="px-5 py-3 font-medium text-gray-900 max-w-[200px] truncate">{post.title}</td>
                <td className="px-5 py-3 text-gray-600">
                  {serviceFa[post.serviceCategory] ?? post.serviceCategory}
                </td>
                <td className="px-5 py-3 text-gray-500 font-mono text-xs">{post.slug}</td>
                <td className="px-5 py-3">
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
                      post.published ? 'bg-brand-light text-brand-dark' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${post.published ? 'bg-brand' : 'bg-gray-400'}`}
                    />
                    {post.published ? 'منتشر شده' : 'پیش‌نویس'}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-500 text-xs whitespace-nowrap">
                  {new Date(post.updatedAt).toLocaleDateString('fa-IR')}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/blog/${post.id}/edit`}
                      className="text-brand hover:underline text-xs"
                    >
                      ویرایش
                    </Link>
                    {post.published ? (
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="text-gray-400 hover:text-gray-600 text-xs"
                      >
                        مشاهده
                      </Link>
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
