export type Anuncio = {
  id: string;
  titulo: string;
  categoria: string;
  subcategoria: string;
  descricao: string;
  preco: string;
  unidade: "hora" | "servico" | "diaria";
  cidade: string;
  raio: string;
  diasAtendidos: string[];
  horarioInicio: string;
  horarioFim: string;
  atendimento24h?: boolean;
  ativo: boolean;
  criadoEm: number;
  prestadorEmail?: string;
  prestadorSenha?: string;
  prestadorTelefone?: string;
  avaliacaoSoma?: number;
  avaliacaoQtd?: number;
};

const KEY = "casalar:anuncios";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const SUPABASE_TABLE = (import.meta.env.VITE_SUPABASE_TABLE as string | undefined) || "anuncios";

const hasRemote = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const CATEGORIAS_TREE = {
  Limpeza: ["Diarista", "Faxina pesada", "Pós-obra", "Vidros e fachadas", "Estofados e tapetes"],
  Elétrica: ["Eletricista residencial", "Instalação de chuveiro", "Ar-condicionado", "Câmeras e alarmes", "Automação"],
  Encanamento: ["Encanador", "Desentupidora", "Caça-vazamentos", "Instalação de aquecedor"],
  Jardinagem: ["Jardineiro", "Paisagismo", "Poda de árvores", "Controle de pragas"],
  Reformas: ["Pedreiro", "Pintor", "Marceneiro", "Vidraceiro", "Gesseiro", "Serralheiro", "Azulejista"],
  Mudanças: ["Carreto", "Mudança residencial", "Frete pequeno", "Montagem de móveis"],
  Aulas: ["Reforço escolar", "Idiomas", "Música", "Informática"],
  Cuidadores: ["Cuidador de idosos", "Babá", "Pet sitter", "Acompanhante hospitalar"],
} as const satisfies Record<string, readonly string[]>;

export type Categoria = keyof typeof CATEGORIAS_TREE;
export const CATEGORIAS = Object.keys(CATEGORIAS_TREE) as Categoria[];

export function getSubcategorias(cat: string): readonly string[] {
  return (CATEGORIAS_TREE as Record<string, readonly string[]>)[cat] ?? [];
}


export const CIDADES_ATENDIDAS = [
  "Piracicaba",
  "Limeira",
  "Rio Claro",
  "Capivari",
  "Americana",
  "Águas de São Pedro",
  "Charqueada",
  "Santa Bárbara",
  "Iracemápolis",
  "Saltinho",
  "Rio das Pedras",
] as const;

export function isCidadeAtendida(cidade: string) {
  const normalizada = cidade.trim().toLowerCase();
  return CIDADES_ATENDIDAS.some((item) => item.toLowerCase() === normalizada);
}

export function normalizeCidadeAtendida(cidade: string) {
  const normalizada = cidade.trim().toLowerCase();
  return CIDADES_ATENDIDAS.find((item) => item.toLowerCase() === normalizada) ?? cidade.trim();
}

export const DIAS = [
  { id: "seg", label: "Seg" },
  { id: "ter", label: "Ter" },
  { id: "qua", label: "Qua" },
  { id: "qui", label: "Qui" },
  { id: "sex", label: "Sex" },
  { id: "sab", label: "Sáb" },
  { id: "dom", label: "Dom" },
] as const;

function fromRow(row: any): Anuncio {
  return {
    id: row.id,
    titulo: row.titulo ?? "",
    categoria: row.categoria ?? "",
    subcategoria: row.subcategoria ?? "",
    descricao: row.descricao ?? "",
    preco: String(row.preco ?? ""),
    unidade: row.unidade ?? "hora",
    cidade: row.cidade ?? "",
    raio: String(row.raio ?? "10"),
    diasAtendidos: row.dias_atendidos ?? row.diasAtendidos ?? [],
    horarioInicio: row.horario_inicio ?? row.horarioInicio ?? "08:00",
    horarioFim: row.horario_fim ?? row.horarioFim ?? "18:00",
    atendimento24h: Boolean(row.atendimento_24h ?? row.atendimento24h ?? ((row.horario_inicio ?? row.horarioInicio) === "00:00" && (row.horario_fim ?? row.horarioFim) === "23:59")),
    ativo: row.ativo ?? true,
    criadoEm: Number(row.criado_em ?? row.criadoEm ?? Date.now()),
    prestadorEmail: row.prestador_email ?? row.prestadorEmail ?? "",
    prestadorSenha: row.prestador_senha ?? row.prestadorSenha ?? "",
    prestadorTelefone: row.prestador_telefone ?? row.prestadorTelefone ?? "",
    avaliacaoSoma: Number(row.avaliacao_soma ?? row.avaliacaoSoma ?? 0),
    avaliacaoQtd: Number(row.avaliacao_qtd ?? row.avaliacaoQtd ?? 0),
  };
}

function toRow(a: Anuncio) {
  return {
    id: a.id,
    titulo: a.titulo,
    categoria: a.categoria,
    subcategoria: a.subcategoria,
    descricao: a.descricao,
    preco: a.preco,
    unidade: a.unidade,
    cidade: a.cidade,
    raio: a.raio,
    dias_atendidos: a.diasAtendidos,
    horario_inicio: a.horarioInicio,
    horario_fim: a.horarioFim,
    ativo: a.ativo,
    criado_em: a.criadoEm,
    prestador_email: a.prestadorEmail ?? "",
    prestador_senha: a.prestadorSenha ?? "",
    prestador_telefone: a.prestadorTelefone ?? "",
    avaliacao_soma: a.avaliacaoSoma ?? 0,
    avaliacao_qtd: a.avaliacaoQtd ?? 0,
  };
}

async function supabaseRequest(path: string, options: RequestInit = {}) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) throw new Error("Supabase não configurado");
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(options.headers || {}),
    },
  });
  if (!res.ok) throw new Error(await res.text());
  if (res.status === 204) return null;
  return res.json();
}

export function loadAnunciosLocal(): Anuncio[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Anuncio[];
  } catch {
    return [];
  }
}

export async function loadAnuncios(): Promise<Anuncio[]> {
  if (!hasRemote) return loadAnunciosLocal();
  try {
    const rows = await supabaseRequest(`${SUPABASE_TABLE}?select=*&order=criado_em.desc`);
    return (rows as any[]).map(fromRow);
  } catch (error) {
    console.warn("Falha ao carregar anúncios no Supabase. Usando localStorage.", error);
    return loadAnunciosLocal();
  }
}

export async function loginPrestador(email: string, senha: string): Promise<Anuncio | null> {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedSenha = senha.trim();

  if (!normalizedEmail || !normalizedSenha) return null;

  const todos = await loadAnuncios();
  return (
    todos.find(
      (a) =>
        (a.prestadorEmail ?? "").trim().toLowerCase() === normalizedEmail &&
        (a.prestadorSenha ?? "").trim() === normalizedSenha,
    ) ?? null
  );
}

export function saveAnunciosLocal(items: Anuncio[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(items));
}

export async function upsertAnuncio(a: Anuncio) {
  if (hasRemote) {
    try {
      await supabaseRequest(`${SUPABASE_TABLE}?on_conflict=id`, {
        method: "POST",
        headers: { Prefer: "resolution=merge-duplicates,return=representation" },
        body: JSON.stringify(toRow(a)),
      });
      return;
    } catch (error) {
      console.warn("Falha ao salvar no Supabase. Salvando localmente.", error);
    }
  }
  const items = loadAnunciosLocal();
  const idx = items.findIndex((i) => i.id === a.id);
  if (idx >= 0) items[idx] = a;
  else items.unshift(a);
  saveAnunciosLocal(items);
}

export async function addAvaliacao(id: string, nota: number) {
  const notaSegura = Math.max(1, Math.min(5, Math.round(nota)));
  const todos = await loadAnuncios();
  const anuncio = todos.find((item) => item.id === id);
  if (!anuncio) return;

  const atualizado: Anuncio = {
    ...anuncio,
    avaliacaoSoma: (anuncio.avaliacaoSoma ?? 0) + notaSegura,
    avaliacaoQtd: (anuncio.avaliacaoQtd ?? 0) + 1,
  };

  await upsertAnuncio(atualizado);
}

export async function setAvaliacao(id: string, media: number, quantidade = 1) {
  const mediaSegura = Math.max(0, Math.min(5, Number(media) || 0));
  const qtdSegura = Math.max(0, Math.round(Number(quantidade) || 0));
  const todos = await loadAnuncios();
  const anuncio = todos.find((item) => item.id === id);
  if (!anuncio) return;

  await upsertAnuncio({
    ...anuncio,
    avaliacaoSoma: qtdSegura > 0 ? mediaSegura * qtdSegura : 0,
    avaliacaoQtd: qtdSegura,
  });
}

export function getAvaliacaoMedia(anuncio: Anuncio) {
  const qtd = anuncio.avaliacaoQtd ?? 0;
  if (qtd <= 0) return 0;
  return (anuncio.avaliacaoSoma ?? 0) / qtd;
}

export async function removeAnuncio(id: string) {
  if (hasRemote) {
    try {
      await supabaseRequest(`${SUPABASE_TABLE}?id=eq.${id}`, { method: "DELETE" });
      return;
    } catch (error) {
      console.warn("Falha ao remover no Supabase. Removendo localmente.", error);
    }
  }
  saveAnunciosLocal(loadAnunciosLocal().filter((i) => i.id !== id));
}

export async function toggleAnuncioAtivo(id: string, ativo: boolean) {
  if (hasRemote) {
    try {
      await supabaseRequest(`${SUPABASE_TABLE}?id=eq.${id}`, {
        method: "PATCH",
        body: JSON.stringify({ ativo }),
      });
      return;
    } catch (error) {
      console.warn("Falha ao atualizar no Supabase. Atualizando localmente.", error);
    }
  }
  saveAnunciosLocal(loadAnunciosLocal().map((i) => (i.id === id ? { ...i, ativo } : i)));
}

export function emptyAnuncio(): Anuncio {
  return {
    id: crypto.randomUUID(),
    titulo: "",
    categoria: "",
    subcategoria: "",
    descricao: "",
    preco: "",
    unidade: "hora",
    cidade: "",
    raio: "10",
    diasAtendidos: ["seg", "ter", "qua", "qui", "sex"],
    horarioInicio: "08:00",
    horarioFim: "18:00",
    ativo: true,
    criadoEm: Date.now(),
    prestadorEmail: "",
    prestadorSenha: "",
    prestadorTelefone: "",
    avaliacaoSoma: 0,
    avaliacaoQtd: 0,
  };
}
