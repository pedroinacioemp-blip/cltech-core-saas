# CL-TECH-CORE Ecosystem - Makefile
# Comandos úteis para desenvolvimento

.PHONY: help up down logs build clean test dev-backend dev-frontend bot deploy migrate

help:
	@echo "╔════════════════════════════════════════════════════════════╗"
	@echo "║       CL-TECH-CORE Ecosystem - Comandos Disponíveis        ║"
	@echo "╚════════════════════════════════════════════════════════════╝"
	@echo ""
	@echo "Infrastructure:"
	@echo "  make up              - Iniciar todos os services (Docker)"
	@echo "  make down            - Parar todos os services"
	@echo "  make logs            - Ver logs em tempo real"
	@echo "  make clean           - Limpar containers e volumes"
	@echo "  make restart         - Reiniciar todos services"
	@echo ""
	@echo "Development:"
	@echo "  make dev-backend     - Rodar Backend com hot-reload"
	@echo "  make dev-frontend    - Rodar Frontend com hot-reload"
	@echo "  make bot             - Rodar WhatsApp Bot"
	@echo ""
	@echo "Database:"
	@echo "  make migrate         - Executar migrations EF Core"
	@echo "  make seed            - Seed banco com dados iniciais"
	@echo "  make db-reset        - Reset banco de dados"
	@echo ""
	@echo "Testing & Build:"
	@echo "  make test            - Rodar todos testes"
	@echo "  make build           - Build production"
	@echo "  make deploy          - Deploy para production"
	@echo ""
	@echo "API:"
	@echo "  make api-health      - Check saúde da API"
	@echo "  make api-swagger     - Abrir Swagger docs"
	@echo ""

# Infrastructure
up:
	@echo "🚀 Iniciando CL-TECH-CORE..."
	docker-compose up -d
	@echo "✅ Services iniciados!"
	@echo "   Frontend: http://localhost:3000"
	@echo "   API: http://localhost:5000"
	@echo "   Swagger: http://localhost:5000/swagger"

down:
	@echo "🛑 Parando services..."
	docker-compose down

logs:
	docker-compose logs -f --tail=100

clean:
	@echo "🧹 Limpando..."
	docker-compose down -v
	rm -rf ./logs/*
	@echo "✅ Limpeza completa!"

restart: down up

status:
	docker-compose ps

# Development
dev-backend:
	@echo "🔧 Rodando Backend com hot-reload..."
	cd backend/src/ClTechCore.Api && dotnet watch run

dev-frontend:
	@echo "⚛️ Rodando Frontend com hot-reload..."
	cd frontend && npm install && npm run dev

bot:
	@echo "🤖 Rodando WhatsApp Bot..."
	cd bot && npm install && npm run dev

# Database
migrate:
	@echo "📊 Aplicando migrations..."
	docker-compose exec api dotnet ef database update -p /src/ClTechCore.Infrastructure

seed:
	@echo "🌱 Seed banco de dados..."
	docker-compose exec api dotnet run --project /src/ClTechCore.Api -- seed-admin

db-reset:
	@echo "⚠️  Resetando banco de dados..."
	docker-compose down -v
	docker-compose up -d
	@$(MAKE) migrate
	@$(MAKE) seed
	@echo "✅ Banco resetado e seed aplicado!"

# Testing & Build
test:
	@echo "🧪 Rodando testes..."
	dotnet test backend/tests

build:
	@echo "🏗️  Building para production..."
	docker-compose build --no-cache
	@echo "✅ Build completo!"

deploy:
	@echo "🚀 Deploying para production..."
	git push origin main
	@echo "✅ Push enviado! GitHub Actions irá deploy..."

# API
api-health:
	@curl -s http://localhost:5000/health | python3 -m json.tool

api-swagger:
	@echo "Abrindo Swagger em http://localhost:5000/swagger"
	@python3 -m webbrowser http://localhost:5000/swagger 2>/dev/null || echo "Open http://localhost:5000/swagger in your browser"

# Convenience
install:
	@echo "📦 Instalando dependências..."
	cd frontend && npm install
	cd ../bot && npm install
	@echo "✅ Dependências instaladas!"

ssh-api:
	docker-compose exec api bash

ssh-db:
	docker-compose exec sqlserver /bin/bash

redis-cli:
	docker-compose exec redis redis-cli

# Documentation
docs:
	@echo "📚 Abrindo documentação..."
	@python3 -m webbrowser README.md 2>/dev/null || cat README.md

architecture:
	@cat ARCHITECTURE.md

getting-started:
	@cat GETTING_STARTED.md

# Quick start
.DEFAULT_GOAL := help
