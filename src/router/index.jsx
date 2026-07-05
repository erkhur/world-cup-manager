import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AppLayout from '../layout/AppLayout'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import Equipos from '../pages/Equipos'
import Jugadores from '../pages/Jugadores'
import Partidos from '../pages/Partidos'
import Posiciones from '../pages/Posiciones'
import Goleadores from '../pages/Goleadores'
import Settings from '../pages/Settings'
import Estadisticas from '../pages/Estadisticas'

function RutaProtegida({ children }) {
  const { session } = useAuth()
  if (session === undefined) return <div className="min-h-screen flex items-center justify-center text-gray-400">Cargando...</div>
  if (!session) return <Navigate to="/login" replace />
  return children
}

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<RutaProtegida><AppLayout /></RutaProtegida>}>
          <Route index element={<Dashboard />} />
          <Route path="/equipos" element={<Equipos />} />
          <Route path="/jugadores" element={<Jugadores />} />
          <Route path="/partidos" element={<Partidos />} />
          <Route path="/posiciones" element={<Posiciones />} />
          <Route path="/goleadores" element={<Goleadores />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/estadisticas" element={<Estadisticas />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}