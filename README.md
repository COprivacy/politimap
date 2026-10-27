# 🗺️ PolitiMap – Mapeamento do Espectro Político de Estabelecimentos

Plataforma colaborativa e georreferenciada para visualização, enquete de orientação política (Direita, Centro, Esquerda) e avaliações comunitárias de estabelecimentos comerciais, sindicais, culturais e gastronômicos.

---

## 🚀 Funcionalidades

- 🗺️ **Mapa Georreferenciado Sem Chave de API:** Utiliza tiles abertos do Esri ArcGIS (Dark Gray Canvas & Ruas Mundiais).
- 🧭 **GPS Inteligente:** Suporte a GPS de hardware com fallback automático por geolocalização de rede/IP.
- 🔍 **Barra de Pesquisa:** Localização instantânea de bairros, ruas e cidades por geocoding.
- 📊 **Enquete Política:** Medidor estatístico com cálculo de porcentagem em tempo real e prevenção de votos duplicados por navegador.
- 💬 **Comentários da Comunidade:** Avaliações de usuários com indicação de perfil (Direita, Centro, Esquerda).
- 📸 **Visualização de Fachada & Street View:** Fotos reais de fachadas e link direto para a vista panorâmica 360º no Google Maps.
- 📱 **Mobile First:** Painel inferior retrátil (*Bottom Sheet Drawer*) e barra de navegação ergonômica para smartphones.

---

## 🎨 Paleta do Espectro Político

- **Direita:** Dourado (`#F59E0B`) & Verde Esmeralda (`#10B981`)
- **Esquerda:** Vermelho Carmesim (`#EF4444`)
- **Centro / Neutro:** Slate Grafite (`#64748B`)

---

## 🛠️ Tecnologias Utilizadas

- **HTML5 & CSS3 Moderno** (Flexbox, CSS Grid, Design Dark Institucional)
- **JavaScript Puro (ES6+)** sem dependências de compilação
- **Leaflet.js** (Biblioteca de mapas interativos)
- **Font Awesome 6** (Ícones vetoriais profissionais, zero emojis)
- **LocalStorage API** (Persistência no navegador)

---

## 💻 Como Executar Localmente

### Opção 1: Servidor Local (Recomendado para GPS total)
```bash
# Com Python:
python -m http.server 8080

# Ou com Node.js (npx):
npx serve -l 8080
```
Acesse no navegador: `http://localhost:8080`

### Opção 2: Arquivo Direto
Basta abrir o arquivo `index.html` em qualquer navegador web.

---

## 📄 Licença
Distribuído sob a licença MIT.
