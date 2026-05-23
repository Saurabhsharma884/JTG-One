import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { google } from "googleapis";
import * as path from "path";

// 1. Initialize Google Auth using the Service Account credentials
// Note: We are requesting read-only access for safety.
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, 'credentials.json'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const sheets = google.sheets({ version: 'v4', auth });

// 2. Initialize the MCP Server
const server = new McpServer({
  name: "google-sheets-mcp-server",
  version: "1.0.0",
});

// 3. Define the tools this server provides
server.registerTool(
  "read_sheet",
  {
    description: "Read data from a specific Google Sheet and range.",
    inputSchema: {
      spreadsheetId: z.string().describe("The ID of the Google Sheet (found in the URL)"),
      range: z.string().describe("The A1 notation of the range to read (e.g., 'Sheet1!A1:D10')"),
    },
  },
  async ({ spreadsheetId, range }) => {
    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
      });

      const rows = response.data.values;
      if (!rows || rows.length === 0) {
        return {
          content: [{ type: "text", text: "No data found in the specified range." }],
        };
      }

      // Return the data as a formatted JSON string
      return {
        content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error fetching sheet: ${error.message}` }],
        isError: true,
      };
    }
  }
);

// 4. Start the server
async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Google Sheets MCP Server is running on stdio");
}

run().catch(console.error);
