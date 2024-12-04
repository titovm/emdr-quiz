import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export default function Layout({ children }) {
    return (
      <div className={`min-h-screen flex flex-col ${inter.className}`}>
      {/* Header */}
      <header className="bg-green-700 text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-extrabold tracking-tight">
            <a href="/" className="hover:text-green-100 transition-colors">EMDR Тест</a>
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto md:px-4 py-12">
        <div className="bg-white rounded-2xl shadow-2xl py-6 px-2 md:px-8 max-w-3xl mx-auto">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-green-700 text-white py-4">
        <div className="container mx-auto px-4 text-center text-sm">
          &copy; {new Date().getFullYear()} Ассоциация EMDR России
        </div>
      </footer>
    </div>
    );
  }