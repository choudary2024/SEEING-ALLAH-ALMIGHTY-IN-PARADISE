
export interface Reflection {
  id: string;
  text: string;
  timestamp: number;
  type: 'user' | 'ai';
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: number;
}
