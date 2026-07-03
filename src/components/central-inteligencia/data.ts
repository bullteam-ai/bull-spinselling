export type Medo = { icon: string; titulo: string; frase: string; comoReduzir: string };

export const MEDOS: Medo[] = [
  {
    icon: "😟",
    titulo: "Medo de julgamento",
    frase: "“O que essa pessoa vai pensar de mim?”",
    comoReduzir:
      "Mostre que indicar alguém não significa vender algo. Significa compartilhar uma oportunidade.",
  },
  {
    icon: "🤝",
    titulo: "Medo de responsabilidade",
    frase: "“E se ela achar ruim?”",
    comoReduzir:
      "Reforce que a decisão sempre continuará sendo da pessoa indicada.",
  },
  {
    icon: "🔒",
    titulo: "Medo de perder controle",
    frase: "“Você vai ligar sem eu saber.”",
    comoReduzir:
      "Explique exatamente como funciona o processo e devolva o controle ao cliente.",
  },
  {
    icon: "📱",
    titulo: "Medo de exposição",
    frase: "“Não gosto de passar telefone.”",
    comoReduzir:
      "Mostre que o contato será tratado com respeito e utilizado apenas para um convite.",
  },
  {
    icon: "💬",
    titulo: "Medo de parecer vendedor",
    frase: "“Não quero misturar amizade com negócio.”",
    comoReduzir:
      "Reposicione. Ele não está vendendo. Está apenas abrindo uma oportunidade para alguém importante.",
  },
];

export type Escada = {
  n: number;
  titulo: string;
  objetivo: string;
  exemplos: string[];
  regra?: string;
};

export const ESCADA: Escada[] = [
  {
    n: 1,
    titulo: "Validar",
    objetivo: "Reduzir imediatamente a resistência.",
    exemplos: ["“Faz sentido.”", "“Entendo seu ponto.”", "“É um cuidado importante mesmo.”"],
    regra: "Nunca comece respondendo. Primeiro faça o cliente sentir que foi compreendido.",
  },
  {
    n: 2,
    titulo: "Reenquadrar",
    objetivo: "Mudar a perspectiva do cliente.",
    exemplos: [
      "“Na verdade você não está comprometendo ninguém. Está apenas permitindo que essa pessoa escolha.”",
    ],
  },
  {
    n: 3,
    titulo: "Gerar segurança",
    objetivo: "O cliente precisa perceber que…",
    exemplos: [
      "✔ ninguém será pressionado",
      "✔ ninguém será obrigado",
      "✔ ninguém perderá dinheiro",
      "✔ ninguém será exposto",
    ],
    regra:
      "Quanto menor o risco percebido, maior será a chance de indicação.",
  },
  {
    n: 4,
    titulo: "Mostrar oportunidade",
    objetivo: "Nunca transforme a indicação em um favor. Sempre em oportunidade.",
    exemplos: [
      "“Assim como essa conversa trouxe clareza para você, pode ajudar alguém importante na sua vida.”",
    ],
  },
  {
    n: 5,
    titulo: "Pedir ação",
    objetivo: "Depois de reduzir o medo, conduza para uma ação concreta.",
    exemplos: [
      "❌ “Depois você me manda.”",
      "✅ “Quem foi a primeira pessoa que veio à sua cabeça?”",
    ],
  },
];

export type Objecao = {
  id: string;
  frase: string;
  significado: string;
  objetivo: string;
  resposta: string;
  escalada: string;
  ultimaCartada: string;
  fraseBolso: string;
  erroComum: string;
};

export const OBJECOES: Objecao[] = [
  {
    id: "pensar",
    frase: "Quero pensar melhor antes de passar alguém",
    significado: "Medo de julgamento e de responsabilidade. Ele ainda não se sente seguro.",
    objetivo: "Reduzir o risco percebido e devolver o controle antes de pedir novamente.",
    resposta:
      "Faz total sentido. Pensar antes é sinal de cuidado. Só quero deixar claro: ninguém será pressionado — o convite é só para uma conversa como a nossa, e a decisão continua sendo dela. Enquanto a gente pensa, qual foi a primeira pessoa que veio à sua cabeça?",
    escalada:
      "Entendi. Se te ajudar, posso te mostrar exatamente como eu faço o primeiro contato — nada invasivo, só um convite. Aí você me diz se faz sentido.",
    ultimaCartada:
      "Sem problema. Só uma coisa: o ‘pensar depois’ normalmente vira ‘nunca’. Se hoje você lembra de alguém que talvez se beneficie, prefere segurar essa oportunidade só para você ou permitir que ela também tenha essa clareza que você teve?",
    fraseBolso: "A decisão continua sendo dela. Você só está abrindo a porta.",
    erroComum: "Aceitar o ‘vou pensar’ e não fazer nenhuma pergunta em seguida.",
  },
  {
    id: "falar-antes",
    frase: "Preciso falar com a pessoa antes",
    significado: "Medo de perder controle e de expor a amizade.",
    objetivo: "Mostrar que o processo respeita a relação e devolver o controle.",
    resposta:
      "Perfeito, é assim que deve ser mesmo. Aliás, funciona melhor quando você fala antes — a pessoa fica mais aberta. Combinamos assim: você me passa 2 ou 3 nomes agora, fala com eles hoje ou amanhã, e só depois eu entro em contato. Combinado?",
    escalada:
      "Se preferir, posso te mandar um textinho pronto para você adaptar e enviar. Assim fica natural e você tem controle total do que é dito.",
    ultimaCartada:
      "Deixa eu te propor o seguinte: escolhe UMA pessoa em quem você mais confia. Fala com ela essa semana. Se ela topar, seguimos. Faz sentido?",
    fraseBolso: "Você fala primeiro. Eu só entro quando ela permitir.",
    erroComum: "Aceitar o ‘eu falo antes’ sem combinar prazo nem próximo passo.",
  },
  {
    id: "numero-agora",
    frase: "Não quero passar número agora",
    significado: "Medo de exposição e de LGPD/privacidade.",
    objetivo: "Gerar segurança sobre o uso do contato e propor caminho alternativo.",
    resposta:
      "Faz sentido esse cuidado, cada vez mais importante. Não precisa passar número hoje. O que faz mais sentido para você: você mesmo(a) faz a ponte com a pessoa, ou combinamos de você me enviar depois só quando ela autorizar?",
    escalada:
      "Se te deixar mais tranquilo(a), o contato só é usado para um convite. Se ela não quiser, o assunto morre ali — sem insistência.",
    ultimaCartada:
      "Certo. Então vamos fazer diferente: me diz só o primeiro nome e como você a conhece. Você conversa com ela e me confirma depois. Quem vem primeiro na sua cabeça?",
    fraseBolso: "Nome primeiro. Contato só quando ela autorizar.",
    erroComum: "Insistir por número no mesmo momento.",
  },
  {
    id: "depois-whats",
    frase: "Depois eu mando no WhatsApp",
    significado: "Procrastinação. A memória e o desejo diminuem com o tempo.",
    objetivo: "Aproveitar o momento sem soar pressão.",
    resposta:
      "Combinado. Só que a memória funciona muito melhor agora, enquanto a gente está conversando. Que tal a gente listar rapidinho aqui só 3 nomes que já vieram à sua cabeça, e o resto você me manda com calma no zap?",
    escalada:
      "Se preferir, deixa comigo: eu vou fazendo perguntas e você só vai me dizendo nomes. Sem compromisso ainda com telefone. Topa?",
    ultimaCartada:
      "Sem problema. Combinamos assim então: eu te mando uma mensagem hoje à noite e você me responde 3 nomes. Fecha?",
    fraseBolso: "O depois normalmente vira nunca.",
    erroComum: "Encerrar a reunião sem tirar pelo menos 3 nomes ali.",
  },
  {
    id: "nao-lembro",
    frase: "Não lembro de ninguém agora",
    significado: "Falta de gatilho de memória. Não é falta de rede — é falta de estímulo.",
    objetivo: "Ativar categorias específicas com o Radar de Pessoas.",
    resposta:
      "Normal, o cérebro trava quando a pergunta é ampla. Vamos por categorias: dos AMIGOS que você mais convive hoje, quais são os 3 primeiros nomes que vêm à sua cabeça?",
    escalada:
      "E pensando nas pessoas do seu trabalho / academia / igreja — quem aparece primeiro? Não precisa filtrar ainda, só me diz os nomes.",
    ultimaCartada:
      "Vou te ajudar: quem casou recentemente, teve filho, comprou imóvel ou fala em aposentadoria? Pode ser mais de um.",
    fraseBolso: "Não é falta de gente. É falta de gatilho.",
    erroComum: "Aceitar o ‘não lembro’ e mudar de assunto.",
  },
  {
    id: "pode-nao-querer",
    frase: "A pessoa pode não querer",
    significado: "Medo de responsabilidade pela decisão do outro.",
    objetivo: "Devolver a responsabilidade à pessoa indicada.",
    resposta:
      "Justamente por isso o convite é da pessoa, não seu. Você só abre a porta — quem decide entrar é ela. Quem seria a primeira pessoa que você acha que MERECE receber esse convite, mesmo que depois ela diga que não é o momento?",
    escalada:
      "Se ela não quiser, o assunto termina ali. Nada muda entre vocês. O único risco real é ela não receber a oportunidade.",
    ultimaCartada:
      "Pensa assim: se alguém tivesse essa conversa e não te convidasse, você preferiria ter ficado sabendo ou não?",
    fraseBolso: "A decisão continua sendo dela.",
    erroComum: "Concordar e desistir.",
  },
  {
    id: "nao-sei-objetivo",
    frase: "Nem sei se esse é o objetivo dela",
    significado: "Projeção do próprio julgamento. Ele decide pela outra pessoa.",
    objetivo: "Retirar o filtro. A escolha é dela.",
    resposta:
      "Boa reflexão. Só que essa é exatamente a pergunta que ela precisa se fazer — não a gente. O convite é uma conversa, sem custo, sem compromisso. Quem, mesmo que hoje não pareça ‘o momento’, você acha que merece pelo menos ter essa chance de escolher?",
    escalada:
      "Muitas vezes as pessoas nem sabem que existe esse tipo de conversa. Talvez a maior contribuição seja simplesmente apresentar.",
    ultimaCartada:
      "Se você tivesse que apostar em 3 pessoas que talvez se beneficiassem — mesmo sem certeza — quem seriam?",
    fraseBolso: "Você não decide por ela. Só abre a porta.",
    erroComum: "Deixar o vendedor filtrar por ele mesmo.",
  },
  {
    id: "cansado",
    frase: "Estou cansado / minha cabeça já deu",
    significado: "Fadiga real da reunião. Não é objeção — é limite.",
    objetivo: "Respeitar o momento sem perder a REC. Reduzir esforço.",
    resposta:
      "Entendo, foi uma conversa densa mesmo. Vamos facilitar: em vez de nomes, me diz só categorias — família, trabalho, amigos, empresários. Quais dessas categorias primeiro vem à sua cabeça?",
    escalada:
      "Se preferir, marcamos 10 minutos amanhã só para isso. Sua cabeça vai estar mais fresca e você vai me trazer o triplo de nomes.",
    ultimaCartada:
      "Fecha assim então: um único nome agora, o que estiver mais fácil. E amanhã você me manda mais 2 no zap.",
    fraseBolso: "Facilita: categoria antes de nome.",
    erroComum: "Insistir por 10 nomes com o cliente exausto.",
  },
  {
    id: "sair-agora",
    frase: "Preciso sair agora",
    significado: "Restrição real de tempo. Precisa ser rápido e respeitoso.",
    objetivo: "Salvar a REC em 60 segundos.",
    resposta:
      "Sem problema, respeito seu tempo. Em 1 minuto: me diz os 3 primeiros nomes que vierem — sem filtro, sem contexto. Ganho de tempo pra nós dois. Pode ir.",
    escalada:
      "Se rolar 1 nome só agora, já ajuda. O resto você me manda por mensagem hoje à noite.",
    ultimaCartada:
      "Combinamos assim: você sai agora, e às [horário] eu te chamo no zap pra fechar 5 minutinhos. Fecha?",
    fraseBolso: "60 segundos, 3 nomes.",
    erroComum: "Encerrar sem agendar retorno.",
  },
  {
    id: "invasivo",
    frase: "Isso parece invasivo",
    significado: "Medo de parecer vendedor / de expor pessoas próximas.",
    objetivo: "Reposicionar como oportunidade, não abordagem fria.",
    resposta:
      "Faz total sentido pensar assim. Mas repara: você não está vendendo nada. Está apenas dizendo pra alguém importante ‘tive uma conversa boa, se quiser conhecer, avisa’. Quem, na sua vida, você acha que mereceria pelo menos SABER que existe essa possibilidade?",
    escalada:
      "A abordagem é totalmente respeitosa. Se em qualquer momento a pessoa não quiser, o assunto termina ali.",
    ultimaCartada:
      "Se ainda parecer invasivo, você mesmo(a) faz a ponte. Eu só entro quando ela pedir.",
    fraseBolso: "Você não vende. Você apresenta.",
    erroComum: "Ignorar o desconforto e insistir.",
  },
  {
    id: "misturar",
    frase: "Não quero misturar amigos/família com isso",
    significado: "Medo de contaminar a relação com dinheiro.",
    objetivo: "Separar ‘conversa’ de ‘venda’.",
    resposta:
      "Entendo. Aliás, é justamente o contrário: quem menos deveria ficar de fora dessa conversa é quem você mais ama. Não é sobre vender nada — é sobre garantir que quem está perto de você tenha a mesma clareza que você teve hoje.",
    escalada:
      "Se preferir, começamos pelas pessoas menos próximas — colegas, conhecidos — e depois você decide se faz sentido incluir família.",
    ultimaCartada:
      "Pensa comigo: o que estraga uma amizade é dinheiro mal falado, não uma boa conversa. Você confia em como conversamos hoje?",
    fraseBolso: "Quem você ama merece a mesma clareza que você teve.",
    erroComum: "Aceitar o ‘família não’ sem oferecer outros nichos.",
  },
  {
    id: "ligar-sem-confirmar",
    frase: "Se eu passar, você vai ligar sem eu confirmar?",
    significado: "Medo de perder controle sobre a relação.",
    objetivo: "Devolver o controle do processo ao cliente.",
    resposta:
      "Nunca. O combinado é: você fala com ela primeiro. Só depois que ela autorizar, eu entro em contato. Você tem o controle total do timing. Isso te deixa mais confortável?",
    escalada:
      "Se quiser, marcamos um dia pra você me confirmar. Sem o seu ‘ok’, eu não ligo.",
    ultimaCartada:
      "Se preferir extremo cuidado: você mesmo(a) agenda a conversa entre nós. Quando quiser.",
    fraseBolso: "Você autoriza. Eu executo.",
    erroComum: "Prometer discrição vaga sem explicar o processo.",
  },
  {
    id: "com-calma",
    frase: "Depois vejo isso com calma",
    significado: "Procrastinação educada. Costuma virar zero.",
    objetivo: "Fazer AGORA o mínimo viável.",
    resposta:
      "Beleza. Só pra não deixar o assunto morrer: enquanto vemos ‘com calma’, me diz apenas os 3 primeiros nomes que vieram à sua cabeça durante a nossa conversa. Só isso.",
    escalada:
      "Se preferir, mando uma mensagem hoje à noite com uma pergunta simples. Você responde quando puder.",
    ultimaCartada:
      "Combinamos data para revisitar? Assim garantimos que ‘depois’ tem endereço.",
    fraseBolso: "‘Depois’ precisa de data.",
    erroComum: "Aceitar sem marcar retorno.",
  },
  {
    id: "sem-numero",
    frase: "Não sei o número de cabeça",
    significado: "Barreira operacional real. Nada emocional aqui.",
    objetivo: "Não pedir número agora. Pedir nome + contexto.",
    resposta:
      "Tranquilo, número quase ninguém sabe de cabeça hoje em dia. Me passa só o nome e como vocês se conhecem — quando você falar com ela, aí você me manda o contato.",
    escalada:
      "Se preferir, abre a agenda do celular na hora e pesquisa. Leva 10 segundos.",
    ultimaCartada:
      "Combinamos assim: nome agora, contato hoje à noite no zap.",
    fraseBolso: "Nome primeiro. Contato depois.",
    erroComum: "Insistir por número e travar a REC.",
  },
  {
    id: "lgpd",
    frase: "Tenho receio por LGPD / privacidade",
    significado: "Preocupação legítima e crescente.",
    objetivo: "Mostrar processo respeitoso e consentimento explícito.",
    resposta:
      "Preocupação super válida. Justamente por isso o modelo aqui é diferente: você fala com a pessoa antes, ela consente, e só então eu entro em contato. Nada de contato sem autorização. Isso resolve seu receio?",
    escalada:
      "Posso te mostrar exatamente como funciona o primeiro contato. É formal e respeitoso.",
    ultimaCartada:
      "Se ainda tiver dúvida, você mesmo(a) apresenta a gente. Eu só entro quando ela quiser.",
    fraseBolso: "Sem consentimento, sem contato.",
    erroComum: "Minimizar a preocupação.",
  },
  {
    id: "tem-assessor",
    frase: "Ela já tem assessor financeiro",
    significado: "Confusão comum: assessor de investimentos ≠ planejamento financeiro.",
    objetivo: "Diferenciar sem desqualificar o outro profissional.",
    resposta:
      "Ótimo, mostra que ela já se preocupa. Só que o que fazemos aqui é diferente — assessor cuida dos investimentos, a gente cuida do PLANEJAMENTO como um todo: proteção, aposentadoria, filhos, sucessão. Um complementa o outro. Faz sentido apresentar?",
    escalada:
      "Ela pode manter o assessor 100%. Nossa conversa é sobre estratégia de vida financeira, não sobre produto.",
    ultimaCartada:
      "Se depois ela decidir que não precisa, ótimo. Mas pelo menos ela vai ter tido a visão completa.",
    fraseBolso: "Investimento é peça. Planejamento é o tabuleiro.",
    erroComum: "Desqualificar o assessor atual.",
  },
  {
    id: "outra-cidade",
    frase: "Ela mora em outra cidade",
    significado: "Objeção fraca / desatualizada. Fácil de contornar.",
    objetivo: "Reforçar que o processo é 100% remoto.",
    resposta:
      "Sem problema nenhum, tudo é feito por vídeo, como já fazemos hoje. Inclusive muitos clientes moram fora. Qual o nome dela?",
    escalada: "Fuso, cidade, país — não faz diferença. Basta ela ter internet.",
    ultimaCartada:
      "Se preferir, marcamos um horário adaptado à cidade dela.",
    fraseBolso: "Distância deixou de existir.",
    erroComum: "Aceitar como se fosse impedimento real.",
  },
  {
    id: "sem-dinheiro",
    frase: "Ela não tem dinheiro",
    significado: "Projeção. O cliente decide pela pessoa antes da hora.",
    objetivo: "Retirar o filtro financeiro do cliente.",
    resposta:
      "Entendi. Só que planejamento não é sobre quanto ela tem hoje, é sobre organizar o que ela vai ter. Muita gente que ‘não tinha’ começou justamente por essa conversa. Quem você conhece que talvez esteja nessa fase?",
    escalada:
      "A primeira conversa é gratuita e serve exatamente pra ela entender se faz sentido continuar. Não tem risco.",
    ultimaCartada:
      "Pensa assim: quem menos tem é quem mais precisa se planejar. Não seria injusto ela não ter nem a chance?",
    fraseBolso: "Planejamento é pra construir, não pra ostentar.",
    erroComum: "Aceitar o filtro do cliente.",
  },
  {
    id: "ocupada",
    frase: "Ela é muito ocupada",
    significado: "Mais uma projeção — o cliente decide pela agenda do outro.",
    objetivo: "Devolver a decisão pra pessoa indicada.",
    resposta:
      "Justo pessoas ocupadas são as que mais precisam de clareza financeira, porque não têm tempo pra arrumar depois. A conversa é curta e ela mesma decide se vale. Qual o nome?",
    escalada:
      "Marcamos no horário que ela puder. Manhã cedo, fim do dia, sábado — o que for melhor pra ela.",
    ultimaCartada:
      "Se ela topar 30 minutos, ótimo. Se não, ela mesma diz. Você só apresenta.",
    fraseBolso: "Quem é ocupado precisa mais, não menos.",
    erroComum: "Decidir pela agenda dos outros.",
  },
  {
    id: "incomodar",
    frase: "Não quero incomodar ninguém",
    significado: "Medo de exposição + de parecer vendedor.",
    objetivo: "Reposicionar como serviço, não incômodo.",
    resposta:
      "Entendo, mas repara: o que é incomodar? É oferecer algo que a pessoa não pediu e que não agrega. Aqui é o oposto — você está oferecendo uma conversa que trouxe clareza pra você. Isso não é incômodo, é generosidade.",
    escalada:
      "Se ela achar chato, é só dizer não. Nada muda entre vocês.",
    ultimaCartada:
      "Pensa em quem te apresentou coisas boas na vida. Você chama isso de incômodo?",
    fraseBolso: "Apresentar é o oposto de incomodar.",
    erroComum: "Concordar e recuar.",
  },
  {
    id: "vergonha",
    frase: "Tenho vergonha de indicar",
    significado: "Medo de julgamento social.",
    objetivo: "Retirar o peso emocional. Normalizar.",
    resposta:
      "Muita gente sente isso no começo. Mas indicar não é ‘vender’ — é apenas dizer ‘conheci uma conversa que fez sentido pra mim, e talvez faça pra você’. Simples assim. Quem você chamaria primeiro se essa vergonha não existisse?",
    escalada:
      "Se preferir, você só me apresenta e eu explico o resto. Você não precisa vender nada.",
    ultimaCartada:
      "A vergonha some quando a primeira pessoa que você indica agradece por ter sido lembrada.",
    fraseBolso: "Apresentar não é vender.",
    erroComum: "Ignorar o sentimento.",
  },
  {
    id: "quieto",
    frase: "Acho melhor deixar quieto",
    significado: "Rejeição educada, mistura de medos.",
    objetivo: "Desmontar o ‘quieto’ com uma pergunta específica.",
    resposta:
      "Entendo. Só pra ter certeza: você acha melhor deixar quieto pra você ou pras pessoas que talvez se beneficiassem? Porque nem toda oportunidade cabe no silêncio.",
    escalada:
      "Se quiser, começamos com apenas 1 nome — aquele mais óbvio. E aí você decide o resto depois.",
    ultimaCartada:
      "Se essa porta ficar fechada agora, provavelmente não abre depois. Vale abrir uma frestinha?",
    fraseBolso: "Nem toda oportunidade cabe no silêncio.",
    erroComum: "Aceitar o ‘quieto’ e mudar de assunto.",
  },
  {
    id: "ja-tentou",
    frase: "Ela já tentou isso antes",
    significado: "Objeção herdada da experiência anterior da pessoa indicada.",
    objetivo: "Diferenciar sem desqualificar a experiência passada.",
    resposta:
      "Isso é bem comum. Justamente por já ter tentado, ela sabe reconhecer diferença. Nosso modelo é diferente porque [X]. Vale ela pelo menos comparar? Qual o nome dela?",
    escalada:
      "Se ela achar que é a mesma coisa, ela mesma vai dizer. Você só apresenta.",
    ultimaCartada:
      "Justamente quem já tentou é quem mais valoriza quando encontra algo que funciona.",
    fraseBolso: "Quem já tentou reconhece diferença.",
    erroComum: "Aceitar como definitivo.",
  },
  {
    id: "nao-acredita",
    frase: "Ela não acredita muito nessas coisas",
    significado: "Projeção da crença do próprio cliente sobre o outro.",
    objetivo: "Devolver a decisão pra pessoa indicada.",
    resposta:
      "Ótimo, gente cética costuma virar os melhores clientes porque quando entendem, entendem de verdade. Deixa ela decidir se acredita ou não depois de UMA conversa. Qual o nome?",
    escalada: "O convite é justamente uma conversa sem compromisso. Ela julga depois.",
    ultimaCartada:
      "Se ela não acreditar, ótimo — você respeitou a opinião dela. Se acreditar, você abriu uma porta.",
    fraseBolso: "Cético informado > entusiasta sem base.",
    erroComum: "Concordar com a projeção.",
  },
];

export const RADAR: Record<string, string[]> = {
  Família: [
    "Quem sempre pede sua opinião sobre dinheiro?",
    "Quem na família mais fala sobre aposentadoria?",
    "Quem teve mudança grande de vida recentemente?",
  ],
  Colegas: [
    "Quem no trabalho reclama de dinheiro?",
    "Quem foi promovido nos últimos meses?",
    "Quem trocou de emprego recentemente?",
  ],
  Empresários: [
    "Quais os 3 empresários mais bem sucedidos que você conhece pessoalmente?",
    "Quem abriu ou vendeu empresa nos últimos anos?",
    "Quem tem sócio e nunca conversou sobre proteção?",
  ],
  Médicos: [
    "Quais os 3 médicos mais respeitados da sua rede?",
    "Quem acabou de terminar residência?",
    "Quem virou sócio de clínica recentemente?",
  ],
  Dentistas: [
    "Quais dentistas mais cresceram nos últimos anos?",
    "Quem abriu clínica própria?",
  ],
  Advogados: [
    "Quais os 3 advogados mais bem posicionados?",
    "Quem virou sócio recentemente?",
  ],
  "Pais da escola": [
    "Quem são os pais mais preocupados com o futuro dos filhos?",
    "Quem sempre comenta sobre educação dos filhos?",
  ],
  Academia: [
    "Quem você mais conversa na academia?",
    "Quem parece estar em uma fase boa de vida?",
  ],
  Igreja: [
    "Quem da sua comunidade mais admira profissionalmente?",
    "Quem tem filhos crescendo e ainda não planejou nada?",
  ],
  Clientes: [
    "Quais são seus 3 melhores clientes?",
    "Quem entre eles tem perfil parecido com o seu?",
  ],
  Fornecedores: [
    "Quais fornecedores viraram próximos?",
    "Quem entre eles cresceu junto com você?",
  ],
  Parceiros: [
    "Quais parceiros de negócio se dariam bem com essa conversa?",
    "Quem indicou você a alguém importante recentemente?",
  ],
  "Casou recentemente": [
    "Quem casou nos últimos 12 meses?",
    "Quem está planejando morar junto?",
  ],
  "Teve filho": [
    "Quem virou pai/mãe recentemente?",
    "Quem está esperando bebê?",
  ],
  "Comprou imóvel": [
    "Quem comprou casa/apto nos últimos 2 anos?",
    "Quem está tentando comprar mas não organizou financeiramente?",
  ],
  "Vendeu empresa": [
    "Quem vendeu ou está vendendo empresa?",
    "Quem recebeu evento de liquidez?",
  ],
  "Quer empreender": [
    "Quem sempre fala em abrir negócio?",
    "Quem está de saco cheio do CLT?",
  ],
  "Reclama de dinheiro": [
    "Quem sempre reclama que ‘não sobra nada’?",
    "Quem ganha bem e mesmo assim vive apertado?",
  ],
  Aposentadoria: [
    "Quem já mencionou aposentadoria nos últimos meses?",
    "Quem tem medo do INSS?",
  ],
  Herança: [
    "Quem recebeu herança e não sabe o que fazer?",
    "Quem tem herança prevista e nunca conversou sobre isso?",
  ],
};

export const FRASES = [
  {
    titulo: "Reduzir risco",
    itens: [
      "Ninguém perde absolutamente nada por conversar.",
      "A decisão continua sendo dela.",
      "Ela continua no controle.",
      "O convite não gera compromisso.",
    ],
  },
  {
    titulo: "Compartilhar oportunidade",
    itens: [
      "Você não está fazendo um favor para mim.",
      "Está abrindo uma oportunidade para alguém importante.",
      "Boas oportunidades normalmente chegam através de pessoas de confiança.",
    ],
  },
  {
    titulo: "Quebrar procrastinação",
    itens: [
      "O depois normalmente vira nunca.",
      "A memória funciona melhor agora.",
      "Enquanto estamos conversando, as pessoas aparecem naturalmente.",
    ],
  },
  {
    titulo: "Responsabilidade positiva",
    itens: [
      "Às vezes a melhor ajuda não é dinheiro.",
      "É apresentar a pessoa certa.",
    ],
  },
  {
    titulo: "Criar urgência",
    itens: [
      "Se essa porta não for aberta agora, talvez essa oportunidade nunca chegue até ela.",
    ],
  },
  {
    titulo: "Gerar reciprocidade",
    itens: [
      "Assim como alguém lembrou de você um dia, hoje você pode lembrar de outra pessoa.",
    ],
  },
];

export const ERROS = [
  {
    titulo: "Parecer desesperado",
    texto:
      "O cliente percebe quando a recomendação parece apenas uma meta. Mantenha o foco no benefício da pessoa indicada.",
  },
  {
    titulo: "Discutir",
    texto: "Objeções não se vencem no argumento. São reduzidas diminuindo o medo.",
  },
  {
    titulo: "Invalidar sentimentos",
    texto:
      "Nunca diga: “Não precisa pensar assim.” Prefira: “Faz sentido esse cuidado.”",
  },
  {
    titulo: "Pedir contato cedo demais",
    texto: "Primeiro gere segurança. Depois peça ação.",
  },
  {
    titulo: "Transformar indicação em favor",
    texto:
      "Nunca: “Você pode me ajudar?”. Prefira: “Quem pode se beneficiar dessa conversa?”",
  },
  {
    titulo: "Esquecer o próximo passo",
    texto:
      "Toda REC precisa terminar com um compromisso claro. Ex: “Combina com ela hoje e amanhã me manda mensagem confirmando.”",
  },
  {
    titulo: "Soar como robô",
    texto:
      "Scripts existem para dar direção, não para tirar naturalidade. Conversa, não leitura.",
  },
];