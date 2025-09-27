import type { DynamicStructuredTool } from "@langchain/core/tools";

export default interface mcpClient {
  getTools(): Promise<DynamicStructuredTool[]>;
}
