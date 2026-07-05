import { createClient } from "@supabase/supabase-js"
import { useState, useEffect } from "react"
import { Shield, Users, Swords, Trophy, TrendingUp } from "lucide-react"

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
)

export default function Dashboard() {
  const [stats, setStats] = useState({ equipos: 0, jugadores: 0, partidos: 0, goles: 0, promedio: "0.00" })
  const [ultimosPartidos, setUltimosPartidos] = useState([])

  useEffect(() => { cargarStats(); cargarUltimosPartidos() }, [])

  async function cargarStats() {
    const [eq, jug, par, gol] = await Promise.all([
      supabase.from("equipos").select("*", { count: "exact", head: true }),
      supabase.from("jugadores").select("*", { count: "exact", head: true }),
      supabase.from("partidos").select("*", { count: "exact", head: true }),
      supabase.from("goles").select("*", { count: "exact", head: true }),
    ])
    const totalGoles = gol.count ?? 0
    const totalPartidos = par.count ?? 0
    setStats({
      equipos: eq.count ?? 0, jugadores: jug.count ?? 0,
      partidos: totalPartidos, goles: totalGoles,
      promedio: totalPartidos > 0 ? (totalGoles / totalPartidos).toFixed(2) : "0.00"
    })
  }

  async function cargarUltimosPartidos() {
    const { data, error } = await supabase
      .from("partidos")
      .select("*, local:equipos!local_id(nombre, imagen_url), visitante:equipos!visitante_id(nombre, imagen_url)")
      .order("fecha", { ascending: false })
      .limit(5)
    if (error) { console.error(error); return }
    setUltimosPartidos(data)
  }

  const cards = [
    { icon: Shield,     label: "Total Equipos",       value: stats.equipos    },
    { icon: Users,      label: "Total Jugadores",     value: stats.jugadores  },
    { icon: Swords,     label: "Total Partidos",      value: stats.partidos   },
    { icon: Trophy,     label: "Total Goles",         value: stats.goles      },
    { icon: TrendingUp, label: "Prom. Goles/Partido", value: stats.promedio   },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-display-lg text-primary">Dashboard</h2>
        <p className="text-body-lg text-on-surface-variant mt-1">Resumen del torneo</p>
      </div>

      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.label} className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
              <div className="w-9 h-9 rounded-lg bg-primary-fixed text-primary flex items-center justify-center mb-3">
                <Icon size={18} />
              </div>
              <p className="text-caption text-on-surface-variant uppercase tracking-wider text-xs">{card.label}</p>
              <p className="text-display-lg text-primary mt-1">{card.value}</p>
            </div>
          )
        })}
      </section>

      <section>
        <h3 className="text-headline-md text-on-surface mb-4">Últimos Partidos</h3>

        {/* Desktop */}
        <div className="hidden md:block bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-surface-container text-caption text-on-surface-variant uppercase tracking-wider border-b border-outline-variant">
            <div className="col-span-2">Fecha</div>
            <div className="col-span-6 text-center">Partido</div>
            <div className="col-span-2 text-center">Fase</div>
            <div className="col-span-2 text-right">Resultado</div>
          </div>
          {ultimosPartidos.length === 0 ? (
            <div className="px-6 py-8 text-center text-on-surface-variant text-body-md">No hay partidos registrados aún</div>
          ) : ultimosPartidos.map((p) => (
            <div key={p.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center border-b border-outline-variant last:border-0 hover:bg-surface-container-low transition-colors">
              <div className="col-span-2 text-body-md text-on-surface-variant">{p.fecha ? new Date(p.fecha).toLocaleDateString("es-PE") : "—"}</div>
              <div className="col-span-6 flex justify-center items-center gap-2">
                {p.local?.imagen_url && <img src={p.local.imagen_url} alt={p.local.nombre} className="w-6 h-6 rounded object-cover" />}
                <span className="text-body-md font-medium text-on-surface">{p.local?.nombre}</span>
                <span className="text-headline-sm text-primary font-bold bg-primary-fixed px-3 py-1 rounded">{p.goles_local} - {p.goles_visitante}</span>
                <span className="text-body-md font-medium text-on-surface">{p.visitante?.nombre}</span>
                {p.visitante?.imagen_url && <img src={p.visitante.imagen_url} alt={p.visitante.nombre} className="w-6 h-6 rounded object-cover" />}
              </div>
              <div className="col-span-2 text-center"><span className="text-caption bg-surface-container-high text-on-surface-variant px-2 py-1 rounded-full">{p.fase}</span></div>
              <div className="col-span-2 text-right"><span className="text-caption text-on-surface-variant">FT</span></div>
            </div>
          ))}
        </div>

        {/* Móvil - tarjetas */}
        <div className="md:hidden flex flex-col gap-3">
          {ultimosPartidos.length === 0 ? (
            <p className="text-center text-gray-400 py-6">No hay partidos registrados aún</p>
          ) : ultimosPartidos.map((p) => (
            <div key={p.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">{p.fecha ? new Date(p.fecha).toLocaleDateString("es-PE") : "—"}</span>
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{p.fase}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1">
                  {p.local?.imagen_url && <img src={p.local.imagen_url} alt={p.local.nombre} className="w-7 h-7 rounded object-cover" />}
                  <span className="text-sm font-medium text-gray-800 truncate">{p.local?.nombre}</span>
                </div>
                <span className="text-primary font-bold bg-primary-fixed px-3 py-1 rounded text-sm whitespace-nowrap">{p.goles_local} - {p.goles_visitante}</span>
                <div className="flex items-center gap-2 flex-1 justify-end">
                  <span className="text-sm font-medium text-gray-800 truncate">{p.visitante?.nombre}</span>
                  {p.visitante?.imagen_url && <img src={p.visitante.imagen_url} alt={p.visitante.nombre} className="w-7 h-7 rounded object-cover" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}