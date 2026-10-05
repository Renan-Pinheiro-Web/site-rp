/* ============================================================
   Configuração do Supabase — Catálogo do Site (Essenza)
   ============================================================

   >>> TROCAR AQUI AO IR PARA PRODUÇÃO <<<

   Hoje: credenciais de DEV (migration 004/005 aplicada só em DEV).
   Quando Renan aplicar as migrations em PRODUÇÃO e validar, trocar
   os dois valores abaixo pelos de produção e fazer o deploy final.

   PROD (deixado comentado de propósito — NÃO usar antes do deploy):
     URL  = https://qfrinxjegpwgclyhxoul.supabase.co
     ANON = (anon key de produção — pegar em Project Settings > API)

   A anon key é pública por desenho: o RLS (Row Level Security) garante
   que o site só lê o que está marcado is_visible = true. Nenhum dado
   interno (custo, estoque) existe nestas tabelas.
   ============================================================ */

const SUPABASE_URL = 'https://yjemkvuaayakvldsszjr.supabase.co'; // DEV
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqZW1rdnVhYXlha3ZsZHNzempyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4ODQwNjQsImV4cCI6MjEwNjQ2MDA2NH0.o5ttW0mkTQIMCRbxgqiT2dqq3aWAB4nEFZ4y_-SP980'; // DEV

const SB_REST = SUPABASE_URL + '/rest/v1';

/* Helper: GET no PostgREST com os headers de anon já prontos. */
function sbSelect(path) {
  return fetch(SB_REST + path, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: 'Bearer ' + SUPABASE_ANON_KEY,
    },
  }).then(function (r) {
    if (!r.ok) throw new Error('Supabase ' + r.status);
    return r.json();
  });
}

/* Número de WhatsApp — mesmo usado em todo o site. */
const WPP_NUMERO = '5588993668921';

/* Monta link de WhatsApp com mensagem no MESMO padrão do site:
   "Oi! Quero o {nome}". */
function wppLinkProduto(nome) {
  return 'https://wa.me/' + WPP_NUMERO + '?text=' + encodeURIComponent('Oi! Quero o ' + nome);
}
