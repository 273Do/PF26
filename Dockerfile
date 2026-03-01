FROM node:22-bookworm-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
  git \
  openssh-client \
  && rm -rf /var/lib/apt/lists/*

RUN corepack enable && \
  corepack prepare pnpm@latest --activate

ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN pnpm config set global-bin-dir /usr/local/bin && \
  pnpm add -g @evilmartians/lefthook

RUN node --version && \
  pnpm --version && \
  git --version && \
  lefthook version

EXPOSE 4321
