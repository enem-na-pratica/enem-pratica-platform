FROM node:26-alpine

WORKDIR /app

# Library required to compile native modules (bcrypt, sharp) on Alpine
RUN apk add --no-cache libc6-compat

# Copy manifests first -> Docker cache only invalidates this
# layer when dependencies change, not on every code edit
COPY package.json package-lock.json* ./
COPY prisma ./prisma/
RUN npm install

# Copy the rest of the project. In dev, this is overridden by the bind mount
# in docker-compose.yml — it's here to allow builds without compose
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]