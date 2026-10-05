/* ============================================================
   catalog.js — destaques da home vindos do banco (site_products)
   ============================================================
   Substitui os 5 cards antes hardcoded. Busca:
     is_visible = true AND is_featured = true, ordenado por display_order.
   O HTML gerado é idêntico em estrutura/classe ao original — só a
   fonte do dado mudou. Campos novos (brand, volume_label,
   fragrance_notes, background_variant, badge_tag) são opcionais e
   tratados graciosamente quando null/vazios.
   ============================================================ */

(function () {
  var grid = document.getElementById('gridProdutos');
  if (!grid) return;

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Preço no formato R$&nbsp;119,90 (igual ao original).
  function fmtPreco(n) {
    var v = Number(n).toFixed(2).replace('.', ',');
    return 'R$ ' + v;
  }

  // Ícone fallback quando não há foto — varia por categoria (frasco de
  // perfume p/ árabe/importado, pote p/ cosmético), igual ao padrão que
  // já existia nos cards hardcoded. Cor da linha varia com o fundo.
  function iconeFallback(category, variant, grande) {
    var stroke = variant === 'claro'
      ? 'rgba(44,36,32,.35)'
      : variant === 'creme'
        ? 'rgba(139,111,78,.35)'
        : 'rgba(232,213,192,.5)'; // escuro (default)
    var size = grande ? 56 : 40;
    var path = (category === 'cosmético')
      ? '<rect x="7" y="2" width="10" height="20" rx="3"/><path d="M7 7h10"/><circle cx="12" cy="14" r="2"/>'
      : '<path d="M12 2c-1.5 0-3 .6-3 2.2v2h6v-2C15 2.6 13.5 2 12 2z"/><path d="M8 6.2v11c0 2.8 1.5 4.6 4 4.6s4-1.8 4-4.6v-11"/>';
    return '<svg class="produto-icon" aria-hidden="true" width="' + size + '" height="' + size +
      '" viewBox="0 0 24 24" fill="none" stroke="' + stroke + '" stroke-width="1">' + path + '</svg>';
  }

  function variantClass(v) {
    if (v === 'claro') return 'produto-img--claro';
    if (v === 'creme') return 'produto-img--creme';
    return 'produto-img--escuro'; // default / null
  }

  function cardHTML(p, destaque) {
    var variant = p.background_variant || 'escuro';
    var href = '/produto/' + encodeURIComponent(p.slug);

    // imagem principal (se houver foto); senão, ícone de fallback
    var foto = p._foto;
    var imgInner = foto
      ? '<img src="' + esc(foto) + '" alt="' + esc(p.name) + '" class="produto-foto" loading="lazy">'
      : iconeFallback(p.category, variant, destaque);

    var tag = p.badge_tag
      ? '<span class="produto-tag">' + esc(p.badge_tag) + '</span>'
      : '';

    var marca = p.brand
      ? '<span class="produto-marca" itemprop="brand">' + esc(p.brand) + '</span>'
      : '';

    var vol = p.volume_label
      ? '<span class="produto-vol">' + esc(p.volume_label) + '</span>'
      : '';

    var desc = p.short_description
      ? '<p class="produto-desc">' + esc(p.short_description) + '</p>'
      : '';

    var notas = '';
    if (destaque && Array.isArray(p.fragrance_notes) && p.fragrance_notes.length) {
      notas = '<div class="produto-notas">' +
        p.fragrance_notes.map(function (n) { return '<span>' + esc(n) + '</span>'; }).join('') +
        '</div>';
    }

    var precoBloco =
      '<span class="produto-preco" itemprop="offers" itemscope itemtype="https://schema.org/Offer">' +
        '<span itemprop="price" content="' + Number(p.price).toFixed(2) + '">' + fmtPreco(p.price) + '</span>' +
        '<meta itemprop="priceCurrency" content="BRL">' +
      '</span>';

    var cta =
      '<a href="' + esc(wppLinkProduto(p.name)) + '" class="cta cta--wpp cta--sm" target="_blank" rel="noopener" data-nocard>Quero esse</a>';

    var cls = 'produto reveal' + (destaque ? ' produto--destaque' : '');

    return '' +
      '<article class="' + cls + '" itemscope itemtype="https://schema.org/Product" data-href="' + esc(href) + '">' +
        '<a class="produto-img ' + variantClass(variant) + '" href="' + esc(href) + '" aria-label="' + esc(p.name) + '">' +
          tag + imgInner +
        '</a>' +
        '<div class="produto-info">' +
          marca +
          '<h3 itemprop="name"><a href="' + esc(href) + '">' + esc(p.name) + '</a></h3>' +
          vol +
          desc +
          notas +
          '<div class="produto-bottom">' +
            precoBloco +
            cta +
          '</div>' +
        '</div>' +
      '</article>';
  }

  function render(produtos) {
    if (!produtos.length) {
      // Sem destaques: não quebra a seção, só esvazia o grid.
      grid.innerHTML = '';
      return;
    }
    grid.innerHTML = produtos.map(function (p, i) {
      return cardHTML(p, i === 0); // primeiro = destaque (span 2)
    }).join('');

    // Reaplica reveal + stagger nos cards recém-criados, igual ao
    // comportamento do grid estático.
    if (window.essenzaRevealApply) window.essenzaRevealApply(grid);

    // Card inteiro clicável (sem roubar cliques de links internos).
    grid.querySelectorAll('.produto').forEach(function (card) {
      card.addEventListener('click', function (e) {
        if (e.target.closest('a')) return; // links já navegam sozinhos
        var href = card.getAttribute('data-href');
        if (href) window.location.href = href;
      });
    });
  }

  // Busca destaques + a primeira foto de cada (galeria ordenada).
  sbSelect('/site_products?select=*,site_product_images(image_url,display_order)&is_visible=eq.true&is_featured=eq.true&order=display_order.asc')
    .then(function (rows) {
      rows.forEach(function (p) {
        var imgs = (p.site_product_images || []).slice().sort(function (a, b) {
          return (a.display_order || 0) - (b.display_order || 0);
        });
        p._foto = imgs.length ? imgs[0].image_url : null;
      });
      render(rows);
    })
    .catch(function (err) {
      // Falha de rede: mantém a seção sem quebrar o resto do site.
      console.error('[catalog] falha ao carregar destaques:', err);
      grid.innerHTML = '';
    });
})();
