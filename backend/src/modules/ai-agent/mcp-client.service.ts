import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

@Injectable()
export class McpClientService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(McpClientService.name);
  private client: Client;
  private transport: StdioClientTransport;
  private connected = false;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() { await this.connect(); }
  async onModuleDestroy() { await this.disconnect(); }

  private async connect() {
    if (this.connected) return;
    try {
      const serverPath = this.configService.get<string>('mcp.serverPath') ?? '';
      const credentialsPath = this.configService.get<string>('mcp.credentialsPath') ?? '';
      this.transport = new StdioClientTransport({ command: 'node', args: [serverPath], env: { ...process.env, GOOGLE_APPLICATION_CREDENTIALS: credentialsPath } as Record<string, string> });
      this.client = new Client({ name: 'nest-backend', version: '1.0.0' }, { capabilities: {} });
      await this.client.connect(this.transport);
      this.connected = true;
    } catch (error) { this.logger.error('Failed to connect to MCP:', error); }
  }

  private async disconnect() {
    if (!this.connected) return;
    try { await this.transport.close(); this.connected = false; } catch (error) { this.logger.error('Error disconnecting MCP:', error); }
  }

  async readSheet(spreadsheetId: string, range: string): Promise<any> {
    if (!this.connected) await this.connect();
    const result: any = await this.client.callTool({ name: 'read_sheet', arguments: { spreadsheetId, range } });
    if (result.isError) throw new Error(result.content[0].text);
    return JSON.parse(result.content[0].text);
  }

  async fetchAllRanges(spreadsheetId?: string): Promise<Record<string, any>> {
    const id = spreadsheetId || this.configService.get<string>('sheets.defaultSpreadsheetId');
    const ranges = this.configService.get<string[]>('sheets.ranges') || [];
    const results: Record<string, any> = {};
    for (const range of ranges) {
      try { results[range] = await this.readSheet(id!, range); } catch (error: any) { results[range] = { error: error.message }; }
    }
    return results;
  }
}
