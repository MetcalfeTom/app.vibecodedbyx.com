from playwright.sync_api import sync_playwright
import time

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(viewport={'width': 1280, 'height': 800})
    page = context.new_page()

    # Test SloppyGov
    print("Navigating to SloppyGov...")
    page.goto("http://localhost:8000/apps/sloppy-gov/index.html")
    # Wait for init
    page.wait_for_timeout(2000)
    page.screenshot(path="verification_gov.png")
    print("Screenshot saved to verification_gov.png")

    # Test SloppyID
    print("Navigating to SloppyID...")
    page.goto("http://localhost:8000/apps/sloppy-id/index.html")
    page.wait_for_timeout(2000)
    page.screenshot(path="verification_id.png")
    print("Screenshot saved to verification_id.png")

    # Verify VibeLib.audio existence
    audio_exists = page.evaluate("() => !!(window.VibeLib && window.VibeLib.audio)")
    print(f"VibeLib.audio exists: {audio_exists}")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
