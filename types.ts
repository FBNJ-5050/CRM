
export type Status = 'Open' | 'In Progress' | 'On Hold' | 'Pending' | 'Lost' | 'Sold' | 'No Opportunity';
export type ProposalStatus = 'Sent' | 'Not Sent';
export type State = 'NJ' | 'NY' | 'PA' | 'CT';

export interface Lead {
  id: string;
  created_by?: string;
  initial_contact?: string;
  contact_1?: string;
  contact_2?: string;
  opportunity_title: string;
  contact_display_name: string;
  contact_first_name?: string;
  contact_last_name?: string;
  street_address?: string;
  city?: string;
  state: State;
  zip?: string;
  street_address_contact?: string;
  city_contact?: string;
  state_contact?: string;
  zip_contact?: string;
  status: Status;
  salesperson?: string;
  source?: string;
  phone?: string;
  cell?: string;
  email?: string;
  general_notes?: string;
  tag?: string;
  project_type?: string;
  estimated_revenue_start?: number;
  estimated_revenue_end?: number;
  sewer_service?: string;
  wish_list?: string;
  basement_sq_ft?: string;
  basement_status?: string;
  appointment_type?: string;
  hoa?: string;
  gas_service?: string;
  design_type?: string;
  selected_services?: string;
  project_budget?: string;
  home_age?: string;
  home_sq_ft?: string;
  home_style?: string;
  water_service?: string;
  second_egress?: string;
  gmail_message_id?: string;
  email_received_at: string;
  email_subject?: string;
  processed: boolean;
  proposal_status: ProposalStatus;
}

export type SortDirection = 'asc' | 'desc' | null;

export interface SortState {
  column: keyof Lead;
  direction: SortDirection;
}

export type Density = 'Compact' | 'Comfortable';

export interface ColumnConfig {
  key: keyof Lead;
  label: string;
  visible: boolean;
  pinned?: boolean;
}
