import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage } from "@langchain/core/messages";

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash-lite",
  apiKey: process.env.GEMINI_API_KEY || "YOUR_API_KEY_HERE",
});

const agent = createReactAgent({
  llm,
  tools: [],
});

async function runAgent(query: string): Promise<string> {
  try {
    const inputs = { messages: [new HumanMessage(query)] };
    const response = await agent.invoke(inputs);
    const lastMessage = response.messages[response.messages.length - 1];
    return lastMessage.content as string;
  } catch (error) {
    return `Error: ${error}`;
  }
}

async function main() {
  const query = "What is 5 + 3?";
  const result = await runAgent(query);
  console.log(`Query: ${query}`);
  console.log(`Response: ${result}`);
}

main().catch(console.error);