import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4 md:px-8">
        <div className="md:col-span-2">
          <h3 className="font-display text-2xl font-semibold">Casalar</h3>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            Conectamos pessoas a profissionais de confiança para cuidar do que importa: o seu lar.
          </p>
        </div>
        <div>
          <p className="text-sm font-medium">Para clientes</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/servicos" className="hover:text-foreground">Encontrar serviços</Link></li>
            <li><a href="#como-funciona" className="hover:text-foreground">Como funciona</a></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-medium">Para prestadores</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/cadastro/prestador" className="hover:text-foreground">Anunciar serviço</Link></li>
            <li><Link to="/prestador/login" className="hover:text-foreground">Entrar no perfil</Link></li>
            <li><Link to="/admin" className="hover:text-foreground">Painel admin</Link></li>
            <li><a href="#prestadores" className="hover:text-foreground">Por que Casalar</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 px-4 py-5 text-center text-xs text-muted-foreground md:px-8">
        © {new Date().getFullYear()} Casalar. Feito com cuidado.
      </div>
    </footer>
  );
}
