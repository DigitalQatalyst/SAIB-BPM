# POC Setup Verification Script
# Run this to check if everything is configured correctly

Write-Host "`n=== POC Setup Verification ===" -ForegroundColor Cyan
Write-Host ""

# Check 1: Files exist
Write-Host "Checking files..." -ForegroundColor Yellow

$files = @(
    "src/pages/DocWriterEnhanced.tsx",
    "src/utils/mockDocumentContent.ts",
    "src/utils/sectionParser.ts",
    "src/utils/sectionGenerator.ts",
    "src/components/docwriter/SectionNavigator.tsx"
)

$allFilesExist = $true
foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "  ✓ $file" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $file MISSING!" -ForegroundColor Red
        $allFilesExist = $false
    }
}

Write-Host ""

# Check 2: App.tsx import
Write-Host "Checking App.tsx import..." -ForegroundColor Yellow

$appContent = Get-Content "src/App.tsx" -Raw
if ($appContent -match "import DocWriter from './pages/DocWriterEnhanced'") {
    Write-Host "  ✓ Using DocWriterEnhanced" -ForegroundColor Green
} elseif ($appContent -match "import DocWriter from './pages/DocWriter'") {
    Write-Host "  ✗ Still using old DocWriter!" -ForegroundColor Red
    Write-Host "    Fix: Change import to './pages/DocWriterEnhanced'" -ForegroundColor Yellow
} else {
    Write-Host "  ? Could not find DocWriter import" -ForegroundColor Yellow
}

Write-Host ""

# Check 3: Node modules
Write-Host "Checking node_modules..." -ForegroundColor Yellow

if (Test-Path "node_modules") {
    Write-Host "  ✓ node_modules exists" -ForegroundColor Green
} else {
    Write-Host "  ✗ node_modules missing!" -ForegroundColor Red
    Write-Host "    Fix: Run 'npm install'" -ForegroundColor Yellow
}

Write-Host ""

# Summary
Write-Host "=== Summary ===" -ForegroundColor Cyan

if ($allFilesExist -and ($appContent -match "DocWriterEnhanced")) {
    Write-Host "✓ Setup looks good!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "  1. Restart your dev server (Ctrl+C, then 'npm run dev')" -ForegroundColor White
    Write-Host "  2. Clear browser cache (Ctrl+Shift+R)" -ForegroundColor White
    Write-Host "  3. Navigate to /manage-requests" -ForegroundColor White
    Write-Host "  4. Click on a request" -ForegroundColor White
    Write-Host "  5. Click 'Generate Document in AI DocWriter'" -ForegroundColor White
} else {
    Write-Host "✗ Setup has issues!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please fix the issues above and run this script again." -ForegroundColor Yellow
}

Write-Host ""
