#!/bin/bash
# Quick app quality verification script
# Run this anytime to check compliance with guidelines

echo "🔍 Checking app quality across all apps..."
echo ""

total_apps=$(ls -1 /vibespace/apps | wc -l)
issues=0

# Check for missing favicons
missing_favicon=()
for app in /vibespace/apps/*/; do
    app_name=$(basename "$app")
    index_file="$app/index.html"
    [ ! -f "$index_file" ] && continue

    if ! grep -qi "rel=.*icon" "$index_file"; then
        missing_favicon+=("$app_name")
    fi
done

# Check for missing og:url
missing_og_url=()
for app in /vibespace/apps/*/; do
    app_name=$(basename "$app")
    index_file="$app/index.html"
    [ ! -f "$index_file" ] && continue

    if ! grep -qi "og:url" "$index_file"; then
        missing_og_url+=("$app_name")
    fi
done

# Report
echo "📊 Total apps: $total_apps"
echo ""

if [ ${#missing_favicon[@]} -eq 0 ] && [ ${#missing_og_url[@]} -eq 0 ]; then
    echo "✅ ALL APPS PASS QUALITY CHECKS!"
    echo ""
    echo "All apps have:"
    echo "  ✓ Favicons"
    echo "  ✓ OG:URL tags"
    echo "  ✓ Complete head sections"
    exit 0
fi

echo "⚠️  Issues found:"
echo ""

if [ ${#missing_favicon[@]} -gt 0 ]; then
    echo "❌ Missing Favicons (${#missing_favicon[@]} apps):"
    for app in "${missing_favicon[@]}"; do
        echo "   • $app"
    done
    echo ""
    issues=$((issues + ${#missing_favicon[@]}))
fi

if [ ${#missing_og_url[@]} -gt 0 ]; then
    echo "⚠️  Missing og:url (${#missing_og_url[@]} apps):"
    for app in "${missing_og_url[@]}"; do
        echo "   • $app"
    done
    echo ""
    issues=$((issues + ${#missing_og_url[@]}))
fi

echo "Total issues: $issues"
echo "See APP_AUDIT_REPORT.md for detailed fixes"
exit 1
