const ENAMAD_HREF =
  'https://trustseal.enamad.ir/?id=726729&Code=klUNleo2O1bhQZB6YUWt9R0dMw4qLOAk'
const ENAMAD_IMG =
  'https://trustseal.enamad.ir/logo.aspx?id=726729&Code=klUNleo2O1bhQZB6YUWt9R0dMw4qLOAk'

type Props = {
  className?: string
}

export function EnamadTrustSeal({ className }: Props) {
  return (
    <a
      referrerPolicy="origin"
      target="_blank"
      rel="noopener noreferrer"
      href={ENAMAD_HREF}
      className={className}
    >
      <img
        referrerPolicy="origin"
        src={ENAMAD_IMG}
        alt="نماد اعتماد الکترونیکی — اینماد"
        className="cursor-pointer max-h-[120px] w-auto h-auto"
      />
    </a>
  )
}
