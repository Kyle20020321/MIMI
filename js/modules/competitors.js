/**
 * 竞品对比模块
 */
const Competitors = (() => {
  let showAll = false;

  function render(container) {
    const items = showAll ? COMPETITORS : COMPETITORS.slice(0, 3);

    container.innerHTML = `
      <div class="mb-4" style="font-size:14px;color:var(--mi-gray-500);">
        小米平板 vs 竞品核心差异一览，帮助您做出更明智的选择
      </div>
      <div class="products-grid">
        ${items.map(c => renderCard(c)).join('')}
      </div>
      ${COMPETITORS.length > 3 ? `
        <div class="text-center mt-4">
          <button class="btn-outline" onclick="Competitors.toggleAll()" style="font-size:13px;">
            ${showAll ? '收起' : `查看全部 ${COMPETITORS.length} 款竞品`}
          </button>
        </div>
      ` : ''}
    `;
  }

  function renderCard(competitor) {
    // 找到同价位的小米产品对比
    const xiaomiMatch = PRODUCTS.find(p =>
      Math.abs(p.price - competitor.price) <= 500
    );

    return `
      <div class="competitor-card fade-in">
        <div class="competitor-brand">${competitor.brand}</div>
        <div class="competitor-name">${competitor.name}</div>
        <div class="competitor-price">HK$${competitor.price.toLocaleString()}</div>
        <div style="margin-top:8px;font-size:13px;color:var(--mi-gray-500);">
          ${competitor.size}" ${competitor.panel} · ${competitor.chip} · ${competitor.ram}GB
        </div>
        <div style="margin-top:8px;font-size:13px;">
          <strong>亮点：</strong>${competitor.highlight}
        </div>
        ${competitor.vsNote ? `
          <div class="competitor-note">
            <strong>💡 虾说：</strong>${competitor.vsNote}
          </div>
        ` : ''}
        ${xiaomiMatch ? `
          <div style="margin-top:12px;padding:12px;background:var(--mi-gray-50);border-radius:var(--radius-sm);">
            <div style="font-size:12px;color:var(--mi-gray-500);">同价位小米选择</div>
            <div style="font-size:15px;font-weight:700;margin-top:4px;">
              ${xiaomiMatch.name} · HK$${xiaomiMatch.price.toLocaleString()}
            </div>
            <div style="font-size:12px;color:var(--mi-gray-500);margin-top:4px;">
              ${xiaomiMatch.highlight}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  function toggleAll() {
    showAll = !showAll;
    render(document.getElementById('competitor-section'));
  }

  return { render, toggleAll };
})();
