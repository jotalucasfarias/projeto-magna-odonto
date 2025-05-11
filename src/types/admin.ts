export interface AdminAppointment {
  id: string;
  name: string;
  phone: string;
  service: string;
  date: string;
  timeSlot: string;
  message: string;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: "lido" | "não-lido";
  createdAt: string;
}

export interface ReportFilters {
  reportType: string;
  startDate: string;
  endDate: string;
  selectedService: string;
}
