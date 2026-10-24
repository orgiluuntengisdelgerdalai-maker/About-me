export interface CheerMessage {
  id: string;
  name: string;
  message: string;
  badge?: string;
  timestamp: string;
  likes: number;
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  url: string;
  tag: string;
  color: string;
  iconName: string;
}
