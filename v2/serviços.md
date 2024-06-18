# Preparação do ambiente dos serviços em nuvem

## Serviços

### Proxy reverso HTTPS: NGINX

_Site_ padrão, arquivo `/etc/nginx/sites-enabled/default`:

```nginx
server {
  listen 80;
  listen [::]:80;

  server_name feira-de-jogos.dev.br;
  if ($host = feira-de-jogos.dev.br) {
    return 301 https://$host$request_uri;
  }
  return 404;
}

server {
  listen [::]:443 http2 ssl ipv6only=on;
  listen 443 http2 ssl;

  ssl_certificate /etc/letsencrypt/live/feira-de-jogos.dev.br/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/feira-de-jogos.dev.br/privkey.pem;
  ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
  ssl_session_timeout 1d;
  ssl_session_cache shared:MozSSL:10m;
  ssl_session_tickets off;
  ssl_protocols TLSv1.3;
  ssl_prefer_server_ciphers off;
  add_header Strict-Transport-Security "max-age=63072000" always;
  ssl_stapling on;
  ssl_stapling_verify on;

  server_name feira-de-jogos.dev.br;

  location / {
    root /opt/github/feira-de-jogos/frontend;
    try_files $uri $uri/ =404;

    # Retirado de: https://docs.unity3d.com/Manual/webgl-server-configuration-code-samples.html
    location ~ .+\.(data|symbols\.json)\.br$ {
      gzip off;
      add_header Content-Encoding br;
      default_type application/octet-stream;
    }
    location ~ .+\.js\.br$ {
      gzip off;
      add_header Content-Encoding br;
      default_type application/javascript;
    }
    location ~ .+\.wasm\.br$ {
      gzip off;
      add_header Content-Encoding br;
      default_type application/wasm;
    }
    location ~ .+\.(data|symbols\.json)\.gz$ {
      gzip off;
      add_header Content-Encoding gzip;
      default_type application/gzip;
    }
    location ~ .+\.js\.gz$ {
      gzip off;
      add_header Content-Encoding gzip;
      default_type application/javascript;
    }
    location ~ .+\.wasm\.gz$ {
      gzip off;
      add_header Content-Encoding gzip;
      default_type application/wasm;
    }
  }
}
```

### REST-API: aplicação Node.js


Arquivo `.env`:

```ini
GOOGLE_CLIENT_ID="***" # ID de credencial criado no GCP
```