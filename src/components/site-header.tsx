import { Link } from "@tanstack/react-router";
import casalarIcon from "@/assets/casalar-logo-icon.png";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 md:px-8">

        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center overflow-hidden rounded-xl bg-card shadow-soft ring-1 ring-border/70">
            <img
              src={casalarIcon}
              alt="Logo Casalar"
              className="h-7 w-7 md:h-9 md:w-9 object-contain"
            />
          </span>

          <span className="font-display text-lg md:text-xl font-semibold tracking-tight">
            Casalar
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#categorias"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Categorias
          </a>

          <a
            href="#como-funciona"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Como funciona
          </a>

          <a
            href="#prestadores"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Para prestadores
          </a>
        </nav>

        <div className="flex items-center gap-2">

          <Link
            to="/servicos"
            className="inline-flex items-center justify-center rounded-full bg-primary/10 px-3 py-2 text-xs font-semibold text-primary ring-1 ring-primary/20 transition-all hover:bg-primary hover:text-primary-foreground"
          >
            Encontrar
          </Link>

          <Link
            to="/cadastro/prestador"
            className="inline-flex items-center justify-center rounded-full bg-foreground px-3 py-2 text-xs font-semibold text-background transition-all hover:scale-[1.02]"
          >
            + Anunciar
          </Link>

        </div>
      </div>
    </header>
  );
}