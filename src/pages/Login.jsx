import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [cargando, setCargando] = useState(false)
  const [mostrarPassword, setMostrarPassword] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setCargando(true)
    setError("")
    const err = await login(email, password)
    if (err) {
      setError("Credenciales incorrectas. Intenta de nuevo.")
      setCargando(false)
    } else {
      navigate("/")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0a0a2e 0%, #1a1a5e 40%, #0d3b6e 70%, #1a6b3c 100%)"
      }}
    >
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }}
      />

      <div className="absolute top-8 left-8 text-6xl opacity-20">🇨🇦</div>
      <div className="absolute top-8 right-8 text-6xl opacity-20">🇺🇸</div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-6xl opacity-20">🇲🇽</div>

      <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4">

        <div className="flex flex-col items-center mb-6">
          <img
            src="/wc2026.png"
            alt="2026 FIFA World Cup"
            className="w-20 h-24 object-contain mb-3"
          />
          <h1 className="text-xl font-bold text-gray-800">2026 FIFA World Cup</h1>
          <p className="text-xs text-gray-400 mt-1">Canada · United States · Mexico</p>
          <p className="text-sm text-gray-500 mt-2">Inicia sesión para continuar</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide mb-1 block">Email</label>
            <input
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide mb-1 block">Contraseña</label>
            <div className="relative">
              <input
                type={mostrarPassword ? "text" : "password"}
                placeholder="••••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="button"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                {mostrarPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg py-2.5 text-sm transition disabled:opacity-50"
          >
            {cargando ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        <div className="flex justify-center gap-4 mt-5">
          <span className="text-2xl">🇨🇦</span>
          <span className="text-2xl">🇺🇸</span>
          <span className="text-2xl">🇲🇽</span>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Desarrollado por <span className="font-semibold text-gray-500">Coderk</span> · 2026 ™
          <br />
          Soporte: <a href="mailto:erkhur@gmail.com" className="hover:text-gray-600 underline">erkhur@gmail.com</a>
        </p>
      </div>
    </div>
  )
}