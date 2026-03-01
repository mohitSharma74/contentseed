export type Platform = 'twitter' | 'linkedin' | 'reddit' | 'substack';
export type SpeedMode = 'fast' | 'balanced' | 'quality';
export type PlatformGenerationStatus = 'idle' | 'queued' | 'generating' | 'done' | 'error';
export type GenerationTone = 'casual' | 'professional' | 'technical' | 'storytelling';
export type GenerationLength = 'shorter' | 'default' | 'longer';

export interface ParsedContent {
  title: string;
  headings: string[];
  paragraphs: string[];
  codeBlocks: string[];
  links: string[];
  stats: string[];
  tldr?: string;
  raw: string;
}

export interface PlatformOutput {
  platform: Platform;
  content: string;
  hashtags: string[];
  hook?: string;
  metadata?: Record<string, unknown>;
}

export interface GenerationOptions {
  platform: Platform;
  speedMode?: SpeedMode;
  tone?: GenerationTone;
  length?: GenerationLength;
  includeHashtags?: boolean;
  includeEmojis?: boolean;
}

export interface QuickEditSettings {
  tone: GenerationTone;
  length: GenerationLength;
  includeHashtags: boolean;
  includeEmojis: boolean;
}

export interface ProviderConfig {
  provider: 'anthropic' | 'openai' | 'gemini';
  apiKey: string;
  rememberKey: boolean;
  speedMode?: SpeedMode;
}

export interface GenerationResult {
  success: boolean;
  output?: PlatformOutput;
  error?: string;
}
