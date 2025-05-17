import { Timestamp } from "firebase/firestore";

export interface TimeSlot {
  id: string;
  time: string;
  isAvailable: boolean;
}

export interface Appointment {
  id?: string;
  name: string;
  phone: string;
  service: string;
  date: string;
  timeSlot: string;
  message?: string;
  createdAt: Date | Timestamp;
  reminderSent?: boolean;
  lastReminderDate?: Date | Timestamp;
}
