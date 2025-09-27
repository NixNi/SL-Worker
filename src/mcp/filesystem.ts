import { MultiServerMCPClient } from "@langchain/mcp-adapters";
import type mcpClient from "./mcpClient";

export class FilesystemMCP implements mcpClient {
  client: MultiServerMCPClient;
  constructor() {
    this.client = new MultiServerMCPClient({
      mcpServers: {
        filesystem: {
          command: "bunx",
          args: ["-y", "@modelcontextprotocol/server-filesystem", "./Data"],
        },
      },
    });
  }
  public async getTools() {
    return (await this.client.getTools()) || [];
  }
}
