const apiKeyInput = document.getElementById('apiKey')
const gameSelect = document.getElementById('gameSelect')
const questionInput = document.getElementById('questionInput')
const askButton = document.getElementById('askButton')
const aiResponse = document.getElementById('aiResponse')
const form = document.getElementById('form')

const markdownToHTML = (text) => {
  const converter = new showdown.Converter()
  return converter.makeHtml(text)
  }

//AIzaSyAJIJOv-f3uyoohwPlqz5hNyWiGrilRQLg
const perguntarAI = async (question, game, apiKey) => {
  const model = "gemini-2.0-flash"
  const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`


  const perguntaLeague = `
   ## Especialidade
    Você é um especialista assistente de meta para o jogo ${game}

    ## Tarefa
    Você deve responder as perguntas do usuário com base no seu conhecimento do jogo, estratégias, builds e dicas.

    ## Regras
    - Se você não sabe a resposta, responda com 'Não sei' e não tente inventar uma resposta.
    - Se a pergunta não está relacionada ao jogo, responda com 'Essa pergunta não está relacionada ao jogo'
    - Considere a data atual ${new Date().toLocaleDateString()}
    - Faça pesquisas atualizadas sobre o patch atual, baseado na data atual, para dar uma resposta coerente.
    - Nunca responsda itens que vc não tenha certeza de que existe no patch atual.

    ## Resposta
    - Economize na resposta, seja direto e responda no máximo 500 caracteres.
    - Responda em markdown.
    - Não precisa fazer nenhuma saudação ou despedida, apenas responda o que o usuário está querendo.

    ## Exemplo de resposta
    pergunta do usuário: Melhor build rengar jungle
    resposta: A build mais atual é: \n\n **Itens:**\n\n coloque os itens aqui.\n\n**Runas:**\n\nexemplo de runas\n\n

    ---
    Aqui está a pergunta do usuário: ${question}
    `
  const perguntaValorant = `
   ## Especialidade
    Você é um especialista assistente de meta para o jogo ${game}

    ## Tarefa
    Você deve responder as perguntas do usuário com base no seu conhecimento do jogo, estratégias, agentes, habilidades, mapas e dicas.

    ## Regras
    - Se você não sabe a resposta, responda com 'Não sei' e não tente inventar uma resposta.
    - Se a pergunta não está relacionada ao jogo, responda com 'Essa pergunta não está relacionada ao jogo'
    - Considere a data atual ${new Date().toLocaleDateString()}
    - Faça pesquisas atualizadas sobre o patch atual do Valorant, baseado na data atual, para dar uma resposta coerente.
    - Nunca responsda itens que vc não tenha certeza de que existe no patch atual.

    ## Resposta
    - Economize na resposta, seja direto e responda no máximo 500 caracteres.
    - Responda em markdown.
    - Não precisa fazer nenhuma saudação ou despedida, apenas responda o que o usuário está querendo.

    ## Exemplo de resposta
    Pergunta do usuário: Qual a melhor composição de agentes para o mapa Ascent?
    Resposta: A melhor composição atual para Ascent geralmente inclui:  \n\n **Um controlador** (ex: Omen/Astra) \n\n,  \n\n **Dois duelistas** (ex: Jett/Raze/Phoenix) \n\n,  \n\n **Um sentinela** (ex: Cypher/Killjoy)  \n\n \n\n **Um iniciador** (ex: Sova/Fade).\n\n

    ---
    Aqui está a pergunta do usuário: ${question}
  `
  const perguntaCSGo = `
   ## Especialidade
    Você é um especialista assistente de meta para o jogo ${game}

    ## Tarefa
    Você deve responder as perguntas do usuário com base no seu conhecimento do jogo, estratégias, armas, utilitários, mapas e dicas.

    ## Regras
   - Se você não sabe a resposta, responda com 'Não sei' e não tente inventar uma resposta.
   - Se a pergunta não está relacionada ao jogo, responda com 'Essa pergunta não está relacionada ao jogo'.
   - Considere a data atual ${new Date().toLocaleDateString()}.
   - Faça pesquisas atualizadas sobre o patch atual do CS2, baseado na data atual, para dar uma resposta coerente.
   - Nunca responda itens que você não tenha certeza de que existem no patch atual.

    ## Resposta
    - Economize na resposta, seja direto e responda no máximo 500 caracteres.
    - Responda em markdown.
    - Não precisa fazer nenhuma saudação ou despedida, apenas responda o que o usuário está querendo.

    ## Exemplo de resposta
    Pergunta do usuário: Qual a melhor estratégia para o lado CT na Mirage?
    Resposta: A melhor estratégia atual para o lado CT na Mirage envolve: \n\n  **Um forte controle de meio (mid), com smokes e flashes para atrasar avanços inimigos. No bombsite A, defensores agressivos podem segurar o palácio e jungle. No bombsite B, use setups com molotovs e granadas para conter rushes.**
    ---
    Aqui está a pergunta do usuário: ${question}
  `

    let pergunta = ''
  if (game == 'lol') {
    pergunta = perguntaLeague

    } else if (game == 'valorant') {
    pergunta = perguntaValorant

    } else if (game == 'csgo') {
    pergunta = perguntaCSGo
    } 

  const contents = [{
    role: "user",
    parts: [{
      text: pergunta
  }]
}]

const tools = [{
  google_search: {}
}]



//chamada API
const response = await fetch(geminiURL, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        contents, tools
    })
})

const data = await response.json()
  return data.candidates[0].content.parts[0].text
}

const enviarFormulario = async (event) => {
  event.preventDefault() // Impede o envio do formulário padrão
   const apiKey = apiKeyInput.value
    const game = gameSelect.value
    const question = questionInput.value

    if (apiKey == '' || game == '' || question == '') {
        alert('Por favor, preencha todos os campos')
        return
    }

    askButton.disabled = true
    askButton.textContent = 'Perguntando...'
    askButton.classList.add('loading')

   try {
      const text = await perguntarAI(question, game, apiKey)
      aiResponse.querySelector('.response-content').innerHTML = markdownToHTML(text)
      aiResponse.classList.remove('hidden')
    } catch (error) {
      console.log('Erro: ', error)
    } finally {
        askButton.disabled = false
        askButton.textContent = "Perguntar"
        askButton.classList.remove('loading')
    }

}

form.addEventListener('submit', enviarFormulario) 
