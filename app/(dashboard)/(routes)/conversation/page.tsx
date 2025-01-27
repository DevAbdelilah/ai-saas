"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Bot, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Heading } from "@/components/heading";
import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const ConversationPage = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!values.prompt.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: values.prompt }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: values.prompt }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response,
        },
      ]);

      form.reset();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      router.refresh();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)]">
      <Heading
        title="Conversation"
        description="Our most advanced conversation model."
        icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
      />

      <div className="flex-1 overflow-y-auto px-4 lg:px-8 pb-20">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              } mb-4`}
            >
              <div
                className={` gap-3 flex items-start max-w-[80%] ${
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                } space-x-2`}
              >
                <div
                  className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                    message.role === "user" ? "bg-violet-500" : "bg-gray-200"
                  }`}
                >
                  {message.role === "user" ? (
                    <User className="h-5 w-5 text-white" />
                  ) : (
                    <Bot className="h-5 w-5 text-gray-700" />
                  )}
                </div>
                <div
                  className={`px-4 py-2 rounded-2xl ${
                    message.role === "user"
                      ? "bg-violet-500 text-white ml-2"
                      : "bg-gray-100 text-gray-900 mr-2"
                  } shadow-sm`}
                >
                  {message.content}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="  px-4 pb-4  bg-gradient-to-t from-white via-white to-transparent pt-10">
        {isLoading && (
          <div className="flex items-center gap-2 mb-4 text-violet-500 font-medium px-4">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce"></div>
            </div>
            AI is thinking...
          </div>
        )}
        <div className="max-w-4xl mx-auto px-4 pb-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="relative flex items-center bg-white rounded-lg shadow-lg"
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        className="border-0 focus-visible:ring-0 focus-visible:ring-transparent rounded-full px-4 py-6"
                        disabled={isLoading}
                        placeholder="Type your message..."
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                size="icon"
                type="submit"
                disabled={isLoading}
                className="absolute right-2 rounded-full bg-violet-500 hover:bg-violet-600 h-10 w-10"
              >
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;
