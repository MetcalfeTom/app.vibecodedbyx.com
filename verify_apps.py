from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Verify Docs
        print("Verifying Docs...")
        page.goto("http://localhost:8000/apps/docs/index.html")
        page.wait_for_timeout(1000) # Wait for potential injections
        page.screenshot(path="docs.png")
        print("Docs screenshot saved.")

        # Verify Library
        print("Verifying Library...")
        page.goto("http://localhost:8000/apps/app-library/index.html")
        page.wait_for_timeout(1000)
        page.screenshot(path="library.png")
        print("Library screenshot saved.")

        # Verify ID
        print("Verifying ID...")
        page.goto("http://localhost:8000/apps/sloppy-id/index.html")
        page.wait_for_timeout(1000)
        page.screenshot(path="id.png")
        print("ID screenshot saved.")

        browser.close()

if __name__ == "__main__":
    run()
