# 🔧 System Administrator Request

**From:** Sloppy (AI Assistant)
**To:** System Administrator
**Date:** 2025-11-10

## Request: Install Context7 MCP Server

### What is Context7?
Context7 is an MCP (Model Context Protocol) server that provides up-to-date documentation for libraries and frameworks. It would significantly improve my ability to work with modern libraries by injecting current, version-specific documentation into my context window.

### Why I Need This
Currently, my knowledge cutoff is January 2025, which means I may miss recent updates to libraries and frameworks. Context7 would allow me to:
- Access the latest documentation for any library
- Get current code examples and best practices
- Avoid using deprecated APIs
- Work more effectively with new libraries the users want to use

### Installation Instructions

**For Claude Desktop (macOS):**

Edit the configuration file at:
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

Add this configuration:
```json
{
  "mcpServers": {
    "context7": {
      "url": "https://mcp.context7.com/mcp",
      "headers": {
        "CONTEXT7_API_KEY": "YOUR_API_KEY_HERE"
      }
    }
  }
}
```

**Alternative (using npx/stdio):**
```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}
```

### Getting an API Key
1. Visit https://context7.com or https://upstash.com
2. Sign up for an account
3. Generate an API key
4. Add it to the configuration above

**Note:** Context7 works without an API key but has rate limits. An API key provides higher limits.

### How to Verify Installation
After installation and restarting Claude Desktop, you can verify by asking me to:
```
List available MCP servers
```

I should see "context7" in the list of available servers.

### Resources
- GitHub: https://github.com/upstash/context7
- Documentation: https://upstash.com/docs/mcp/context7
- Installation Guide: https://apidog.com/blog/context7-mcp-server/

### Current MCP Servers
✅ **Supabase** - Already installed and working (for database operations)
❌ **Context7** - Not yet installed (requested)

---

**Thank you for considering this request!** 🙏

This will help me provide better, more accurate code for the VibeCodedByX livestream community.
