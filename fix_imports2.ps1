# PowerShell script to fix all remaining versioned imports
Write-Host "Fixing remaining versioned imports..." -ForegroundColor Green

# Function to replace versioned imports in a file
function Fix-File {
    param([string]$FilePath)
    
    if (-not (Test-Path $FilePath)) {
        Write-Host "File not found: $FilePath" -ForegroundColor Yellow
        return
    }
    
    $content = Get-Content $FilePath -Raw
    $originalContent = $content
    
    # Replace all radix-ui versioned imports
    $content = $content -replace '@radix-ui/react-[a-z-]+@\d+\.\d+\.\d+', {
        param($match)
        $match -replace '@\d+\.\d+\.\d+', ''
    }
    
    # Replace all other versioned imports
    $content = $content -replace '"[^"]+@\d+\.\d+\.\d+"', {
        param($match)
        $match -replace '@\d+\.\d+\.\d+', ''
    }
    
    # Replace class-variance-authority version
    $content = $content -replace 'class-variance-authority@\d+\.\d+\.\d+', 'class-variance-authority'
    
    if ($content -ne $originalContent) {
        Set-Content -Path $FilePath -Value $content -NoNewline
        Write-Host "Fixed: $FilePath" -ForegroundColor Green
    }
}

# Files that still have issues based on error messages
$problemFiles = @(
    "src/components/ui/badge.tsx",
    "src/components/ui/hover-card.tsx",
    "src/components/ui/alert-dialog.tsx",
    "src/components/ui/tabs.tsx",
    "src/components/ui/scroll-area.tsx"
)

Write-Host "Fixing specific problem files..." -ForegroundColor Cyan

foreach ($file in $problemFiles) {
    Fix-File -FilePath $file
}

# Also search for any remaining files with versioned imports
Write-Host "Searching for any remaining files with versioned imports..." -ForegroundColor Cyan

$files = Get-ChildItem -Path . -Recurse -Include *.tsx, *.ts | Where-Object { 
    $_.FullName -notlike '*node_modules*' -and $_.FullName -notlike '*\.git*'
}

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    if ($content -match '@\d+\.\d+\.\d+' -and $content -match 'from\s+"[^"]+@\d+\.\d+\.\d+"') {
        Write-Host "Found versioned import in: $($file.FullName)" -ForegroundColor Yellow
        Fix-File -FilePath $file.FullName
    }
}

Write-Host "Done!" -ForegroundColor Green