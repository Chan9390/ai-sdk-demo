import { Experimental_Agent as Agent, stepCountIs } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { allTools } from "@/lib/tools/ai-sdk";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return Response.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "OPENAI_API_KEY not configured" },
        { status: 500 }
      );
    }

    // If you want to customize other things like base URL, headers, etc. you can do so here.
    const openai = createOpenAI({ apiKey });

    const agent = new Agent({
      // Explicitly using the chat completions endpoint
      // Default is the responses API
      model: openai.chat("gpt-5"),
      tools: allTools,
      // Allow multiple steps: tool calls + final response
      // Default is stepCountIs(1) which stops after tool execution WITHOUT generating final text
      stopWhen: stepCountIs(5),
    });

    // Use agent.stream() for streaming response
    const result = agent.stream({
      messages,
      providerOptions: {
        openai: {
          reasoningEffort: 'minimal',
        },
      },
    });

    // Create a streaming response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Iterate through the stream chunks
          // fullStream is a stream of full messages (including tool calls and final response)
          // textStream is a stream of text tokens only
          for await (const chunk of result.fullStream) {
            // Stream the chunk as JSON
            const data = JSON.stringify(chunk) + "\n";
            controller.enqueue(new TextEncoder().encode(data));
          }
          controller.close();
        } catch (error) {
          console.error("Error in stream:", error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error in AI SDK streaming endpoint:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
