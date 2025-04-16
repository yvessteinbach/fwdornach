import Image from "next/image"

export default function StatistikPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold">Nothing here yet</h1>
      <div className="relative h-32 w-32">
        <Image
          src="/logo.png" // Path to your logo in public folder
          alt="Logo"
          fill
          className="object-contain"
        />
      </div>
    </div>
  )
}