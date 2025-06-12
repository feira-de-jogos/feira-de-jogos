// Choose a cache name
const cacheName = 'cache-v1'

// List the files to precache
const precacheResources = [
  './',
  './assets/botoes',
  './assets/botoes/baixo.png',
  './assets/botoes/cima.png',
  './assets/botoes/direita.png',
  './assets/botoes/esquerda.png',
  './assets/comendo.mp3',
  './assets/cookies.png',
  './assets/correndo.mp3',
  './assets/logo.png',
  './assets/mapa/arvore.png',
  './assets/mapa/casa.png',
  './assets/mapa/cerca.png',
  './assets/mapa/grama.png',
  './assets/mapa/mapa.json',
  './assets/miado.mp3',
  './assets/moeda.mp3',
  './assets/moedinha.png',
  './assets/personagens',
  './assets/personagens/Boo.png',
  './assets/personagens/Missy.png',
  './assets/personagens/cachorro.png',
  './assets/salas.png',
  './assets/trilha.mp3',
  './assets/vazio.png',
  './index.css',
  './index.html',
  './index.js',
  './manifest.json',
  './package.json',
  './sw.js',
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
