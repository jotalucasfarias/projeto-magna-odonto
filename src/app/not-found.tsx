import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-primary-beige">
      <div className="text-center p-8 max-w-lg">
        <h1 className="text-6xl font-bold text-primary-dark-blue mb-6">404</h1>
        <h2 className="text-2xl font-semibold text-gray-headline mb-4">
          Página não encontrada
        </h2>
        <p className="text-gray-paragraph mb-8">
          Desculpe, a página que você está procurando não existe ou foi removida.
        </p>
        <Link href="/">
          <Button text="VOLTAR PARA INÍCIO" className="mx-auto" />
        </Link>
      </div>
    </div>
  );
}
