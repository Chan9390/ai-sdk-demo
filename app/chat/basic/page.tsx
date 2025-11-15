"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  PromptInput,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";

export default function BasicChatPage() {
  const [text, setText] = useState("");

  // Yo, this is how you can simply use the AI SDK to talk to your backend.
  // Note, we are not adding any headers. Just simple endpoint that accepts messages.
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/agent/ai-sdk/responses",
    }),
  });

  return (
    <div className="flex h-screen flex-col">
      <div className="border-b p-4">
        <h1 className="font-semibold text-xl">Basic Chat</h1>
        <p className="text-muted-foreground text-sm">
          Simple chat with AI SDK agent endpoint
        </p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              <p className="whitespace-pre-wrap">
                {message.parts.map((part, index) =>
                  part.type === "text" ? (
                    <span key={index}>{part.text}</span>
                  ) : null
                )}
              </p>
            </div>
          </div>
        ))}
        {status !== "ready" && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg bg-muted px-4 py-2">
              <p className="text-muted-foreground">Thinking...</p>
            </div>
          </div>
        )}
      </div>

      <div className="border-t p-4">
        <PromptInput
          onSubmit={(message) => {
            const hasText = Boolean(message.text);
            if (!hasText) return;

            sendMessage({ text: message.text });
            setText("");
          }}
        >
          <PromptInputBody>
            <PromptInputTextarea
              placeholder="Type your message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools>
              {/* Future: Add action buttons here */}
            </PromptInputTools>
            <PromptInputSubmit disabled={!text} status={status} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}
