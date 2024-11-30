// components/Layout.js
export default function Layout({ children }) {
    return (
      <div className="min-h-screen flex flex-col font-sans">
        {/* Header */}
        <header className="bg-green-700 text-white py-4 shadow">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold">
              <a href="/">EMDR Тест</a>
            </h1>
          </div>
        </header>
  
        {/* Main Content */}
        <main className="flex-grow container mx-auto px-4 py-6 my-6 md:w-2/3 rounded-xl shadow-xl">
          {children}
        </main>
  
        {/* Footer */}
        <footer className="bg-green-700 text-white py-4">
          <div className="container mx-auto px-4 text-center">
            &copy; {new Date().getFullYear()} Ассоциация EMDR России
          </div>
        </footer>
      </div>
    );
  }