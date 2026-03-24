# PowerShell script to fix all versioned imports in the project
Write-Host "Fixing versioned imports..." -ForegroundColor Green

# Function to replace versioned imports in a file
function Fix-File {
    param([string]$FilePath)
    
    if (-not (Test-Path $FilePath)) {
        Write-Host "File not found: $FilePath" -ForegroundColor Yellow
        return
    }
    
    $content = Get-Content $FilePath -Raw
    $originalContent = $content
    
    # Replace common versioned imports
    $content = $content -replace '@radix-ui/react-switch@\d+\.\d+\.\d+', '@radix-ui/react-switch'
    $content = $content -replace '@radix-ui/react-checkbox@\d+\.\d+\.\d+', '@radix-ui/react-checkbox'
    $content = $content -replace '@radix-ui/react-tooltip@\d+\.\d+\.\d+', '@radix-ui/react-tooltip'
    $content = $content -replace '@radix-ui/react-dialog@\d+\.\d+\.\d+', '@radix-ui/react-dialog'
    $content = $content -replace '@radix-ui/react-popover@\d+\.\d+\.\d+', '@radix-ui/react-popover'
    $content = $content -replace '@radix-ui/react-select@\d+\.\d+\.\d+', '@radix-ui/react-select'
    $content = $content -replace '@radix-ui/react-label@\d+\.\d+\.\d+', '@radix-ui/react-label'
    $content = $content -replace '@radix-ui/react-button@\d+\.\d+\.\d+', '@radix-ui/react-button'
    
    # Replace lucide-react versioned imports
    $content = $content -replace 'lucide-react@\d+\.\d+\.\d+', 'lucide-react'
    
    # Replace sonner versioned imports
    $content = $content -replace 'sonner@\d+\.\d+\.\d+', 'sonner'
    
    # Replace other versioned imports
    $content = $content -replace 'react-day-picker@\d+\.\d+\.\d+', 'react-day-picker'
    $content = $content -replace 'emoji-picker-react@\d+\.\d+\.\d+', 'emoji-picker-react'
    
    if ($content -ne $originalContent) {
        Set-Content -Path $FilePath -Value $content -NoNewline
        Write-Host "Fixed: $FilePath" -ForegroundColor Green
    }
}

# Find all TypeScript/JavaScript files with versioned imports
Write-Host "Searching for files with versioned imports..." -ForegroundColor Cyan

# Common patterns to search for
$patterns = @(
    '@radix-ui/react-.*@\d+\.\d+\.\d+',
    'lucide-react@\d+\.\d+\.\d+',
    'sonner@\d+\.\d+\.\d+',
    'react-day-picker@\d+\.\d+\.\d+',
    'emoji-picker-react@\d+\.\d+\.\d+'
)

# Get all .tsx and .ts files
$files = Get-ChildItem -Path . -Recurse -Include *.tsx, *.ts | Where-Object { $_.FullName -notlike '*node_modules*' }

$filesToFix = @()
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    foreach ($pattern in $patterns) {
        if ($content -match $pattern) {
            $filesToFix += $file.FullName
            break
        }
    }
}

Write-Host "Found $($filesToFix.Count) files to fix" -ForegroundColor Cyan

# Fix each file
foreach ($file in $filesToFix) {
    Fix-File -FilePath $file
}

Write-Host "Done!" -ForegroundColor Green