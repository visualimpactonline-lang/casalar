import { Outlet, createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Sparkles } from "lucide-react";

export const Route = createFileRoute("/cadastro")({
  component: CadastroLayout,
});

function CadastroLayout() {
  return (
    <div className="min-h-screen bg-gradient-cream">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 md:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-warm text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="font-display text-lg font-semibold">Casalar</span>
        </Link>
        <div className="w-16" />
      </header>
      <main className="mx-auto max-w-6xl px-4 pb-20 md:px-8">
        <Outlet />
      </main>
    </div>
  );
}
