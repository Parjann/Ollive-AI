FROM node:20-alpine

# Install openssl and libc6-compat for Prisma engines on Alpine
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Disable Next.js telemetry in production
ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 3000

# Declare build arguments passed from Docker Compose
ARG GROQ_API_KEY
ARG GEMINI_API_KEY

# Inject build arguments as environment variables for compile time
ENV GROQ_API_KEY=$GROQ_API_KEY
ENV GEMINI_API_KEY=$GEMINI_API_KEY

# Provide a build-time dummy database url so Next.js build succeeds without connecting to Postgres
ENV DATABASE_URL postgresql://dummy:dummy@localhost:5432/dummy

# Copy package configurations first for cached layer installation
COPY package*.json ./
RUN npm ci

# Copy Prisma schema and config files to generate the client during build stage
COPY prisma ./prisma/
COPY prisma.config.ts ./
RUN npx prisma generate

# Copy the rest of the application files
COPY . .

# Build Next.js application
RUN npm run build

# Set environment to production for container runtime
ENV NODE_ENV production

# Expose Next.js server port
EXPOSE 3000

# Start command executes database migrations automatically before booting the server
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
