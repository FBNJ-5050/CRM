
import { Lead, Status } from './types';

const generateMockLeads = (count: number): Lead[] => {
  const names = ['Julianne Moore', 'Sterling Archer', 'Clarice Starling', 'Don Draper', 'Peggy Olson', 'Roger Sterling', 'Bert Cooper', 'Joan Holloway', 'Ken Cosgrove', 'Harry Crane'];
  const titles = ['Kitchen Remodel', 'Basement Renovation', 'Master Suite Upgrade', 'Exterior Painting', 'Full Home Design', 'Guest House Project', 'New Flooring Installation', 'Garden Decking', 'Luxury Bathroom', 'Custom Library Build'];
  const states: any[] = ['NJ', 'NY', 'PA', 'CT'];
  const statuses: Status[] = ['Open', 'In Progress', 'On Hold', 'Pending', 'Lost', 'Sold', 'No Opportunity'];
  const sources = ['Google Search', 'Instagram Ads', 'Referral', 'Email Campaign'];
  const projectTypes = ['Residential', 'Commercial', 'Mixed-Use'];
  const designTypes = ['Modern', 'Classical', 'Industrial', 'Minimalist'];
  const homeStyles = ['Colonial', 'Victorian', 'Modernist', 'Ranch', 'Tudor'];
  const services = ['Plumbing', 'Electrical', 'Structural', 'Aesthetic'];

  return Array.from({ length: count }).map((_, i) => {
    const nameIndex = i % names.length;
    const titleIndex = i % titles.length;
    const state = states[Math.floor(Math.random() * states.length)];
    
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 10));
    
    return {
      id: `lead-${i}`,
      created_by: 'System Administrator',
      opportunity_title: titles[titleIndex],
      contact_display_name: names[nameIndex],
      contact_first_name: names[nameIndex].split(' ')[0],
      contact_last_name: names[nameIndex].split(' ')[1],
      street_address: `${100 + i} Luxury Ave`,
      city: 'Jersey City',
      state,
      zip: '07302',
      street_address_contact: `${200 + i} Private Road`,
      city_contact: 'New York',
      state_contact: 'NY',
      zip_contact: '10001',
      status: statuses[Math.floor(Math.random() * statuses.length)],
      salesperson: ['Alice Johnson', 'Bob Smith', 'Charlie Davis'][Math.floor(Math.random() * 3)],
      source: sources[Math.floor(Math.random() * sources.length)],
      phone: `555-010${i}`,
      cell: `555-999${i}`,
      email: `${names[nameIndex].toLowerCase().replace(' ', '.')}@example.com`,
      general_notes: 'High intent lead with premium requirements.',
      tag: i % 2 === 0 ? 'VIP' : 'Urgent',
      project_type: projectTypes[i % projectTypes.length],
      estimated_revenue_start: 50000 + (i * 1000),
      estimated_revenue_end: 150000 + (i * 1000),
      sewer_service: i % 2 === 0 ? 'Public' : 'Septic',
      wish_list: 'Heated floors, smart lighting',
      basement_sq_ft: '1200',
      basement_status: i % 3 === 0 ? 'Finished' : 'Unfinished',
      appointment_type: 'In-person',
      hoa: i % 4 === 0 ? 'Yes' : 'No',
      gas_service: 'Natural Gas',
      design_type: designTypes[i % designTypes.length],
      selected_services: services.slice(0, 2).join(', '),
      project_budget: `$${100000 + (i * 5000)}`,
      home_age: `${15 + i} years`,
      home_sq_ft: `${2500 + (i * 100)}`,
      home_style: homeStyles[i % homeStyles.length],
      water_service: 'Municipal',
      second_egress: i % 2 === 0 ? 'Installed' : 'Required',
      email_received_at: date.toISOString(),
      email_subject: `New Project Inquiry: ${titles[titleIndex]}`,
      processed: Math.random() > 0.4,
      proposal_status: Math.random() > 0.5 ? 'Sent' : 'Not Sent'
    };
  });
};

export const MOCK_LEADS = generateMockLeads(50);
