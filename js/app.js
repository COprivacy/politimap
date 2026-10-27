// ============================================================
// PolitiMap – Controlador da Aplicação
// Sem Emojis, 100% Livre de Chaves de API e Sem Bloqueios (403)
// Suporte Completo a GPS (Hardware + Rede/IP Fallback)
// ============================================================

let mainMap;
let miniMapPicker;
let markersMap = {};
let currentActiveFilter = 'all';
let selectedEstablishmentId = null;
let temporaryPickerMarker = null;
let currentUserMarker = null;
let currentTileIndex = 0;
let currentTileLayer = null;
let currentReferenceLayer = null;

// Configuração de Camadas Estilo Tesla Navigation (100% Livres de API Key e Marcas d'água)
const MAP_TILE_CONFIGS = [
  {
    name: 'tesla',
    label: 'Tesla Cyber Stealth (Padrão)',
    base: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    reference: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
    options: {
      maxNativeZoom: 16,
      maxZoom: 19,
      attribution: '&copy; Tesla Navigation Stealth Style &mdash; Esri Canvas',
    },
    className: 'tesla-cyber-tiles',
  },
  {
    name: 'streets',
    label: 'Ruas Detalhadas Esri',
    base: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    reference: null,
    options: {
      maxNativeZoom: 18,
      maxZoom: 19,
      attribution: 'Tiles &copy; Esri &mdash; Fontes Cartográficas Mundiais',
    },
    className: '',
  },
  {
    name: 'satellite',
    label: 'Satélite Alta Definição',
    base: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    reference: null,
    options: {
      maxNativeZoom: 18,
      maxZoom: 19,
      attribution: 'Tiles &copy; Esri &mdash; Imagens Satélite Gratuitas',
    },
    className: '',
  },
];

// ─── INICIALIZAÇÃO ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  dbInit();
  initMainMap();
  refreshGlobalStatistics();
  renderMarkersOnMap();

  // Redimensionamento inteligente para mobile e desktop
  window.addEventListener('resize', () => {
    if (mainMap) mainMap.invalidateSize();
  });

  // Notificar usuário caso esteja em file:/// sobre o GPS
  if (window.location.protocol === 'file:') {
    setTimeout(() => {
      displayToast('Dica: Para GPS nativo sem restrição do browser, use http://localhost:8080');
    }, 2500);
  }
});

// ─── TELA DE ENTRADA (SPLASH) ───────────────────────────────
function dismissSplash() {
  const overlay = document.getElementById('splash-overlay');
  if (overlay) {
    overlay.classList.add('hidden');
    setTimeout(() => {
      overlay.style.display = 'none';
      if (mainMap) mainMap.invalidateSize();
    }, 450);
  }
}

// ─── MAPA PRINCIPAL ─────────────────────────────────────────
function initMainMap() {
  mainMap = L.map('map-viewport', {
    center: [-23.555, -46.645],
    zoom: 14,
    zoomControl: false,
  });

  // Zoom no canto inferior esquerdo
  L.control.zoom({ position: 'bottomleft' }).addTo(mainMap);

  // Aplicação da camada inicial livre de 403
  applyTileLayer(0);

  // Clique no mapa fecha o drawer no mobile se não for marcador
  mainMap.on('click', () => {
    if (window.innerWidth <= 860) {
      minimizeMobileDrawer();
    }
  });
}

function applyTileLayer(index) {
  // Limpar camadas anteriores
  if (currentTileLayer) mainMap.removeLayer(currentTileLayer);
  if (currentReferenceLayer) mainMap.removeLayer(currentReferenceLayer);

  currentTileIndex = index % MAP_TILE_CONFIGS.length;
  const config = MAP_TILE_CONFIGS[currentTileIndex];
  const container = document.getElementById('map-viewport');

  // Alterna classe de visualização Tesla
  if (container) {
    if (config.className) {
      container.classList.add(config.className);
    } else {
      container.classList.remove('tesla-cyber-tiles');
    }
  }

  currentTileLayer = L.tileLayer(config.base, config.options).addTo(mainMap);

  // Adicionar camada de nomes e ruas de referência se houver
  if (config.reference) {
    currentReferenceLayer = L.tileLayer(config.reference, {
      maxNativeZoom: config.options.maxNativeZoom || 16,
      maxZoom: config.options.maxZoom || 19,
      zIndex: 400,
    }).addTo(mainMap);
  }
}

function toggleMapStyle() {
  applyTileLayer(currentTileIndex + 1);
  displayToast(`Visual: ${MAP_TILE_CONFIGS[currentTileIndex].label}`);
}

// ─── BUSCA DE ENDEREÇO / BAIRRO NO MAPA ─────────────────────
async function handleAddressSearch(event) {
  if (event && event.key && event.key !== 'Enter') return;

  const input = document.getElementById('search-input');
  if (!input) return;

  const query = input.value.trim();
  if (!query) {
    displayToast('Digite um bairro, rua ou cidade para buscar.');
    return;
  }

  displayToast('Buscando localização...');
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
    const response = await fetch(url, { headers: { 'Accept-Language': 'pt-BR,pt;q=0.9' } });
    const results = await response.json();

    if (results && results.length > 0) {
      const lat = parseFloat(results[0].lat);
      const lon = parseFloat(results[0].lon);
      mainMap.flyTo([lat, lon], 15, { duration: 1.2 });
      displayToast(`Local encontrado: ${results[0].display_name.split(',')[0]}`);
    } else {
      displayToast('Endereço não localizado. Tente com outro termo.');
    }
  } catch (err) {
    // Fallback: buscar nos estabelecimentos cadastrados
    const matched = dbGetAll().find(e => 
      e.name.toLowerCase().includes(query.toLowerCase()) || 
      (e.address && e.address.toLowerCase().includes(query.toLowerCase()))
    );
    if (matched) {
      selectEstablishment(matched.id);
      displayToast(`Exibindo: ${matched.name}`);
    } else {
      displayToast('Nenhum local correspondente encontrado.');
    }
  }
}

// ─── ÍCONES HUD ESTILO TESLA NAVIGATION (SEM EMOJIS) ─────────
function createCustomPin(lean) {
  let iconHtml = '';
  let pinClass = 'tesla-waypoint-pin ' + lean;

  if (lean === 'direita') {
    iconHtml = '<i class="fa-solid fa-arrow-trend-up"></i>';
  } else if (lean === 'esquerda') {
    iconHtml = '<i class="fa-solid fa-arrow-trend-down"></i>';
  } else {
    iconHtml = '<i class="fa-solid fa-scale-balanced"></i>';
  }

  return L.divIcon({
    html: `
      <div class="${pinClass}">
        <div class="tesla-pin-ring"></div>
        <div class="tesla-pin-core">${iconHtml}</div>
        <div class="tesla-pin-stem"></div>
      </div>
    `,
    className: '',
    iconSize: [36, 46],
    iconAnchor: [18, 46],
    popupAnchor: [0, -46],
  });
}

// ─── RENDERIZAÇÃO DE MARCADORES ─────────────────────────────
function renderMarkersOnMap() {
  Object.values(markersMap).forEach(marker => mainMap.removeLayer(marker));
  markersMap = {};

  const establishments = dbGetAll();
  establishments.forEach(est => {
    addEstablishmentMarker(est);
  });
}

function addEstablishmentMarker(est) {
  const winningLean = getWinningLean(est.votes);
  const icon = createCustomPin(winningLean);
  const marker = L.marker([est.lat, est.lng], { icon }).addTo(mainMap);

  marker.bindPopup(buildPopupTemplate(est), {
    maxWidth: 260,
    minWidth: 220,
    className: 'custom-leaflet-popup',
  });

  marker.on('click', () => {
    selectEstablishment(est.id);
  });

  markersMap[est.id] = marker;

  if (currentActiveFilter !== 'all' && winningLean !== currentActiveFilter) {
    mainMap.removeLayer(marker);
  }
}

function buildPopupTemplate(est) {
  const lean = getWinningLean(est.votes);
  const pct = getVotePercentages(est.votes);
  const catConfig = getCategoryConfig(est.category);
  const leanLabel = getLeanLabel(lean);

  return `
    <div class="popup-card-content">
      <div class="popup-card-header ${lean}">
        <i class="${catConfig.iconClass}"></i> ${leanLabel}
      </div>
      <div class="popup-card-title">${escapeHtml(est.name)}</div>
      <div class="popup-card-category">${catConfig.label}</div>
      <div class="popup-meter-wrap">
        <div class="popup-meter">
          <div class="popup-meter-d" style="width: ${pct.d}%;"></div>
          <div class="popup-meter-e" style="width: ${pct.e}%;"></div>
        </div>
        <div class="popup-meter-stats">
          <span style="color:var(--direita-gold)">Dir: ${pct.d}%</span>
          <span style="color:var(--esquerda-red)">Esq: ${pct.e}%</span>
        </div>
      </div>
      <button class="popup-action-btn" onclick="selectEstablishment('${est.id}')">
        <i class="fa-solid fa-chart-column"></i> Inspecionar Local
      </button>
    </div>
  `;
}

// ─── FILTROS POLÍTICOS ──────────────────────────────────────
function applyFilter(filter) {
  currentActiveFilter = filter;

  document.querySelectorAll('.filter-chip, .mobile-nav-btn').forEach(btn => {
    if (btn.dataset.filter) {
      btn.classList.toggle('active', btn.dataset.filter === filter);
    }
  });

  applyAllFilters();
}

// ─── FILTRO POR CATEGORIA ────────────────────────────────────
let currentCategoryFilter = 'all';

function applyCategoryFilter(cat) {
  currentCategoryFilter = cat;

  // Atualiza estilo dos chips de categoria
  document.querySelectorAll('.cat-chip').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.cat === cat);
  });

  applyAllFilters();
}

// Aplica cruzamento: filtro político + filtro de categoria
function applyAllFilters() {
  const establishments = dbGetAll();
  establishments.forEach(est => {
    const winningLean = getWinningLean(est.votes);
    const marker = markersMap[est.id];
    if (!marker) return;

    const passesLean = currentActiveFilter === 'all' || winningLean === currentActiveFilter;
    const passesCat  = currentCategoryFilter === 'all' || est.category === currentCategoryFilter;

    if (passesLean && passesCat) {
      if (!mainMap.hasLayer(marker)) mainMap.addLayer(marker);
    } else {
      if (mainMap.hasLayer(marker)) mainMap.removeLayer(marker);
    }
  });
}

// ─── DETALHES DO ESTABELECIMENTO ────────────────────────────
function selectEstablishment(id) {
  selectedEstablishmentId = id;
  const est = dbGetById(id);
  if (!est) return;

  mainMap.flyTo([est.lat, est.lng], 15, { duration: 1.0 });

  document.getElementById('panel-welcome').style.display = 'none';
  const panelDetails = document.getElementById('panel-details');
  panelDetails.classList.add('active');

  if (window.innerWidth <= 860) {
    expandMobileDrawer();
  }

  const winningLean = getWinningLean(est.votes);
  const catConfig = getCategoryConfig(est.category);

  // Status pill
  const pill = document.getElementById('detail-pill');
  pill.className = `detail-status-pill ${winningLean}`;
  pill.innerHTML = `<i class="fa-solid fa-circle-dot"></i> Tendência: ${getLeanLabel(winningLean)}`;

  document.getElementById('detail-name').textContent = est.name;
  document.getElementById('detail-desc').textContent = est.description || 'Nenhuma descrição fornecida para este estabelecimento.';
  document.getElementById('detail-category').innerHTML = `<i class="${catConfig.iconClass}"></i> ${catConfig.label}`;
  document.getElementById('detail-address').innerHTML = `<i class="fa-solid fa-location-dot"></i> ${est.address || 'Endereço não informado'}`;

  // Imagem de Fachada
  const facadeImg = document.getElementById('detail-facade-img');
  const validPhotoUrl = (est.photoUrl && est.photoUrl.startsWith('http')) ? est.photoUrl : catConfig.defaultPhoto;
  facadeImg.src = validPhotoUrl;
  facadeImg.onerror = () => {
    facadeImg.src = catConfig.defaultPhoto;
  };

  // Google Street View Gratuito Oficial com Coordenadas GPS
  const streetLink = document.getElementById('btn-street-link');
  streetLink.href = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${est.lat},${est.lng}`;
  streetLink.title = 'Abrir vista panorâmica Street View no Google Maps';

  updatePollUI(est);
  renderCommentsList(est);
}

function closeEstablishmentDetail() {
  selectedEstablishmentId = null;
  document.getElementById('panel-welcome').style.display = 'flex';
  document.getElementById('panel-details').classList.remove('active');
  if (window.innerWidth <= 860) {
    minimizeMobileDrawer();
  }
}

// ─── DRAWER MOBILE ──────────────────────────────────────────
function toggleMobileDrawer() {
  const panel = document.getElementById('sidebar-panel');
  if (panel.classList.contains('expanded')) {
    minimizeMobileDrawer();
  } else {
    expandMobileDrawer();
  }
}

function expandMobileDrawer() {
  const panel = document.getElementById('sidebar-panel');
  panel.classList.add('expanded');
  panel.classList.remove('minimized');
}

function minimizeMobileDrawer() {
  const panel = document.getElementById('sidebar-panel');
  panel.classList.remove('expanded');
  panel.classList.add('minimized');
}

// ─── ENQUETE POLÍTICA (VOTAÇÃO) ─────────────────────────────
function updatePollUI(est) {
  const pct = getVotePercentages(est.votes);
  const myVote = getMyVote(est.id);

  const meterD = document.getElementById('meter-direita');
  const meterE = document.getElementById('meter-esquerda');
  meterD.style.width = `${pct.d}%`;
  meterE.style.width = `${pct.e}%`;

  document.getElementById('pct-d-text').textContent = `Direita: ${pct.d}%`;
  document.getElementById('pct-e-text').textContent = `Esquerda: ${pct.e}%`;
  document.getElementById('detail-vote-count').textContent = `${pct.total} votos registrados`;

  ['direita', 'neutro', 'esquerda'].forEach(side => {
    const btn = document.getElementById(`btn-vote-${side}`);
    if (myVote) {
      btn.disabled = true;
      btn.classList.add('voted');
      btn.classList.toggle('active-choice', myVote === side);
    } else {
      btn.disabled = false;
      btn.classList.remove('voted', 'active-choice');
    }
  });
}

function handleVote(side) {
  if (!selectedEstablishmentId) return;

  if (hasVoted(selectedEstablishmentId)) {
    displayToast('Você já participou da votação deste local.');
    return;
  }

  const est = dbGetById(selectedEstablishmentId);
  if (!est) return;

  est.votes[side] = (est.votes[side] || 0) + 1;
  dbUpdate(est);
  markVoted(selectedEstablishmentId, side);

  refreshMarkerOnMap(est);
  updatePollUI(est);
  refreshGlobalStatistics();

  const names = { direita: 'Direita', neutro: 'Centro / Neutro', esquerda: 'Esquerda' };
  displayToast(`Voto registrado com sucesso: ${names[side]}`);
}

function refreshMarkerOnMap(est) {
  if (markersMap[est.id]) {
    mainMap.removeLayer(markersMap[est.id]);
    delete markersMap[est.id];
  }
  addEstablishmentMarker(est);
}

// ─── COMENTÁRIOS E AVALIAÇÕES ───────────────────────────────
function renderCommentsList(est) {
  const container = document.getElementById('comments-container');
  if (!est.comments || est.comments.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:24px 0;color:var(--text-muted);font-size:0.85rem;">
        Nenhuma avaliação publicada até o momento. Seja o primeiro a opinar!
      </div>
    `;
    return;
  }

  container.innerHTML = est.comments.slice().reverse().map(comment => {
    const leanClass = comment.lean || 'neutro';
    const leanLabel = getLeanLabel(leanClass);

    return `
      <div class="comment-bubble">
        <div class="comment-meta">
          <span class="comment-author">
            <i class="fa-solid fa-user-shield" style="font-size:0.75rem;"></i>
            ${escapeHtml(comment.author || 'Usuário')}
          </span>
          <span class="comment-lean-tag ${leanClass}">${leanLabel}</span>
        </div>
        <p class="comment-body">${escapeHtml(comment.text)}</p>
        <div class="comment-time">${formatDate(comment.date)}</div>
      </div>
    `;
  }).join('');
}

function handleCommentSubmit() {
  if (!selectedEstablishmentId) return;

  const authorInput = document.getElementById('input-comment-author');
  const bodyInput = document.getElementById('input-comment-body');
  const leanSelect = document.getElementById('select-comment-lean');

  const text = bodyInput.value.trim();
  if (!text) {
    displayToast('Por favor, digite o conteúdo do comentário.');
    return;
  }

  const est = dbGetById(selectedEstablishmentId);
  if (!est) return;

  const newComment = {
    id: generateId(),
    author: authorInput.value.trim() || 'Cidadão',
    text,
    lean: leanSelect.value,
    date: new Date().toISOString(),
  };

  est.comments.push(newComment);
  dbUpdate(est);

  bodyInput.value = '';
  authorInput.value = '';
  leanSelect.value = 'neutro';

  renderCommentsList(est);
  displayToast('Avaliação publicada com sucesso.');
}

// ─── ESTATÍSTICAS GLOBAIS ───────────────────────────────────
function refreshGlobalStatistics() {
  const list = dbGetAll();
  let countD = 0;
  let countE = 0;

  list.forEach(item => {
    const lean = getWinningLean(item.votes);
    if (lean === 'direita') countD++;
    if (lean === 'esquerda') countE++;
  });

  const statsRow = document.getElementById('stats-summary-row');
  if (statsRow) {
    statsRow.innerHTML = `
      <div class="metric-box">
        <span class="metric-value">${list.length}</span>
        <span class="metric-label">Locais</span>
      </div>
      <div class="metric-box direita">
        <span class="metric-value">${countD}</span>
        <span class="metric-label">Direita</span>
      </div>
      <div class="metric-box esquerda">
        <span class="metric-value">${countE}</span>
        <span class="metric-label">Esquerda</span>
      </div>
    `;
  }
}

// ─── GEOLOCALIZAÇÃO GPS INTELIGENTE (HARDWARE + REDE IP FALLBACK) ──
async function triggerGeolocation() {
  const btn = document.getElementById('btn-locate');
  const originalHtml = btn ? btn.innerHTML : '';
  if (btn) btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i>';

  displayToast('Obtendo localização do dispositivo...');

  const isSecureContext = window.isSecureContext || 
                          window.location.hostname === 'localhost' || 
                          window.location.hostname === '127.0.0.1';

  // 1. Tenta GPS de Hardware (se suportado e em contexto seguro ou autorizado)
  if (navigator.geolocation && isSecureContext) {
    navigator.geolocation.getCurrentPosition(
      position => {
        applyUserPosition(position.coords.latitude, position.coords.longitude, 'GPS de Alta Precisão');
        if (btn) btn.innerHTML = originalHtml;
      },
      async error => {
        // Se o navegador bloquear o GPS localmente, acionar o fallback imediato por IP
        await fallbackIpGeolocation(btn, originalHtml);
      },
      { timeout: 6000, enableHighAccuracy: true, maximumAge: 30000 }
    );
  } else {
    // 2. Se for arquivo local (file:///) ou contexto sem GPS direto, usar IP Geolocation
    await fallbackIpGeolocation(btn, originalHtml);
  }
}

async function fallbackIpGeolocation(btn, originalHtml) {
  try {
    displayToast('Acessando geolocalização por conexão de rede...');
    // API pública e gratuita de geolocalização por IP
    const response = await fetch('https://ipapi.co/json/');
    if (!response.ok) throw new Error('Falha no serviço de IP');
    const data = await response.json();

    if (data.latitude && data.longitude) {
      applyUserPosition(data.latitude, data.longitude, `${data.city || 'Sua Região'} (Rede)`);
    } else {
      throw new Error('Coordenadas indisponíveis');
    }
  } catch (err) {
    // Fallback gracioso: centraliza na região central de São Paulo (Av. Paulista)
    applyUserPosition(-23.555, -46.645, 'São Paulo (Padrão)');
    displayToast('Para GPS de satélite em tempo real, execute via http://localhost:8080');
  } finally {
    if (btn) btn.innerHTML = originalHtml;
  }
}

function applyUserPosition(lat, lng, sourceLabel) {
  mainMap.flyTo([lat, lng], 15, { animate: true, duration: 1.2 });

  if (currentUserMarker) mainMap.removeLayer(currentUserMarker);

  const teslaCursorIcon = L.divIcon({
    html: `
      <div class="tesla-user-beacon">
        <div class="tesla-radar-ring"></div>
        <div class="tesla-radar-ring delay"></div>
        <div class="tesla-car-chevron">
          <i class="fa-solid fa-location-arrow"></i>
        </div>
      </div>
    `,
    className: '',
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -22],
  });

  currentUserMarker = L.marker([lat, lng], { icon: teslaCursorIcon })
    .addTo(mainMap)
    .bindPopup(`
      <div style="text-align:center;padding:4px;">
        <span style="font-size:0.68rem;font-weight:800;color:#38BDF8;text-transform:uppercase;letter-spacing:0.08em;">TESLA GPS • LOCALIZAÇÃO ATIVA</span>
        <div style="font-size:0.86rem;font-weight:700;color:#F8FAFC;margin-top:2px;">${escapeHtml(sourceLabel)}</div>
      </div>
    `).openPopup();

  displayToast(`Localização definida: ${sourceLabel}`);
}

// ─── MODAL DE CADASTRO ──────────────────────────────────────
function openCreateModal() {
  const modal = document.getElementById('create-modal-backdrop');
  modal.classList.add('open');

  setTimeout(() => {
    if (!miniMapPicker) {
      miniMapPicker = L.map('picker-mini-map', {
        center: [-23.555, -46.645],
        zoom: 13,
        zoomControl: false,
      });

      // Esri Streets para o seletor (Livre de 403 e sem API Key)
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 18,
        attribution: '&copy; Esri',
      }).addTo(miniMapPicker);

      miniMapPicker.on('click', e => {
        setPickerCoordinates(e.latlng.lat, e.latlng.lng);
      });
    } else {
      miniMapPicker.invalidateSize();
    }
  }, 150);
}

function closeCreateModal() {
  document.getElementById('create-modal-backdrop').classList.remove('open');
  if (temporaryPickerMarker && miniMapPicker) {
    miniMapPicker.removeLayer(temporaryPickerMarker);
    temporaryPickerMarker = null;
  }
}

function closeCreateModalOnBackdrop(e) {
  if (e.target.id === 'create-modal-backdrop') {
    closeCreateModal();
  }
}

function setPickerCoordinates(lat, lng) {
  document.getElementById('form-lat').value = lat.toFixed(6);
  document.getElementById('form-lng').value = lng.toFixed(6);

  if (!miniMapPicker) return;
  if (temporaryPickerMarker) miniMapPicker.removeLayer(temporaryPickerMarker);

  temporaryPickerMarker = L.circleMarker([lat, lng], {
    radius: 8,
    fillColor: '#F59E0B',
    color: '#FFFFFF',
    weight: 2,
    fillOpacity: 1,
  }).addTo(miniMapPicker);

  miniMapPicker.panTo([lat, lng]);
}

async function detectUserLocationForForm() {
  displayToast('Obtendo posição para cadastro...');
  if (navigator.geolocation && (window.isSecureContext || window.location.hostname === 'localhost')) {
    navigator.geolocation.getCurrentPosition(
      pos => {
        setPickerCoordinates(pos.coords.latitude, pos.coords.longitude);
        displayToast('Coordenadas GPS capturadas.');
      },
      async () => {
        await fallbackFormCoords();
      },
      { timeout: 5000 }
    );
  } else {
    await fallbackFormCoords();
  }
}

async function fallbackFormCoords() {
  try {
    const res = await fetch('https://ipapi.co/json/');
    const data = await res.json();
    if (data.latitude && data.longitude) {
      setPickerCoordinates(data.latitude, data.longitude);
      displayToast(`Posição aproximada: ${data.city || 'Detectada'}`);
      return;
    }
  } catch (e) {}
  setPickerCoordinates(-23.555, -46.645);
  displayToast('Coordenadas de São Paulo aplicadas como referência.');
}

function handleEstablishmentSubmit() {
  const name = document.getElementById('form-name').value.trim();
  const category = document.getElementById('form-category').value;
  const initialLean = document.getElementById('form-lean').value;
  const address = document.getElementById('form-address').value.trim();
  const desc = document.getElementById('form-desc').value.trim();
  const photo = document.getElementById('form-photo').value.trim();
  const lat = parseFloat(document.getElementById('form-lat').value);
  const lng = parseFloat(document.getElementById('form-lng').value);

  if (!name) {
    displayToast('Informe o nome do estabelecimento.');
    return;
  }
  if (isNaN(lat) || isNaN(lng)) {
    displayToast('Defina o ponto no mini-mapa.');
    return;
  }

  const initialVotes = { direita: 0, esquerda: 0, neutro: 0 };
  initialVotes[initialLean] = 1;

  const newEstablishment = {
    id: generateId(),
    name,
    description: desc,
    category,
    lean: initialLean,
    address,
    lat,
    lng,
    photoUrl: photo,
    votes: initialVotes,
    comments: [],
    addedAt: new Date().toISOString(),
  };

  dbAdd(newEstablishment);
  addEstablishmentMarker(newEstablishment);
  refreshGlobalStatistics();
  closeCreateModal();

  ['form-name', 'form-address', 'form-desc', 'form-photo', 'form-lat', 'form-lng'].forEach(id => {
    document.getElementById(id).value = '';
  });

  displayToast(`"${name}" cadastrado com sucesso.`);
  selectEstablishment(newEstablishment.id);
}

function resetView() {
  closeEstablishmentDetail();
  mainMap.flyTo([-23.555, -46.645], 14, { duration: 1.0 });
}

// ─── NOTIFICAÇÃO TOAST ──────────────────────────────────────
let toastTimeoutId;
function displayToast(message) {
  const toast = document.getElementById('app-toast');
  if (!toast) return;

  toast.innerHTML = `<i class="fa-solid fa-circle-info"></i> ${message}`;
  toast.classList.add('visible');

  clearTimeout(toastTimeoutId);
  toastTimeoutId = setTimeout(() => {
    toast.classList.remove('visible');
  }, 3500);
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ============================================================
// PROGRESSIVE WEB APP (PWA) – NATIVO & GENTIL
// ============================================================
let deferredInstallPrompt = null;
const PWA_DISMISSED_KEY = 'politimap_pwa_dismissed_until';

// 1. Registro do Service Worker + Detecção de Atualização
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./sw.js')
      .then(reg => {
        console.log('PolitiMap SW registrado:', reg.scope);

        // Detecta novo SW sendo instalado em segundo plano
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            // Quando o novo SW terminou de instalar e está esperando
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Envia sinal para o SW ativar imediatamente (skipWaiting)
              newWorker.postMessage({ type: 'SKIP_WAITING' });
            }
          });
        });
      })
      .catch(err => {
        console.warn('Falha ao registrar Service Worker:', err);
      });

    // Quando o SW ativo muda (novo SW tomou controle), recarrega
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });

    // Recebe mensagem do SW sobre atualização disponível
    navigator.serviceWorker.addEventListener('message', event => {
      if (event.data && event.data.type === 'SW_UPDATED') {
        showUpdateToast(event.data.message || 'Nova versão disponível!');
      }
    });
  });
}

// Toast especial de atualização com botão de recarregar
function showUpdateToast(msg) {
  // Remove toast anterior se existir
  const old = document.getElementById('update-toast');
  if (old) old.remove();

  const toast = document.createElement('div');
  toast.id = 'update-toast';
  toast.style.cssText = `
    position: fixed;
    bottom: 88px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #1e293b, #0f172a);
    border: 1px solid var(--accent-gold, #F7C948);
    border-radius: 14px;
    padding: 14px 20px;
    display: flex;
    align-items: center;
    gap: 14px;
    z-index: 99999;
    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
    max-width: 340px;
    width: calc(100% - 32px);
    animation: slideUp 0.35s ease;
  `;

  toast.innerHTML = `
    <i class="fa-solid fa-rotate" style="color:#F7C948;font-size:1.2rem;flex-shrink:0;"></i>
    <div style="flex:1;">
      <div style="color:#f1f5f9;font-size:0.82rem;font-weight:600;line-height:1.3;">Atualização disponível</div>
      <div style="color:#94a3b8;font-size:0.73rem;margin-top:2px;">${msg}</div>
    </div>
    <button onclick="window.location.reload()" style="
      background: linear-gradient(135deg, #F7C948, #e6b800);
      color: #000;
      border: none;
      border-radius: 8px;
      padding: 7px 14px;
      font-size: 0.75rem;
      font-weight: 700;
      cursor: pointer;
      white-space: nowrap;
      flex-shrink: 0;
    ">Atualizar</button>
  `;

  document.body.appendChild(toast);

  // Auto-remove após 20 segundos
  setTimeout(() => {
    if (toast.parentNode) toast.remove();
  }, 20000);
}


// 2. Captura do Evento Nativo de Instalação (beforeinstallprompt)
window.addEventListener('beforeinstallprompt', e => {
  // Impede o prompt bruto padrão do navegador
  e.preventDefault();
  deferredInstallPrompt = e;

  // Torna visível o botão "Instalar App" na Navbar
  const navInstallBtn = document.getElementById('btn-pwa-install');
  if (navInstallBtn) {
    navInstallBtn.style.display = 'inline-flex';
  }

  // Verifica se o usuário dispensou o banner recentemente (últimos 7 dias)
  const dismissedUntil = localStorage.getItem(PWA_DISMISSED_KEY);
  const now = Date.now();
  if (dismissedUntil && now < parseInt(dismissedUntil, 10)) {
    return; // Não incomoda o usuário
  }

  // Exibe a notificação gentil com atraso amigável de 3.5 segundos
  setTimeout(() => {
    showPwaGentleBanner();
  }, 3500);
});

// 3. Exibir o Banner Gentil
function showPwaGentleBanner() {
  // Se já estiver rodando como app instalado (standalone), não mostra nada
  if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
    return;
  }

  const banner = document.getElementById('pwa-install-banner');
  if (banner) {
    banner.classList.add('show');
  }
}

// 4. Dispensar o Banner Gentil
function dismissPwaBanner(rememberChoice = true) {
  const banner = document.getElementById('pwa-install-banner');
  if (banner) {
    banner.classList.remove('show');
  }

  if (rememberChoice) {
    // Guarda lembrete para 5 dias sem incomodar
    const fiveDaysFromNow = Date.now() + (5 * 24 * 60 * 60 * 1000);
    localStorage.setItem(PWA_DISMISSED_KEY, fiveDaysFromNow.toString());
  }
}

// 5. Ação de Instalação Nativa
async function triggerPwaInstall() {
  dismissPwaBanner(false);

  // Se o navegador disparou o evento nativo
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;
    
    if (outcome === 'accepted') {
      displayToast('Obrigado por instalar o PolitiMap!');
    }
    deferredInstallPrompt = null;
    
    const navInstallBtn = document.getElementById('btn-pwa-install');
    if (navInstallBtn) navInstallBtn.style.display = 'none';
    return;
  }

  // Detecção especial para iOS Safari (iPhone / iPad)
  const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  if (isIos) {
    displayToast('Para instalar no iOS: toque no botão Compartilhar e selecione "Adicionar à Tela de Início"');
    return;
  }

  // Se já estiver instalado ou navegador de desktop sem prompt direto
  displayToast('Para instalar: clique no ícone de instalação (computador/seta) na barra de endereços do seu navegador.');
}

// 6. Confirmação quando o app for instalado
window.addEventListener('appinstalled', () => {
  displayToast('PolitiMap instalado com sucesso!');
  const navInstallBtn = document.getElementById('btn-pwa-install');
  if (navInstallBtn) navInstallBtn.style.display = 'none';
  dismissPwaBanner(false);
  deferredInstallPrompt = null;
});
