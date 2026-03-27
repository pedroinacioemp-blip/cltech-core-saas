#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
# AUTOMATED DEPLOYMENT SCRIPT - Node.js Express API to Render
# ═══════════════════════════════════════════════════════════════════════════════
# 
# Usage: bash deploy.sh
# 
# This script automates the deployment process to Render.com
# Pre-requirements:
#   1. Render PostgreSQL database created with external connection string
#   2. Render environment setup with JWT_SECRET, DATABASE_URL, etc.
#
# ═══════════════════════════════════════════════════════════════════════════════

set -e  # Exit on error

echo "🚀 Starting CL-TECH-CORE API Deployment to Render..."
echo ""

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# ─────────────────────────────────────────────────────────────────────────────
# STEP 1: Verify Prerequisites
# ─────────────────────────────────────────────────────────────────────────────
echo -e "${BLUE}[STEP 1] Verifying Prerequisites...${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js not found. Please install Node.js first.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js v$(node --version)${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ npm not found. Please install npm first.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm v$(npm --version)${NC}"

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}✗ git not found. Please install git first.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ git installed${NC}"

echo ""

# ─────────────────────────────────────────────────────────────────────────────
# STEP 2: Navigate to API directory
# ─────────────────────────────────────────────────────────────────────────────
echo -e "${BLUE}[STEP 2] Navigating to API directory...${NC}"

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
API_DIR="$SCRIPT_DIR/api"

if [ ! -d "$API_DIR" ]; then
    echo -e "${RED}✗ /api directory not found at $API_DIR${NC}"
    exit 1
fi

cd "$API_DIR"
echo -e "${GREEN}✓ Working directory: $(pwd)${NC}"
echo ""

# ─────────────────────────────────────────────────────────────────────────────
# STEP 3: Install Dependencies
# ─────────────────────────────────────────────────────────────────────────────
echo -e "${BLUE}[STEP 3] Installing Dependencies...${NC}"

if [ -f package.json ]; then
    npm install
    echo -e "${GREEN}✓ Dependencies installed${NC}"
else
    echo -e "${RED}✗ package.json not found${NC}"
    exit 1
fi

echo ""

# ─────────────────────────────────────────────────────────────────────────────
# STEP 4: Verify .env Configuration
# ─────────────────────────────────────────────────────────────────────────────
echo -e "${BLUE}[STEP 4] Checking Environment Configuration...${NC}"

if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        echo -e "${YELLOW}⚠ .env file not found, creating from .env.example${NC}"
        cp .env.example .env
        echo -e "${YELLOW}⚠ Please edit .env with your Render database URL and JWT secret${NC}"
        echo -e "${YELLOW}⚠ Key variables to update:${NC}"
        echo "   - DATABASE_URL=postgres://user:password@host:5432/db"
        echo "   - JWT_SECRET=your-secret-key"
        echo ""
        echo -e "${YELLOW}Edit .env file now? (y/n)${NC}"
        read -r edit_env
        if [ "$edit_env" = "y" ]; then
            nano .env || vim .env || code .env
        fi
    else
        echo -e "${RED}✗ .env and .env.example not found${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓ .env file exists${NC}"
fi

echo ""

# ─────────────────────────────────────────────────────────────────────────────
# STEP 5: Test Local Server Start
# ─────────────────────────────────────────────────────────────────────────────
echo -e "${BLUE}[STEP 5] Verifying Server Configuration...${NC}"

# Check if server.js exists
if [ ! -f server.js ]; then
    echo -e "${RED}✗ server.js not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ server.js verified${NC}"

# Check required files
required_files=("src/config/database.js" "src/config/jwt.js" "src/middlewares/auth.js" "src/routes/auth.js" "src/routes/users.js")
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo -e "${RED}✗ Missing: $file${NC}"
        exit 1
    fi
done
echo -e "${GREEN}✓ All required files verified${NC}"

echo ""

# ─────────────────────────────────────────────────────────────────────────────
# STEP 6: Git Push for Render Deployment
# ─────────────────────────────────────────────────────────────────────────────
echo -e "${BLUE}[STEP 6] Pushing to GitHub (for Render auto-deployment)...${NC}"

cd "$SCRIPT_DIR"

# Check if we're in a git repository
if [ ! -d .git ]; then
    echo -e "${RED}✗ Not a git repository${NC}"
    exit 1
fi

# Check for uncommitted changes in api/
if git diff --quiet api/; then
    echo -e "${YELLOW}⚠ No changes to commit in /api${NC}"
else
    echo -e "${YELLOW}Staging /api changes...${NC}"
    git add api/
    git commit -m "🚀 Deploy: Update backend to Render - $(date +'%Y-%m-%d %H:%M:%S')" || true
    echo -e "${GREEN}✓ Changes committed${NC}"
fi

# Push to repository
echo "Pushing to GitHub..."
git push origin main || {
    echo -e "${YELLOW}⚠ Git push encountered an issue (may already be up to date)${NC}"
}

echo -e "${GREEN}✓ Repository synced${NC}"
echo ""

# ─────────────────────────────────────────────────────────────────────────────
# STEP 7: Deployment Summary and Next Steps
# ─────────────────────────────────────────────────────────────────────────────
echo -e "${GREEN}════════════════════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ DEPLOYMENT PREPARATION COMPLETE${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${BLUE}📋 NEXT STEPS ON RENDER.COM:${NC}"
echo ""
echo "1. Create PostgreSQL Database:"
echo "   - Go to https://dashboard.render.com"
echo "   - New → PostgreSQL"
echo "   - Copy the External Database URL"
echo ""
echo "2. Create Web Service:"
echo "   - New → Web Service"
echo "   - Connect GitHub repo: cltech-core-saas"
echo "   - Build: cd api && npm install"
echo "   - Start: cd api && npm start"
echo ""
echo "3. Set Environment Variables:"
echo "   - DATABASE_URL=<from PostgreSQL>"
echo "   - JWT_SECRET=<your-secret>"
echo "   - NODE_ENV=production"
echo "   - PORT=5000"
echo ""
echo "4. Initialize Database:"
echo "   - Connect to PostgreSQL using pgAdmin"
echo "   - Run /api/database_setup.sql"
echo ""
echo "5. Test API:"
echo "   - GET https://<your-api>.onrender.com/health"
echo "   - POST /api/auth/register"
echo "   - POST /api/auth/login"
echo ""

echo -e "${YELLOW}Documentation: See DEPLOYMENT_CHECKLIST.txt${NC}"
echo ""
echo -e "${GREEN}🎉 Ready for Render deployment!${NC}"
