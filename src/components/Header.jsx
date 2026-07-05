import { useAuth } from "../context/AuthContext"

export default function Header() {
  const { session, logout } = useAuth()

  return (
    <header className="bg-surface-container-lowest border-b border-outline-variant shadow-sm sticky top-0 z-50 flex justify-between items-center h-16 px-6">
      <h2 className="text-headline-sm font-black text-primary">
          2026 FIFA World Cup

      </h2>
      <div className="flex items-center gap-4">
        {session && (
          <span className="text-xs text-gray-500 hidden md:block">
            {session.user.email}
          </span>
        )}
        <div className="w-8 h-8 rounded-full bg-primary-container overflow-hidden border border-outline-variant flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-sm">
            person
          </span>
        </div>
        <button
          onClick={logout}
          className="text-xs text-gray-500 hover:text-red-500 flex items-center gap-1 transition"
        >
          <span className="material-symbols-outlined text-sm">logout</span>
          Salir
        </button>
      </div>
    </header>
  )
}