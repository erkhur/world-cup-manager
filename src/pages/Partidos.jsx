import { createClient } from "@supabase/supabase-js"
import { useState, useEffect } from "react"
import ImagenModal from "../components/ImagenModal"

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
)

export default function Partidos() {
  const [partidos, setPartidos] = useState([])
  const [equipos, setEquipos] = useState([])
  const [busqueda, setBusqueda] = useState("")
  const [modalImg, setModalImg] = useState(null)
  const [modalAlt, setModalAlt] = useState("")

  const [localId, setLocalId] = useState("")
  const [visitanteId, setVisitanteId] = useState("")
  const [golesLocal, setGolesLocal] = useState("")
  const [golesVisitante, setGolesVisitante] = useState("")
  const [fase, setFase] = useState("")
  const [fecha, setFecha] = useState("")

  const [editandoId, setEditandoId] = useState(null)
  const [editLocalId, setEditLocalId] = useState("")
  const [editVisitanteId, setEditVisitanteId] = useState("")
  const [editGolesLocal, setEditGolesLocal] = useState("")
  const [editGolesVisitante, setEditGolesVisitante] = useState("")
  const [editFase, setEditFase] = useState("")

  useEffect(() => { getPartidos(); getEquipos() }, [])

  async function getPartidos() {
    const { data, error } = await supabase
      .from("partidos")
      .select("*, local:equipos!local_id(nombre, imagen_url), visitante:equipos!visitante_id(nombre, imagen_url)")
      .order("fecha", { ascending: false })
    if (error) { console.error(error); return }
    setPartidos(data)
  }

  async function getEquipos() {
    const { data, error } = await supabase.from("equipos").select("id, nombre").order("nombre")
    if (error) { console.error(error); return }
    setEquipos(data)
  }

  const partidosFiltrados = partidos.filter(p =>
    p.local?.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.visitante?.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.fase?.toLowerCase().includes(busqueda.toLowerCase())
  )

  async function agregarPartido(e) {
    e.preventDefault()
    const { error } = await supabase.from("partidos").insert({
      local_id: Number(localId), visitante_id: Number(visitanteId),
      goles_local: Number(golesLocal), goles_visitante: Number(golesVisitante), fase, fecha
    })
    if (error) { alert("Error: " + error.message); return }
    setLocalId(""); setVisitanteId(""); setGolesLocal(""); setGolesVisitante(""); setFase(""); setFecha("")
    getPartidos()
  }

  function iniciarEdicion(p) {
    setEditandoId(p.id); setEditLocalId(p.local_id); setEditVisitanteId(p.visitante_id)
    setEditGolesLocal(p.goles_local); setEditGolesVisitante(p.goles_visitante); setEditFase(p.fase)
  }

  async function guardarEdicion(id) {
    const { error } = await supabase.from("partidos").update({
      local_id: Number(editLocalId), visitante_id: Number(editVisitanteId),
      goles_local: Number(editGolesLocal), goles_visitante: Number(editGolesVisitante), fase: editFase
    }).eq("id", id)
    if (error) { alert("Error: " + error.message); return }
    setEditandoId(null); getPartidos()
  }

  async function eliminarPartido(id) {
    if (!confirm("¿Eliminar este partido?")) return
    const { error } = await supabase.from("partidos").delete().eq("id", id)
    if (error) { alert("Error: " + error.message); return }
    getPartidos()
  }

  const fases = ["Grupos", "Octavos de Final", "Cuartos de Final", "Semifinal", "Final"]

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <ImagenModal src={modalImg} alt={modalAlt} onClose={() => setModalImg(null)} />
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Partidos</h1>

      <div className="bg-white rounded-xl shadow p-5 mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Agregar Partido</h2>
        <form onSubmit={agregarPartido} className="grid grid-cols-2 gap-3 md:grid-cols-3">
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={localId} onChange={e => setLocalId(e.target.value)} required>
            <option value="">Equipo Local</option>
            {equipos.map(eq => <option key={eq.id} value={eq.id}>{eq.nombre}</option>)}
          </select>
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={visitanteId} onChange={e => setVisitanteId(e.target.value)} required>
            <option value="">Equipo Visitante</option>
            {equipos.map(eq => <option key={eq.id} value={eq.id}>{eq.nombre}</option>)}
          </select>
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={fase} onChange={e => setFase(e.target.value)} required>
            <option value="">Fase</option>
            {fases.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          <input className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" type="number" placeholder="Goles Local" value={golesLocal} onChange={e => setGolesLocal(e.target.value)} required />
          <input className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" type="number" placeholder="Goles Visitante" value={golesVisitante} onChange={e => setGolesVisitante(e.target.value)} required />
          <input className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" type="date" value={fecha} onChange={e => setFecha(e.target.value)} required />
          <button type="submit" className="md:col-span-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-4 py-2 text-sm transition">+ Agregar Partido</button>
        </form>
      </div>

      {/* BUSCADOR */}
      <div className="mb-4">
        <input
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="🔍 Buscar por equipo o fase..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Fecha</th>
              <th className="px-4 py-3 text-center">Partido</th>
              <th className="px-4 py-3 text-center">Resultado</th>
              <th className="px-4 py-3 text-center">Fase</th>
              <th className="px-4 py-3 text-center">Opciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {partidosFiltrados.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-400">No se encontraron resultados</td></tr>
            ) : partidosFiltrados.map(p => (
              <tr key={p.id} className="hover:bg-gray-50 transition">
                {editandoId === p.id ? (
                  <>
                    <td className="px-4 py-2" colSpan={2}>
                      <div className="flex gap-2">
                        <select className="border rounded px-2 py-1 text-sm flex-1" value={editLocalId} onChange={e => setEditLocalId(e.target.value)}>
                          {equipos.map(eq => <option key={eq.id} value={eq.id}>{eq.nombre}</option>)}
                        </select>
                        <span className="self-center text-gray-400">vs</span>
                        <select className="border rounded px-2 py-1 text-sm flex-1" value={editVisitanteId} onChange={e => setEditVisitanteId(e.target.value)}>
                          {equipos.map(eq => <option key={eq.id} value={eq.id}>{eq.nombre}</option>)}
                        </select>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex gap-1 justify-center">
                        <input className="border rounded px-2 py-1 text-sm w-12 text-center" type="number" value={editGolesLocal} onChange={e => setEditGolesLocal(e.target.value)} />
                        <span className="self-center">-</span>
                        <input className="border rounded px-2 py-1 text-sm w-12 text-center" type="number" value={editGolesVisitante} onChange={e => setEditGolesVisitante(e.target.value)} />
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <select className="border rounded px-2 py-1 text-sm" value={editFase} onChange={e => setEditFase(e.target.value)}>
                        {fases.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-2 text-center space-x-2">
                      <button onClick={() => guardarEdicion(p.id)} className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded-lg transition">Guardar</button>
                      <button onClick={() => setEditandoId(null)} className="bg-gray-300 hover:bg-gray-400 text-gray-700 text-xs px-3 py-1 rounded-lg transition">Cancelar</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3 text-gray-500 text-xs">{p.fecha ? new Date(p.fecha).toLocaleDateString() : "—"}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {p.local?.imagen_url && <img src={p.local.imagen_url} alt={p.local.nombre} className="w-7 h-7 rounded object-cover border cursor-pointer hover:opacity-80" onClick={() => { setModalImg(p.local.imagen_url); setModalAlt(p.local.nombre) }} />}
                        <span className="font-medium text-gray-800">{p.local?.nombre}</span>
                        <span className="text-gray-400 mx-1">vs</span>
                        <span className="font-medium text-gray-800">{p.visitante?.nombre}</span>
                        {p.visitante?.imagen_url && <img src={p.visitante.imagen_url} alt={p.visitante.nombre} className="w-7 h-7 rounded object-cover border cursor-pointer hover:opacity-80" onClick={() => { setModalImg(p.visitante.imagen_url); setModalAlt(p.visitante.nombre) }} />}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center"><span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">{p.goles_local} - {p.goles_visitante}</span></td>
                    <td className="px-4 py-3 text-center"><span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{p.fase}</span></td>
                    <td className="px-4 py-3 text-center space-x-2">
                      <button onClick={() => iniciarEdicion(p)} className="bg-yellow-400 hover:bg-yellow-500 text-white text-xs px-3 py-1 rounded-lg transition">Editar</button>
                      <button onClick={() => eliminarPartido(p.id)} className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-lg transition">Eliminar</button>
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