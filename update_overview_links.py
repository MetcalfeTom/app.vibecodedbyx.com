#!/usr/bin/env python3
"""
Script to add overview page links to all apps.
Adds a link to https://app.vibecodedbyx.com/overview near existing vibecodedbyx.com backlinks.
"""

import os
import re
from pathlib import Path

def find_index_files():
    """Find all index.html files excluding overview, forums, and node_modules."""
    apps_dir = Path("/vibespace/apps")
    all_files = list(apps_dir.rglob("index.html"))

    # Filter out unwanted directories
    filtered = []
    for f in all_files:
        path_str = str(f)
        if "/overview/" not in path_str and "/forums/" not in path_str and "node_modules" not in path_str:
            filtered.append(f)

    return sorted(filtered)

def add_overview_link(file_path):
    """Add overview link to a single file."""

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check if already has overview link
    if 'app.vibecodedbyx.com/overview' in content:
        return 'SKIP', 'already has overview link'

    # Check if has vibecodedbyx.com backlink
    if 'vibecodedbyx.com' not in content:
        return 'NO_BACKLINK', 'no existing vibecodedbyx link found'

    # Strategy: Find the vibecodedbyx.com link and add overview link after it
    # Pattern 1: Simple inline link with style
    # Pattern 2: Link in div/backlink section

    patterns_to_try = [
        # Pattern 1: Inline link with closing </a>, add right after
        (
            r'(<a[^>]*href=["\']https?://www\.vibecodedbyx\.com["\'][^>]*>.*?</a>)',
            r'\1\n            <a href="https://app.vibecodedbyx.com/overview" style="color:#4ecdc4;text-decoration:none;margin-left:10px">🎨 View All Apps</a>'
        ),
        # Pattern 2: Link in a div, add before closing div
        (
            r'(<div[^>]*>.*?vibecodedbyx\.com.*?</a>)(.*?</div>)',
            r'\1 | <a href="https://app.vibecodedbyx.com/overview" style="color:#4ecdc4;text-decoration:none">🎨 View All Apps</a>\2'
        ),
    ]

    # Try to find and replace
    new_content = content
    replaced = False

    # More sophisticated approach: find the first occurrence of vibecodedbyx link
    # and insert overview link right after the closing </a> tag

    # Find all vibecodedbyx.com links
    link_pattern = r'<a[^>]*href=["\']https?://(?:www\.)?vibecodedbyx\.com["\'][^>]*>.*?</a>'
    matches = list(re.finditer(link_pattern, content, re.DOTALL | re.IGNORECASE))

    if matches:
        # Get the first match
        first_match = matches[0]
        insert_pos = first_match.end()

        # Determine the style based on the existing link
        existing_link = first_match.group(0)

        # Try to extract styling patterns
        overview_link = ''

        # Check context around the link to determine best format
        before_link = content[max(0, first_match.start()-100):first_match.start()]
        after_link = content[insert_pos:min(len(content), insert_pos+100)]

        # If it's in a fixed position style (top/bottom left/right)
        if 'position:' in existing_link and 'fixed' in existing_link:
            # Don't add inline, look for a better spot (e.g., game over screen or bottom)
            # Find if there's a game over or similar section
            game_over_match = re.search(r'(<div[^>]*class=["\'][^"\']*game-over[^"\']*["\'][^>]*>.*?)(</div>)', content, re.DOTALL)
            if game_over_match:
                # Add before the closing game over div
                overview_link_html = '\n            <div style="margin-top:20px;font-size:12px;opacity:.7">\n                <a href="https://app.vibecodedbyx.com/overview" style="color:#4ecdc4;text-decoration:none">🎨 View All Apps</a>\n            </div>'
                new_content = content[:game_over_match.end()-6] + overview_link_html + content[game_over_match.end()-6:]
                replaced = True
            else:
                # Add at the same level as backlink but with right position
                # Extract position values
                top_match = re.search(r'top:\s*(\d+)px', existing_link)
                if top_match:
                    top_val = top_match.group(1)
                    overview_link = f'\n<a href="https://app.vibecodedbyx.com/overview" style="position:fixed;top:{top_val}px;right:20px;color:#fff;text-decoration:none;background:rgba(255,255,255,.2);padding:10px 20px;border-radius:10px;transition:all .3s">🎨 All Apps →</a>'
                    new_content = content[:insert_pos] + overview_link + content[insert_pos:]
                    replaced = True

        # If it's inline or in a div, add right after
        elif not replaced:
            # Check if next chars are whitespace/newline or closing tag
            if after_link.strip().startswith('</'):
                # It's at end of a container, add before closing tag
                overview_link = ' | <a href="https://app.vibecodedbyx.com/overview" style="color:#4ecdc4;text-decoration:none">🎨 View All Apps</a>'
            else:
                # Add on new line or inline
                overview_link = '\n            <a href="https://app.vibecodedbyx.com/overview" style="color:#4ecdc4;text-decoration:none;margin-left:10px">🎨 View All Apps</a>'

            new_content = content[:insert_pos] + overview_link + content[insert_pos:]
            replaced = True

    if replaced and new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return 'UPDATED', 'added overview link'
    else:
        return 'NO_CHANGE', 'could not find suitable insertion point'

def main():
    """Main function to update all files."""
    files = find_index_files()

    print(f"Found {len(files)} index.html files to process\n")

    stats = {
        'UPDATED': 0,
        'SKIP': 0,
        'NO_BACKLINK': 0,
        'NO_CHANGE': 0,
        'ERROR': 0
    }

    for file_path in files:
        try:
            status, message = add_overview_link(file_path)
            stats[status] += 1

            rel_path = str(file_path).replace('/vibespace/apps/', '')

            if status == 'UPDATED':
                print(f"✓ UPDATED: {rel_path}")
            elif status == 'SKIP':
                print(f"⊘ SKIP: {rel_path} ({message})")
            elif status == 'NO_BACKLINK':
                print(f"⚠ NO_BACKLINK: {rel_path}")
            else:
                print(f"- NO_CHANGE: {rel_path}")

        except Exception as e:
            stats['ERROR'] += 1
            print(f"✗ ERROR: {file_path}: {e}")

    print("\n" + "="*50)
    print("Summary:")
    print(f"  Total files processed: {len(files)}")
    print(f"  ✓ Successfully updated: {stats['UPDATED']}")
    print(f"  ⊘ Skipped (already has link): {stats['SKIP']}")
    print(f"  ⚠ No backlink found: {stats['NO_BACKLINK']}")
    print(f"  - No change needed: {stats['NO_CHANGE']}")
    print(f"  ✗ Errors: {stats['ERROR']}")
    print("="*50)

    return stats['UPDATED']

if __name__ == '__main__':
    updated = main()
    exit(0 if updated > 0 else 1)
