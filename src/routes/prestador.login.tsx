import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Lock, Mail, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { loginPrestador } from "@/lib/anuncios-store";

export const Route = createFileRoute("/prestador/login")({
  head: () => ({
    meta: [
      { title: "Entrar como prestador — Casalar" },
      { name: "description", content: "Acesse seu perfil de prestador para gerenciar seus anúncios." },
    ],
  }),
  component: PrestadorLogin,
});

function PrestadorLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const entrar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setLoading(true);

    const anuncio = await loginPrestador(email, senha);
    setLoading(false);

    if (!anuncio) {
      setErro("E-mail ou senha não encontrados. Confira os dados ou crie seu perfil primeiro.");
      return;
    }

    window.localStorage.setItem("casalar:prestador:email", email.trim().toLowerCase());
    navigate({ to: "/painel/prestador" });
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto grid max-w-6xl gap-10 px-4 py-10 md:grid-cols-[0.9fr_1fr] md:px-8 md:py-16">
        <section className="rounded-3xl bg-gradient-warm p-8 text-primary-foreground shadow-warm md:p-10">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-primary-foreground">
            <ArrowLeft className="h-4 w-4" /> Voltar ao site
          </Link>
          <div className="mt-12 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-foreground/15">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="mt-6 font-display text-4xl font-semibold leading-tight md:text-5xl">
            Acesse seu perfil de prestador.
          </h1>
          <p className="mt-4 max-w-md text-primary-foreground/80">
            Entre com o e-mail e senha cadastrados para criar, editar e pausar seus anúncios.
          </p>
        </section>

        <section className="rounded-3xl border border-border bg-card p-6 shadow-soft md:p-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Lock className="h-3.5 w-3.5" /> Área do prestador
          </span>
          <h2 className="mt-6 font-display text-3xl font-semibold">Entrar no perfil</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Use os dados criados na primeira etapa do cadastro.
          </p>

          <form onSubmit={entrar} className="mt-8 space-y-5">
            <div className="block">
              <span className="mb-2 block text-sm font-medium">E-mail</span>
              <div className="flex items-center rounded-xl border border-input bg-background focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                <Mail className="ml-4 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@email.com"
                  className="w-full bg-transparent px-3 py-3 text-base focus:outline-none"
                />
              </div>
            </div>

            <div className="block">
              <span className="mb-2 block text-sm font-medium">Senha</span>
              <div className="flex items-center rounded-xl border border-input bg-background focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                <Lock className="ml-4 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Digite sua senha"
                  className="w-full bg-transparent px-3 py-3 text-base focus:outline-none"
                />
              </div>
            </div>

            {erro && <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{erro}</p>}

            <button
              type="submit"
              disabled={loading || !email.trim() || !senha.trim()}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-soft transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Entrando..." : "Entrar"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Ainda não tem perfil?{" "}
            <Link to="/cadastro/prestador" className="font-medium text-primary hover:underline">
              Anunciar serviço
            </Link>
          </p>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
