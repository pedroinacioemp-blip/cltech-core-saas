import axios from 'axios'
import { OpenAI } from 'openai'
import dotenv from 'dotenv'
import express from 'express'

dotenv.config()

const app = express()
app.use(express.json())

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// Configurações da WhatsApp Cloud API (Meta)
const WA_PHONE_NUMBER_ID = process.env.WA_PHONE_NUMBER_ID
const WA_ACCESS_TOKEN = process.env.WA_ACCESS_TOKEN
const API_BASE_URL = process.env.API_URL || 'https://cltech-api-ch41.onrender.com'
const AUTO_TARGET_NUMBER = '5511951289502' // Número configurado

let authToken = null

// ============================================================================
// ENVIAR MENSAGEM VIA CLOUD API (Sem QR Code)
// ============================================================================
async function sendWhatsAppMessage(to, content, isImage = false, caption = '') {
  try {
    const url = `https://graph.facebook.com/v18.0/${WA_PHONE_NUMBER_ID}/messages`
    
    let data;
    if (isImage) {
      data = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: to,
        type: "image",
        image: {
          link: content,
          caption: caption
        }
      }
    } else {
      data = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: to,
        type: "text",
        text: { body: content }
      }
    }

    const response = await axios.post(url, data, {
      headers: {
        'Authorization': `Bearer ${WA_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    })

    console.log(`✅ Mensagem enviada via API para ${to}`)
    return response.data
  } catch (error) {
    console.error('❌ Erro no envio via Cloud API:', error.response?.data || error.message)
    throw error
  }
}

// ============================================================================
// WEBHOOK PARA RECEBER MENSAGENS (Opcional)
// ============================================================================
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode']
  const token = req.query['hub.verify_token']
  const challenge = req.query['hub.challenge']

  if (mode && token === process.env.WA_VERIFY_TOKEN) {
    res.status(200).send(challenge)
  } else {
    res.sendStatus(403)
  }
})

app.post('/webhook', async (req, res) => {
  const body = req.body
  console.log('📨 Nova mensagem recebida via Webhook Meta')
  
  // Lógica para processar mensagens recebidas pode ser adicionada aqui
  res.sendStatus(200)
})

// ============================================================================
// LÓGICA DE AUTOMAÇÃO DE IMAGEM
// ============================================================================
async function handleImageAutomation() {
  try {
    // 1. Buscar imagens do usuário na API
    const response = await axios.get(`${API_BASE_URL}/api/images`, {
      headers: { Authorization: `Bearer ${authToken}` }
    })

    const images = response.data.images
    if (!images || images.length === 0) {
      console.log('Nenhuma imagem para enviar.')
      return
    }

    const latestImage = images[0]
    
    // 2. Enviar via Cloud API para o número fixo
    await sendWhatsAppMessage(
      AUTO_TARGET_NUMBER, 
      latestImage.url, 
      true, 
      latestImage.caption || 'Enviado via CL-TECH API'
    )

    // 3. Reportar status
    await reportStatus(latestImage.id, 'sent')

  } catch (error) {
    console.error('Erro na automação de imagem:', error.message)
    await reportStatus(null, 'failed', error.message)
  }
}

async function reportStatus(imageId, status, error = null) {
  try {
    await axios.post(`${API_BASE_URL}/api/webhooks/bot-status`, {
      imageId, status, error
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    })
  } catch (err) {
    console.error('Erro ao reportar status:', err.message)
  }
}

// ============================================================================
// INITIALIZE
// ============================================================================
async function authenticate() {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      email: process.env.BOT_EMAIL || 'admin@cltech.com',
      password: process.env.BOT_PASSWORD || '123456789'
    })
    authToken = response.data.token
    console.log('✅ Bot autenticado na API!')
    return true
  } catch (error) {
    console.error('❌ Erro de autenticação na API:', error.message)
    return false
  }
}

async function initialize() {
  const isAuth = await authenticate()
  if (isAuth) {
    console.log('🚀 Bot iniciado em modo API (Sem QR Code)')
    
    // Iniciar servidor de Webhook
    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => console.log(`📡 Webhook server listening on port ${PORT}`))

    // Exemplo: Rodar automação a cada 5 minutos
    setInterval(handleImageAutomation, 5 * 60 * 1000)
  }
}

initialize()
