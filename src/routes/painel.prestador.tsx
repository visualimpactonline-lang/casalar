import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  MapPin,
  DollarSign,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import {
  type Anuncio,
  loadAnuncios,
  removeAnuncio,
  toggleAnuncioAtivo,
  emptyAnuncio,
} from "@/lib/anuncios-store";
import { AnuncioEditor } from "@/components/anuncio-editor";

export const Route = createFileRoute("/painel/prestador")({
  head: () => ({
    meta: [
      { title: "Painel do Prestador — Casalar" },
      {
        name: "description",
        content:
          "Gerencie seus anúncios, horários e preços em um só lugar.",
      },
    ],
  }),
  component: PainelPrestador,
});

function PainelPrestador() {
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [editing, setEditing] = useState<Anuncio | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    void refresh();
  }, []);

  const ativos = useMemo(() => anuncios.filter((a) => a.ativo).length, [anuncios]);

  const refresh = async () => {
    const emailLogado = window.localStorage.getItem("casalar:prestador:email")?.trim().toLowerCase();
    const todos = await loadAnuncios();
    setAnuncios(emailLogado ? todos.filter((a) => (a.prestadorEmail ?? "").trim().toLowerCase() === emailLogado) : todos);
    setHydrated(true);
  };

  const handleToggle = async (a: Anuncio) => {
    const updated = anuncios.map((i) =>
      i.id === a.id ? { ...i, ativo: !i.ativo } : i,
    );
    setAnuncios(updated);
    await toggleAnuncioAtivo(a.id, !a.ativo);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remover este anúncio? Essa ação não pode ser desfeita.")) return;
    await removeAnuncio(id);
    await refresh();
  };

  if (editing) {
    return (
      <AnuncioEditor
        anuncio={editing}
        onClose={() => {
          setEditing(null);
          void refresh();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="border-b border-border/60 bg-gradient-cream">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar ao site
          </Link>
          <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Painel do Prestador
              </span>
              <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-5xl">
                Seus anúncios
              </h1>
              <p className="mt-2 max-w-xl text-muted-foreground">
                Crie, edite e gerencie tudo o que você oferece — horários
                e preços em poucos cliques.
              </p>
            </div>
            <Button
              size="lg"
              className="rounded-full bg-foreground text-background hover:bg-foreground/90"
              onClick={() => setEditing(emptyAnuncio())}
            >
              <Plus className="h-4 w-4" />
              Novo anúncio
            </Button>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            <StatCard label="Total de anúncios" value={anuncios.length} />
            <StatCard label="Publicados" value={ativos} />
            <StatCard label="Pausados" value={anuncios.length - ativos} />
            <StatCard label="Visualizações" value="—" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        {!hydrated ? null : anuncios.length === 0 ? (
          <EmptyState onCreate={() => setEditing(emptyAnuncio())} />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {anuncios.map((a) => (
              <AnuncioCard
                key={a.id}
                anuncio={a}
                onEdit={() => setEditing(a)}
                onToggle={() => handleToggle(a)}
                onDelete={() => handleDelete(a.id)}
              />
            ))}
          </div>
        )}
      </section>

      <SiteFooter />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold">{value}</p>
    </div>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-card/40 p-12 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-warm text-primary-foreground shadow-warm">
        <Sparkles className="h-6 w-6" />
      </div>
      <h2 className="mt-6 font-display text-2xl font-semibold">
        Vamos criar seu primeiro anúncio
      </h2>
      <p className="mx-auto mt-2 max-w-md text-muted-foreground">
        Conte aos clientes o que você faz, defina seus horários
        e estabeleça seus preços.
      </p>
      <Button
        size="lg"
        className="mt-6 rounded-full bg-foreground text-background hover:bg-foreground/90"
        onClick={onCreate}
      >
        <Plus className="h-4 w-4" />
        Criar anúncio
      </Button>
    </div>
  );
}

function AnuncioCard({
  anuncio,
  onEdit,
  onToggle,
  onDelete,
}: {
  anuncio: Anuncio;
  onEdit: () => void;
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-shadow hover:shadow-warm">
      <div className="flex flex-wrap items-center gap-2 border-b border-border bg-card px-5 py-4">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
            anuncio.ativo
              ? "bg-foreground text-background"
              : "bg-muted text-muted-foreground"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              anuncio.ativo ? "bg-emerald-400" : "bg-muted-foreground"
            }`}
          />
          {anuncio.ativo ? "Publicado" : "Pausado"}
        </span>
        {anuncio.categoria && (
          <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-foreground">
            {anuncio.categoria}
            {anuncio.subcategoria ? ` · ${anuncio.subcategoria}` : ""}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl font-semibold leading-tight">
          {anuncio.titulo || "Sem título"}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
          {anuncio.descricao || "Adicione uma descrição para atrair clientes."}
        </p>

        <dl className="mt-4 space-y-1.5 text-sm">
          <Meta icon={DollarSign}>
            {anuncio.preco
              ? `R$ ${anuncio.preco} / ${anuncio.unidade}`
              : "Preço não definido"}
          </Meta>
          <Meta icon={MapPin}>
            {anuncio.cidade
              ? `${anuncio.cidade} · ${anuncio.raio} km`
              : "Localização pendente"}
          </Meta>
          <Meta icon={Calendar}>
            {anuncio.diasAtendidos.length > 0
              ? `${anuncio.diasAtendidos.length} dias · ${anuncio.horarioInicio}–${anuncio.horarioFim}`
              : "Horário não definido"}
          </Meta>
        </dl>

        <div className="mt-5 flex items-center gap-2 border-t border-border pt-4">
          <Button variant="outline" size="sm" className="flex-1 rounded-full" onClick={onEdit}>
            <Pencil className="h-3.5 w-3.5" /> Editar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full"
            onClick={onToggle}
            title={anuncio.ativo ? "Pausar" : "Publicar"}
          >
            {anuncio.ativo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={onDelete}
            title="Remover"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </article>
  );
}

function Meta({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <Icon className="h-3.5 w-3.5 text-primary" />
      <span className="truncate">{children}</span>
    </div>
  );
}
