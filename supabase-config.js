/* ============================================================
   Configuração do Supabase — Catálogo do Site (Essenza)
   ============================================================

*/

const SUPABASE_URL = 'https://qfrinxjegpwgclyhxoul.supabase.co'; // DEV
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmcmlueGplZ3B3Z2NseWh4b3VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4ODQxMTEsImV4cCI6MjEwNjQ2MDExMX0.M9CJgCUCeKD-TMfKvHQfliAYqUzWUPvL_Kod0YUZOyY'; // DEV

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
