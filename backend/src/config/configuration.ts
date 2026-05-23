import * as path from 'path';

export default () => ({
  port: parseInt(process.env.PORT || '3001', 10),
  mongodb: { uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/employee-dashboard' },
  gemini: { apiKey: process.env.GEMINI_API_KEY || 'AIzaSyDeFEKkf6i38Cpk8m6LYQAmtl0tGJzpmmk', model: process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite' },
  mcp: { serverPath: process.env.MCP_SERVER_PATH || path.join(__dirname, '..', 'mcp-server', 'google-sheets.js'), credentialsPath: process.env.GOOGLE_APPLICATION_CREDENTIALS || path.join(__dirname, '..', 'mcp-server', 'credentials.json') },
  sheets: { defaultSpreadsheetId: process.env.DEFAULT_SPREADSHEET_ID || '1n26g_aDBT-c5DAHxpSIgZVKkGZK_bI5nPFR2GvwCIXY', ranges: ['Summary!A1:B11', 'Summary!B1:F26', 'Technical Excellence!D1:E33', 'Delivery!C1:E25', 'Timely Execution!C1:E18', 'Process!D1:E18', 'Communication Skills!D1:E24', 'Team Work & LeaderShip!D1:E15', 'Organisational Contribution!D1:E22'] }
});
