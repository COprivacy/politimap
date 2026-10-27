// ============================================================
// PolitiMap – Data Layer (LocalStorage & Core Models)
// Design Profissional - Sem Emojis, Ícones Vetoriais FontAwesome
// ============================================================

const DB_KEY = 'politimap_v2';
const VOTES_KEY = 'politimap_votes_v2';

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
};

// ─── Dados Iniciais Reais ─────────────────────────────────────
const SEED_ESTABLISHMENTS = [
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

function dbInit() {
  const existing = dbLoad();
  if (!existing || !Array.isArray(existing) || existing.length === 0) {
    dbSave(SEED_ESTABLISHMENTS);
    return SEED_ESTABLISHMENTS;
  }
  return existing;
}

function dbGetAll() {
  return dbLoad() || dbInit();
}

function dbGetById(id) {
  return dbGetAll().find(e => e.id === id) || null;
}

function dbAdd(establishment) {
  const data = dbGetAll();
  data.unshift(establishment);
  dbSave(data);
}

function dbUpdate(updated) {
  const data = dbGetAll();
  const idx = data.findIndex(e => e.id === updated.id);
  if (idx !== -1) {
    data[idx] = updated;
    dbSave(data);
  }
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
