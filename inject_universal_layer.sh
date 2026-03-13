#!/bin/bash

# Mission 5: The "Mass Awakening" (Bulk Injection)
# Iterates through every index.html file in the apps/ directory
# and inserts the vibelib-extended.js script block just before </body>.

COUNT=0

# Iterate through all index.html files in apps/
find apps -name "index.html" | while read -r file; do
    if grep -q "vibelib-extended.js" "$file"; then
        echo "Skipping $file (Already Injected)"
        continue
    fi

    echo "Injecting into $file..."

    # Create the script block to insert
    SCRIPT_BLOCK='<script src="/vibelib-extended.js"></script>
<script>
  // Compatibility Patch for Legacy Apps
  window.addEventListener("load", () => {
    if (window.SloppyKarma && window.VibeLib.Economy) {
      // Redirect old calls to new engine
      window.SloppyKarma.track = window.VibeLib.Economy.track;
    }
  });
</script>'

    # Insert the block before </body>
    # Using python for safer insertion as sed with newlines can be tricky across platforms
    python3 -c "
import sys
import os

filepath = '$file'
script_block = '''$SCRIPT_BLOCK'''

try:
    with open(filepath, 'r') as f:
        content = f.read()

    if '</body>' in content:
        new_content = content.replace('</body>', script_block + '\n</body>')
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f'Successfully injected {filepath}')
    else:
        print(f'Warning: No </body> tag found in {filepath}')

except Exception as e:
    print(f'Error processing {filepath}: {e}')
"

    if [ $? -eq 0 ]; then
        ((COUNT++))
    fi
done

echo "Injected Universal Layer into $COUNT apps."
