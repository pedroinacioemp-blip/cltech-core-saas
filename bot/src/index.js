import Client from 'whatsapp-web.js'
import qrcode from 'qrcode-terminal'
import axios from 'axios'
import { OpenAI } from 'openai'
import dotenv from 'dotenv'

dotenv.config()

const client = new Client({
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
})

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const API_BASE_URL = process.env.API_URL || 'http://localhost:5000'
let botId = null

// ============================================================================
// QR CODE GENERATION
// ============================================================================
client.on('qr', (qr) => {
  console.log('\n📱 Scan QR Code for WhatsApp:')
  qrcode.generate(qr, { small: true })
})

// ============================================================================
// CLIENT READY
// ============================================================================
client.on('ready', () => {
  console.log('✅ WhatsApp Bot is ready!')
})

// ============================================================================
// MESSAGE HANDLER
// ============================================================================
client.on('message', async (message) => {
  console.log(`📨 Mensagem de ${message.from}: ${message.body}`)

  try {
    // Extrair phone number
    const phoneNumber = message.from.replace('@c.us', '')

    // Salvar mensagem no backend
    await saveMessage({
      botId,
      fromNumber: phoneNumber,
      toNumber: 'bot',
      content: message.body,
      type: 'text',
      direction: 'in'
    })

    // Processar com IA
    const aiResponse = await processWithAI(message.body)

    // Responder ao usuário
    await message.reply(aiResponse)

    // Salvar resposta no backend
    await saveMessage({
      botId,
      fromNumber: 'bot',
      toNumber: phoneNumber,
      content: aiResponse,
      type: 'text',
      direction: 'out',
      isFromAI: true
    })

  } catch (error) {
    console.error('❌ Erro:', error.message)
    message.reply('😕 Desculpa, houve um erro. Tente novamente.')
  }
})

// ============================================================================
// AI PROCESSING
// ============================================================================
async function processWithAI(message) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Você é um assistente amigável que responde mensagens no WhatsApp de forma breve e profissional.'
        },
        {
          role: 'user',
          content: message
        }
      ],
      max_tokens: 150,
      temperature: 0.7
    })

    return response.choices[0].message.content
  } catch (error) {
    console.error('AI Error:', error.message)
    return 'Desculpa, não consegui processar sua mensagem. Tente novamente!'
  }
}

// ============================================================================
// SAVE MESSAGE TO BACKEND
// ============================================================================
async function saveMessage(data) {
  try {
    const token = process.env.BOT_TOKEN || ''
    
    await axios.post(`${API_BASE_URL}/api/v1/messages`, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    console.error('Error saving message:', error.message)
  }
}

// ============================================================================
// AUTHENTICATION & HEALTH CHECK
// ============================================================================
async function authenticate() {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/v1/auth/login`, {
      email: process.env.BOT_EMAIL,
      password: process.env.BOT_PASSWORD
    })

    const { data } = response.data
    process.env.AUTH_TOKEN = data.accessToken
    botId = process.env.BOT_ID

    console.log('✅ Bot autenticado com sucesso!')
    return true
  } catch (error) {
    console.error('❌ Erro de autenticação:', error.message)
    return false
  }
}

// ============================================================================
// INITIALIZE
// ============================================================================
async function initialize() {
  // Autenticar
  const isAuthenticated = await authenticate()
  if (!isAuthenticated) {
    console.error('Falha na autenticação. Abortando...')
    process.exit(1)
  }

  // Inicializar WhatsApp
  client.initialize()
}

// ============================================================================
// ERROR HANDLING
// ============================================================================
client.on('disconnected', () => {
  console.log('❌ WhatsApp Bot desconectado!')
  process.exit(1)
})

process.on('SIGINT', () => {
  console.log('\n🛑 Encerrando bot...')
  client.destroy().then(() => {
    process.exit(0)
  })
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason)
})

// Start
initialize().catch(err => {
  console.error('Initialization error:', err)
  process.exit(1)
})

export { client, openai }
