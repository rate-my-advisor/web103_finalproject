# ==========================================
# Build Frontend
# ==========================================
FROM node:20-alpine AS client-builder
WORKDIR /app/client

# Copy client package definition & install dependencies
COPY client/package*.json ./
RUN npm install

# Make it available to Vite during build
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Copy client source & compile production static bundle
COPY client/ ./
RUN npm run build

# ==========================================
# Final Stage
# ==========================================
FROM node:20-alpine
WORKDIR /app/server

# Copy server package definition & install production dependencies
COPY server/package*.json ./
RUN npm install --omit=dev

# Copy server application files
COPY server/ ./

# Copy compiled React static assets from Stage 1 into server/public
COPY --from=client-builder /app/server/public ./public

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Start Express server
CMD ["node", "server.js"]
