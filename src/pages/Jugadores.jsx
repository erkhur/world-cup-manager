import { createClient } from "@supabase/supabase-js"
import { useState, useEffect } from "react"
import ImagenModal from "../components/ImagenModal"

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
)

const MAX_SIZE = 2 * 1024 * 1024

export default function Jugadores() {
  const [jugadores, setJugadores] = useState([])
  const [equipos, setEquipos] = useState([])
  const [busqueda, setBusqueda] = useState("")
  const [modalImg, setModalImg] = useState(null)
  const [modalAlt, setModalAlt] = useState("")

  const [nombre, setNombre] = useState("")
  const [posicion, setPosicion] = useState("")
  const [dorsal, setDorsal] = useState("")
  const [equipoId, setEquipoId] = useState("")
  const [imagen, setImagen] = useState(null)
  const [preview, setPreview] = useState(null)
  const [subiendo, setSubiendo] = useState(false)

  const [editandoId, setEditandoId] = useState(null)
  const [editNombre, setEditNombre] = useState("")
  const [editPosicion, setEditPosicion] = useState("")
  const [editDorsal, setEditDorsal] = useState("")
  const [editEquipoId, setEditEquipoId] = useState("")
  const [editImagen, setEditImagen] = useState(null)
  const [editPreview, setEditPreview] = useState(null)
  const [editImagenUrl, setEditImagenUrl] = useState("")

  useEffect(() => { getJugadores(); getEquipos() }, [])

  async function getJugadores() {
    const { data, error } = await supabase.from("jugadores").select("*, equipo:equipos(nombre)")
    if (error) { console.error(error); return }
    setJugadores(data)
  }

  async function getEquipos() {
    const { data, error } = await supabase.from("equipos").select("id, nombre").order("nombre")
    if (error) { console.error(error); return }
    setEquipos(data)
  }

  const jugadoresFiltrados = jugadores.filter(j =>
    j.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    j.posicion?.toLowerCase().includes(busqueda.toLowerCase()) ||
    j.equipo?.nombre?.toLowerCase().includes(busqueda.toLowerCase())
  )

  function validarImagen(file) {
    if (file.size > MAX_SIZE) { alert("La imagen es muy grande. Máximo 2MB."); return false }
    return true
  }

  function handleImagenChange(e) {
    const file = e.target.files[0]
    if (!file) return
    if (!validarImagen(file)) { e.target.value = ""; return }
    setImagen(file); setPreview(URL.createObjectURL(file))
  }

  function handleEditImagenChange(e) {
    const file = e.target.files[0]
    if (!file) return
    if (!validarImagen(file)) { e.target.value = ""; return }
    setEditImagen(file); setEditPreview(URL.createObjectURL(file))
  }

  async function subirImagen(file, carpeta) {
    const ext = file.name.split(".").pop()
    const fileName = `${carpeta}/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from("imagenes").upload(fileName, file)
    if (error) { alert("Error al subir imagen: " + error.message); return null }
    const { data } = supabase.storage.from("imagenes").getPublicUrl(fileName)
    return data.publicUrl
  }

  async function agregarJugador(e) {
    e.preventDefault()
    setSubiendo(true)
    let imagen_url = null
    if (imagen) imagen_url = await subirImagen(imagen, "jugadores")
    const { error } = await supabase.from("jugadores").insert({
      nombre, posicion, dorsal: Number(dorsal),
      equipo_id: equipoId ? Number(equipoId) : null, imagen_url
    })
    if (error) { alert("Error: " + error.message); setSubiendo(false); return }
    setNombre(""); setPosicion(""); setDorsal(""); setEquipoId("")
    setImagen(null); setPreview(null); setSubiendo(false); getJugadores()
  }

  function iniciarEdicion(jugador) {
    setEditandoId(jugador.id); setEditNombre(jugador.nombre)
    setEditPosicion(jugador.posicion); setEditDorsal(jugador.dorsal)
    setEditEquipoId(jugador.equipo_id ?? ""); setEditImagenUrl(jugador.imagen_url ?? "")
    setEditImagen(null); setEditPreview(null)
  }

  async function guardarEdicion(id) {
    setSubiendo(true)
    let imagen_url = editImagenUrl
    if (editImagen) imagen_url = await subirImagen(editImagen, "jugadores")
    const updates = { nombre: editNombre, posicion: editPosicion, dorsal: Number(editDorsal), imagen_url }
    if (editEquipoId) updates.equipo_id = Number(editEquipoId)
    const { error } = await supabase.from("jugadores").update(updates).eq("id", id)
    if (error) { alert("Error: " + error.message); setSubiendo(false); return }
    setEditandoId(null); setSubiendo(false); getJugadores()
  }

  async function eliminarJugador(id) {
    if (!confirm("¿Eliminar este jugador?")) return
    const { error } = await supabase.from("jugadores").delete().eq("id", id)
    if (error) { alert("Error: " + error.message); return }
    getJugadores()
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <ImagenModal src={modalImg} alt={modalAlt} onClose={() => setModalImg(null)} />
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Jugadores</h1>

      <div className="bg-white rounded-xl shadow p-5 mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Agregar Jugador</h2>
        <form onSubmit={agregarJugador} className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
          <input className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} required />
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={posicion} onChange={e => setPosicion(e.target.value)} required>
            <option value="">Posición</option>
            <option value="POR">Portero</option>
            <option value="DEF">Defensa</option>
            <option value="MED">Mediocampista</option>
            <option value="DEL">Delantero</option>
          </select>
          <input className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" type="number" placeholder="Dorsal" value={dorsal} onChange={e => setDorsal(e.target.value)} required />
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={equipoId} onChange={e => setEquipoId(e.target.value)}>
            <option value="">Equipo (opcional)</option>
            {equipos.map(eq => <option key={eq.id} value={eq.id}>{eq.nombre}</option>)}
          </select>
          <div className="flex items-center gap-3">
            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg px-3 py-2 text-sm transition">
              📷 Subir foto <span className="text-gray-400">(máx 2MB)</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImagenChange} />
            </label>
            {preview && <img src={preview} alt="preview" className="w-10 h-10 rounded-full object-cover border cursor-pointer" onClick={() => { setModalImg(preview); setModalAlt("Preview") }} />}
          </div>
          <button type="submit" disabled={subiendo} className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-4 py-2 text-sm transition disabled:opacity-50">
            {subiendo ? "Subiendo..." : "+ Agregar"}
          </button>
        </form>
      </div>

      {/* BUSCADOR */}
      <div className="mb-4">
        <input
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="🔍 Buscar por nombre, posición o equipo..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Foto</th>
              <th className="px-4 py-3 text-left">Nombre</th>
              <th className="px-4 py-3 text-left">Posición</th>
              <th className="px-4 py-3 text-left">Dorsal</th>
              <th className="px-4 py-3 text-left">Equipo</th>
              <th className="px-4 py-3 text-center">Opciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {jugadoresFiltrados.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-400">No se encontraron resultados</td></tr>
            ) : jugadoresFiltrados.map(jugador => (
              <tr key={jugador.id} className="hover:bg-gray-50 transition">
                {editandoId === jugador.id ? (
                  <>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        {(editPreview || editImagenUrl)
                          ? <img src={editPreview || editImagenUrl} alt="preview" className="w-10 h-10 rounded-full object-cover border cursor-pointer" onClick={() => { setModalImg(editPreview || editImagenUrl); setModalAlt(editNombre) }} />
                          : <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">—</div>}
                        <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg px-2 py-1 text-xs transition">
                          📷<input type="file" accept="image/*" className="hidden" onChange={handleEditImagenChange} />
                        </label>
                      </div>
                    </td>
                    <td className="px-4 py-2"><input className="border rounded px-2 py-1 text-sm w-full" value={editNombre} onChange={e => setEditNombre(e.target.value)} /></td>
                    <td className="px-4 py-2">
                      <select className="border rounded px-2 py-1 text-sm" value={editPosicion} onChange={e => setEditPosicion(e.target.value)}>
                        <option value="POR">Portero</option>
                        <option value="DEF">Defensa</option>
                        <option value="MED">Mediocampista</option>
                        <option value="DEL">Delantero</option>
                      </select>
                    </td>
                    <td className="px-4 py-2"><input className="border rounded px-2 py-1 text-sm w-16" type="number" value={editDorsal} onChange={e => setEditDorsal(e.target.value)} /></td>
                    <td className="px-4 py-2">
                      <select className="border rounded px-2 py-1 text-sm" value={editEquipoId} onChange={e => setEditEquipoId(e.target.value)}>
                        <option value="">Sin equipo</option>
                        {equipos.map(eq => <option key={eq.id} value={eq.id}>{eq.nombre}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-2 text-center space-x-2">
                      <button onClick={() => guardarEdicion(jugador.id)} disabled={subiendo} className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded-lg transition disabled:opacity-50">{subiendo ? "..." : "Guardar"}</button>
                      <button onClick={() => setEditandoId(null)} className="bg-gray-300 hover:bg-gray-400 text-gray-700 text-xs px-3 py-1 rounded-lg transition">Cancelar</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3">
                      {jugador.imagen_url
                        ? <img src={jugador.imagen_url} alt={jugador.nombre} className="w-10 h-10 rounded-full object-cover border cursor-pointer hover:opacity-80 transition" onClick={() => { setModalImg(jugador.imagen_url); setModalAlt(jugador.nombre) }} />
                        : <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">—</div>}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">{jugador.nombre}</td>
                    <td className="px-4 py-3"><span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full">{jugador.posicion}</span></td>
                    <td className="px-4 py-3 text-gray-600">#{jugador.dorsal}</td>
                    <td className="px-4 py-3 text-gray-600">{jugador.equipo?.nombre ?? "—"}</td>
                    <td className="px-4 py-3 text-center space-x-2">
                      <button onClick={() => iniciarEdicion(jugador)} className="bg-yellow-400 hover:bg-yellow-500 text-white text-xs px-3 py-1 rounded-lg transition">Editar</button>
                      <button onClick={() => eliminarJugador(jugador.id)} className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-lg transition">Eliminar</button>
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