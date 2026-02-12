
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:8080/apps/sloppy-desktop/index.html")

        # Wait for desktop to load
        page.wait_for_selector("#desktop")

        # Click start button to open menu
        page.click(".start-btn")

        # Wait for animation
        page.wait_for_timeout(500)

        # Take screenshot
        page.screenshot(path="verification/desktop.png")
        browser.close()

if __name__ == "__main__":
    run()
