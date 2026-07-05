import { createClient } from "@supabase/supabase-js"
import { useState, useEffect } from "react"
import ImagenModal from "../components/ImagenModal"

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
)

export default function Goleadores() {
  const [goles, setGoles] = useState([])
  const [jugadores, setJugadores] = useState([])
  const [partidos, setPartidos] = useState([])
  const [busqueda, setBusqueda] = useState("")
  const [modalImg, setModalImg] = useState(null)
  const [modalAlt, setModalAlt] = useState("")

  const [jugadorId, setJugadorId] = useState("")
  const [partidoId, setPartidoId] = useState("")
  const [minuto, setMinuto] = useState("")
  const [esPenal, setEsPenal] = useState(false)

  const [editandoId, setEditandoId] = useState(null)
  const [editMinuto, setEditMinuto] = useState("")
  const [editEsPenal, setEditEsPenal] = useState(false)

  useEffect(() => { getGoles(); getJugadores(); getPartidos() }, [])

  async function getGoles() {
    const { data, error } = await supabase
      .from("goles")
      .select("*, jugador:jugadores(nombre, imagen_url), partido:partidos(goles_local, goles_visitante, fase, local:equipos!local_id(nombre), visitante:equipos!visitante_id(nombre))")
      .order("minuto", { ascending: true })
    if (error) { console.error(error); return }
    setGoles(data)
  }

  async function getJugadores() {
    const { data, error } = await supabase.from("jugadores").select("id, nombre").order("nombre")
    if (error) { console.error(error); return }
    setJugadores(data)
  }

  async function getPartidos() {
    const { data, error } = await supabase
      .from("partidos")
      .select("id, fase, local:equipos!local_id(nombre), visitante:equipos!visitante_id(nombre)")
    if (error) { console.error(error); return }
    setPartidos(data)
  }

  const golesFiltrados = goles.filter(g =>
    g.jugador?.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    g.partido?.local?.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    g.partido?.visitante?.nombre?.toLowerCase().includes(busqueda.toLowerCase())
  )

  async function agregarGol(e) {
    e.preventDefault()
    const { error } = await supabase.from("goles").insert({
      jugador_id: Number(jugadorId), partido_id: Number(partidoId),
      minuto: Number(minuto), es_penal: esPenal
    })
    if (error) { alert("Error: " + error.message); return }
    setJugadorId(""); setPartidoId(""); setMinuto(""); setEsPenal(false)
    getGoles()
  }

  function iniciarEdicion(gol) {
    setEditandoId(gol.id); setEditMinuto(gol.minuto); setEditEsPenal(gol.es_penal)
  }

  async function guardarEdicion(id) {
    const { error } = await supabase.from("goles").update({
      minuto: Number(editMinuto), es_penal: editEsPenal
    }).eq("id", id)
    if (error) { alert("Error: " + error.message); return }
    setEditandoId(null); getGoles()
  }

  async function eliminarGol(id) {
    if (!confirm("¿Eliminar este gol?")) return
    const { error } = await supabase.from("goles").delete().eq("id", id)
    if (error) { alert("Error: " + error.message); return }
    getGoles()
  }

  const ranking = Object.values(
    goles.reduce((acc, g) => {
      const nombre = g.jugador?.nombre ?? "Desconocido"
      const img = g.jugador?.imagen_url ?? null
      if (!acc[nombre]) acc[nombre] = { nombre, img, goles: 0, penales: 0 }
      acc[nombre].goles++
      if (g.es_penal) acc[nombre].penales++
      return acc
    }, {})
  ).sort((a, b) => b.goles - a.goles)

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <ImagenModal src={modalImg} alt={modalAlt} onClose={() => setModalImg(null)} />
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Goleadores</h1>

      <div className="bg-white rounded-xl shadow p-5 mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">🏆 Ranking de Goleadores</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {ranking.slice(0, 8).map((g, i) => (
            <div key={g.nombre} className={`rounded-lg p-3 flex items-center gap-3 ${i === 0 ? "bg-yellow-50 border border-yellow-200" : "bg-gray-50"}`}>
              <span className={`text-lg font-bold ${i === 0 ? "text-yellow-500" : i === 1 ? "text-gray-400" : i === 2 ? "text-amber-600" : "text-gray-500"}`}>#{i + 1}</span>
              {g.img
                ? <img src={g.img} alt={g.nombre} className="w-8 h-8 rounded-full object-cover border cursor-pointer hover:opacity-80" onClick={() => { setModalImg(g.img); setModalAlt(g.nombre) }} />
                : <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">—</div>}
              <div>
                <p className="font-medium text-gray-800 text-sm">{g.nombre}</p>
                <p className="text-xs text-gray-500">{g.goles} gol{g.goles !== 1 ? "es" : ""} {g.penales > 0 ? `(${g.penales}p)` : ""}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-5 mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Registrar Gol</h2>
        <form onSubmit={agregarGol} className="grid grid-cols-2 gap-3 md:grid-cols-5">
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={jugadorId} onChange={e => setJugadorId(e.target.value)} required>
            <option value="">Jugador</option>
            {jugadores.map(j => <option key={j.id} value={j.id}>{j.nombre}</option>)}
          </select>
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={partidoId} onChange={e => setPartidoId(e.target.value)} required>
            <option value="">Partido</option>
            {partidos.map(p => <option key={p.id} value={p.id}>{p.local?.nombre} vs {p.visitante?.nombre}</option>)}
          </select>
          <input className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" type="number" placeholder="Minuto" value={minuto} onChange={e => setMinuto(e.target.value)} required />
          <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm cursor-pointer">
            <input type="checkbox" checked={esPenal} onChange={e => setEsPenal(e.target.checked)} /> Es Penal
          </label>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-4 py-2 text-sm transition">+ Registrar</button>
        </form>
      </div>

      {/* BUSCADOR */}
      <div className="mb-4">
        <input
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="🔍 Buscar por jugador o equipo..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Foto</th>
              <th className="px-4 py-3 text-left">Jugador</th>
              <th className="px-4 py-3 text-left">Partido</th>
              <th className="px-4 py-3 text-center">Minuto</th>
              <th className="px-4 py-3 text-center">Penal</th>
              <th className="px-4 py-3 text-center">Opciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {golesFiltrados.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-400">No se encontraron resultados</td></tr>
            ) : golesFiltrados.map(g => (
              <tr key={g.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3">
                  {g.jugador?.imagen_url
                    ? <img src={g.jugador.imagen_url} alt={g.jugador.nombre} className="w-10 h-10 rounded-full object-cover border cursor-pointer hover:opacity-80" onClick={() => { setModalImg(g.jugador.imagen_url); setModalAlt(g.jugador.nombre) }} />
                    : <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">—</div>}
                </td>
                {editandoId === g.id ? (
                  <>
                    <td className="px-4 py-2 font-medium">{g.jugador?.nombre}</td>
                    <td className="px-4 py-2 text-gray-500 text-xs">{g.partido?.local?.nombre} vs {g.partido?.visitante?.nombre}</td>
                    <td className="px-4 py-2 text-center"><input className="border rounded px-2 py-1 text-sm w-16 text-center" type="number" value={editMinuto} onChange={e => setEditMinuto(e.target.value)} /></td>
                    <td className="px-4 py-2 text-center"><input type="checkbox" checked={editEsPenal} onChange={e => setEditEsPenal(e.target.checked)} /></td>
                    <td className="px-4 py-2 text-center space-x-2">
                      <button onClick={() => guardarEdicion(g.id)} className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded-lg transition">Guardar</button>
                      <button onClick={() => setEditandoId(null)} className="bg-gray-300 hover:bg-gray-400 text-gray-700 text-xs px-2 py-1 rounded-lg transition">Cancelar</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3 font-medium text-gray-800">{g.jugador?.nombre}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{g.partido?.local?.nombre} vs {g.partido?.visitante?.nombre}</td>
                    <td className="px-4 py-3 text-center"><span className="bg-gray-100 text-gray-700 text-xs font-semibold px-2 py-1 rounded-full">{g.minuto}'</span></td>
                    <td className="px-4 py-3 text-center">{g.es_penal ? <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full">Penal</span> : "—"}</td>
                    <td className="px-4 py-3 text-center space-x-2">
                      <button onClick={() => iniciarEdicion(g)} className="bg-yellow-400 hover:bg-yellow-500 text-white text-xs px-3 py-1 rounded-lg transition">Editar</button>
                      <button onClick={() => eliminarGol(g.id)} className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-lg transition">Eliminar</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}