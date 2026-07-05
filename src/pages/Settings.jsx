import { createClient } from "@supabase/supabase-js"
import { useState, useEffect } from "react"

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
)

export default function Settings() {
  const [stats, setStats] = useState({ equipos: 0, jugadores: 0, partidos: 0, goles: 0, posiciones: 0 })
  const [conexion, setConexion] = useState("verificando")
  const [exportando, setExportando] = useState(null)
  const [actualizando, setActualizando] = useState(false)

  useEffect(() => {
    verificarConexion()
    cargarStats()
  }, [])

  async function verificarConexion() {
    const { error } = await supabase.from("equipos").select("id").limit(1)
    setConexion(error ? "error" : "conectado")
  }

  async function cargarStats() {
    setActualizando(true)
    const tablas = ["equipos", "jugadores", "partidos", "goles", "posiciones_por_grupo"]
    const resultados = await Promise.all(
      tablas.map(t => supabase.from(t).select("*", { count: "exact", head: true }))
    )
    setStats({
      equipos:    resultados[0].count ?? 0,
      jugadores:  resultados[1].count ?? 0,
      partidos:   resultados[2].count ?? 0,
      goles:      resultados[3].count ?? 0,
      posiciones: resultados[4].count ?? 0,
    })
    setActualizando(false)
  }

  async function exportarCSV(tabla, nombre) {
    setExportando(tabla)
    const { data, error } = await supabase.from(tabla).select("*")
    if (error) { alert("Error al exportar: " + error.message); setExportando(null); return }
    if (!data || data.length === 0) { alert("No hay datos para exportar en " + nombre); setExportando(null); return }

    const headers = Object.keys(data[0]).join(",")
    const filas = data.map(row => Object.values(row).map(v => `"${v ?? ""}"`).join(",")).join("\n")
    const csv = `${headers}\n${filas}`

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${nombre}.csv`
    link.click()
    URL.revokeObjectURL(url)
    setExportando(null)
  }

  const tablas = [
    { key: "equipos",              nombre: "Equipos",    count: stats.equipos,    color: "blue"   },
    { key: "jugadores",            nombre: "Jugadores",  count: stats.jugadores,  color: "violet" },
    { key: "partidos",             nombre: "Partidos",   count: stats.partidos,   color: "green"  },
    { key: "goles",                nombre: "Goles",      count: stats.goles,      color: "red"    },
    { key: "posiciones_por_grupo", nombre: "Posiciones", count: stats.posiciones, color: "orange" },
  ]

  const colores = {
    blue:   { bg: "bg-blue-50",   text: "text-blue-700",   badge: "bg-blue-600"   },
    violet: { bg: "bg-violet-50", text: "text-violet-700", badge: "bg-violet-600" },
    green:  { bg: "bg-green-50",  text: "text-green-700",  badge: "bg-green-600"  },
    red:    { bg: "bg-red-50",    text: "text-red-700",    badge: "bg-red-600"    },
    orange: { bg: "bg-orange-50", text: "text-orange-700", badge: "bg-orange-600" },
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? ""
  const keyPreview = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "").slice(0, 24) + "••••••••"

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Settings</h1>

      {/* CONEXIÓN SUPABASE */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          🔌 Conexión Supabase
        </h2>
        <div className="flex items-center gap-3 mb-4">
          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
            conexion === "conectado" ? "bg-green-100 text-green-700" :
            conexion === "error"     ? "bg-red-100 text-red-700"     :
                                       "bg-gray-100 text-gray-500"
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              conexion === "conectado" ? "bg-green-500" :
              conexion === "error"     ? "bg-red-500"   : "bg-gray-400"
            }`}></span>
            {conexion === "conectado" ? "Conectado" : conexion === "error" ? "Sin conexión" : "Verificando..."}
          </span>
        </div>
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-lg px-4 py-3">
            <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Project URL</p>
            <p className="text-sm font-mono text-gray-800 break-all">{supabaseUrl}</p>
          </div>
          <div className="bg-gray-50 rounded-lg px-4 py-3">
            <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Publishable Key</p>
            <p className="text-sm font-mono text-gray-800">{keyPreview}</p>
          </div>
        </div>
      </div>

      {/* INDICADORES POR TABLA */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">📊 Registros por tabla</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {tablas.map(t => {
            const c = colores[t.color]
            return (
              <div key={t.key} className={`${c.bg} rounded-xl p-4 text-center`}>
                <p className={`text-3xl font-bold ${c.text}`}>{t.count}</p>
                <p className="text-xs text-gray-500 mt-1">{t.nombre}</p>
              </div>
            )
          })}
        </div>
        <button
          onClick={cargarStats}
          disabled={actualizando}
          className="mt-4 text-sm text-blue-600 hover:text-blue-800 underline disabled:opacity-50"
        >
          {actualizando ? "Actualizando..." : "Actualizar conteos"}
        </button>
      </div>

      {/* EXPORTAR CSV */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">📥 Exportar datos</h2>
        <p className="text-sm text-gray-500 mb-4">Descarga cualquier tabla como archivo CSV.</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {tablas.map(t => {
            const c = colores[t.color]
            const sinDatos = t.count === 0
            return (
              <button
                key={t.key}
                onClick={() => exportarCSV(t.key, t.nombre)}
                disabled={exportando === t.key || sinDatos}
                className={`flex items-center justify-between px-4 py-3 rounded-lg border border-gray-200 transition text-left ${
                  sinDatos ? "opacity-50 cursor-not-allowed" : "hover:border-blue-300 hover:bg-blue-50"
                } ${exportando === t.key ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">{t.nombre}</p>
                  <p className="text-xs text-gray-400">{t.count} registros</p>
                </div>
                <span className={`text-xs font-semibold text-white px-2 py-1 rounded-full ${sinDatos ? "bg-gray-400" : c.badge}`}>
                  {exportando === t.key ? "..." : sinDatos ? "—" : "CSV"}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}