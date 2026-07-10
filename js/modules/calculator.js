/**
 * 预算计算器模块
 */
const Calculator = (() => {
  let budget = 2000;
  let includeAccessories = false;

  function render(container) {
    const accessoriesBudget = includeAccessories ? 500 : 0;
    const totalBudget = budget + accessoriesBudget;
    const matched = PRODUCTS.filter(p => p.price <= totalBudget)
      .sort((a, b) => b.rating - a.rating);

    container.innerHTML = `
      <div class="calc-slider-container mb-4">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <label style="font-size:14px;font-weight:600;">平板预算</label>
          <label style="font-size:14px;color:var(--mi-gray-500);display:flex;align-items:center;gap:8px;">
            <input type="checkbox" ${includeAccessories ? 'checked' : ''}
                   onchange="Calculator.toggleAccessories(this.checked)">
            预算配件（+HK$500）
          </label>
        </div>
        <input type="range" class="calc-slider" min="800" max="5000" step="100"
               value="${budget}"
               oninput="Calculator.updateBudget(this.value)"
               style="--slider-pct: ${(budget - 800) / (5000 - 800) * 100}%;">
        <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--mi-gray-500);">
          <span>HK$800</span>
          <span style="font-size:16px;font-weight:700;color:var(--mi-orange);">HK$${totalBudget.toLocaleString()}</span>
          <span>HK$5,000</span>
        </div>
      </div>

      ${matched.length > 0 ? `
        <div style="font-size:14px;color:var(--mi-gray-500);margin-bottom:12px;">
          找到 <strong>${matched.length}</strong> 款符合条件的平板
        </div>
        <div class="calc-recommendations">
          ${matched.map(p => renderCalcCard(p, totalBudget)).join('')}
        </div>
      ` : `
        <div class="text-center mt-4" style="padding:32px;">
          <div style="font-size:48px;margin-bottom:12px;">💸</div>
          <div style="font-size:16px;color:var(--mi-gray-500);">预算范围内暂无匹配产品</div>
          <div style="font-size:14px;color:var(--mi-gray-500);margin-top:8px;">
            最低预算 HK$${Math.min(...PRODUCTS.map(p => p.price)).toLocaleString()}
          </div>
        </div>
      `}
    `;
  }

  function renderCalcCard(product, budget) {
    const isFav = Favorites.has(product.id);
    const withinBudget = product.price <= budget;
    return `
      <div class="product-card fade-in" style="${!withinBudget ? 'opacity:0.6;' : ''}">
        <div class="product-card-image" style="height:120px;">
          <span style="font-size:48px;">📱</span>
        </div>
        <div class="product-card-body" style="padding:16px;">
          <div class="product-card-series">${product.series}</div>
          <div class="product-card-name" style="font-size:16px;">${product.name}</div>
          <div class="product-card-price" style="font-size:20px;">
            HK$${product.price.toLocaleString()}
          </div>
          <div style="margin-top:8px;font-size:12px;color:var(--mi-gray-500);">
            ${product.sizeLabel} · ${product.chip.split(' ').slice(-1)[0]} · ⭐${product.rating}
          </div>
        </div>
        <div class="product-card-actions" style="padding:0 16px 16px;">
          <a href="${product.buyLink}" target="_blank" class="btn-primary" style="text-decoration:none;font-size:12px;padding:8px 12px;">
            购买
          </a>
          <button class="btn-outline" onclick="Favorites.toggle('${product.id}')" style="font-size:12px;padding:8px;">
            ${isFav ? '❤️' : '🤍'}
          </button>
        </div>
      </div>
    `;
  }

  function updateBudget(value) {
    budget = parseInt(value);
    render(document.getElementById('calculator-section'));
  }

  function toggleAccessories(checked) {
    includeAccessories = checked;
    render(document.getElementById('calculator-section'));
  }

  return { render, updateBudget, toggleAccessories };
})();
