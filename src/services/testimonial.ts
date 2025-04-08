import { db } from "@/lib/firebase/config";
import { Testimonial } from "@/lib/types/testimonial";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  DocumentData,
} from "firebase/firestore";

// Serviço para gerenciar depoimentos
class TestimonialService {
  // Coleção de depoimentos no Firestore
  private testimonialsCollection = collection(db, "testimonials");

  // Busca todos os depoimentos aprovados
  async getApprovedTestimonials(): Promise<Testimonial[]> {
    try {
      const q = query(
        this.testimonialsCollection,
        where("approved", "==", true),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Testimonial[];
    } catch (error) {
      console.error("Erro ao buscar depoimentos:", error);
      return [];
    }
  }

  // Busca todos os depoimentos (para administração)
  async getAllTestimonials(): Promise<Testimonial[]> {
    try {
      const q = query(
        this.testimonialsCollection,
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Testimonial[];
    } catch (error) {
      console.error("Erro ao buscar depoimentos:", error);
      return [];
    }
  }

  // Cria um novo depoimento
  async createTestimonial(testimonialData: Omit<Testimonial, "id" | "createdAt" | "approved">): Promise<string> {
    try {
      // Prepara os dados para salvar no Firebase
      const testimonial: Omit<Testimonial, "id"> = {
        ...testimonialData,
        approved: false, // Começa como não aprovado
        createdAt: new Date(),
      };

      // Adiciona o documento no Firestore
      const docRef = await addDoc(this.testimonialsCollection, {
        ...testimonial,
        createdAt: serverTimestamp(),
      });

      return docRef.id;
    } catch (error) {
      console.error("Erro ao criar depoimento:", error);
      throw error;
    }
  }

  // Aprovar ou rejeitar um depoimento
  async updateApprovalStatus(id: string, approved: boolean): Promise<void> {
    try {
      const testimonialRef = doc(this.testimonialsCollection, id);
      await updateDoc(testimonialRef, { approved });
    } catch (error) {
      console.error("Erro ao atualizar status do depoimento:", error);
      throw error;
    }
  }

  // Excluir um depoimento
  async deleteTestimonial(id: string): Promise<void> {
    try {
      const testimonialRef = doc(this.testimonialsCollection, id);
      await deleteDoc(testimonialRef);
    } catch (error) {
      console.error("Erro ao excluir depoimento:", error);
      throw error;
    }
  }
}

// Exporta uma instância do serviço
export const testimonialService = new TestimonialService();