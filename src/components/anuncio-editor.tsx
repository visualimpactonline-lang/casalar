import { useState } from "react";
import { ArrowLeft, Save, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { type Anuncio, CATEGORIAS, DIAS, getSubcategorias, upsertAnuncio } from "@/lib/anuncios-store";

export function AnuncioEditor({
  anuncio,
  onClose,
}: {
  anuncio: Anuncio;
  onClose: () => void;
}) {
  const [data, setData] = useState<Anuncio>(anuncio);
  const isNew = !anuncio.titulo;

  const update = <K extends keyof Anuncio>(key: K, value: Anuncio[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const toggleDia = (id: string) => {
    setData((d) => ({
      ...d,
      diasAtendidos: d.diasAtendidos.includes(id)
        ? d.diasAtendidos.filter((x) => x !== id)
        : [...d.diasAtendidos, id],
    }));
  };

  const subcategorias = getSubcategorias(data.categoria);
  const canSave = data.titulo.trim() && data.categoria && data.subcategoria && data.preco.trim();

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!canSave || saving) return;
    setSaving(true);
    await upsertAnuncio(data);
    setSaving(false);
    onClose();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 md:px-8">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar
          </button>
          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-muted-foreground sm:inline">
              {isNew ? "Novo anúncio" : "Editando"}
            </span>
            <Button
              onClick={handleSave}
              disabled={!canSave || saving}
              className="rounded-full bg-foreground text-background hover:bg-foreground/90"
            >
              <Save className="h-4 w-4" /> {saving ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10 md:px-8">
        <div className="mb-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            {isNew ? "Criar novo anúncio" : data.titulo}
          </span>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight">
            Detalhes do serviço
          </h1>
        </div>

        <div className="space-y-8">
          {/* Básico */}
          <Section title="Sobre o serviço" subtitle="O que aparece no topo do anúncio.">
            <Field label="Título" required>
              <Input
                value={data.titulo}
                onChange={(e) => update("titulo", e.target.value)}
                placeholder="Ex: Limpeza completa de apartamento"
                maxLength={80}
              />
            </Field>
            <Field label="Categoria" required>
              <div className="flex flex-wrap gap-2">
                {CATEGORIAS.map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => {
                      update("categoria", c);
                      update("subcategoria", "");
                    }}
                    className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                      data.categoria === c
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-card hover:border-foreground/40"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </Field>
            {data.categoria && (
              <Field label="Especialidade" required>
                <div className="flex flex-wrap gap-2">
                  {subcategorias.map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => update("subcategoria", s)}
                      className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                        data.subcategoria === s
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-card hover:border-primary/40"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Escolha a especialidade que melhor descreve seu serviço.
                </p>
              </Field>
            )}
            <Field label="Descrição">
              <Textarea
                rows={4}
                value={data.descricao}
                onChange={(e) => update("descricao", e.target.value)}
                placeholder="Conte o que está incluído, sua experiência e diferenciais."
                maxLength={600}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {data.descricao.length}/600 caracteres
              </p>
            </Field>
          </Section>

          {/* Preço */}
          <Section title="Preço" subtitle="Como você cobra por esse serviço.">
            <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
              <Field label="Valor (R$)" required>
                <Input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  value={data.preco}
                  onChange={(e) => update("preco", e.target.value)}
                  placeholder="150"
                />
              </Field>
              <Field label="Unidade">
                <div className="flex gap-2">
                  {(["hora", "servico", "diaria"] as const).map((u) => (
                    <button
                      type="button"
                      key={u}
                      onClick={() => update("unidade", u)}
                      className={`rounded-full border px-3.5 py-1.5 text-sm capitalize transition-colors ${
                        data.unidade === u
                          ? "border-foreground bg-foreground text-background"
                          : "border-border bg-card hover:border-foreground/40"
                      }`}
                    >
                      {u === "servico" ? "serviço" : u === "diaria" ? "diária" : "hora"}
                    </button>
                  ))}
                </div>
              </Field>
            </div>
          </Section>

          {/* Horários */}
          <Section title="Horários de atendimento" subtitle="Quando você está disponível.">
            <Field label="Dias da semana">
              <div className="flex flex-wrap gap-2">
                {DIAS.map((d) => {
                  const on = data.diasAtendidos.includes(d.id);
                  return (
                    <button
                      type="button"
                      key={d.id}
                      onClick={() => toggleDia(d.id)}
                      className={`h-10 w-12 rounded-xl border text-sm font-medium transition-colors ${
                        on
                          ? "border-foreground bg-foreground text-background"
                          : "border-border bg-card text-muted-foreground hover:border-foreground/40"
                      }`}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Início">
                <Input
                  type="time"
                  value={data.horarioInicio}
                  onChange={(e) => update("horarioInicio", e.target.value)}
                />
              </Field>
              <Field label="Fim">
                <Input
                  type="time"
                  value={data.horarioFim}
                  onChange={(e) => update("horarioFim", e.target.value)}
                />
              </Field>
            </div>
          </Section>

          {/* Localização */}
          <Section title="Localização" subtitle="Onde você atende.">
            <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
              <Field label="Cidade">
                <Input
                  value={data.cidade}
                  onChange={(e) => update("cidade", e.target.value)}
                  placeholder="São Paulo, SP"
                />
              </Field>
              <Field label="Raio (km)">
                <Input
                  type="number"
                  min="1"
                  value={data.raio}
                  onChange={(e) => update("raio", e.target.value)}
                />
              </Field>
            </div>
          </Section>

          <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-5">
            <div>
              <p className="font-medium">Publicar anúncio</p>
              <p className="text-sm text-muted-foreground">
                Quando ativo, clientes podem encontrá-lo nas buscas.
              </p>
            </div>
            <button
              type="button"
              onClick={() => update("ativo", !data.ativo)}
              className={`relative h-7 w-12 rounded-full transition-colors ${
                data.ativo ? "bg-foreground" : "bg-muted"
              }`}
              aria-pressed={data.ativo}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-background shadow transition-transform ${
                  data.ativo ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex justify-end gap-2 pb-12">
            <Button variant="ghost" onClick={onClose} className="rounded-full">
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={!canSave}
              size="lg"
              className="rounded-full bg-foreground text-background hover:bg-foreground/90"
            >
              <Save className="h-4 w-4" /> {saving ? "Salvando..." : "Salvar"} anúncio
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-soft md:p-8">
      <header className="mb-6">
        <h2 className="font-display text-2xl font-semibold tracking-tight">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </header>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label className="mb-2 block text-sm font-medium">
        {label}
        {required && <span className="ml-1 text-primary">*</span>}
      </Label>
      {children}
    </div>
  );
}
