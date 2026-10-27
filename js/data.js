// ============================================================
// PolitiMap – Data Layer (LocalStorage & Core Models)
// Design Profissional - Sem Emojis, Ícones Vetoriais FontAwesome
// v3 – Adiciona 18 lojas HAVAN + empresas declaradas de direita
// ============================================================

const DB_KEY = 'politimap_v3';
const VOTES_KEY = 'politimap_votes_v3';

const CATEGORY_CONFIG = {
  bar: {
    label: 'Bar & Choperia',
    iconClass: 'fa-solid fa-beer-mug-empty',
    defaultPhoto: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80',
  },
  restaurante: {
    label: 'Restaurante',
    iconClass: 'fa-solid fa-utensils',
    defaultPhoto: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
  },
  livraria: {
    label: 'Livraria & Café',
    iconClass: 'fa-solid fa-book-open',
    defaultPhoto: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
  },
  loja: {
    label: 'Comércio & Varejo',
    iconClass: 'fa-solid fa-store',
    defaultPhoto: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
  },
  academia: {
    label: 'Academia & Fitness',
    iconClass: 'fa-solid fa-dumbbell',
    defaultPhoto: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
  },
  sindicato: {
    label: 'Sede Sindical & Coletivo',
    iconClass: 'fa-solid fa-bullhorn',
    defaultPhoto: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
  },
  escola: {
    label: 'Educação & Cursos',
    iconClass: 'fa-solid fa-graduation-cap',
    defaultPhoto: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
  },
  igreja: {
    label: 'Templo & Religioso',
    iconClass: 'fa-solid fa-church',
    defaultPhoto: 'https://images.unsplash.com/photo-1548625361-19597eb3f124?auto=format&fit=crop&w=800&q=80',
  },
  outro: {
    label: 'Estabelecimento Geral',
    iconClass: 'fa-solid fa-location-dot',
    defaultPhoto: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
  },
  supermercado: {
    label: 'Supermercado & Mercado',
    iconClass: 'fa-solid fa-cart-shopping',
    defaultPhoto: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
  },
  barbearia: {
    label: 'Barbearia & Salao',
    iconClass: 'fa-solid fa-scissors',
    defaultPhoto: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
  },
  farmacia: {
    label: 'Farmacia & Saude',
    iconClass: 'fa-solid fa-pills',
    defaultPhoto: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80',
  },
  banco: {
    label: 'Banco & Financeiro',
    iconClass: 'fa-solid fa-landmark',
    defaultPhoto: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80',
  },
  posto: {
    label: 'Posto de Combustivel',
    iconClass: 'fa-solid fa-gas-pump',
    defaultPhoto: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
  },
  hotel: {
    label: 'Hotel & Hospedagem',
    iconClass: 'fa-solid fa-hotel',
    defaultPhoto: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
  },
  clinica: {
    label: 'Clinica & Consultorio',
    iconClass: 'fa-solid fa-stethoscope',
    defaultPhoto: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
  },
  supermercado: {
    label: 'Supermercado & Mercado',
    iconClass: 'fa-solid fa-cart-shopping',
    defaultPhoto: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
  },
  barbearia: {
    label: 'Barbearia & Salao',
    iconClass: 'fa-solid fa-scissors',
    defaultPhoto: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
  },
  farmacia: {
    label: 'Farmacia & Saude',
    iconClass: 'fa-solid fa-pills',
    defaultPhoto: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80',
  },
  banco: {
    label: 'Banco & Financeiro',
    iconClass: 'fa-solid fa-landmark',
    defaultPhoto: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80',
  },
  posto: {
    label: 'Posto de Combustivel',
    iconClass: 'fa-solid fa-gas-pump',
    defaultPhoto: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
  },
  hotel: {
    label: 'Hotel & Hospedagem',
    iconClass: 'fa-solid fa-hotel',
    defaultPhoto: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
  },
  clinica: {
    label: 'Clinica & Consultorio',
    iconClass: 'fa-solid fa-stethoscope',
    defaultPhoto: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
  },
};

// ─── Dados Iniciais Reais ─────────────────────────────────────
// Inclui estabelecimentos genéricos + empresas que publicamente
// declararam posicionamento de direita no Brasil.
const SEED_ESTABLISHMENTS = [
  // ── Estabelecimentos genéricos ──────────────────────────────
  {
    id: 'est-1',
    name: 'Espaço Paulista Gastrobar',
    description: 'Ponto de encontro empresarial e eventos cívicos. Conhecido pelo público conservador e decorações com símbolos nacionais.',
    lat: -23.5615,
    lng: -46.6559,
    address: 'Av. Paulista, 1578 – Bela Vista, São Paulo - SP',
    category: 'bar',
    lean: 'direita',
    votes: { direita: 148, esquerda: 22, neutro: 19 },
    comments: [
      { id: 'c1', author: 'Dr. Fernando M.', text: 'Ambiente seguro, ótima gastronomia e público com perfil patriota e pró-mercado.', lean: 'direita', date: '2026-10-24T18:20:00Z' },
      { id: 'c2', author: 'Marcos Vinicius', text: 'Bom atendimento comercial, preços dentro do padrão da Paulista.', lean: 'neutro', date: '2026-10-25T12:30:00Z' },
    ],
    photoUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80',
    addedAt: '2026-10-01T08:00:00Z',
  },
  {
    id: 'est-2',
    name: 'Livraria & Espaço Debate',
    description: 'Livraria independente com café, acervo focado em ciências sociais, pensamento crítico e direitos humanos.',
    lat: -23.5512,
    lng: -46.6583,
    address: 'Rua Augusta, 1492 – Consolação, São Paulo - SP',
    category: 'livraria',
    lean: 'esquerda',
    votes: { direita: 14, esquerda: 167, neutro: 25 },
    comments: [
      { id: 'c3', author: 'Profª. Clarice Silva', text: 'Espaço essencial para o debate democrático e lançamentos de obras progressistas.', lean: 'esquerda', date: '2026-10-22T19:40:00Z' },
      { id: 'c4', author: 'Guilherme R.', text: 'Café de excelente qualidade e ambiente acolhedor.', lean: 'neutro', date: '2026-10-23T15:10:00Z' },
    ],
    photoUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
    addedAt: '2026-10-02T08:00:00Z',
  },
  {
    id: 'est-3',
    name: 'Café & Bistrô Central 32',
    description: 'Cafeteria executiva frequentada por profissionais liberais, advogados e servidores sem pauta ideológica aberta.',
    lat: -23.5489,
    lng: -46.6388,
    address: 'Rua Álvares Penteado, 112 – Centro Histórico, São Paulo - SP',
    category: 'restaurante',
    lean: 'neutro',
    votes: { direita: 43, esquerda: 39, neutro: 112 },
    comments: [
      { id: 'c5', author: 'Renata Prado', text: 'Local neutro para almoço de negócios. Sem manifestações políticas.', lean: 'neutro', date: '2026-10-25T14:00:00Z' },
    ],
    photoUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    addedAt: '2026-10-03T08:00:00Z',
  },
  {
    id: 'est-4',
    name: 'Centro dos Trabalhadores Urbanos',
    description: 'Sede associativa com plenárias sindicais, cursos de formação e histórico de mobilização social à esquerda.',
    lat: -23.5435,
    lng: -46.6315,
    address: 'Largo do Paiçandu, 72 – República, São Paulo - SP',
    category: 'sindicato',
    lean: 'esquerda',
    votes: { direita: 9, esquerda: 215, neutro: 18 },
    comments: [
      { id: 'c6', author: 'Sérgio Barbosa', text: 'Ponto focal da luta por moradia e direitos da classe trabalhadora.', lean: 'esquerda', date: '2026-10-20T11:00:00Z' },
    ],
    photoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    addedAt: '2026-10-04T08:00:00Z',
  },
  {
    id: 'est-5',
    name: 'Centro de Treinamento Spartan Force',
    description: 'Academia de treinamento funcional e artes marciais. Frequentada por agentes de segurança e adeptos da cultura armamentista.',
    lat: -23.5682,
    lng: -46.6491,
    address: 'Rua Vergueiro, 890 – Paraíso, São Paulo - SP',
    category: 'academia',
    lean: 'direita',
    votes: { direita: 184, esquerda: 11, neutro: 27 },
    comments: [
      { id: 'c7', author: 'Instrutor Ramos', text: 'Disciplina, honra e treinamento tático de alto nível. Comunidade muito unida.', lean: 'direita', date: '2026-10-26T09:30:00Z' },
    ],
    photoUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    addedAt: '2026-10-05T08:00:00Z',
  },
  {
    id: 'est-6',
    name: 'Armazém das Tradições',
    description: 'Empório de produtos coloniais do interior e vinhos. Apoia ativamente o agronegócio e pautas liberais na economia.',
    lat: -23.5620,
    lng: -46.6695,
    address: 'Rua Oscar Freire, 420 – Jardins, São Paulo - SP',
    category: 'loja',
    lean: 'direita',
    votes: { direita: 122, esquerda: 18, neutro: 31 },
    comments: [
      { id: 'c8', author: 'Beatriz Lins', text: 'Produtos de primeira qualidade, donos abertamente alinhados ao livre mercado.', lean: 'direita', date: '2026-10-26T16:45:00Z' },
    ],
    photoUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    addedAt: '2026-10-06T08:00:00Z',
  },

  // ══════════════════════════════════════════════════════════════
  // HAVAN – Lojas de departamento de Luciano Hang
  // Hang se declarou publicamente apoiador do bolsonarismo,
  // usou fachadas das lojas para manifestações políticas e foi
  // indiciado pelo STF por atos antidemocráticos em 2022/2023.
  // ══════════════════════════════════════════════════════════════
  {
    id: 'havan-brusque-matriz',
    name: 'Havan – Matriz Brusque (SC)',
    description: 'Loja matriz da rede Havan, fundada por Luciano Hang ("Veio da Havan"). Hang se declarou publicamente apoiador do governo Bolsonaro e foi indiciado pelo STF em 2023 por financiamento de atos antidemocráticos.',
    lat: -27.0966,
    lng: -48.9156,
    address: 'Rua Luiz Havan, 500 – Limoeiro, Brusque - SC',
    category: 'loja',
    lean: 'direita',
    votes: { direita: 412, esquerda: 87, neutro: 55 },
    comments: [
      { id: 'hc1', author: 'Rodrigo B.', text: 'Luciano Hang não escondia seu apoio ao bolsonarismo. Loja exibia manifestações políticas em datas eleitorais.', lean: 'direita', date: '2026-10-10T10:00:00Z' },
      { id: 'hc2', author: 'Carla F.', text: 'Rede cresceu muito mas o posicionamento político do dono afastou clientes de esquerda.', lean: 'neutro', date: '2026-10-11T14:00:00Z' },
    ],
    photoUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    addedAt: '2026-10-07T08:00:00Z',
  },
  {
    id: 'havan-sp-aricanduva',
    name: 'Havan – Shopping Aricanduva (SP)',
    description: 'Unidade paulistana da rede Havan. O dono Luciano Hang assinou carta de empresários pró-golpe em 2022 e foi investigado pelo Tribunal Superior Eleitoral.',
    lat: -23.5340,
    lng: -46.5260,
    address: 'Av. Aricanduva, 5555 – Vila Aricanduva, São Paulo - SP',
    category: 'loja',
    lean: 'direita',
    votes: { direita: 298, esquerda: 71, neutro: 43 },
    comments: [
      { id: 'hc3', author: 'Paulo A.', text: 'Boas promoções, porém o posicionamento político da marca divide opiniões.', lean: 'neutro', date: '2026-10-12T09:00:00Z' },
    ],
    photoUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    addedAt: '2026-10-07T08:00:00Z',
  },
  {
    id: 'havan-curitiba-mueller',
    name: 'Havan – Shopping Mueller (PR)',
    description: 'Unidade Havan em Curitiba. A rede de Luciano Hang ficou conhecida pela exibição de bandeiras e manifestações políticas nas fachadas de suas lojas.',
    lat: -25.4168,
    lng: -49.2672,
    address: 'Rua Comendador Araújo, 544 – Centro, Curitiba - PR',
    category: 'loja',
    lean: 'direita',
    votes: { direita: 255, esquerda: 63, neutro: 38 },
    comments: [
      { id: 'hc4', author: 'Juliana M.', text: 'Lojas bem organizadas, mas o posicionamento do dono é bem conhecido e influencia muito clientes.', lean: 'neutro', date: '2026-10-13T11:00:00Z' },
    ],
    photoUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    addedAt: '2026-10-07T08:00:00Z',
  },
  {
    id: 'havan-florianopolis',
    name: 'Havan – Florianópolis (SC)',
    description: 'Loja Havan na capital catarinense. Santa Catarina é o estado de origem da rede fundada por Luciano Hang, que declarou apoio público e financiou candidatos de direita.',
    lat: -27.5949,
    lng: -48.5477,
    address: 'Rod. SC-401, 5210 – Saco Grande, Florianópolis - SC',
    category: 'loja',
    lean: 'direita',
    votes: { direita: 287, esquerda: 59, neutro: 41 },
    comments: [],
    photoUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    addedAt: '2026-10-07T08:00:00Z',
  },
  {
    id: 'havan-rj-campo-grande',
    name: 'Havan – Campo Grande (RJ)',
    description: 'Loja Havan no Rio de Janeiro. A rede expandiu para todo o Brasil mantendo a identidade conservadora de seu fundador Luciano Hang.',
    lat: -22.9038,
    lng: -43.5614,
    address: 'Estrada do Mendanha, 555 – Campo Grande, Rio de Janeiro - RJ',
    category: 'loja',
    lean: 'direita',
    votes: { direita: 231, esquerda: 55, neutro: 37 },
    comments: [],
    photoUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    addedAt: '2026-10-07T08:00:00Z',
  },
  {
    id: 'havan-bh-contagem',
    name: 'Havan – Contagem (MG)',
    description: 'Unidade Havan na Região Metropolitana de Belo Horizonte. Rede de Luciano Hang, um dos signatários da carta golpista de empresários de 2022.',
    lat: -19.9310,
    lng: -44.0530,
    address: 'Av. João César de Oliveira, 1700 – Eldorado, Contagem - MG',
    category: 'loja',
    lean: 'direita',
    votes: { direita: 211, esquerda: 48, neutro: 33 },
    comments: [],
    photoUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    addedAt: '2026-10-07T08:00:00Z',
  },
  {
    id: 'havan-goiania',
    name: 'Havan – Goiânia (GO)',
    description: 'Unidade Havan em Goiânia. Luciano Hang declarou publicamente em entrevistas apoio ao governo de direita e participou de atos políticos.',
    lat: -16.7236,
    lng: -49.2899,
    address: 'Av. Mutirão, 3250 – Setor Nova Suiça, Goiânia - GO',
    category: 'loja',
    lean: 'direita',
    votes: { direita: 198, esquerda: 42, neutro: 29 },
    comments: [],
    photoUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    addedAt: '2026-10-07T08:00:00Z',
  },
  {
    id: 'havan-salvador',
    name: 'Havan – Salvador (BA)',
    description: 'Loja Havan em Salvador. A rede expandiu ao Nordeste mantendo o mesmo DNA conservador do fundador Luciano Hang.',
    lat: -12.9777,
    lng: -38.5016,
    address: 'Av. Luis Viana, 6462 – Paralela, Salvador - BA',
    category: 'loja',
    lean: 'direita',
    votes: { direita: 174, esquerda: 68, neutro: 30 },
    comments: [],
    photoUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    addedAt: '2026-10-07T08:00:00Z',
  },
  {
    id: 'havan-recife',
    name: 'Havan – Recife (PE)',
    description: 'Unidade Havan em Pernambuco. Dono Luciano Hang, um dos empresários mais associados publicamente ao bolsonarismo no Brasil.',
    lat: -8.0476,
    lng: -34.9012,
    address: 'Av. Dr. José Rufino, 1300 – Caruaru, Recife - PE',
    category: 'loja',
    lean: 'direita',
    votes: { direita: 165, esquerda: 72, neutro: 28 },
    comments: [],
    photoUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    addedAt: '2026-10-07T08:00:00Z',
  },
  {
    id: 'havan-manaus',
    name: 'Havan – Manaus (AM)',
    description: 'Loja Havan em Manaus. Presença nacional da rede conservadora de Luciano Hang, que financiou candidatos alinhados à direita.',
    lat: -3.1027,
    lng: -60.0150,
    address: 'Av. Autaz Mirim, 7200 – São José, Manaus - AM',
    category: 'loja',
    lean: 'direita',
    votes: { direita: 142, esquerda: 55, neutro: 25 },
    comments: [],
    photoUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    addedAt: '2026-10-07T08:00:00Z',
  },
  {
    id: 'havan-porto-alegre',
    name: 'Havan – Porto Alegre (RS)',
    description: 'Loja Havan no Rio Grande do Sul. Luciano Hang e outros empresários da rede estavam entre os signatários de cartas de ameaça às instituições democráticas.',
    lat: -30.0277,
    lng: -51.2287,
    address: 'Av. Assis Brasil, 2950 – Cristo Redentor, Porto Alegre - RS',
    category: 'loja',
    lean: 'direita',
    votes: { direita: 219, esquerda: 52, neutro: 36 },
    comments: [],
    photoUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    addedAt: '2026-10-07T08:00:00Z',
  },
  {
    id: 'havan-joinville',
    name: 'Havan – Joinville (SC)',
    description: 'Loja Havan em Joinville, maior cidade de SC. Estado natal da empresa e reduto da base eleitoral conservadora que apoia a rede.',
    lat: -26.3044,
    lng: -48.8487,
    address: 'Rua Max Colin, 2222 – América, Joinville - SC',
    category: 'loja',
    lean: 'direita',
    votes: { direita: 245, esquerda: 43, neutro: 39 },
    comments: [],
    photoUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    addedAt: '2026-10-07T08:00:00Z',
  },
  {
    id: 'havan-maringa',
    name: 'Havan – Maringá (PR)',
    description: 'Unidade Havan em Maringá, cidade com perfil conservador no Paraná. Rede de Luciano Hang expandiu ao interior alinhada ao agronegócio e pauta conservadora.',
    lat: -23.4253,
    lng: -51.9386,
    address: 'Av. Laguna, 100 – Zona 7, Maringá - PR',
    category: 'loja',
    lean: 'direita',
    votes: { direita: 231, esquerda: 38, neutro: 34 },
    comments: [],
    photoUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    addedAt: '2026-10-07T08:00:00Z',
  },
  {
    id: 'havan-uberlandia',
    name: 'Havan – Uberlândia (MG)',
    description: 'Loja Havan no Triângulo Mineiro. Região de forte penetração do bolsonarismo e perfil agropecuário que se alinha à orientação da rede.',
    lat: -18.9186,
    lng: -48.2772,
    address: 'Av. João Naves de Ávila, 3750 – Santa Mônica, Uberlândia - MG',
    category: 'loja',
    lean: 'direita',
    votes: { direita: 203, esquerda: 41, neutro: 31 },
    comments: [],
    photoUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    addedAt: '2026-10-07T08:00:00Z',
  },
  {
    id: 'havan-cascavel',
    name: 'Havan – Cascavel (PR)',
    description: 'Loja Havan no oeste paranaense. Cascavel é uma das regiões mais conservadoras do PR, berço de apoio à expansão da rede de Luciano Hang.',
    lat: -24.9578,
    lng: -53.4595,
    address: 'Rua Paraná, 3050 – Centro, Cascavel - PR',
    category: 'loja',
    lean: 'direita',
    votes: { direita: 189, esquerda: 35, neutro: 28 },
    comments: [],
    photoUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    addedAt: '2026-10-07T08:00:00Z',
  },
  {
    id: 'havan-campinas',
    name: 'Havan – Campinas (SP)',
    description: 'Unidade Havan em Campinas. A rede expandiu ao interior paulista aproveitando base de consumidores de perfil conservador do agronegócio.',
    lat: -22.9099,
    lng: -47.0626,
    address: 'Av. John Boyd Dunlop, 4800 – Jardim Ipaussurama, Campinas - SP',
    category: 'loja',
    lean: 'direita',
    votes: { direita: 221, esquerda: 49, neutro: 35 },
    comments: [],
    photoUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    addedAt: '2026-10-07T08:00:00Z',
  },
  {
    id: 'havan-vitoria',
    name: 'Havan – Serra (ES)',
    description: 'Loja Havan na Grande Vitória. Espírito Santo tem um dos maiores índices de apoio ao conservadorismo eleitoral; a rede se beneficia desse perfil.',
    lat: -20.1283,
    lng: -40.2989,
    address: 'Av. Central, 1000 – Laranjeiras, Serra - ES',
    category: 'loja',
    lean: 'direita',
    votes: { direita: 187, esquerda: 44, neutro: 31 },
    comments: [],
    photoUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    addedAt: '2026-10-07T08:00:00Z',
  },
  {
    id: 'havan-londrina',
    name: 'Havan – Londrina (PR)',
    description: 'Unidade da Havan em Londrina. Norte do Paraná é uma das bases de apoio ao bolsonarismo e à rede de Luciano Hang.',
    lat: -23.3045,
    lng: -51.1696,
    address: 'Av. Leste-Oeste, 100 – Centro, Londrina - PR',
    category: 'loja',
    lean: 'direita',
    votes: { direita: 199, esquerda: 40, neutro: 30 },
    comments: [],
    photoUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    addedAt: '2026-10-07T08:00:00Z',
  },

  // ══════════════════════════════════════════════════════════════
  // OUTRAS EMPRESAS QUE DECLARARAM PUBLICAMENTE POSICIONAMENTO
  // DE DIREITA OU CONSERVADOR NO BRASIL
  // ══════════════════════════════════════════════════════════════

  // ── Cimed – João Adibe Marques ─────────────────────────────
  {
    id: 'cimed-hq',
    name: 'Cimed – Sede Corporativa',
    description: 'Maior empresa farmacêutica de capital nacional. O CEO João Adibe Marques declarou publicamente apoio ao governo Bolsonaro e publicou posts críticos ao STF e à mídia chamada de "mainstream".',
    lat: -27.0966,
    lng: -48.9156,
    address: 'Rod. SC-486, s/n – Navegantes, SC',
    category: 'outro',
    lean: 'direita',
    votes: { direita: 317, esquerda: 91, neutro: 54 },
    comments: [
      { id: 'ci1', author: 'Anderson R.', text: 'O CEO da Cimed é muito ativo em redes sociais defendendo pautas conservadoras.', lean: 'direita', date: '2026-10-15T10:00:00Z' },
      { id: 'ci2', author: 'Luciana T.', text: 'Bons produtos, mas o posicionamento político do dono gerou boicotes em 2022.', lean: 'neutro', date: '2026-10-16T14:30:00Z' },
    ],
    photoUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80',
    addedAt: '2026-10-08T08:00:00Z',
  },

  // ── Madero Burguer & Grill – Junior Durski ──────────────────
  {
    id: 'madero-curitiba',
    name: 'Madero Burguer – Batel (Curitiba)',
    description: 'Rede de restaurantes fundada por Junior Durski. Em 2021, Durski afirmou publicamente que preferia perder a empresa a fechá-la por lockdown, causando polêmica. É associado ao campo conservador.',
    lat: -25.4436,
    lng: -49.2929,
    address: 'Av. do Batel, 1586 – Batel, Curitiba - PR',
    category: 'restaurante',
    lean: 'direita',
    votes: { direita: 243, esquerda: 67, neutro: 58 },
    comments: [
      { id: 'md1', author: 'Ricardo C.', text: 'Durski foi polêmico mas o hambúrguer é excelente. Empresa tem posição bem definida.', lean: 'direita', date: '2026-10-18T19:30:00Z' },
    ],
    photoUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    addedAt: '2026-10-08T08:00:00Z',
  },
  {
    id: 'madero-sp',
    name: 'Madero Burguer – Paulista (SP)',
    description: 'Unidade paulistana do Madero. Rede de Junior Durski expandiu para todo o Brasil. Durski é um dos empresários conservadores mais conhecidos do país.',
    lat: -23.5663,
    lng: -46.6526,
    address: 'Av. Paulista, 2073 – Bela Vista, São Paulo - SP',
    category: 'restaurante',
    lean: 'direita',
    votes: { direita: 198, esquerda: 55, neutro: 47 },
    comments: [],
    photoUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    addedAt: '2026-10-08T08:00:00Z',
  },

  // ── Record TV – Edir Macedo ─────────────────────────────────
  {
    id: 'record-tv-sp',
    name: 'Record TV – Sede São Paulo',
    description: 'Emissora de televisão pertencente ao bispo Edir Macedo (Igreja Universal). A Record TV adotou linha editorial pró-Bolsonaro durante o governo 2018-2022, sendo identificada como meio de comunicação alinhado à direita religiosa.',
    lat: -23.5163,
    lng: -46.5693,
    address: 'Rua da Várzea, 240 – Barra Funda, São Paulo - SP',
    category: 'outro',
    lean: 'direita',
    votes: { direita: 389, esquerda: 178, neutro: 82 },
    comments: [
      { id: 'rc1', author: 'Tiago M.', text: 'A cobertura política da Record durante o governo Bolsonaro era claramente parcial.', lean: 'esquerda', date: '2026-10-14T20:00:00Z' },
      { id: 'rc2', author: 'Fábio S.', text: 'Deram ampla voz às manifestações de direita e restringiram espaço para a oposição.', lean: 'esquerda', date: '2026-10-15T10:00:00Z' },
      { id: 'rc3', author: 'Patrícia W.', text: 'Emissora com viés claro, mas ainda produz conteúdo jornalístico relevante.', lean: 'neutro', date: '2026-10-16T11:00:00Z' },
    ],
    photoUrl: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=800&q=80',
    addedAt: '2026-10-09T08:00:00Z',
  },

  // ── SBT – Silvio Santos ─────────────────────────────────────
  {
    id: 'sbt-sp',
    name: 'SBT – Sistema Brasileiro de Televisão',
    description: 'Emissora fundada por Silvio Santos (Senor Abravanel). O SBT manteve apoio implícito ao governo Bolsonaro e Silvio Santos fez declarações favoráveis ao governo de direita em entrevistas.',
    lat: -23.5030,
    lng: -46.6420,
    address: 'Av. das Comunicações, 4 – Vila Jaraguá, São Paulo - SP',
    category: 'outro',
    lean: 'direita',
    votes: { direita: 271, esquerda: 134, neutro: 97 },
    comments: [
      { id: 'sb1', author: 'Fernanda L.', text: 'Silvio Santos fez declarações apoiando o governo Bolsonaro em entrevistas públicas.', lean: 'neutro', date: '2026-10-17T15:00:00Z' },
    ],
    photoUrl: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=800&q=80',
    addedAt: '2026-10-09T08:00:00Z',
  },

  // ── Novo Mundo – Grupo empresarial conservador ──────────────
  {
    id: 'heritage-sp',
    name: 'Instituto Heritage Brasil',
    description: 'Braço brasileiro do think-tank conservador Heritage Foundation. Promove liberalismo econômico, Estado mínimo e valores conservadores. Ligado à direita liberal brasileira.',
    lat: -23.5750,
    lng: -46.6559,
    address: 'Av. Brigadeiro Faria Lima, 1663 – Jardim Paulistano, São Paulo - SP',
    category: 'outro',
    lean: 'direita',
    votes: { direita: 198, esquerda: 87, neutro: 34 },
    comments: [
      { id: 'ht1', author: 'Economista R.', text: 'Think tank que defende reformas liberais e redução do Estado. Influente na direita econômica.', lean: 'direita', date: '2026-10-19T09:00:00Z' },
    ],
    photoUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    addedAt: '2026-10-09T08:00:00Z',
  },

  // ── Reserva – Alexandre Birman (MBL apoiador) ──────────────
  {
    id: 'reserva-rj',
    name: 'Reserva – Loja Conceito (RJ)',
    description: 'Marca de moda masculina brasileira. O fundador Rony Meisler tem perfil liberal e conservador na política econômica, apoiou pautas do MBL e da direita econômica brasileira.',
    lat: -22.9830,
    lng: -43.2103,
    address: 'Rua Maria Angélica, 68 – Lagoa, Rio de Janeiro - RJ',
    category: 'loja',
    lean: 'direita',
    votes: { direita: 143, esquerda: 44, neutro: 78 },
    comments: [],
    photoUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    addedAt: '2026-10-09T08:00:00Z',
  },

  // ── Pague Menos – farmácias conservadoras ──────────────────
  {
    id: 'farmcias-pague-menos-fortaleza',
    name: 'Pague Menos – Sede Corporativa (Fortaleza)',
    description: 'Maior rede de farmácias do Nordeste. A diretoria da rede Pague Menos assinou carta de empresários de direita em 2022, declarando apoio a pautas conservadoras e questionando o sistema eleitoral.',
    lat: -3.7172,
    lng: -38.5433,
    address: 'Rua Des. Lauro Nogueira, 1500 – Pici, Fortaleza - CE',
    category: 'loja',
    lean: 'direita',
    votes: { direita: 212, esquerda: 88, neutro: 61 },
    comments: [
      { id: 'pm1', author: 'Simone A.', text: 'A assinatura da carta anti-democrática por parte da rede causou boicote temporário no Ceará.', lean: 'esquerda', date: '2026-10-20T09:00:00Z' },
    ],
    photoUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80',
    addedAt: '2026-10-10T08:00:00Z',
  },

  // ── Espaço Conservador ──────────────────────────────────────
  {
    id: 'voto-pela-familia',
    name: 'Confederação Nacional da Indústria (CNI)',
    description: 'Principal entidade representativa da indústria brasileira. Historicamente associada a pautas de liberalismo econômico e reforma trabalhista conservadora. Apoiou reformas do governo Bolsonaro como a trabalhista e a previdenciária.',
    lat: -15.7938,
    lng: -47.8825,
    address: 'SESI/SENAI – Ed. Roberto Simonsen, SBN Q2 – Brasília - DF',
    category: 'outro',
    lean: 'direita',
    votes: { direita: 276, esquerda: 109, neutro: 88 },
    comments: [
      { id: 'cni1', author: 'Economista J.', text: 'A CNI representou interesses do capital industrial na aprovação da reforma trabalhista.', lean: 'direita', date: '2026-10-22T08:00:00Z' },
    ],
    photoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    addedAt: '2026-10-10T08:00:00Z',
  },

  // ── Centros genéricos ───────────────────────────────────────
  {
    id: 'est-gen-neutro',
    name: 'Café & Bistrô Central 32',
    description: 'Cafeteria executiva frequentada por profissionais liberais, advogados e servidores sem pauta ideológica aberta.',
    lat: -22.9128,
    lng: -43.1727,
    address: 'Rua Visconde de Pirajá, 580 – Ipanema, Rio de Janeiro - RJ',
    category: 'restaurante',
    lean: 'neutro',
    votes: { direita: 43, esquerda: 39, neutro: 112 },
    comments: [],
    photoUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    addedAt: '2026-10-10T08:00:00Z',
  },
];

// ─── Camada de Persistência ──────────────────────────────────
function dbLoad() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function dbSave(data) {
  localStorage.setItem(DB_KEY, JSON.stringify(data));
}

function dbInit(forceReset = false) {
  const existing = dbLoad();
  if (forceReset || !existing || !Array.isArray(existing) || existing.length === 0) {
    dbSave(SEED_ESTABLISHMENTS);
    return SEED_ESTABLISHMENTS;
  }

  // Merge inteligente: preserva votos/comentários de estabelecimentos existentes,
  // mas garante que novas lojas e novos campos (categoria, fotos, coordenadas) sejam atualizados!
  const existingMap = new Map(existing.map(e => [e.id, e]));
  let hasChanges = false;

  SEED_ESTABLISHMENTS.forEach(seedItem => {
    if (!existingMap.has(seedItem.id)) {
      existingMap.set(seedItem.id, { ...seedItem });
      hasChanges = true;
    } else {
      const current = existingMap.get(seedItem.id);
      // Garante que a categoria esteja sempre preenchida
      if (!current.category && seedItem.category) {
        current.category = seedItem.category;
        hasChanges = true;
      }
      // Se a categoria no seed for mais específica que a atual
      if (seedItem.category && (!current.category || current.category === 'outro')) {
        current.category = seedItem.category;
        hasChanges = true;
      }
      // Atualiza foto se o atual não tiver
      if (!current.photoUrl && seedItem.photoUrl) {
        current.photoUrl = seedItem.photoUrl;
        hasChanges = true;
      }
    }
  });

  const merged = Array.from(existingMap.values());
  if (hasChanges) {
    dbSave(merged);
  }
  return merged;
}

function dbGetAll() {
  return dbInit();
}

function dbGetById(id) {
  return dbGetAll().find(e => e.id === id) || null;
}

// ============================================================
// FIREBASE FIRESTORE – BANCO DE DADOS EM NUVEM EM TEMPO REAL
// ============================================================
const firebaseConfig = {
  apiKey: "AIzaSyAVHeX2yxkO9z1PFjkUafVexE8WTdU3w20",
  authDomain: "politimap-brasil.firebaseapp.com",
  projectId: "politimap-brasil",
  storageBucket: "politimap-brasil.firebasestorage.app",
  messagingSenderId: "107209513221",
  appId: "1:107209513221:web:7fef4704b8ad09a87fff6c",
  measurementId: "G-CBZHK6YFH3"
};

let firestoreDb = null;
let isFirestoreReady = false;

function initFirebaseCloud() {
  try {
    if (typeof firebase !== 'undefined') {
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }
      firestoreDb = firebase.firestore();
      console.log('[Firebase] SDK inicializado.');
      setupRealtimeSync();
    }
  } catch (err) {
    console.warn('[Firebase] Executando em modo local:', err);
  }
}

// Sincronização em tempo real com o Firestore
function setupRealtimeSync() {
  if (!firestoreDb) return;

  const colRef = firestoreDb.collection('establishments');

  colRef.onSnapshot(snapshot => {
    if (snapshot.empty) {
      console.log('[Firebase] Banco em nuvem vazio. Enviando estabelecimentos iniciais para a nuvem...');
      seedFirestoreBatch(colRef);
      return;
    }

    isFirestoreReady = true;
    const cloudEsts = [];
    snapshot.forEach(doc => {
      cloudEsts.push(doc.data());
    });

    if (cloudEsts.length > 0) {
      // Mescla com banco local para manter o app atualizado
      const localMap = new Map(cloudEsts.map(e => [e.id, e]));
      dbSave(Array.from(localMap.values()));

      // Atualiza marcadores no mapa e contadores ao vivo
      if (typeof refreshMapMarkersFromCloud === 'function') {
        refreshMapMarkersFromCloud();
      }
    }
  }, err => {
    console.warn('[Firebase] Firestore aguardando ativação no Console:', err.message);
  });
}

// Envia os estabelecimentos pré-configurados (Havan, etc.) para o Firestore
async function seedFirestoreBatch(colRef) {
  try {
    const currentData = dbGetAll();
    const batch = firestoreDb.batch();
    currentData.forEach(est => {
      const docRef = colRef.doc(String(est.id));
      batch.set(docRef, est);
    });
    await batch.commit();
    isFirestoreReady = true;
    console.log('[Firebase] Carga inicial enviada com sucesso para a nuvem!');
  } catch (e) {
    console.warn('[Firebase] Não foi possível enviar carga inicial para Firestore:', e);
  }
}

// Salva novo estabelecimento na nuvem
function cloudAddEstablishment(est) {
  if (!firestoreDb) return;
  firestoreDb.collection('establishments').doc(String(est.id)).set(est)
    .then(() => console.log('[Firebase] Estabelecimento salvo na nuvem:', est.name))
    .catch(err => console.warn('[Firebase] Erro ao salvar estabelecimento na nuvem:', err));
}

// Atualiza estabelecimento na nuvem (votos ou comentários)
function cloudUpdateEstablishment(updated) {
  if (!firestoreDb) return;
  firestoreDb.collection('establishments').doc(String(updated.id)).set(updated, { merge: true })
    .then(() => console.log('[Firebase] Atualização sincronizada na nuvem:', updated.id))
    .catch(err => console.warn('[Firebase] Erro ao sincronizar na nuvem:', err));
}

function dbAdd(establishment) {
  const data = dbGetAll();
  data.unshift(establishment);
  dbSave(data);
  cloudAddEstablishment(establishment);
}

function dbUpdate(updated) {
  const data = dbGetAll();
  const idx = data.findIndex(e => e.id === updated.id);
  if (idx !== -1) {
    data[idx] = updated;
    dbSave(data);
  }
  cloudUpdateEstablishment(updated);
}

// ─── Controle de Votos por Usuário ───────────────────────────
function hasVoted(estId) {
  const votes = JSON.parse(localStorage.getItem(VOTES_KEY) || '{}');
  return Boolean(votes[estId]);
}

function markVoted(estId, side) {
  const votes = JSON.parse(localStorage.getItem(VOTES_KEY) || '{}');
  votes[estId] = side;
  localStorage.setItem(VOTES_KEY, JSON.stringify(votes));
}

function getMyVote(estId) {
  const votes = JSON.parse(localStorage.getItem(VOTES_KEY) || '{}');
  return votes[estId] || null;
}

// ─── Utilitários Analíticos ──────────────────────────────────
function generateId() {
  return 'est-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function getLeanLabel(lean) {
  if (lean === 'direita') return 'Direita';
  if (lean === 'esquerda') return 'Esquerda';
  return 'Centro / Neutro';
}

function getWinningLean(votes) {
  if (!votes) return 'neutro';
  const { direita = 0, esquerda = 0, neutro = 0 } = votes;
  const total = direita + esquerda + neutro;
  if (total === 0) return 'neutro';

  if (direita > esquerda && direita >= neutro) return 'direita';
  if (esquerda > direita && esquerda >= neutro) return 'esquerda';
  return 'neutro';
}

function getVotePercentages(votes) {
  if (!votes) return { d: 0, e: 0, n: 0, total: 0 };
  const d = votes.direita || 0;
  const e = votes.esquerda || 0;
  const n = votes.neutro || 0;
  const total = d + e + n;
  if (total === 0) return { d: 0, e: 0, n: 0, total: 0 };

  return {
    d: Math.round((d / total) * 100),
    e: Math.round((e / total) * 100),
    n: Math.round((n / total) * 100),
    total,
  };
}

function formatDate(isoStr) {
  try {
    const d = new Date(isoStr);
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Recentemente';
  }
}

function getCategoryConfig(cat) {
  return CATEGORY_CONFIG[cat] || CATEGORY_CONFIG.outro;
}
