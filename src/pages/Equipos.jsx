import { createClient } from "@supabase/supabase-js"
import { useState, useEffect } from "react"
import ImagenModal from "../components/ImagenModal"

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
)

const MAX_SIZE = 2 * 1024 * 1024

export default function Equipos() {
  const [equipos, setEquipos] = useState([])
  const [busqueda, setBusqueda] = useState("")
  const [modalImg, setModalImg] = useState(null)
  const [modalAlt, setModalAlt] = useState("")

  const [nombre, setNombre] = useState("")
  const [confederacion, setConfederacion] = useState("")
  const [grupo, setGrupo] = useState("")
  const [ranking, setRanking] = useState("")
  const [imagen, setImagen] = useState(null)
  const [preview, setPreview] = useState(null)
  const [subiendo, setSubiendo] = useState(false)

  const [editandoId, setEditandoId] = useState(null)
  const [editNombre, setEditNombre] = useState("")
  const [editConfederacion, setEditConfederacion] = useState("")
  const [editGrupo, setEditGrupo] = useState("")
  const [editRanking, setEditRanking] = useState("")
  const [editImagen, setEditImagen] = useState(null)
  const [editPreview, setEditPreview] = useState(null)
  const [editImagenUrl, setEditImagenUrl] = useState("")

  useEffect(() => { getEquipos() }, [])

  async function getEquipos() {
    const { data, error } = await supabase.from("equipos").select("*")
    if (error) { console.error(error); return }
    setEquipos(data)
  }

  const equiposFiltrados = equipos.filter(e =>
    e.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    e.confederacion?.toLowerCase().includes(busqueda.toLowerCase()) ||
    e.grupo?.toLowerCase().includes(busqueda.toLowerCase())
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

  async function agregarEquipo(e) {
    e.preventDefault()
    setSubiendo(true)
    let imagen_url = null
    if (imagen) imagen_url = await subirImagen(imagen, "equipos")
    const { error } = await supabase.from("equipos").insert({
      nombre, confederacion, grupo, ranking_fifa: Number(ranking), imagen_url
    })
    if (error) { alert("Error: " + error.message); setSubiendo(false); return }
    setNombre(""); setConfederacion(""); setGrupo(""); setRanking("")
    setImagen(null); setPreview(null); setSubiendo(false); getEquipos()
  }

  function iniciarEdicion(equipo) {
    setEditandoId(equipo.id); setEditNombre(equipo.nombre)
    setEditConfederacion(equipo.confederacion); setEditGrupo(equipo.grupo)
    setEditRanking(equipo.ranking_fifa); setEditImagenUrl(equipo.imagen_url ?? "")
    setEditImagen(null); setEditPreview(null)
  }

  async function guardarEdicion(id) {
    setSubiendo(true)
    let imagen_url = editImagenUrl
    if (editImagen) imagen_url = await subirImagen(editImagen, "equipos")
    const { error } = await supabase.from("equipos").update({
      nombre: editNombre, confederacion: editConfederacion,
      grupo: editGrupo, ranking_fifa: Number(editRanking), imagen_url
    }).eq("id", id)
    if (error) { alert("Error: " + error.message); setSubiendo(false); return }
    setEditandoId(null); setSubiendo(false); getEquipos()
  }

  async function eliminarEquipo(id) {
    if (!confirm("¿Eliminar este equipo?")) return
    const { error } = await supabase.from("equipos").delete().eq("id", id)
    if (error) { alert("Error: " + error.message); return }
    getEquipos()
  }

  const confederaciones = ["UEFA", "CONMEBOL", "CONCACAF", "CAF", "AFC", "OFC"]

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <ImagenModal src={modalImg} alt={modalAlt} onClose={() => setModalImg(null)} />
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Equipos</h1>

      <div className="bg-white rounded-xl shadow p-5 mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Agregar Equipo</h2>
        <form onSubmit={agregarEquipo} className="grid grid-cols-2 gap-3 md:grid-cols-3">
          <input className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} required />
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={confederacion} onChange={e => setConfederacion(e.target.value)} required>
            <option value="">Confederación</option>
            {confederaciones.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Grupo (A, B...)" value={grupo} onChange={e => setGrupo(e.target.value)} required />
          <input className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" type="number" placeholder="Ranking FIFA" value={ranking} onChange={e => setRanking(e.target.value)} required />
          <div className="flex items-center gap-3">
            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg px-3 py-2 text-sm transition">
              📷 Subir imagen <span className="text-gray-400">(máx 2MB)</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImagenChange} />
            </label>
            {preview && <img src={preview} alt="preview" className="w-10 h-10 rounded-lg object-cover border cursor-pointer" onClick={() => { setModalImg(preview); setModalAlt("Preview") }} />}
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
          placeholder="🔍 Buscar por nombre, confederación o grupo..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Imagen</th>
              <th className="px-4 py-3 text-left">Nombre</th>
              <th className="px-4 py-3 text-left">Confederación</th>
              <th className="px-4 py-3 text-left">Grupo</th>
              <th className="px-4 py-3 text-left">Ranking FIFA</th>
              <th className="px-4 py-3 text-center">Opciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {equiposFiltrados.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-400">No se encontraron resultados</td></tr>
            ) : equiposFiltrados.map(equipo => (
              <tr key={equipo.id} className="hover:bg-gray-50 transition">
                {editandoId === equipo.id ? (
                  <>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        {(editPreview || editImagenUrl)
                          ? <img src={editPreview || editImagenUrl} alt="preview" className="w-10 h-10 rounded-lg object-cover border cursor-pointer" onClick={() => { setModalImg(editPreview || editImagenUrl); setModalAlt(editNombre) }} />
                          : <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">—</div>}
                        <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg px-2 py-1 text-xs transition">
                          📷<input type="file" accept="image/*" className="hidden" onChange={handleEditImagenChange} />
                        </label>
                      </div>
                    </td>
                    <td className="px-4 py-2"><input className="border rounded px-2 py-1 text-sm w-full" value={editNombre} onChange={e => setEditNombre(e.target.value)} /></td>
                    <td className="px-4 py-2">
                      <select className="border rounded px-2 py-1 text-sm w-full" value={editConfederacion} onChange={e => setEditConfederacion(e.target.value)}>
                        {confederaciones.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-2"><input className="border rounded px-2 py-1 text-sm w-20" value={editGrupo} onChange={e => setEditGrupo(e.target.value)} /></td>
                    <td className="px-4 py-2"><input className="border rounded px-2 py-1 text-sm w-24" type="number" value={editRanking} onChange={e => setEditRanking(e.target.value)} /></td>
                    <td className="px-4 py-2 text-center space-x-2">
                      <button onClick={() => guardarEdicion(equipo.id)} disabled={subiendo} className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded-lg transition disabled:opacity-50">{subiendo ? "..." : "Guardar"}</button>
                      <button onClick={() => setEditandoId(null)} className="bg-gray-300 hover:bg-gray-400 text-gray-700 text-xs px-3 py-1 rounded-lg transition">Cancelar</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3">
                      {equipo.imagen_url
                        ? <img src={equipo.imagen_url} alt={equipo.nombre} className="w-10 h-10 rounded-lg object-cover border cursor-pointer hover:opacity-80 transition" onClick={() => { setModalImg(equipo.imagen_url); setModalAlt(equipo.nombre) }} />
                        : <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">—</div>}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">{equipo.nombre}</td>
                    <td className="px-4 py-3"><span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-1 rounded-full">{equipo.confederacion}</span></td>
                    <td className="px-4 py-3 text-gray-600">{equipo.grupo}</td>
                    <td className="px-4 py-3 text-gray-600">#{equipo.ranking_fifa}</td>
                    <td className="px-4 py-3 text-center space-x-2">
                      <button onClick={() => iniciarEdicion(equipo)} className="bg-yellow-400 hover:bg-yellow-500 text-white text-xs px-3 py-1 rounded-lg transition">Editar</button>
                      <button onClick={() => eliminarEquipo(equipo.id)} className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-lg transition">Eliminar</button>
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