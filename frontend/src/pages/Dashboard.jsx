import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuthStore } from '../store/authStore'
import Sidebar from '../components/Sidebar'
import Card from '../components/Card'

export default function Dashboard() {
  const [bots, setBots] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalBots: 0,
    totalMessages: 0,
    activeChats: 0,
    usage: 0
  })
  const { accessToken, user } = useAuthStore()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${accessToken}` }
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/bots`,
        config
      )

      setBots(response.data.data || [])
      setStats({
        totalBots: response.data.data?.length || 0,
        totalMessages: 0,
        activeChats: 0,
        usage: 45
      })
    } catch (err) {
      console.error('Erro ao carregar dados:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-dark-bg">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neon-green mb-2">
              Dashboard
            </h1>
            <p className="text-gray-400">
              Bem-vindo, {user?.fullName}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <div className="text-gray-400 text-sm mb-2">Total de Bots</div>
              <div className="text-2xl font-bold text-neon-green">
                {stats.totalBots}
              </div>
            </Card>
            
            <Card>
              <div className="text-gray-400 text-sm mb-2">Mensagens</div>
              <div className="text-2xl font-bold text-neon-purple">
                {stats.totalMessages}
              </div>
            </Card>
            
            <Card>
              <div className="text-gray-400 text-sm mb-2">Chats Ativos</div>
              <div className="text-2xl font-bold text-blue-400">
                {stats.activeChats}
              </div>
            </Card>
            
            <Card>
              <div className="text-gray-400 text-sm mb-2">Uso do Plano</div>
              <div className="text-2xl font-bold text-yellow-400">
                {stats.usage}%
              </div>
            </Card>
          </div>

          {/* Bots List */}
          <div>
            <h2 className="text-xl font-bold text-neon-green mb-4">
              Seus Bots
            </h2>

            {loading ? (
              <div className="text-center py-8 text-gray-400">
                Carregando bots...
              </div>
            ) : bots.length === 0 ? (
              <Card>
                <p className="text-gray-400 text-center py-8">
                  Nenhum bot criado ainda.{' '}
                  <a href="/bots/new" className="text-neon-green hover:underline">
                    Criar novo
                  </a>
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bots.map(bot => (
                  <Card key={bot.id}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-white">
                          {bot.name}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {bot.phoneNumber}
                        </p>
                      </div>
                      <span className={`badge badge-${bot.status === 'active' ? 'success' : bot.status === 'inactive' ? 'danger' : 'warning'}`}>
                        {bot.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mb-4">
                      {bot.enableAI ? '🤖 IA Habilitada' : '🔇 IA Desabilitada'}
                    </p>
                    <div className="flex gap-2">
                      <a
                        href={`/bots/${bot.id}`}
                        className="flex-1 btn btn-secondary text-center text-sm"
                      >
                        Gerenciar
                      </a>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
