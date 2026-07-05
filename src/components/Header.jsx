import { Menu } from 'lucide-react'
import { useAuth } from "../context/AuthContext"

export default function Header({ onMenuClick }) {
  const { session, logout } = useAuth()

  return (
    <header className="bg-surface-container-lowest border-b border-outline-variant shadow-sm sticky top-0 z-20 flex justify-between items-center h-16 px-4 md:px-6">
      <div className="flex items-center gap-3">
        {/* Botón hamburguesa solo en móvil */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition"
        >
          <Menu size={22} />
        </button>
        <h2 className="text-headline-sm font-black text-primary">2026 FIFA World Cup</h2>
      </div>
      <div className="flex items-center gap-3">
        {session && (
          <span className="text-xs text-gray-500 hidden md:block">{session.user.email}</span>
        )}
        <div className="w-8 h-8 rounded-full bg-primary-container overflow-hidden border border-outline-variant flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-sm">person</span>
        </div>
        <button
          onClick={logout}
          className="text-xs text-gray-500 hover:text-red-500 flex items-center gap-1 transition"
        >
          <span className="material-symbols-outlined text-sm">logout</span>
          <span className="hidden md:block">Salir</span>
        </button>
      </div>
    </header>
  )
}