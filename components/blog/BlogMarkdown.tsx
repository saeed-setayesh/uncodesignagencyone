import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Props {
  source: string
}

export default function BlogMarkdown({ source }: Props) {
  return (
    <div
      dir="rtl"
      className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900 prose-a:text-brand hover:prose-a:text-brand-dark prose-code:text-gray-800 prose-pre:bg-gray-100"
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{source}</ReactMarkdown>
    </div>
  )
}
