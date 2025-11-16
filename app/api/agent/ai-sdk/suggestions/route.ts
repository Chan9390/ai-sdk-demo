import {
  streamText,
  streamObject,
  createUIMessageStream,
  createUIMessageStreamResponse,
  stepCountIs,
  convertToModelMessages,
} from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { allTools } from "@/lib/tools/ai-sdk";
import { z } from "zod";

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

    const openai = createOpenAI({ apiKey });

    // Convert UI messages to model messages for streamText
    const modelMessages = convertToModelMessages(messages);

    // Create UI message stream with suggestions
    const stream = createUIMessageStream({
      async execute({ writer }) {
        // Step 1: Stream the main AI response
        const result = streamText({
          model: openai("gpt-5"),
          messages: modelMessages,
          tools: allTools,
          stopWhen: stepCountIs(5),
        });

        // Merge the AI response into the stream
        writer.merge(result.toUIMessageStream());

        // Wait for the response to complete
        await result.consumeStream();
        const response = await result.response;

        // Step 2: Generate follow-up suggestions using streamObject
        const suggestionsResult = streamObject({
          model: openai("gpt-5-mini"),
          messages: [
            ...modelMessages,
            ...response.messages,
            {
              role: "user",
              content:
                "Based on the provided response, generate up to three concise follow-up questions or actions. These should directly relate to the content and offer specific next steps or inquiries for deeper engagement. Avoid generic suggestions. If the last message contains a question, do NOT create suggestions/actions.",
            },
          ],
          schema: z.object({
            suggestions: z
              .array(z.string())
              .min(0)
              .max(3)
              .describe("Array of follow-up questions and/or actions"),
          }),
        });

        // Step 3: Stream suggestions progressively to the frontend
        const dataPartId = crypto.randomUUID();

        for await (const chunk of suggestionsResult.partialObjectStream) {
          // Write suggestions with the SAME id - this updates the previous data
          writer.write({
            id: dataPartId,
            type: "data-suggestions",
            data:
              chunk.suggestions?.filter(
                (suggestion) => suggestion !== undefined
              ) ?? [],
          });
        }
      },
    });

    return createUIMessageStreamResponse({ stream });
  } catch (error) {
    console.error("Error in AI SDK suggestions endpoint:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
