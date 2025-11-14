import { ChatOpenAI } from "@langchain/openai";
import { allTools } from "@/lib/chat/tools";

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

    // Get OpenAI API key from environment
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "OPENAI_API_KEY not configured" },
        { status: 500 }
      );
    }

    // Initialize ChatOpenAI with gpt-5 and bind tools
    const model = new ChatOpenAI({
      model: "gpt-5-mini",
      apiKey,
      temperature: undefined, // Not supported on gpt-5
      modelKwargs: {
        reasoning_effort: "minimal",
      },
    }).bindTools(allTools);

    // Invoke the model and wait for complete response
    const response = await model.invoke(messages);

    // Return the complete response
    return Response.json({
      role: "assistant",
      content: response.content,
      tool_calls: response.tool_calls || [],
    });
  } catch (error) {
    console.error("Error in non-streaming langchain endpoint:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
