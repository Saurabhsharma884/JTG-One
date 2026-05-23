import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import { Types } from 'mongoose';
import { McpClientService } from '../ai-agent/mcp-client.service';
import { AiAgentService } from '../ai-agent/ai-agent.service';
import { FeedbackService } from '../feedback/feedback.service';
import { EmployeeService } from '../employee/employee.service';

export interface TaskState {
  taskId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  errorMessage?: string;
  feedbackImportId?: string;
  analyticsData?: any;
}

@Injectable()
export class FeedbackAnalysisService {
  private readonly logger = new Logger(FeedbackAnalysisService.name);
  private readonly aiClient: GoogleGenAI;
  private tasks: Map<string, TaskState> = new Map();

  constructor(
    private readonly mcpClient: McpClientService,
    private readonly configService: ConfigService,
    private readonly feedbackService: FeedbackService,
    private readonly employeeService: EmployeeService,
    private readonly aiAgentService: AiAgentService,
  ) {
    this.aiClient = new GoogleGenAI({ apiKey: this.configService.get('gemini.apiKey') });
  }

  async createTask(employeeId: string): Promise<TaskState> {
    // Attempt to fetch, but allow dummy for prototype mock data (e.g. emp-001)
    let employee;
    try {
      employee = await this.employeeService.findOne(employeeId);
      this.logger.log(`[createTask] Found employee in DB: ${employee.name}`);
    } catch (e) {
      this.logger.warn(`[createTask] Employee ${employeeId} not found in DB. Using fallback for prototype.`);
      employee = { name: 'Mock Employee', designation: 'Software Engineer', targetDesignation: 'Senior Software Engineer', skills: ['React', 'Node'] };
    }

    const taskId = new Types.ObjectId().toString();
    const initialState: TaskState = {
      taskId,
      status: 'queued',
      progress: 10,
    };
    this.tasks.set(taskId, initialState);
    this.logger.log(`[createTask] Task ${taskId} created for employee ${employeeId}`);

    // Start background processing
    this.processTask(taskId, employeeId).catch(err => {
      this.logger.error(`[createTask] Error processing task ${taskId}`, err);
    });

    return initialState;
  }

  getTaskStatus(taskId: string): TaskState {
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new NotFoundException(`Task ${taskId} not found`);
    }
    return task;
  }

  private async processTask(taskId: string, employeeId: string) {
    try {
      this.logger.log(`[processTask] Task ${taskId} — status: processing (30%)`);
      this.updateTask(taskId, { status: 'processing', progress: 30 });

      // Fetch employee data
      let employee;
      try {
        employee = await this.employeeService.findOne(employeeId);
        this.logger.log(`[processTask] Task ${taskId} — loaded employee: ${employee.name}`);
      } catch (e) {
        this.logger.warn(`[processTask] Task ${taskId} — employee ${employeeId} not in DB, using fallback`);
        employee = { name: 'Mock Employee', designation: 'Software Engineer', targetDesignation: 'Senior Software Engineer', skills: ['React', 'Node'] };
      }

      // Fetch all sheet ranges via MCP
      this.logger.log(`[processTask] Task ${taskId} — fetching Google Sheets data via MCP...`);
      const sheetData = await this.mcpClient.fetchAllRanges();
      this.logger.log(`[processTask] Task ${taskId} — MCP returned ${Object.keys(sheetData).length} ranges`);

      // Read career ladder for rating context
      const fs = require('fs');
      const path = require('path');
      const cp = path.join(__dirname, '../../data/career-ladder.json');
      const careerLadder = fs.existsSync(cp) ? JSON.parse(fs.readFileSync(cp, 'utf-8')) : {};

      this.updateTask(taskId, { progress: 60 });
      this.logger.log(`[processTask] Task ${taskId} — progress: 60%, calling Gemini AI...`);

      // Build the prompt for Gemini
      const prompt = `Analyze the provided employee's profile and performance data (from Google Sheets).
Employee: ${employee.name}, Designation: ${employee.designation}, Skills: ${employee.skills.join(', ')}
Sheet Data: ${JSON.stringify(sheetData)}
Career Ladder (for rating context): ${JSON.stringify(careerLadder)}

Based on the career ladder specs for the employee's current designation (${employee.designation}) and target designation (${employee.targetDesignation || 'Next Level'}), determine the ratings.
Return strictly valid JSON matching this schema:
{
  "categoryScores": [{ "category": "...", "score": 0-100 }],
  "feedbackTrend": [{ "period": "...", "score": 0-100 }],
  "skillRatings": [{ "skill": "...", "rating": 0-100 }],
  "strengths": ["..."],
  "improvementAreas": ["..."],
  "radarData": [{ "axis": "...", "value": 0-100 }]
}
Make sure all values reflect the data effectively and are calibrated against the career ladder. Use 5 to 6 categories for categoryScores and radarData. Return only the JSON object.`;

      // Call Gemini API
      const response = await this.aiClient.models.generateContent({
        model: this.configService.get('gemini.model')!,
        contents: prompt,
        config: {
          temperature: 0.2,
          responseMimeType: 'application/json',
        },
      });

      this.updateTask(taskId, { progress: 85 });
      this.logger.log(`[processTask] Task ${taskId} — Gemini response received, progress: 85%`);

      const analyticsData = JSON.parse(response.text || '{}');
      this.logger.log(`[processTask] Task ${taskId} — parsed analyticsData keys: ${Object.keys(analyticsData).join(', ')}`);

      // Save to MongoDB using FeedbackService
      this.logger.log(`[processTask] Task ${taskId} — saving feedback import to DB for employee ${employeeId}...`);
      const newImport = await this.feedbackService.create({
        employeeId,
        label: 'AI Analyzed Feedback',
        isLatest: true,
        analyticsData,
      } as any);

      const importId = (newImport as any)._id?.toString() || (newImport as any).id?.toString();
      this.logger.log(`[processTask] Task ${taskId} — saved to DB with feedbackImportId: ${importId}`);

      this.updateTask(taskId, {
        status: 'completed',
        progress: 100,
        feedbackImportId: importId,
        analyticsData,
      });
      this.logger.log(`[processTask] Task ${taskId} — COMPLETED ✓`);

      // Trigger AI agent to generate/update growth goals based on the new feedback import
      try {
        await this.aiAgentService.triggerRefresh(employeeId);
        this.logger.log(`[processTask] Triggered AI agent refresh for employee ${employeeId}`);
      } catch (err) {
        this.logger.warn(`[processTask] Failed to trigger AI agent for employee ${employeeId}: ${err?.message || err}`);
      }
    } catch (error) {
      this.logger.error(`[processTask] Task ${taskId} FAILED:`, error.stack || error.message || error);
      this.updateTask(taskId, {
        status: 'failed',
        progress: 0,
        errorMessage: error.message,
      });
    }
  }

  private updateTask(taskId: string, update: Partial<TaskState>) {
    const task = this.tasks.get(taskId);
    if (task) {
      this.tasks.set(taskId, { ...task, ...update });
    }
  }
}
