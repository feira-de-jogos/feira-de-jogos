// Choose a cache name
const cacheName = 'cache-v1'

// List the files to precache
const precacheResources = [
  './',
  './assets/Cenas/CenaMorte.png',
  './assets/Cenas/CenaVitoria.png',
  './assets/Cenas/CenadeJogos.png',
  './assets/Cenas/TeladeFundo.png',
  './assets/Cenas/teladeselecao.png',
  './assets/Cenas/vazioparaselecao.png',
  './assets/Controles/AtqEsp.png',
  './assets/Controles/AtqMac.png',
  './assets/Controles/HabDef.png',
  './assets/Controles/HabFlecha.png',
  './assets/Controles/SetaCima.png',
  './assets/Controles/SetaDir.png',
  './assets/Controles/SetaEsq.png',
  './assets/Controles/barradevida.png',
  './assets/Controles/botaocristal.png',
  './assets/LogoHAB.png',
  './assets/audio.mp3',
  './assets/mapa/BlocosBordas.png',
  './assets/mapa/BlocosCenarioAmarelo.png',
  './assets/mapa/BlocosCenarioAzul.png',
  './assets/mapa/BlocosCenarioRoxo.png',
  './assets/mapa/BlocosCenarioVerde.png',
  './assets/mapa/BlocosCenarioVermelho.png',
  './assets/mapa/BlocosMorte.png',
  './assets/mapa/BlocosTeto.png',
  './assets/mapa/FundoCavernaAmarela.png',
  './assets/mapa/FundoCavernaAzul.png',
  './assets/mapa/FundoCavernaRoxa.png',
  './assets/mapa/FundoCavernaVerde.png',
  './assets/mapa/FundoCavernaVermelho.png',
  './assets/mapa/Gramas.png',
  './assets/mapa/GramasAmarela.png',
  './assets/mapa/GramasAzul.png',
  './assets/mapa/GramasRoxo.png',
  './assets/mapa/GramasVermelho.png',
  './assets/mapa/Mapa.json',
  './assets/mapa/Pedrinhas.png',
  './assets/mapa/Vazio.png',
  './assets/mapa/arenaboss.png',
  './assets/mapa/inicio.png',
  './assets/mapa/pedra.png',
  './assets/personagens/BenAtirando.png',
  './assets/personagens/BenVen.png',
  './assets/personagens/BenVenAtk.png',
  './assets/personagens/LeoVen.png',
  './assets/personagens/LeoVenAtk.png',
  './assets/personagens/dragaozinho.png',
  './assets/personagens/dragaozinhoroxo.png',
  './assets/personagens/dragaozinhogelo.png',
  './assets/personagens/dragaozinhofogo.png',
  './assets/personagens/dragaozinhoverde.png',
  './assets/personagens/explosaomorte32.png',
  './assets/personagens/monstro.png',
  './assets/personagens/ogroamarelo.png',
  './assets/personagens/ogrofogo.png',
  './assets/personagens/ogrogelo.png',
  './assets/personagens/ogroroxo.png',
  './assets/spritesmapa/PortaBoss.png',
  './assets/spritesmapa/altarcristalamarelo.png',
  './assets/spritesmapa/altarcristalfogo.png',
  './assets/spritesmapa/altarcristalgelo.png',
  './assets/spritesmapa/altarcristalroxo.png',
  './assets/spritesmapa/cristalamarelo.png',
  './assets/spritesmapa/cristalazul.png',
  './assets/spritesmapa/cristalroxo.png',
  './assets/spritesmapa/cristalvermelho.png',
  './assets/spritesmapa/pocaodevida.png',
  './assets/spritesmapa/bau.png',
  './assets/tutorial.png',
  './assets/logos/logo128.png',
  './assets/logos/logo192.png',
  './assets/logos/logo256.png',
  './assets/logos/logo384.png',
  './assets/logos/logo512.png',
  './index.css',
  './index.html',
  './index.js',
  './manifest.json',
  './sw.js'

]

self.addEventListener('install', (event) => {
  console.log('Service worker install event!')
  event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(precacheResources)))
})

self.addEventListener('activate', (event) => {
  console.log('Service worker activate event!')
})

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request)
    })
  )
})
