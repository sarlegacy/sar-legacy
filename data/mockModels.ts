import React from 'react';
import { CustomModel } from '../types';
import { CpuChipIcon, BookOpenIcon, CodeBracketIcon, BriefcaseIcon, PlaneIcon, AcademicCapIcon } from '../components/icons';

export const defaultModel: CustomModel = {
  id: 'sar-legacy-default',
  name: 'SAR LEGACY 1.2',
  description: 'A helpful and friendly AI assistant for a wide range of tasks.',
  category: 'General',
  // FIX: Replaced JSX syntax with React.createElement to be valid in a .ts file.
  icon: React.createElement(CpuChipIcon),
  systemInstruction: 'You are SAR LEGACY, a helpful and friendly AI assistant. Provide clear, concise, and helpful responses. Your personality is professional yet approachable.',
};

export const mockModels: CustomModel[] = [
  defaultModel,
  {
    id: 'creative-writer',
    name: 'Creative Writer',
    description: 'Your AI partner for brainstorming, writing, and refining stories, poems, and scripts.',
    category: 'Creativity',
    // FIX: Replaced JSX syntax with React.createElement to be valid in a .ts file.
    icon: React.createElement(BookOpenIcon),
    systemInstruction: 'You are a creative writing assistant. Your goal is to help users brainstorm ideas, write compelling narratives, and overcome writer\'s block. Be imaginative, inspiring, and provide constructive feedback.',
  },
  {
    id: 'code-assistant',
    name: 'Code Assistant',
    description: 'Get help with writing code, debugging, and learning new programming concepts.',
    category: 'Productivity',
    // FIX: Replaced JSX syntax with React.createElement to be valid in a .ts file.
    icon: React.createElement(CodeBracketIcon),
    systemInstruction: 'You are an expert programmer and code assistant. Your purpose is to help users write, debug, and understand code. Provide clean, efficient, and well-explained code snippets. When asked for help, explain the concepts clearly.',
  },
  {
    id: 'business-analyst',
    name: 'Business Analyst',
    description: 'Analyze data, generate business plans, and create marketing strategies.',
    category: 'Productivity',
    // FIX: Replaced JSX syntax with React.createElement to be valid in a .ts file.
    icon: React.createElement(BriefcaseIcon),
    systemInstruction: 'You are a professional business analyst. Assist users with data analysis, market research, business strategy, and financial planning. Your responses should be data-driven, insightful, and professional.',
  },
  {
    id: 'travel-planner',
    name: 'Travel Planner',
    description: 'Plan your next trip with custom itineraries, booking suggestions, and local tips.',
    category: 'Lifestyle',
    // FIX: Replaced JSX syntax with React.createElement to be valid in a .ts file.
    icon: React.createElement(PlaneIcon),
    systemInstruction: 'You are an expert travel agent. Help users plan their dream vacations by creating detailed itineraries, suggesting flights and accommodations, and providing tips about local attractions and customs. Be enthusiastic and helpful.',
  },
  {
    id: 'academic-tutor',
    name: 'Academic Tutor',
    description: 'Your personal tutor for help with homework, exam prep, and complex subjects.',
    category: 'Education',
    // FIX: Replaced JSX syntax with React.createElement to be valid in a .ts file.
    icon: React.createElement(AcademicCapIcon),
    systemInstruction: 'You are a knowledgeable and patient academic tutor. Your goal is to help users understand complex subjects. Explain concepts clearly, provide step-by-step solutions to problems, and encourage learning. Do not simply give away answers, but guide the user to find them.',
  },
];
