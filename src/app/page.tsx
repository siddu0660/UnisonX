import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            UnisonX
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Create music no matter what
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/generate"
              className="inline-block bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold py-3 px-8 rounded-full hover:opacity-90 transition-opacity"
            >
              Generate
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
