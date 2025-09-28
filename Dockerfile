FROM oven/bun AS build

WORKDIR /app

# Install OpenSSL and other dependencies
RUN apt-get update -y && apt-get install -y openssl

# Cache package installation
COPY package.json bun.lock ./
RUN bun install

# Copy source files and Prisma schema
COPY src ./src
COPY prisma ./prisma
COPY tsconfig.json ./tsconfig.json

# Generate Prisma client
RUN bun run db:generate

ENV NODE_ENV=production

# Build the application
RUN bun build \
	--compile \
	--minify-whitespace \
	--minify-syntax \
	--outfile server \
	src/index.ts

FROM oven/bun AS runtime

WORKDIR /app

# Install OpenSSL in the runtime image
RUN apt-get update -y && apt-get install -y openssl

# Copy the compiled binary, Prisma client, and package files from the build stage
COPY --from=build /app/server /app/server
COPY --from=build /app/prisma /app/prisma
COPY --from=build /app/generated/prisma /app/generated/prisma
COPY --from=build /app/node_modules/@prisma /app/node_modules/@prisma
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/bun.lock /app/bun.lock

COPY src src
COPY tsconfig.json .

ENV NODE_ENV=production

CMD ["./server"]

EXPOSE 8080