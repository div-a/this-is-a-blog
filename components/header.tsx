import Link from 'next/link'

const Header = () => {
  return (
    <h2 className="text-xl font-bold tracking-tight  leading-tight mb-20 mt-8">
      <Link href="/" className="hover:underline">
          {"< Back"}
      </Link>
    </h2>
  )
}

export default Header
