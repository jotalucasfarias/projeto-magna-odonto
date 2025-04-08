export interface Testimonial {
  id?: string;
  name: string;
  service: string;
  comment: string;
  rating: number; // 1-5 estrelas
  createdAt: Date;
  approved: boolean;
}