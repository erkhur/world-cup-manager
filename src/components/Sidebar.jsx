import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Shield, Users, Swords, TableProperties, Trophy, BarChart2, Settings, X } from 'lucide-react'

const navLinks = [
  { to: '/',              icon: LayoutDashboard, label: 'Dashboard'    },
  { to: '/equipos',       icon: Shield,          label: 'Equipos'      },
  { to: '/jugadores',     icon: Users,           label: 'Jugadores'    },
  { to: '/partidos',      icon: Swords,          label: 'Partidos'     },
  { to: '/posiciones',    icon: TableProperties, label: 'Posiciones'   },
  { to: '/goleadores',    icon: Trophy,          label: 'Goleadores'   },
  { to: '/estadisticas',  icon: BarChart2,       label: 'Estadísticas' },
]

export default function Sidebar({ open, onClose }) {
  const location = useLocation()

  return (
    <aside className={`
      h-screen w-64 fixed left-0 top-0 bg-surface-container-lowest border-r border-outline-variant shadow-sm flex flex-col py-6 z-40
      transition-transform duration-300
      ${open ? 'translate-x-0' : '-translate-x-full'}
      lg:translate-x-0
    `}>
      {/* Botón cerrar en móvil */}
      <button
        onClick={onClose}
        className="lg:hidden absolute top-4 right-4 p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition"
      >
        <X size={18} />
      </button>

      <div className="px-4 mb-8">
        <div className="flex items-center gap-3 mb-1">
          <img
            src="/wc2026.png"
            alt="2026 FIFA World Cup"
            className="w-16 h-20 object-contain flex-shrink-0"
          />
          <h1 className="text-display-sm font-bold text-primary leading-tight">
            2026 FIFA World Cup
          </h1>
        </div>
        <p className="text-caption text-on-surface-variant text-center mt-1">
          Canada · United States · Mexico
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 flex flex-col gap-1">
        {navLinks.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to
          return (
            <Link
              key={to}
              to={to}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors duration-200 text-body-md font-medium ${
                active
                  ? 'bg-primary text-on-primary'
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="px-4 mt-auto pt-4 border-t border-outline-variant">
        <Link
          to="/settings"
          onClick={onClose}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors duration-200 text-body-md font-medium ${
            location.pathname === '/settings'
              ? 'bg-primary text-on-primary'
              : 'text-on-surface-variant hover:bg-surface-container-high'
          }`}
        >
          <Settings size={20} />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  )
}