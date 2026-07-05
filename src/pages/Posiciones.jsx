import { createClient } from "@supabase/supabase-js"
import { useState, useEffect } from "react"
import ImagenModal from "../components/ImagenModal"

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
)

export default function Posiciones() {
  const [posiciones, setPosiciones] = useState([])
  const [equipos, setEquipos] = useState([])
  const [grupoFiltro, setGrupoFiltro] = useState("Todos")
  const [busqueda, setBusqueda] = useState("")
  const [modalImg, setModalImg] = useState(null)
  const [modalAlt, setModalAlt] = useState("")

  const [equipoId, setEquipoId] = useState("")
  const [grupo, setGrupo] = useState("")
  const [pj, setPj] = useState("")
  const [pg, setPg] = useState("")
  const [pe, setPe] = useState("")
  const [pp, setPp] = useState("")
  const [gf, setGf] = useState("")
  const [gc, setGc] = useState("")
  const [puntos, setPuntos] = useState("")

  const [editandoId, setEditandoId] = useState(null)
  const [editPg, setEditPg] = useState("")
  const [editPe, setEditPe] = useState("")
  const [editPp, setEditPp] = useState("")
  const [editGf, setEditGf] = useState("")
  const [editGc, setEditGc] = useState("")
  const [editPuntos, setEditPuntos] = useState("")

  useEffect(() => { getPosiciones(); getEquipos() }, [])

  async function getPosiciones() {
    const { data, error } = await supabase
      .from("posiciones_por_grupo")
      .select("*, equipo:equipos(nombre, imagen_url)")
      .order("puntos", { ascending: false })
    if (error) { console.error(error); return }
    setPosiciones(data)
  }

  async function getEquipos() {
    const { data, error } = await supabase.from("equipos").select("id, nombre").order("nombre")
    if (error) { console.error(error); return }
    setEquipos(data)
  }

  const grupos = ["Todos", ...new Set(posiciones.map(p => p.grupo).filter(Boolean))]

  const posicionesFiltradas = posiciones.filter(p => {
    const matchGrupo = grupoFiltro === "Todos" || p.grupo === grupoFiltro
    const matchBusqueda = p.equipo?.nombre?.toLowerCase().includes(busqueda.toLowerCase())
    return matchGrupo && matchBusqueda
  })

  async function agregarPosicion(e) {
    e.preventDefault()
    const { error } = await supabase.from("posiciones_por_grupo").insert({
      equipo_id: Number(equipoId), grupo,
      pj: Number(pj), pg: Number(pg), pe: Number(pe), pp: Number(pp),
      gf: Number(gf), gc: Number(gc), puntos: Number(puntos)
    })
    if (error) { alert("Error: " + error.message); return }
    setEquipoId(""); setGrupo(""); setPj(""); setPg(""); setPe(""); setPp(""); setGf(""); setGc(""); setPuntos("")
    getPosiciones()
  }

  function iniciarEdicion(pos) {
    setEditandoId(pos.id); setEditPg(pos.pg); setEditPe(pos.pe); setEditPp(pos.pp)
    setEditGf(pos.gf); setEditGc(pos.gc); setEditPuntos(pos.puntos)
  }

  async function guardarEdicion(id) {
    const { error } = await supabase.from("posiciones_por_grupo").update({
      pg: Number(editPg), pe: Number(editPe), pp: Number(editPp),
      gf: Number(editGf), gc: Number(editGc), puntos: Number(editPuntos),
      pj: Number(editPg) + Number(editPe) + Number(editPp)
    }).eq("id", id)
    if (error) { alert("Error: " + error.message); return }
    setEditandoId(null); getPosiciones()
  }

  async function eliminarPosicion(id) {
    if (!confirm("¿Eliminar este registro?")) return
    const { error } = await supabase.from("posiciones_por_grupo").delete().eq("id", id)
    if (error) { alert("Error: " + error.message); return }
    getPosiciones()
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <ImagenModal src={modalImg} alt={modalAlt} onClose={() => setModalImg(null)} />
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Posiciones por Grupo</h1>

      <div className="bg-white rounded-xl shadow p-5 mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Agregar Posición</h2>
        <form onSubmit={agregarPosicion} className="grid grid-cols-3 gap-3 md:grid-cols-5">
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={equipoId} onChange={e => setEquipoId(e.target.value)} required>
            <option value="">Equipo</option>
            {equipos.map(eq => <option key={eq.id} value={eq.id}>{eq.nombre}</option>)}
          </select>
          <input className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Grupo" value={grupo} onChange={e => setGrupo(e.target.value)} required />
          <input className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" type="number" placeholder="PG" value={pg} onChange={e => setPg(e.target.value)} required />
          <input className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" type="number" placeholder="PE" value={pe} onChange={e => setPe(e.target.value)} required />
          <input className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" type="number" placeholder="PP" value={pp} onChange={e => setPp(e.target.value)} required />
          <input className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" type="number" placeholder="GF" value={gf} onChange={e => setGf(e.target.value)} required />
          <input className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" type="number" placeholder="GC" value={gc} onChange={e => setGc(e.target.value)} required />
          <input className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" type="number" placeholder="PJ" value={pj} onChange={e => setPj(e.target.value)} required />
          <input className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" type="number" placeholder="Puntos" value={puntos} onChange={e => setPuntos(e.target.value)} required />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-4 py-2 text-sm transition">+ Agregar</button>
        </form>
      </div>

      {/* FILTROS */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <input
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="🔍 Buscar por equipo..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
        <div className="flex gap-2 flex-wrap">
          {grupos.map(g => (
            <button key={g} onClick={() => setGrupoFiltro(g)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${grupoFiltro === g ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {g === "Todos" ? "Todos" : `Grupo ${g}`}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Equipo</th>
              <th className="px-4 py-3 text-center">Grupo</th>
              <th className="px-4 py-3 text-center">PJ</th>
              <th className="px-4 py-3 text-center">PG</th>
              <th className="px-4 py-3 text-center">PE</th>
              <th className="px-4 py-3 text-center">PP</th>
              <th className="px-4 py-3 text-center">GF</th>
              <th className="px-4 py-3 text-center">GC</th>
              <th className="px-4 py-3 text-center">Pts</th>
              <th className="px-4 py-3 text-center">Opciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {posicionesFiltradas.length === 0 ? (
              <tr><td colSpan={10} className="px-4 py-6 text-center text-gray-400">No se encontraron resultados</td></tr>
            ) : posicionesFiltradas.map(pos => (
              <tr key={pos.id} className="hover:bg-gray-50 transition">
                {editandoId === pos.id ? (
                  <>
                    <td className="px-4 py-2 font-medium">
                      <div className="flex items-center gap-2">
                        {pos.equipo?.imagen_url && <img src={pos.equipo.imagen_url} alt={pos.equipo.nombre} className="w-7 h-7 rounded object-cover" />}
                        {pos.equipo?.nombre}
                      </div>
                    </td>
                    <td className="px-4 py-2 text-center">{pos.grupo}</td>
                    {[editPg, editPe, editPp, editGf, editGc].map((val, i) => {
                      const setters = [setEditPg, setEditPe, setEditPp, setEditGf, setEditGc]
                      return <td key={i} className="px-2 py-2 text-center">
                        <input className="border rounded px-1 py-1 text-sm w-12 text-center" type="number" value={val} onChange={e => setters[i](e.target.value)} />
                      </td>
                    })}
                    <td className="px-2 py-2 text-center"><input className="border rounded px-1 py-1 text-sm w-12 text-center" type="number" value={editPuntos} onChange={e => setEditPuntos(e.target.value)} /></td>
                    <td className="px-4 py-2 text-center space-x-1">
                      <button onClick={() => guardarEdicion(pos.id)} className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded-lg transition">Guardar</button>
                      <button onClick={() => setEditandoId(null)} className="bg-gray-300 hover:bg-gray-400 text-gray-700 text-xs px-2 py-1 rounded-lg transition">Cancelar</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {pos.equipo?.imagen_url
                          ? <img src={pos.equipo.imagen_url} alt={pos.equipo.nombre} className="w-7 h-7 rounded object-cover border cursor-pointer hover:opacity-80" onClick={() => { setModalImg(pos.equipo.imagen_url); setModalAlt(pos.equipo.nombre) }} />
                          : null}
                        <span className="font-medium text-gray-800">{pos.equipo?.nombre}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center"><span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-1 rounded-full">{pos.grupo}</span></td>
                    <td className="px-4 py-3 text-center text-gray-600">{pos.pj}</td>
                    <td className="px-4 py-3 text-center text-green-600 font-medium">{pos.pg}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{pos.pe}</td>
                    <td className="px-4 py-3 text-center text-red-500">{pos.pp}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{pos.gf}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{pos.gc}</td>
                    <td className="px-4 py-3 text-center"><span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">{pos.puntos}</span></td>
                    <td className="px-4 py-3 text-center space-x-2">
                      <button onClick={() => iniciarEdicion(pos)} className="bg-yellow-400 hover:bg-yellow-500 text-white text-xs px-3 py-1 rounded-lg transition">Editar</button>
                      <button onClick={() => eliminarPosicion(pos.id)} className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-lg transition">Eliminar</button>
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