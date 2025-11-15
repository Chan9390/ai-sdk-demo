import { BaseMessageLike } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import { createAgent } from "langchain";
import { allTools } from "@/lib/tools/langchain";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = (await req.json()) as {
      messages?: BaseMessageLike[];
    };

    if (!messages || !Array.isArray(messages)) {
      return Response.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    // Get OpenAI API key from environment
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "OPENAI_API_KEY not configured" },
        { status: 500 }
      );
    }

    // Initialize ChatOpenAI with gpt-5
    const model = new ChatOpenAI({
      model: "gpt-5",
      apiKey,
      modelKwargs: {
        reasoning_effort: "minimal",
      },
    });

    // Create the agent with LangChain helper so it can auto-run tools
    const agent = createAgent({
      model,
      tools: allTools,
    });

    // Invoke the agent so it can call tools and respond with the final message
    const result = (await agent.invoke({ messages })) as {
      messages: BaseMessageLike[];
    };
    const finalMessage = result.messages.at(-1);

    if (finalMessage) {
      return Response.json(finalMessage);
    }

    return Response.json(result);
  } catch (error) {
    console.error("Error in non-streaming langchain endpoint:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
