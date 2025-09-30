# AI Spirit Response Edge Function

This Supabase Edge Function integrates Claude API to provide intelligent, context-aware responses for the Ouija Board V2 app.

## Setup

1. **Install Supabase CLI** (if not already installed):
   ```bash
   npm install -g supabase
   ```

2. **Link your Supabase project**:
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```

3. **Set the Anthropic API key as a secret**:
   ```bash
   supabase secrets set ANTHROPIC_API_KEY=your-api-key-here
   ```

4. **Deploy the function**:
   ```bash
   supabase functions deploy ai-spirit-response
   ```

## Testing Locally

To test the function locally:

```bash
# Start local Supabase
supabase start

# Set local env var
export ANTHROPIC_API_KEY=your-api-key-here

# Serve the function
supabase functions serve ai-spirit-response --env-file .env.local
```

## Usage

The frontend automatically calls this function via:
```javascript
const { data, error } = await supabase.functions.invoke('ai-spirit-response', {
  body: { question: 'Will I find love?' }
});
```

If the function is unavailable or errors occur, the app gracefully falls back to enhanced logic-based responses.

## Response Format

The function returns:
```json
{
  "answer": "LOVE AWAITS THE PATIENT HEART"
}
```

Responses are:
- 3-8 words maximum
- ALL CAPS
- Mystical and cryptic
- Context-aware based on the question
