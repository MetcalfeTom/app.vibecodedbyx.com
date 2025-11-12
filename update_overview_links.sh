#!/bin/bash

# Script to add overview page links to all apps
# This adds a link to https://app.vibecodedbyx.com/overview in all index.html files

count=0
updated=0
errors=0

# Find all index.html files, excluding overview, forums, and node_modules
while IFS= read -r file; do
    ((count++))

    # Skip if already has the overview link
    if grep -q "app.vibecodedbyx.com/overview" "$file"; then
        echo "SKIP: $file (already has overview link)"
        continue
    fi

    # Check if file has a backlink to vibecodedbyx.com
    if grep -q "vibecodedbyx.com" "$file"; then
        # Create a temporary file with the new content
        awk '
        /vibecodedbyx\.com/ && !found {
            # Print the current line
            print $0
            # After the vibecodedbyx link, add overview link on next suitable location
            # We need to be careful about the context
            if ($0 ~ /<\/a>/ && $0 !~ /overview/) {
                # Try to match the styling of the existing link
                if ($0 ~ /style=/) {
                    # Extract and reuse similar styling
                    print "            <a href=\"https://app.vibecodedbyx.com/overview\" style=\"color:#4ecdc4;text-decoration:none;margin-left:10px\">🎨 View All Apps</a>"
                } else {
                    # Add with basic styling
                    print "            <a href=\"https://app.vibecodedbyx.com/overview\" style=\"color:#4ecdc4;text-decoration:none;margin-left:10px\">🎨 View All Apps</a>"
                }
            }
            found=1
            next
        }
        { print }
        ' "$file" > "${file}.tmp"

        # Check if we actually made changes
        if ! diff -q "$file" "${file}.tmp" > /dev/null 2>&1; then
            mv "${file}.tmp" "$file"
            echo "UPDATED: $file"
            ((updated++))
        else
            rm "${file}.tmp"
            echo "NO CHANGE: $file"
        fi
    else
        echo "NO BACKLINK: $file (no existing vibecodedbyx link found)"
        ((errors++))
    fi

done < <(find /vibespace/apps -name "index.html" -type f | grep -v "/overview/" | grep -v "/forums/" | grep -v "node_modules" | sort)

echo ""
echo "================================"
echo "Summary:"
echo "  Total files found: $count"
echo "  Successfully updated: $updated"
echo "  Skipped (already has link): $((count - updated - errors))"
echo "  Errors/No backlink: $errors"
echo "================================"
