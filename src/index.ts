import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage } from "@langchain/core/messages";
import { FilesystemMCP } from "./mcp/filesystem";
import { CallbackHandler } from "langfuse-langchain";
import {
  PDFTools,
} from "./tools/pdf-tools";

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash-lite",
  apiKey: process.env.GEMINI_API_KEY || "YOUR_API_KEY_HERE",
});

const langfuseHandler = new CallbackHandler();

const agent = createReactAgent({
  llm,
  tools: [...(await new FilesystemMCP().getTools()), ...PDFTools],
});

async function runAgent(query: string): Promise<string> {
  try {
    const inputs = { messages: [new HumanMessage(query)] };
    const response = await agent.invoke(inputs, {
      callbacks: [langfuseHandler],
    });
    const lastMessage = response.messages[response.messages.length - 1];
    return lastMessage.content as string;
  } catch (error) {
    return `Error: ${error}`;
  }
}

const query =
  "Tell me about papers in Data/Papers. Read Papers Page by Page and extract titles of works with doi and write it to result txt";
const result = await runAgent(query);
console.log(`Query: ${query}`);
console.log(`Response: ${result}`);
