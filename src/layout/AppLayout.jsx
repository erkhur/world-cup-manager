import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-surface">
      <Sidebar />
      <div className="ml-64 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
        <footer className="ml-0 border-t border-gray-100 py-4 px-6 flex items-center justify-center gap-2 text-xs text-gray-400">
          <span>Desarrollado por</span>
          <span className="font-semibold text-gray-600">Coderk</span>
          <a
            href="https://github.com/erkhur"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center hover:text-gray-700 transition"
            title="GitHub Coderk"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
          </a>
          <span>·</span>
          <span>2026</span>
          <span>™</span>
          <span>·</span>
          <span>Soporte:</span>
          <a
            href="mailto:erkhur@gmail.com"
            className="text-gray-500 hover:text-gray-700 transition underline"
          >
            erkhur@gmail.com
          </a>
        </footer>
      </div>
    </div>
  )
}