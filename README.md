## AI SDK Demo

This is a demo repository for Vercel's AI SDK UI.

I really like how AI SDK makes it easier for non-UI developers like me to create frontend for AI backends.

The goal of the repository is simple: Explore various UI features of AI SDK against Langchain and AI SDK backend.

To make things simpler, these are the following decisions:
1. Use only GPT-5 with a simple prompt. This model has both reasoning and non-reasoning modes.
2. Have 3 tools only. These tools emulate real world tools.
3. Have streaming and non-streaming endpoint. This will help how the frontend components render the output in different scenarios.