# PowerShell script to fix placeholder components with proper function names

$uiDir = "src/components/ui"
$files = Get-ChildItem -Path $uiDir -Filter "*.tsx" -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Check if it's a placeholder component (contains "Placeholder for")
    if ($content -match 'Placeholder for') {
        Write-Host "Fixing $($file.Name)..."
        
        # Get component name from filename
        $baseName = $file.BaseName
        $componentName = ConvertTo-PascalCase $baseName
        
        # Create proper component
        $properContent = @"
"use client";

import * as React from "react";

export function $componentName() {
  return (
    <div>
      Placeholder for $baseName component
    </div>
  );
}
"@
        
        # Save the fixed content
        Set-Content -Path $file.FullName -Value $properContent -Encoding UTF8
    }
}

function ConvertTo-PascalCase($kebabCase) {
    $parts = $kebabCase -split '-'
    $result = ""
    foreach ($part in $parts) {
        $result += $part.Substring(0, 1).ToUpper() + $part.Substring(1).ToLower()
    }
    return $result
}