# feira-de-jogos — Kubernetes Manifests

Tradução do `compose.yaml` original para Kubernetes.

## Estrutura dos arquivos

| Arquivo | Conteúdo |
|---|---|
| `00-namespace.yaml` | Namespace `feira-de-jogos` |
| `01-secrets.yaml` | Secrets (credenciais, TLS) |
| `02-configmaps.yaml` | Configurações do Mosquitto, nginx e coturn |
| `03-pvcs.yaml` | PersistentVolumeClaims (InfluxDB, PostgreSQL, Grafana) |
| `04-workloads.yaml` | Deployments + Services de todos os serviços |
| `05-gateway.yaml` | Gateway API — GatewayClass, Gateway, HTTPRoutes e TCPRoute |
| `06-cert-manager.yaml` | cert-manager — ClusterIssuers (staging + prod) e Certificate |

---

## Antes de aplicar

### 1. Preencha os Secrets (`01-secrets.yaml`)

Substitua todos os `CHANGE_ME_BASE64` com valores reais:

```bash
echo -n 'meu-usuario' | base64
echo -n 'minha-senha' | base64
echo -n 'meu-token-influx' | base64

# Para os certificados TLS:
cat fullchain.pem | base64 -w0
cat privkey.pem | base64 -w0
```

### 2. Preencha os ConfigMaps (`02-configmaps.yaml`)

Cole o conteúdo real dos seus arquivos:
- `mqtt-broker/mosquitto.conf` → ConfigMap `mosquitto-config`
- `http-proxy/nginx.conf` → ConfigMap `nginx-config`
- `stun/coturn.conf` → ConfigMap `coturn-config`

### 3. Código dos serviços Node.js

Os serviços `mqtt-subscriber` e `rest-api` montam o código como volume.
No Docker Compose isso era feito via bind mount local, mas em Kubernetes
a abordagem recomendada é **construir imagens próprias**:

```dockerfile
# Exemplo: mqtt-subscriber/Dockerfile
FROM node:lts
WORKDIR /home/node/app
COPY . .
RUN npm install
USER node
CMD ["npm", "start"]
```

Depois, substitua `image: node:lts` pela sua imagem no `04-workloads.yaml`.

### 4. Conteúdo estático do nginx

Os diretórios `frontend/`, `jogos/` e `snct/` precisam ser servidos pelo nginx.
Opções:
- Construa uma imagem nginx personalizada com o conteúdo embutido
- Use um PVC populado via initContainer ou job de CI/CD

---

## Aplicando

```bash
# 1. Instalar CRDs da Gateway API
kubectl apply -f https://github.com/kubernetes-sigs/gateway-api/releases/latest/download/standard-install.yaml

# 2. Instalar cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/latest/download/cert-manager.yaml

# Aguardar cert-manager pronto
kubectl wait --namespace cert-manager \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/instance=cert-manager \
  --timeout=120s

# 3. Aplicar os manifests em ordem
kubectl apply -f 00-namespace.yaml
kubectl apply -f 01-secrets.yaml
kubectl apply -f 02-configmaps.yaml
kubectl apply -f 03-pvcs.yaml
kubectl apply -f 04-workloads.yaml
kubectl apply -f 05-gateway.yaml
kubectl apply -f 06-cert-manager.yaml

# Ou de uma vez
kubectl apply -f .
```

> **Dica:** Teste primeiro com `letsencrypt-staging` em `06-cert-manager.yaml` para validar o fluxo sem risco de rate limit. Troque para `letsencrypt-prod` depois de confirmar que o certificado é emitido com sucesso.

Acompanhe a emissão do certificado:
```bash
kubectl describe certificate tls-feira -n feira-de-jogos
kubectl describe certificaterequest -n feira-de-jogos
```

---

## Diferenças e decisões de tradução

| Recurso Docker Compose | Equivalente Kubernetes | Observação |
|---|---|---|
| `restart: always` | `restartPolicy: Always` (padrão em Deployment) | Implícito |
| `depends_on` + `condition: service_healthy` | `initContainers` com `nc -z` | K8s não tem depends_on nativo |
| `secrets` (arquivos em `/run/secrets`) | `projected volume` de Secret | Mesmo caminho de montagem |
| `network_mode: host` (coturn) | `hostNetwork: true` | Equivalente mais próximo |
| `ports: 443/udp` | Service com `protocol: UDP` | QUIC/HTTP3 — adicionar se necessário |
| Volumes bind mount locais | PVC ou imagens próprias | Bind mounts não existem em K8s |
| `healthcheck` | `livenessProbe` + `readinessProbe` | Separados em K8s |

---

## Recomendações adicionais

- **Gateway API CRDs**: Instale antes de aplicar: `kubectl apply -f https://github.com/kubernetes-sigs/gateway-api/releases/latest/download/standard-install.yaml`
- **Controlador**: Ajuste o `controllerName` no `GatewayClass` conforme o controlador do seu cluster (Envoy Gateway, Cilium, NGINX Gateway Fabric, Istio).
- **TCPRoute** (MQTT): é um recurso experimental — verifique se seu controlador suporta. Caso contrário, adicione um `Service type: LoadBalancer` no `mqtt-broker` diretamente.
- **TLS**: Considere usar [cert-manager](https://cert-manager.io/) com Let's Encrypt ao invés de gerenciar certificados manualmente.
- **MQTT externo**: Para expor o MQTT (porta 1883) externamente, adicione um Service do tipo `LoadBalancer` ou use o TCP passthrough do nginx-ingress.
- **coturn com hostNetwork**: Requer que o nó tenha as portas UDP disponíveis. Verifique as regras de firewall do seu cluster.
- **StorageClass**: Ajuste o `storageClassName` nos PVCs conforme o seu provedor (GKE, EKS, AKS, bare-metal, etc.).
