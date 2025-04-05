// Estrutura do chatbot para WhatsApp - Clínica da Família

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Objeto para armazenar o estado de cada chat e contagem de respostas não entendidas
const chatStates = {};
const unrecognizedResponsesCount = {};
const pauseUntil = {};

const client = new Client({
    authStrategy: new LocalAuth(),
    restartOnAuthFail: true,
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process', // <- this one doesn't work on Windows
            '--disable-gpu'
        ]
    }
});

client.on('qr', qr => {
    console.log('QR Code recebido, escaneie por favor.');
    qrcode.generate(qr, { small: true });
});

client.on('authenticated', () => {
    console.log('Autenticado com sucesso!');
});

client.on('auth_failure', msg => {
    console.error('Falha na autenticação', msg);
});

client.on('ready', () => {
    console.log('Chatbot está pronto!');
});

client.on('disconnected', (reason) => {
    console.log('Cliente desconectado', reason);
    setTimeout(() => {
        client.initialize();
    }, 5000);  // Aguarde 5 segundos antes de tentar reiniciar
});

client.on('message', async msg => {
    try {
        const chatId = msg.from;
        const chat = await msg.getChat();
        const contact = await msg.getContact();
        const nome = contact.pushname || 'Paciente';
        const mensagem = msg.body.trim().toLowerCase();
        
        if (!chatStates[chatId]) {
            chatStates[chatId] = 'inicio';
        }

        if (!unrecognizedResponsesCount[chatId]) {
            unrecognizedResponsesCount[chatId] = 0;
        }

        // Check if the chat is in pause state
        if (pauseUntil[chatId] && pauseUntil[chatId] > new Date()) {
            if (mensagem === 'menu') {
                chatStates[chatId] = 'menu';
                delete pauseUntil[chatId];
                msg.reply(`*Escolha uma das opções:*
                    
1️⃣ - Horário de funcionamento
                    
2️⃣ - Agendar consulta
                    
3️⃣ - Avaliação de exames
                    
4️⃣ - Dentista
                    
5️⃣ - Psicólogo
                    
6️⃣ - DIU/Vasectomia
                    
7️⃣ - Grupos
                    
8️⃣ - Tenho dor/sintoma
                    
9️⃣ - Outros`);
            } else {
                msg.reply(`O Joseph irá entrar em contato com você em breve. Digite *menu* para voltar ao menu principal.`);
            }
            return;
        }

        switch (chatStates[chatId]) {
            case 'inicio':
                if (['oi', 'olá'].includes(mensagem)) {
                    msg.reply(`Olá, ${nome}! Sou a assistente virtual do Agente de Saúde *Joseph* da *Equipe Saboya*.
                    
Você já tem cadastro na Clínica da Família Maria José Papera de Azevedo?
                    
1️⃣ - Sim, já tenho
                    
2️⃣ - Não tenho`);
                    chatStates[chatId] = 'cadastro';
                    unrecognizedResponsesCount[chatId] = 0;
                } else {
                    msg.reply(`Desculpe, não entendi sua resposta. Digite *oi* ou *olá* para iniciar a conversa.`);
                    unrecognizedResponsesCount[chatId]++;
                    if (unrecognizedResponsesCount[chatId] >= 3) {
                        msg.reply(`Ok. Pode falar ou escrever aqui o que deseja que assim que possível o Joseph irá entrar em contato.




                        
🔙 Caso queira voltar para as opções, digite *menu* para voltar ao menu principal.`);
                        pauseUntil[chatId] = new Date(new Date().getTime() + 2 * 60 * 1000); // Pause for 2 minutes
                    }
                }
                break;

            case 'cadastro':
                if (mensagem === '1' || mensagem === '1️⃣') {
                    msg.reply(`*Escolha uma das opções:*
                    
1️⃣ - Horário de funcionamento
                    
2️⃣ - Agendar consulta
                    
3️⃣ - Avaliação de exames
                    
4️⃣ - Dentista
                    
5️⃣ - Psicólogo
                    
6️⃣ - DIU/Vasectomia
                    
7️⃣ - Grupos
                    
8️⃣ - Tenho dor/sintoma
                    
9️⃣ - Outros`);
                    chatStates[chatId] = 'menu';
                    unrecognizedResponsesCount[chatId] = 0;
                } else if (mensagem === '2' || mensagem === '2️⃣') {
                    msg.reply(`Para realizar o seu cadastro, você precisa ir até a unidade, no guichê da equipe *Saboya* e apresentar os seguintes documentos:
                    
- Identidade
                    
- CPF
                    
- Comprovante de residência em seu nome
                    
Caso o maior de idade não tenha um comprovante em seu nome, a comprovação da residência pode ser realizada através de uma visita do agente de saúde *Joseph*.`);
                    chatStates[chatId] = 'inicio';
                    unrecognizedResponsesCount[chatId] = 0;
                } else {
                    msg.reply(`Desculpe, não entendi sua resposta. Digite *1* ou *2* para continuar.`);
                    unrecognizedResponsesCount[chatId]++;
                    if (unrecognizedResponsesCount[chatId] >= 3) {
                        msg.reply(`Ok. Pode falar ou escrever aqui o que deseja que assim que possível o Joseph irá entrar em contato.




                        
🔙 Caso queira voltar para as opções, digite *menu* para voltar ao menu principal.`);
                        pauseUntil[chatId] = new Date(new Date().getTime() + 2 * 60 * 1000); // Pause for 2 minutes
                    }
                }
                break;

            case 'menu':
                switch (mensagem) {
                    case '1':
                    case '1️⃣':
                        msg.reply(`O horário de funcionamento da Unidade é de segunda à sexta-feira, de 7 às 18 horas e aos sábados de 7 às 12 horas, exceto feriados e ponto facultativos determinados pela prefeitura.




                        
🔙 Digite *menu* para voltar ao menu principal.`);
                        unrecognizedResponsesCount[chatId] = 0;
                        break;
                    
                    case '2':
                    case '2️⃣':
                        msg.reply(`Ok, primeiro me *diga o motivo da consulta* para que eu possa encaminhar seu pedido para o Joseph.




                        
🔙 Digite *menu* para voltar ao menu principal.`);
                        unrecognizedResponsesCount[chatId] = 0;
                        break;
                    
                    case '3':
                    case '3️⃣':
                        msg.reply(`Entendi. Quais seriam os exames que deseja avaliar?
                        
Você pode enviar o arquivo ou fotos para mim.




                        
🔙 Digite *menu* para voltar ao menu principal.`);
                        unrecognizedResponsesCount[chatId] = 0;
                        break;
                    
                    case '4':
                    case '4️⃣':
                        msg.reply(`O fluxo do Dentista agora *é diretamente no consultório dele*.
                        
Para agendar consulta com ele, pode vir até a unidade de *segunda à sexta-feira, de 7 às 18 horas*.
                        
Para atendimento com ele, o *Dentista* está na unidade de *terça à sexta-feira, de 7 às 18 horas*.




                        
🔙 Digite *menu* para voltar ao menu principal.`);
                        unrecognizedResponsesCount[chatId] = 0;
                        break;
                    
                    case '5':
                    case '5️⃣':
                        msg.reply(`Para agendar uma consulta com o psicólogo, você pode vir até a unidade de segunda à sexta-feira, de 7 às 18 horas.




                        
🔙 Digite *menu* para voltar ao menu principal.`);
                        unrecognizedResponsesCount[chatId] = 0;
                        break;

                    case '6':
                    case '6️⃣':
                        msg.reply(`Para informações sobre DIU ou vasectomia, você pode vir até a unidade de segunda à sexta-feira, de 7 às 18 horas.




                        
🔙 Digite *menu* para voltar ao menu principal.`);
                        unrecognizedResponsesCount[chatId] = 0;
                        break;

                    case '7':
                    case '7️⃣':
                        msg.reply(`Temos diversos grupos de apoio e atividades. Para mais informações, você pode vir até a unidade de segunda à sexta-feira, de 7 às 18 horas.




                        
🔙 Digite *menu* para voltar ao menu principal.`);
                        unrecognizedResponsesCount[chatId] = 0;
                        break;

                    case '8':
                    case '8️⃣':
                        msg.reply(`Se você está com dor ou sintomas, por favor, descreva seus sintomas para que possamos ajudar.




                        
🔙 Digite *menu* para voltar ao menu principal.`);
                        unrecognizedResponsesCount[chatId] = 0;
                        break;

                    case '9':
                    case '9️⃣':
                        msg.reply(`Ok. Pode falar ou escrever aqui o que deseja que assim que possível o Joseph irá entrar em contato.




                        
🔙 Caso queira voltar para as opções, digite *menu* para voltar ao menu principal.`);
                        unrecognizedResponsesCount[chatId] = 0;
                        pauseUntil[chatId] = new Date(new Date().getTime() + 2 * 60 * 1000); // Pause for 2 minutes
                        break;
                    
                    case 'menu':
                        msg.reply(`*Escolha uma das opções:*
                        
1️⃣ - Horário de funcionamento
                        
2️⃣ - Agendar consulta
                        
3️⃣ - Avaliação de exames
                        
4️⃣ - Dentista
                        
5️⃣ - Psicólogo
                        
6️⃣ - DIU/Vasectomia
                        
7️⃣ - Grupos
                        
8️⃣ - Tenho dor/sintoma
                        
9️⃣ - Outros`);
                        unrecognizedResponsesCount[chatId] = 0;
                        break;
                    
                    default:
                        msg.reply(`Desculpe, não entendi sua resposta. Digite *menu* para ver as opções disponíveis.`);
                        unrecognizedResponsesCount[chatId]++;
                        if (unrecognizedResponsesCount[chatId] >= 3) {
                            msg.reply(`Ok. Pode falar ou escrever aqui o que deseja que assim que possível o Joseph irá entrar em contato.




                            
🔙 Caso queira voltar para as opções, digite *menu* para voltar ao menu principal.`);
                            pauseUntil[chatId] = new Date(new Date().getTime() + 2 * 60 * 1000); // Pause for 2 minutes
                        }
                        break;
                }
                break;

            default:
                chatStates[chatId] = 'inicio';
                msg.reply(`Desculpe, não entendi sua resposta. Digite *oi* ou *olá* para iniciar a conversa.`);
                unrecognizedResponsesCount[chatId]++;
                if (unrecognizedResponsesCount[chatId] >= 3) {
                    msg.reply(`Ok. Pode falar ou escrever aqui o que deseja que assim que possível o Joseph irá entrar em contato.




                    
🔙 Caso queira voltar para as opções, digite *menu* para voltar ao menu principal.`);
                    pauseUntil[chatId] = new Date(new Date().getTime() + 2 * 60 * 1000); // Pause for 2 minutes
                }
                break;
        }
    } catch (err) {
        console.error('Erro ao processar mensagem:', err);
    }
});

client.initialize().catch(err => {
    console.error('Erro ao inicializar o cliente:', err);
});