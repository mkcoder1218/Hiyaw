
export interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  bio: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}
