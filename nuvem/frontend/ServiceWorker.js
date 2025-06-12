const cacheName = "feira-v1.1";

const precacheResources = [
  "Build/FeiraDejogos1.1.loader.js",
  "Build/FeiraDejogos1.1.framework.js.gz",
  "Build/FeiraDejogos1.1.data.gz",
  "Build/FeiraDejogos1.1.wasm.gz",
  "TemplateData/style.css",
  "jogos/arcade/0/logo.png",
  "jogos/arcade/1/logo.png",
  "jogos/arcade/2/logo.png",
  "jogos/arcade/3/logo.png",
  "jogos/hab/logo.png",
  "jogos/joginho/logo.png",
  "jogos/ecos-da-floresta/logo.png",
  "jogos/misterios-do-amor/logo.png",
  "jogos/tower-of-challenges/logo.png",
  "jogos/procurando-o-robo/logo.png",
  "jogos/caso-paranormal/logo.png",
  "jogos/meowze/logo.png",
  "jogos/missao-espacial/logo.png",
  "jogos/island-adventure/logo.png",
  "jogos/the-last-keepers/logo.png",
  "jogos/capetalismo/logo.png",
  "jogos/salsiheero/logo.png",
  "jogos/rescue-run/logo.png",
  "jogos/herdeiras-da-magia/logo.png",
  "jogos/the-fate-of-the-letters/logo.png",
  "jogos/eldorya/logo.png"
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
