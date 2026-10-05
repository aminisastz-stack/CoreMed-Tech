export interface ServiceItem {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  highlights: string[];
  equipmentCovered: string[];
  standards: string[];
}

export interface EquipmentItem {
  id: string;
  name: string;
  category: 'Diagnostic' | 'Theatre' | 'Laboratory' | 'LifeSupport' | 'MedicalGas';
  manufacturer: string;
  model: string;
  image: string;
  description: string;
  specifications: string[];
  certifications: string[];
  availability: 'In Stock (Dar es Salaam)' | 'Direct Hospital Import (14 Days)' | 'On Display (Arusha)';
}

export interface HospitalTicket {
  ticketId: string;
  hospitalName: string;
  department: string;
  equipmentName: string;
  issueDescription: string;
  priority: 'Emergency' | 'High' | 'Scheduled' | 'Routine';
  status: 'Dispatched' | 'Diagnosing' | 'Calibrated' | 'Resolved';
  assignedEngineer: string;
  dateReported: string;
  estimatedArrival: string;
}

export interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  isForwardedToWhatsApp?: boolean;
  forwardedQuery?: string;
  quickActions?: { label: string; actionId: string; isPrimaryWhatsApp?: boolean }[];
}
