// Estrutura do chatbot para WhatsApp - Clínica da Família

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Chatbot está pronto!');
});

client.on('message', async msg => {
    const chat = await msg.getChat();
    const contact = await msg.getContact();
    const nome = contact.pushname || 'Paciente';
    const mensagem = msg.body.trim();
    
    switch (mensagem) {
        case 'oi':
        case 'Oi':
        case 'olá':
        case 'Olá':
            msg.reply(`Olá, ${nome}! Sou a assistente virtual do Agente de Saúde *Joseph* da *Equipe Saboya*.
            
Você já tem cadastro na Clínica da Família Maria José Papera de Azevedo?
            
1️⃣ - Sim, já tenho
            
2️⃣ - Não tenho`);
            break;
        
        case '1':
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
            break;
        
        case '2':
            msg.reply(`Para realizar o seu cadastro, você precisa ir até a unidade, no guichê da equipe *Saboya* e apresentar os seguintes documentos:
            
- Identidade
            
- CPF
            
- Comprovante de residência em seu nome
            
Caso o maior de idade não tenha um comprovante em seu nome, a comprovação da residência pode ser realizada através de uma visita do agente de saúde *Joseph*.`);
            break;
        
        case '1️⃣':
            msg.reply(`O horário de funcionamento da Unidade é de segunda à sexta-feira, de 7 às 18 horas e aos sábados de 7 às 12 horas, exceto feriados e ponto facultativos determinados pela prefeitura.
            
🔙 Digite *menu* para voltar ao menu principal.`);
            break;
        
        case '2️⃣':
            msg.reply(`Ok, primeiro me *diga o motivo da consulta* para que eu possa encaminhar seu pedido para o Joseph.
            
🔙 Digite *menu* para voltar ao menu principal.`);
            break;
        
        case '3️⃣':
            msg.reply(`Entendi. Quais seriam os exames que deseja avaliar?
            
Você pode enviar o arquivo ou fotos para mim.
            
🔙 Digite *menu* para voltar ao menu principal.`);
            break;
        
        case '4️⃣':
            msg.reply(`O fluxo do Dentista agora *é diretamente no consultório dele*.
            
Para agendar consulta com ele, pode vir até a unidade de *segunda à sexta-feira, de 7 às 18 horas*.
            
Para atendimento com ele, o *Dentista* está na unidade de *terça à sexta-feira, de 7 às 18 horas*.
            
🔙 Digite *menu* para voltar ao menu principal.`);
            break;
        
        case '9️⃣':
            msg.reply(`Ok. Pode escrever aqui o que deseja que assim que possível o Joseph irá entrar em contato.`);
            break;
        
        case 'menu':
        case 'Menu':
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
            break;
        
        default:
            msg.reply(`Desculpe, não entendi sua resposta. Digite *menu* para ver as opções disponíveis.`);
            break;
    }
});

client.initialize();
