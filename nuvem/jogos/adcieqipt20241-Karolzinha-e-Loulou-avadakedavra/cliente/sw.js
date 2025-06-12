// Choose a cache name
const cacheName = 'cache-v1'

// List the files to precache
const precacheResources = [
  './',
  './assets/abertura.png',
  './assets/animacoes/agua.png',
  './assets/animacoes/aguaborda.png',
  './assets/animacoes/armadilha.png',
  './assets/animacoes/armadilhafake.png',
  './assets/animacoes/blocoquebra.png',
  './assets/animacoes/botaograde.png',
  './assets/animacoes/chave.png',
  './assets/animacoes/cristal.png',
  './assets/animacoes/fogueira.png',
  './assets/animacoes/grade.png',
  './assets/animacoes/planta.png',
  './assets/animacoes/pocaoazul.png',
  './assets/animacoes/pocaorosa.png',
  './assets/animacoes/pocaoverde.png',
  './assets/animacoes/pocaoverme.png',
  './assets/animacoes/regia.png',
  './assets/animacoes/tocha.png',
  './assets/audios/bat.mp3',
  './assets/audios/coletar.mp3',
  './assets/audios/coletar2.mp3',
  './assets/audios/hurt.mp3',
  './assets/audios/iniciar.mp3',
  './assets/audios/musga.mp3',
  './assets/audios/shin.mp3',
  './assets/audios/slimemorre.mp3',
  './assets/audios/slimepulo.mp3',
  './assets/blocovazio.png',
  './assets/blocovazio2.png',
  './assets/blocovazio3.png',
  './assets/blocovazio4.png',
  './assets/blocovazio5.png',
  './assets/botao.png',
  './assets/buraco.png',
  './assets/cutscenes/CUTSCENE1.png',
  './assets/cutscenes/CUTSCENE2.png',
  './assets/cutscenes/CUTSCENE3.png',
  './assets/cutscenes/CUTSCENE4.png',
  './assets/cutscenes/CUTSCENE5.png',
  './assets/cutscenes/CUTSCENE6.png',
  './assets/cutscenes/CUTSCENE7.png',
  './assets/cutscenes/CUTSCENE8.png',
  './assets/cutscenes/CUTSCENE9.png',
  './assets/cutscenes/CUTSCENE10.png',
  './assets/cutscenes/FINAL1.png',
  './assets/cutscenes/FINAL2.png',
  './assets/finalFeliz.png',
  './assets/finalTriste.png',
  './assets/fundo.png',
  './assets/inimigos/aranha.png',
  './assets/inimigos/bat.png',
  './assets/inimigos/beyblade.png',
  './assets/inimigos/fantasma.png',
  './assets/inimigos/slime.png',
  './assets/logo/128.png',
  './assets/logo/192.png',
  './assets/logo/256.png',
  './assets/logo/384.png',
  './assets/logo/512.png',
  './assets/logoo.png',
  './assets/mapa/moveisbruxa.png',
  './assets/mapa/tilesetnovo.png',
  './assets/mapa/tilesetnovodungeon.png',
  './assets/mapa/torrebruxa.png',
  './assets/mapa/umapinha.json',
  './assets/personagens/mago.png',
  './assets/personagens/menina.png',
  './assets/personagens/meninaataque.png',
  './assets/personagens/menino.png',
  './assets/personagens/meninoataque.png',
  './assets/simbolos/botao-play.png',
  './assets/simbolos/seta-direita.png',
  './assets/simbolos/seta-esquerda.png',
  './assets/vida.png',
  './assets/nada.png',
  './index.css',
  './index.html',
  './index.js',
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
