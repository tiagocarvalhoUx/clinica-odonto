# 🚀 Guia de Deploy

Este guia fornece instruções para fazer o deploy da aplicação Clínica Odontológica em ambiente de produção.

## 📋 Pré-requisitos

- Servidor com Node.js >= 16.x
- MySQL >= 8.0
- Domínio (opcional, mas recomendado)
- SSL/HTTPS (recomendado)

## 🔧 Backend Deploy

### 1. Preparação

```bash
# Clone o repositório no servidor
git clone <url-do-repositório>
cd clinica-gygy/backend

# Instale as dependências
npm install --production
```

### 2. Configuração de Produção

Crie o arquivo `.env`:

```env
NODE_ENV=production
PORT=3000

# Database (use suas credenciais reais)
DATABASE_URL="mysql://usuario:senha@localhost:3306/clinica_gygy"

# JWT (IMPORTANTE: Use um secret forte e único)
JWT_SECRET=seu_secret_super_seguro_e_aleatorio_aqui
JWT_EXPIRES_IN=7d

# CORS (URL do seu frontend)
CORS_ORIGIN=https://seu-dominio.com
```

### 3. Banco de Dados

```bash
# Execute as migrations
npx prisma migrate deploy

# Gere o Prisma Client
npx prisma generate
```

### 4. Process Manager (PM2)

Instale o PM2 globalmente:

```bash
npm install -g pm2
```

Inicie a aplicação:

```bash
pm2 start server.js --name clinica-gygy-api
pm2 save
pm2 startup
```

Comandos úteis do PM2:

```bash
pm2 status              # Ver status
pm2 logs clinica-gygy-api  # Ver logs
pm2 restart clinica-gygy-api  # Reiniciar
pm2 stop clinica-gygy-api     # Parar
```

### 5. Nginx (Proxy Reverso)

Configuração do Nginx (`/etc/nginx/sites-available/clinica-gygy`):

```nginx
server {
    listen 80;
    server_name api.seu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Ative o site:

```bash
sudo ln -s /etc/nginx/sites-available/clinica-gygy /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 6. SSL com Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.seu-dominio.com
```

## 🎨 Frontend Deploy

### Opção 1: Netlify (Recomendado para iniciantes)

1. Faça build local:

```bash
cd frontend
npm install
npm run build
```

2. Faça upload da pasta `dist` no Netlify

3. Configure variáveis de ambiente no Netlify:
   - `VITE_API_URL=https://api.seu-dominio.com/api`

### Opção 2: Vercel

1. Instale a CLI do Vercel:

```bash
npm i -g vercel
```

2. Faça deploy:

```bash
cd frontend
vercel --prod
```

3. Configure variáveis de ambiente no dashboard do Vercel

### Opção 3: Servidor Próprio (Nginx)

1. Build da aplicação:

```bash
cd frontend
npm install
npm run build
```

2. Configure o Nginx (`/etc/nginx/sites-available/clinica-gygy-frontend`):

```nginx
server {
    listen 80;
    server_name seu-dominio.com;
    root /var/www/clinica-gygy/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache para assets estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

3. Copie os arquivos:

```bash
sudo mkdir -p /var/www/clinica-gygy/frontend
sudo cp -r dist/* /var/www/clinica-gygy/frontend/
```

4. Ative o site:

```bash
sudo ln -s /etc/nginx/sites-available/clinica-gygy-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

5. Configure SSL:

```bash
sudo certbot --nginx -d seu-dominio.com
```

## 🔒 Segurança

### Checklist de Segurança

- [ ] Alterar `JWT_SECRET` para valor forte e único
- [ ] Usar HTTPS em produção
- [ ] Configurar CORS corretamente
- [ ] Não expor informações sensíveis nos logs
- [ ] Usar variáveis de ambiente para credenciais
- [ ] Manter dependências atualizadas
- [ ] Configurar firewall no servidor
- [ ] Fazer backup regular do banco de dados
- [ ] Limitar tentativas de login (rate limiting)
- [ ] Monitorar logs de acesso

### Firewall (UFW)

```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

## 📊 Monitoramento

### PM2 Monitoring

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### MySQL Monitoring

Monitore o uso do banco:

```sql
SHOW PROCESSLIST;
SHOW STATUS LIKE 'Threads_connected';
```

## 🔄 Atualização

Para atualizar a aplicação:

```bash
# Backend
cd backend
git pull
npm install --production
npx prisma generate
npx prisma migrate deploy
pm2 restart clinica-gygy-api

# Frontend (se hospedado em servidor próprio)
cd frontend
git pull
npm install
npm run build
sudo cp -r dist/* /var/www/clinica-gygy/frontend/
```

## 💾 Backup

### Backup do Banco de Dados

Script de backup automático:

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/mysql"
DB_NAME="clinica_gygy"

mysqldump -u usuario -p'senha' $DB_NAME > $BACKUP_DIR/backup_$DATE.sql

# Manter apenas os últimos 7 backups
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
```

Agende com cron:

```bash
# Edite o crontab
crontab -e

# Adicione (backup diário às 2h da manhã)
0 2 * * * /caminho/para/backup.sh
```

## 🆘 Troubleshooting

### Aplicação não inicia

```bash
# Verifique logs
pm2 logs clinica-gygy-api

# Verifique conexão com MySQL
mysql -u usuario -p -h localhost clinica_gygy

# Verifique variáveis de ambiente
cat .env
```

### Erros de CORS

Verifique se `CORS_ORIGIN` no backend está configurado com a URL correta do frontend.

### Problemas de conexão com banco

```bash
# Teste a conexão
npx prisma db pull

# Verifique se o MySQL está rodando
sudo systemctl status mysql
```

## 📝 Notas Importantes

1. **Nunca commite arquivos `.env`** no Git
2. **Faça backups regulares** do banco de dados
3. **Monitore os logs** regularmente
4. **Mantenha as dependências atualizadas**
5. **Use senhas fortes** para banco de dados e usuários
6. **Configure alertas** de downtime
7. **Teste** as atualizações em ambiente de staging primeiro

## 📞 Suporte

Em caso de problemas durante o deploy, verifique:

1. Logs do PM2: `pm2 logs`
2. Logs do Nginx: `/var/log/nginx/error.log`
3. Logs do MySQL: `/var/log/mysql/error.log`
4. Status dos serviços: `pm2 status`, `systemctl status nginx`, `systemctl status mysql`
