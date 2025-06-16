FROM node:20

WORKDIR /app

# Copie les fichiers package.json pour installer les dépendances
COPY package*.json ./
RUN npm install

# Copie le fichier .env AVANT le prisma generate
COPY .env .env

# Copie le dossier prisma
COPY prisma ./prisma

# Copie le reste du projet (src, etc.)
COPY . .

# Génère le client Prisma (nécessite le .env déjà copié)
RUN npx prisma generate

# Compile le projet NestJS
RUN npm run build

# Démarre l'application
CMD ["node", "dist/main"]





