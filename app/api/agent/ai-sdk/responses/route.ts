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
      // Explicitly using the responses API
      model: openai.responses("gpt-5"),
      tools: allTools,
      // Allow multiple steps: tool calls + final response
      // Default is stepCountIs(1) which stops after tool execution WITHOUT generating final text
      stopWhen: stepCountIs(5),
    });

    // agent.respond() returns a streaming response by default
    // It automatically streams the agent's response including tool calls
    return agent.respond({
      messages,
    });
  } catch (error) {
    console.error("Error in AI SDK agent streaming endpoint:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
