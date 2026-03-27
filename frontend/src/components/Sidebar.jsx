import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function Sidebar() {
  const navigate = useNavigate()
  const logout = useAuthStore(state => state.logout)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="w-64 bg-gray-900 border-r border-neon-green border-opacity-20 p-6">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-neon-green">CL-TECH</h2>
      </div>

      <nav className="space-y-2">
        <Link
          to="/dashboard"
          className="block px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-neon-green transition"
        >
          📊 Dashboard
        </Link>
        
        <Link
          to="/bots"
          className="block px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-neon-green transition"
        >
          🤖 Bots
        </Link>
        
        <Link
          to="/messages"
          className="block px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-neon-green transition"
        >
          💬 Mensagens
        </Link>
        
        <Link
          to="/settings"
          className="block px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-neon-green transition"
        >
          ⚙️ Configurações
        </Link>

        <Link
          to="/billing"
          className="block px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-neon-green transition"
        >
          💳 Cobrança
        </Link>
      </nav>

      <div className="mt-auto pt-6 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition"
        >
          Sair
        </button>
      </div>
    </aside>
  )
}
