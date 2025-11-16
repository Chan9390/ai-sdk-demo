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

    // Create a streaming response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Use agent.stream() instead of agent.invoke()
          const streamResult = await agent.stream({ messages });

          // Iterate through the stream chunks
          for await (const chunk of streamResult) {
            // Stream the chunk as JSON
            const data = JSON.stringify(chunk) + "\n";
            controller.enqueue(new TextEncoder().encode(data));
          }

          controller.close();
        } catch (error) {
          console.error("Error in streaming langchain endpoint:", error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error in streaming langchain endpoint:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
