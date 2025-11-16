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
      // Explicitly disabling the usage of Responses API
      useResponsesApi: false,
      reasoning: {
        effort: "minimal",
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

    // Sending `result` will send the complete response from agent including:
    // - tool calls and params (it only discloses the tools that were used)
    // - tool call content
    // - the model in use

    // return Response.json(result);

    // Hence, its always better to send the final message to the client.
    const finalMessage = result.messages.at(-1);

    if (finalMessage) {
      return Response.json(finalMessage);
    }

    // Worst case, if there's no final message, send the complete response.
    return Response.json(result);
  } catch (error) {
    console.error("Error in non-streaming langchain endpoint:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
