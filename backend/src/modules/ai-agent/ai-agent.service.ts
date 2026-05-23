import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GoogleGenAI } from '@google/genai';
import * as fs from 'fs';
import * as path from 'path';
import { McpClientService } from './mcp-client.service';
import { AISuggestion, AISuggestionDocument } from './schemas/ai-suggestion.schema';
import { Employee, EmployeeDocument } from '../employee/schemas/employee.schema';

@Injectable()
export class AiAgentService {
  private readonly logger = new Logger(AiAgentService.name);
  private readonly aiClient: GoogleGenAI;

  constructor(
    private readonly mcpClient: McpClientService,
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
    @InjectModel(AISuggestion.name) private aiSuggestionModel: Model<AISuggestionDocument>,
    @InjectModel(Employee.name) private employeeModel: Model<EmployeeDocument>,
  ) { this.aiClient = new GoogleGenAI({ apiKey: this.configService.get('gemini.apiKey') }); }

  async getLatestSuggestions(employeeId: string): Promise<AISuggestion> {
    const suggestion = await this.aiSuggestionModel.findOne({ employeeId: new Types.ObjectId(employeeId) }).sort({ generatedAt: -1 }).exec();
    if (!suggestion) throw new NotFoundException(`No AI suggestions found`);
    return suggestion;
  }

  async triggerRefresh(employeeId: string): Promise<{ jobId: string }> {
    const employee = await this.employeeModel.findById(employeeId).exec();
    if (!employee) throw new NotFoundException(`Employee not found`);
    const pendingSuggestion = new this.aiSuggestionModel({ employeeId: employee._id, status: 'processing' });
    await pendingSuggestion.save();
    this.processRefresh(employee, pendingSuggestion._id.toString());
    return { jobId: pendingSuggestion._id.toString() };
  }

  private async processRefresh(employee: EmployeeDocument, jobId: string) {
    try {
      const sheetData = await this.mcpClient.fetchAllRanges();
      const cp = path.join(__dirname, '../../data/career-ladder.json');
      const careerLadder = fs.existsSync(cp) ? JSON.parse(fs.readFileSync(cp, 'utf-8')) : {};
      const prompt = `Analyze employee profile, performance data, and career ladder to return a JSON growth plan.\nProfile: ${employee.name}, ${employee.designation}, Skills: ${employee.skills.join(',')}\nData: ${JSON.stringify(sheetData)}\nLadder: ${JSON.stringify(careerLadder)}\nReturn strictly valid JSON: { "targetDesignation": "...", "suggestedGoals": ["..."], "skillGaps": [{ "skill": "...", "currentLevel": "...", "requiredLevel": "..." }], "recommendedLearningPath": [{ "title": "...", "type": "...", "url": "..." }], "projectExposureSuggestions": ["..."], "timelineForImprovement": "...", "confidenceSummary": "...", "reasoningSummary": "..." }`;
      
      const response = await this.aiClient.models.generateContent({ model: this.configService.get('gemini.model') ?? 'gemini-2.0-flash', contents: prompt, config: { temperature: 0.2, responseMimeType: "application/json" } });
      const aiResult = JSON.parse(response.text || '{}');
      await this.aiSuggestionModel.findByIdAndUpdate(jobId, { ...aiResult, sheetDataSnapshot: sheetData, status: 'completed', generatedAt: new Date() });
      this.eventEmitter.emit('ai.refresh.complete', { employeeId: employee._id.toString(), jobId, status: 'completed' });
    } catch (error: any) {
      this.logger.error(error);
      await this.aiSuggestionModel.findByIdAndUpdate(jobId, { status: 'failed', errorMessage: error.message });
      this.eventEmitter.emit('ai.refresh.failed', { employeeId: employee._id.toString(), jobId, status: 'failed', error: error.message });
    }
  }
}
