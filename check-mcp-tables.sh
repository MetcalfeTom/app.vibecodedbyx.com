#!/bin/bash
# Simple helper script to query the Supabase MCP server for the table list.
curl -s http://supabase-mcp:8000/mcp \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"supabase.list_tables","params":{}}'
