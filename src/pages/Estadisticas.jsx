import { createClient } from "@supabase/supabase-js"
import { useState, useEffect } from "react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from "recharts"

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
)

const COLORS = ["#4f46e5", "#7c3aed", "#2563eb", "#0891b2", "#059669", "#d97706", "#dc2626", "#db2777"]

export default function Estadisticas() {
  const [golesPorEquipo, setGolesPorEquipo] = useState([])
  const [golesPorFase, setGolesPorFase] = useState([])
  const [golesPorMinuto, setGolesPorMinuto] = useState([])
  const [topGoleadores, setTopGoleadores] = useState([])
  const [golesPorConfederacion, setGolesPorConfederacion] = useState([])

  useEffect(() => {
    cargarGolesPorEquipo()
    cargarGolesPorFase()
    cargarGolesPorMinuto()
    cargarTopGoleadores()
    cargarGolesPorConfederacion()
  }, [])

  async function cargarGolesPorEquipo() {
    const { data } = await supabase
      .from("partidos")
      .select("goles_local, goles_visitante, local:equipos!local_id(nombre), visitante:equipos!visitante_id(nombre)")

    if (!data) return
    const totales = {}
    data.forEach(p => {
      const local = p.local?.nombre
      const visitante = p.visitante?.nombre
      if (local) totales[local] = (totales[local] || 0) + p.goles_local
      if (visitante) totales[visitante] = (totales[visitante] || 0) + p.goles_visitante
    })
    const sorted = Object.entries(totales)
      .map(([equipo, goles]) => ({ equipo: equipo.length > 12 ? equipo.slice(0, 12) + "…" : equipo, goles }))
      .sort((a, b) => b.goles - a.goles)
      .slice(0, 10)
    setGolesPorEquipo(sorted)
  }

  async function cargarGolesPorFase() {
    const { data } = await supabase
      .from("partidos")
      .select("fase, goles_local, goles_visitante")

    if (!data) return
    const totales = {}
    data.forEach(p => {
      const fase = p.fase ?? "Sin fase"
      if (!totales[fase]) totales[fase] = { fase, goles: 0, partidos: 0 }
      totales[fase].goles += p.goles_local + p.goles_visitante
      totales[fase].partidos += 1
    })
    setGolesPorFase(Object.values(totales))
  }

  async function cargarGolesPorMinuto() {
    const { data } = await supabase.from("goles").select("minuto")
    if (!data) return
    const franjas = { "1-15": 0, "16-30": 0, "31-45": 0, "46-60": 0, "61-75": 0, "76-90": 0, "90+": 0 }
    data.forEach(g => {
      const m = g.minuto
      if (m <= 15) franjas["1-15"]++
      else if (m <= 30) franjas["16-30"]++
      else if (m <= 45) franjas["31-45"]++
      else if (m <= 60) franjas["46-60"]++
      else if (m <= 75) franjas["61-75"]++
      else if (m <= 90) franjas["76-90"]++
      else franjas["90+"]++
    })
    setGolesPorMinuto(Object.entries(franjas).map(([minuto, goles]) => ({ minuto, goles })))
  }

  async function cargarTopGoleadores() {
    const { data } = await supabase
      .from("goles")
      .select("jugador:jugadores(nombre, imagen_url)")

    if (!data) return
    const conteo = {}
    data.forEach(g => {
      const nombre = g.jugador?.nombre ?? "Desconocido"
      const img = g.jugador?.imagen_url ?? null
      if (!conteo[nombre]) conteo[nombre] = { nombre, img, goles: 0 }
      conteo[nombre].goles++
    })
    const sorted = Object.values(conteo).sort((a, b) => b.goles - a.goles).slice(0, 8)
    setTopGoleadores(sorted)
  }

  async function cargarGolesPorConfederacion() {
    const { data } = await supabase
      .from("partidos")
      .select("goles_local, goles_visitante, local:equipos!local_id(confederacion), visitante:equipos!visitante_id(confederacion)")

    if (!data) return
    const totales = {}
    data.forEach(p => {
      const lc = p.local?.confederacion
      const vc = p.visitante?.confederacion
      if (lc) totales[lc] = (totales[lc] || 0) + p.goles_local
      if (vc) totales[vc] = (totales[vc] || 0) + p.goles_visitante
    })
    setGolesPorConfederacion(Object.entries(totales).map(([name, value]) => ({ name, value })))
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Estadísticas</h1>
      <p className="text-sm text-gray-500 mb-8">Análisis del torneo en tiempo real</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* TOP 10 EQUIPOS GOLEADORES */}
        <div className="bg-white rounded-xl shadow p-5 md:col-span-2">
          <h2 className="text-base font-semibold text-gray-700 mb-4">⚽ Top 10 Equipos Goleadores</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={golesPorEquipo} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="equipo" tick={{ fontSize: 11 }} angle={-35} textAnchor="end" interval={0} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="goles" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* GOLES POR FASE */}
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-base font-semibold text-gray-700 mb-4">📊 Goles por Fase</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={golesPorFase} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="fase" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" interval={0} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="goles" fill="#7c3aed" radius={[4, 4, 0, 0]} name="Goles" />
              <Bar dataKey="partidos" fill="#c4b5fd" radius={[4, 4, 0, 0]} name="Partidos" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* GOLES POR CONFEDERACIÓN */}
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-base font-semibold text-gray-700 mb-4">🌍 Goles por Confederación</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={golesPorConfederacion} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                {golesPorConfederacion.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* GOLES POR MINUTO */}
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-base font-semibold text-gray-700 mb-4">⏱️ Goles por Franja de Minuto</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={golesPorMinuto} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="minuto" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="goles" stroke="#2563eb" strokeWidth={2} dot={{ fill: "#2563eb", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* TOP GOLEADORES */}
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-base font-semibold text-gray-700 mb-4">🏆 Top Goleadores</h2>
          <div className="space-y-3">
            {topGoleadores.map((g, i) => (
              <div key={g.nombre} className="flex items-center gap-3">
                <span className={`text-sm font-bold w-6 text-center ${i === 0 ? "text-yellow-500" : i === 1 ? "text-gray-400" : i === 2 ? "text-amber-600" : "text-gray-400"}`}>
                  {i + 1}
                </span>
                {g.img
                  ? <img src={g.img} alt={g.nombre} className="w-8 h-8 rounded-full object-cover border" />
                  : <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">—</div>}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{g.nombre}</p>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                    <div
                      className="bg-indigo-500 h-1.5 rounded-full"
                      style={{ width: `${(g.goles / (topGoleadores[0]?.goles || 1)) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-bold text-indigo-600">{g.goles}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}