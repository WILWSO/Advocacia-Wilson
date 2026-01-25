# 🔒 Pre-Commit Security Check Script
# Este script verifica que no se suban archivos sensibles al repositorio

Write-Host "🔍 Ejecutando verificación de seguridad pre-commit..." -ForegroundColor Cyan

$errors = @()

# 1. Verificar que .env no esté en los archivos staged
Write-Host "  ✓ Verificando archivo .env..." -ForegroundColor Gray
$envFiles = git diff --cached --name-only | Select-String -Pattern "^\.env$"
if ($envFiles) {
    $errors += "❌ ERROR: Intentando hacer commit del archivo .env (contiene credenciales)"
    $errors += "   Solución: git reset HEAD .env"
}

# 2. Buscar credenciales hardcodeadas en archivos staged
Write-Host "  ✓ Buscando credenciales hardcodeadas..." -ForegroundColor Gray
$stagedFiles = git diff --cached --name-only --diff-filter=ACM | Where-Object { $_ -match '\.(ts|tsx|js|jsx|json)$' }
foreach ($file in $stagedFiles) {
    $content = git show ":$file" 2>$null
    if ($content) {
        # Buscar patrones de credenciales
        if ($content -match 'password\s*=\s*["\'][^"\']{3,}["\']' -or
            $content -match 'api[_-]?key\s*=\s*["\'][^"\']{10,}["\']' -or
            $content -match 'secret\s*=\s*["\'][^"\']{10,}["\']' -or
            $content -match 'token\s*=\s*["\'][^"\']{10,}["\']') {
            $errors += "⚠️  ADVERTENCIA: Posible credencial en $file"
        }
    }
}

# 3. Verificar que no haya TODOs críticos
Write-Host "  ✓ Verificando TODOs críticos..." -ForegroundColor Gray
foreach ($file in $stagedFiles) {
    $content = git show ":$file" 2>$null
    if ($content -match '\/\/\s*TODO\s*:\s*CRITICAL|\/\/\s*FIXME\s*:\s*CRITICAL') {
        $errors += "⚠️  ADVERTENCIA: TODO/FIXME crítico en $file"
    }
}

# 4. Verificar tamaño de archivos (no subir archivos muy grandes)
Write-Host "  ✓ Verificando tamaño de archivos..." -ForegroundColor Gray
$largeFiles = git diff --cached --name-only | ForEach-Object {
    if (Test-Path $_) {
        $size = (Get-Item $_).Length / 1MB
        if ($size -gt 5) {
            $_
        }
    }
}
if ($largeFiles) {
    $errors += "⚠️  ADVERTENCIA: Archivos grandes detectados (>5MB):"
    $largeFiles | ForEach-Object { $errors += "   - $_" }
}

# 5. Verificar que haya descripción en el commit
$commitMsg = git log -1 --pretty=%B 2>$null
if (-not $commitMsg -or $commitMsg.Length -lt 10) {
    Write-Host "  ⚠️  Tip: Usa mensajes de commit descriptivos" -ForegroundColor Yellow
}

# Resultado final
Write-Host ""
if ($errors.Count -gt 0) {
    Write-Host "❌ ERRORES ENCONTRADOS:" -ForegroundColor Red
    $errors | ForEach-Object { Write-Host $_ -ForegroundColor Red }
    Write-Host ""
    Write-Host "Por favor, corrige estos problemas antes de hacer commit." -ForegroundColor Yellow
    exit 1
} else {
    Write-Host "✅ Verificación de seguridad completada. Todo OK!" -ForegroundColor Green
    Write-Host ""
    exit 0
}
