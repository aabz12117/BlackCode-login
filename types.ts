export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error' | 'command';
}

export interface UserData {
  // Identity
  realName: string;
  codeName: string;
  nationalId: string;
  nationality: string;
  maritalStatus: string;
  birthDate: string;
  city: string;
  address: string;
  
  // Contact & Tech
  phone: string;
  email: string;
  username: string;
  deviceModel: string;
  
  // Bio
  bloodType: string;
  height: string;
  weight: string;
  shoeSize: string;
  eyeColor: string;
  dominantHand: string;
  scars: string;
  
  // Background
  education: string;
  job: string;
  languages: string;
  criminalRecord: string;
  govtWork: string;
  internetFast: string;

  // Psycho & Ethics
  worstFear: string;
  darkColor: string;
  voices: string;
  nightmare: string;
  loyalty: string;
  skill: string;
  sacrifice: string;
  trustGov: string;
  sleepHours: string;
  lastCry: string;
  secret: string;
  trolleyProblem: string;
  googleSearch: string;
  mindRead: string;
  feeling: string;
  lyingCheck: string;
}

export interface SystemStats {
  cpu: number;
  memory: number;
  network: number;
  securityLevel: number;
  activeThreats: number;
}

export interface MissionPoint {
  id: string;
  x: number;
  y: number;
  status: 'active' | 'pending' | 'completed';
  name: string;
  details: string;
}

export type SoundType = 
  | 'click' 
  | 'hover' 
  | 'alert' 
  | 'success' 
  | 'error'
  | 'notification'
  | 'intro'
  | 'power-up'
  | 'power-down'
  | 'swoosh'
  | 'typing';
