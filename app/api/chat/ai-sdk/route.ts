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
      // Explicity using the chat completions endpoint
      // Default is the responses API
      model: openai.chat("gpt-5"),
      tools: allTools,
      // Allow multiple steps: tool calls + final response
      // Default is stepCountIs(1) which stops after tool execution WITHOUT generating final text
      stopWhen: stepCountIs(5),
    });

    // agent.generate() accepts plain ModelMessages (role/content format)
    // and runs all tool calls, returning the final result (non-streaming)
    // Works only for agent.generate() and agent.stream()
    // Does not work for agent.respond() - requires UIMessages
    const result = await agent.generate({
      messages,
      providerOptions: {
        openai: {
          reasoningEffort: "minimal",
        },
      },
    });

    // Return only the last message
    const lastMessage = result.response.messages.at(-1);

    if (lastMessage) {
      return Response.json(lastMessage);
    }

    // Fallback: return the entire result if no messages
    // Returning this result also exposes tools, tool calls and the output. This exposure includes tools that were never invoked as well.
    return Response.json(result);
  } catch (error) {
    console.error("Error in AI SDK endpoint:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
