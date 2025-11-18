## Matrix Bot

1. Criar o arquivo `.env` antes de registrar o *bot*:

```ini
REGISTRATION_SHARED_SECRET="<chave secreta de registro de usuário do homeserver>"
BOT_PASSWORD="<senha>"
```

2. Registrar o *bot*:

```sh
node registration.ts
```

3. O registro, em caso de sucesso, retornará os demais valores a serem adicionados ao arquivo `.env`:

```ini
USER_ID="<endereço local do bot>"
HOMESERVER="<nome do servidor>"
ACCESS_TOKEN="<token de acesso do bot>"
DEVICE_ID="<id do dispositivo>"
```

4. Executar o *bot*:

```sh
node matrix-bot.ts
```
