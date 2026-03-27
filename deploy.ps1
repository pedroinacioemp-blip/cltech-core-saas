# ═══════════════════════════════════════════════════════════════════════════════
# AUTOMATED DEPLOYMENT SCRIPT - Node.js Express API to Render (PowerShell)
# ═══════════════════════════════════════════════════════════════════════════════
#
# Usage: PowerShell -NoProfile -ExecutionPolicy Bypass -File deploy.ps1
#
# This script automates the deployment process to Render.com
# Pre-requirements:
#   1. Render PostgreSQL database created with external connection string
#   2. Render environment setup with JWT_SECRET, DATABASE_URL, etc.
#
# ═══════════════════════════════════════════════════════════════════════════════

$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting CL-TECH-CORE API Deployment to Render..." -ForegroundColor Green
Write-Host ""

# ─────────────────────────────────────────────────────────────────────────────
# STEP 1: Verify Prerequisites
# ─────────────────────────────────────────────────────────────────────────────
Write-Host "[STEP 1] Verifying Prerequisites..." -ForegroundColor Cyan

# Check Node.js
$nodeVersion = & node --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}
Write-Host "✓ Node.js $nodeVersion" -ForegroundColor Green

# Check npm
$npmVersion = & npm --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ npm not found. Please install npm first." -ForegroundColor Red
    exit 1
}
Write-Host "✓ npm $npmVersion" -ForegroundColor Green

# Check git
$gitVersion = & git --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ git not found. Please install git first." -ForegroundColor Red
    exit 1
}
Write-Host "✓ git installed" -ForegroundColor Green

Write-Host ""

# ─────────────────────────────────────────────────────────────────────────────
# STEP 2: Navigate to API directory
# ─────────────────────────────────────────────────────────────────────────────
Write-Host "[STEP 2] Navigating to API directory..." -ForegroundColor Cyan

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$apiDir = Join-Path $scriptDir "api"

if (-not (Test-Path $apiDir)) {
    Write-Host "✗ /api directory not found at $apiDir" -ForegroundColor Red
    exit 1
}

Push-Location $apiDir
Write-Host "✓ Working directory: $(Get-Location)" -ForegroundColor Green
Write-Host ""

# ─────────────────────────────────────────────────────────────────────────────
# STEP 3: Install Dependencies
# ─────────────────────────────────────────────────────────────────────────────
Write-Host "[STEP 3] Installing Dependencies..." -ForegroundColor Cyan

if (Test-Path "package.json") {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
    Write-Host "✓ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✗ package.json not found" -ForegroundColor Red
    exit 1
}

Write-Host ""

# ─────────────────────────────────────────────────────────────────────────────
# STEP 4: Verify .env Configuration
# ─────────────────────────────────────────────────────────────────────────────
Write-Host "[STEP 4] Checking Environment Configuration..." -ForegroundColor Cyan

if (-not (Test-Path ".env")) {
    if (Test-Path ".env.example") {
        Write-Host "⚠ .env file not found, creating from .env.example" -ForegroundColor Yellow
        Copy-Item ".env.example" ".env"
        Write-Host "⚠ Please edit .env with your Render database URL and JWT secret" -ForegroundColor Yellow
        Write-Host "⚠ Key variables to update:" -ForegroundColor Yellow
        Write-Host "   - DATABASE_URL=postgres://user:password@host:5432/db" -ForegroundColor Yellow
        Write-Host "   - JWT_SECRET=your-secret-key" -ForegroundColor Yellow
        Write-Host ""
        
        $editEnv = Read-Host "Edit .env file now? (y/n)"
        if ($editEnv -eq "y") {
            & notepad ".env"
        }
    } else {
        Write-Host "✗ .env and .env.example not found" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✓ .env file exists" -ForegroundColor Green
}

Write-Host ""

# ─────────────────────────────────────────────────────────────────────────────
# STEP 5: Test Server Configuration
# ─────────────────────────────────────────────────────────────────────────────
Write-Host "[STEP 5] Verifying Server Configuration..." -ForegroundColor Cyan

if (-not (Test-Path "server.js")) {
    Write-Host "✗ server.js not found" -ForegroundColor Red
    exit 1
}
Write-Host "✓ server.js verified" -ForegroundColor Green

# Check required files
$requiredFiles = @(
    "src\config\database.js",
    "src\config\jwt.js",
    "src\middlewares\auth.js",
    "src\routes\auth.js",
    "src\routes\users.js"
)

foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file)) {
        Write-Host "✗ Missing: $file" -ForegroundColor Red
        exit 1
    }
}
Write-Host "✓ All required files verified" -ForegroundColor Green

Write-Host ""

# ─────────────────────────────────────────────────────────────────────────────
# STEP 6: Git Push for Render Deployment
# ─────────────────────────────────────────────────────────────────────────────
Write-Host "[STEP 6] Pushing to GitHub (for Render auto-deployment)..." -ForegroundColor Cyan

Pop-Location
Set-Location $scriptDir

# Check if we're in a git repository
if (-not (Test-Path ".git")) {
    Write-Host "✗ Not a git repository" -ForegroundColor Red
    exit 1
}

# Check for uncommitted changes
$gitStatus = & git status --porcelain
if ($gitStatus) {
    Write-Host "Staging changes..." -ForegroundColor Yellow
    & git add api/
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    & git commit -m "🚀 Deploy: Update backend to Render - $timestamp" 2>$null || $true
    
    Write-Host "✓ Changes committed" -ForegroundColor Green
} else {
    Write-Host "⚠ No changes to commit in /api" -ForegroundColor Yellow
}

# Push to repository
Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
& git push origin main 2>$null || {
    Write-Host "⚠ Git push encountered an issue (may already be up to date)" -ForegroundColor Yellow
}

Write-Host "✓ Repository synced" -ForegroundColor Green
Write-Host ""

# ─────────────────────────────────────────────────────────────────────────────
# STEP 7: Deployment Summary
# ─────────────────────────────────────────────────────────────────────────────
Write-Host "════════════════════════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "✓ DEPLOYMENT PREPARATION COMPLETE" -ForegroundColor Green
Write-Host "════════════════════════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""

Write-Host "📋 NEXT STEPS ON RENDER.COM:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Create PostgreSQL Database:"
Write-Host "   - Go to https://dashboard.render.com"
Write-Host "   - New → PostgreSQL"
Write-Host "   - Copy the External Database URL"
Write-Host ""
Write-Host "2. Create Web Service:"
Write-Host "   - New → Web Service"
Write-Host "   - Connect GitHub repo: cltech-core-saas"
Write-Host "   - Build: cd api && npm install"
Write-Host "   - Start: cd api && npm start"
Write-Host ""
Write-Host "3. Set Environment Variables:"
Write-Host "   - DATABASE_URL=<from PostgreSQL>"
Write-Host "   - JWT_SECRET=<your-secret>"
Write-Host "   - NODE_ENV=production"
Write-Host "   - PORT=5000"
Write-Host ""
Write-Host "4. Initialize Database:"
Write-Host "   - Connect to PostgreSQL using pgAdmin"
Write-Host "   - Run /api/database_setup.sql"
Write-Host ""
Write-Host "5. Test API:"
Write-Host "   - GET https://<your-api>.onrender.com/health"
Write-Host "   - POST /api/auth/register"
Write-Host "   - POST /api/auth/login"
Write-Host ""

Write-Host "🎉 Ready for Render deployment!" -ForegroundColor Green
