import pkg from 'whatsapp-web.js'
const { Client, MessageMedia } = pkg
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

const API_RAW_URL = process.env.API_URL || 'https://cltech-api-ch41.onrender.com'
const API_BASE_URL = API_RAW_URL.endsWith('/') ? API_RAW_URL.slice(0, -1) : API_RAW_URL
const AUTO_TARGET_NUMBER = '5511951289502@c.us'
let botId = null
let authToken = null

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
    // Comando para buscar imagem da API
    if (message.body.toLowerCase().startsWith('!imagem')) {
      await handleImageCommand(message)
      return
    }

    // Processar com IA para outras mensagens
    const aiResponse = await processWithAI(message.body)
    await message.reply(aiResponse)

  } catch (error) {
    console.error('❌ Erro:', error.message)
    message.reply('😕 Desculpa, houve um erro ao processar sua solicitação.')
  }
})

// ============================================================================
// IMAGE COMMAND HANDLER
// ============================================================================
async function handleImageCommand(message) {
  try {
    // 1. Buscar imagens do usuário na API
    const response = await axios.get(`${API_BASE_URL}/api/images`, {
      headers: { Authorization: `Bearer ${authToken}` }
    })

    const images = response.data.images
    if (!images || images.length === 0) {
      return message.reply('Você ainda não tem imagens salvas na sua galeria CL-TECH.')
    }

    // 2. Pegar a última imagem (ou aleatória)
    const latestImage = images[0]
    
    // 3. Carregar mídia do WhatsApp
    const media = await MessageMedia.fromUrl(latestImage.url)
    
    // 4. Enviar com a legenda armazenada na API para o número automático
    await client.sendMessage(AUTO_TARGET_NUMBER, media, {
      caption: latestImage.caption || 'Enviado via CL-TECH CORE API'
    })

    message.reply(`✅ Imagem enviada com sucesso para o número ${AUTO_TARGET_NUMBER.split('@')[0]}!`)

    // 5. Notificar Webhook de sucesso
    await reportStatus(latestImage.id, 'sent')

  } catch (error) {
    console.error('Image Command Error:', error.message)
    message.reply('Erro ao buscar sua imagem na API.')
    await reportStatus(null, 'failed', error.message)
  }
}

// ============================================================================
// REPORT STATUS TO API WEBHOOK
// ============================================================================
async function reportStatus(imageId, status, error = null) {
  try {
    await axios.post(`${API_BASE_URL}/api/webhooks/bot-status`, {
      imageId,
      status,
      error
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    })
  } catch (err) {
    console.error('Webhook Error:', err.message)
  }
}

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
          content: 'Você é um assistente da CL-TECH CORE. Responda de forma breve e profissional. Se o usuário quiser uma imagem, diga para ele usar o comando !imagem.'
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
// AUTHENTICATION
// ============================================================================
async function authenticate() {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      email: process.env.BOT_EMAIL || 'admin@cltech.com',
      password: process.env.BOT_PASSWORD || '123456789'
    })

    const { accessToken } = response.data
    authToken = accessToken
    console.log('✅ Bot autenticado com sucesso na API Render!')
    return true
  } catch (error) {
    console.error('❌ Erro de autenticação na API:', error.message)
    return false
  }
}

// ============================================================================
// INITIALIZE
// ============================================================================
async function initialize() {
  console.log(`🚀 Conectando à API: ${API_BASE_URL}`)
  
  // Autenticar
  const isAuthenticated = await authenticate()
  if (!isAuthenticated) {
    console.error('Falha na autenticação. Verifique BOT_EMAIL e BOT_PASSWORD.')
    // Em produção, talvez queira tentar novamente em vez de sair
  }

  // Inicializar WhatsApp
  client.initialize()
}

// ============================================================================
// ERROR HANDLING
// ============================================================================
client.on('disconnected', () => {
  console.log('❌ WhatsApp Bot desconectado!')
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
})

export { client, openai }
