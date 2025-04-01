export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  role?: string;
  symptoms?: string[];
}

export interface Scenario {
  id: string;
  context: string;
  initialPrompt: string;
  followUp: string;
}

export interface Role {
  id: string;
  name: string;
  availableSymptoms?: string[];
} 