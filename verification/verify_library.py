
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:8080/apps/app-library/index.html")

        # Wait for grid
        page.wait_for_selector("#appsGrid")

        # Type in search
        page.fill("#searchInput", "snake")

        # Wait for filter
        page.wait_for_timeout(500)

        # Take screenshot
        page.screenshot(path="verification/library.png")
        browser.close()

if __name__ == "__main__":
    run()
