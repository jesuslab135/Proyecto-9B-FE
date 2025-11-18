FROM node:20-alpine AS base
WORKDIR /app

# ==================== DEPENDENCIES ====================
FROM base AS deps

COPY package.json package-lock.json* ./

# Instalar dependencias
RUN npm i

# ==================== DEVELOPMENT ====================
FROM base AS development

COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ==================== BUILD ====================
FROM base AS build

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG VITE_API_BASE_URL
ARG VITE_APP_NAME

RUN echo "VITE_API_BASE_URL=${VITE_API_BASE_URL}" > .env.production && \
    echo "VITE_APP_NAME=${VITE_APP_NAME}" >> .env.production

RUN npm run build

# ==================== PRODUCTION ====================
FROM nginx:alpine AS production

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]