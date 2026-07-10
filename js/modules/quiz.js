/**
 * 智能推荐问答引擎
 */
const QuizEngine = (() => {
  let currentStep = 0;
  let answers = {};
  const steps = [
    { key: "scenario", question: "您主要用平板做什么？", desc: "选择最核心的使用场景", options: SCENARIOS },
    { key: "budget", question: "您的预算范围？", desc: "含配件预算更准确", options: BUDGETS },
    { key: "size", question: "您偏好的屏幕尺寸？", desc: "大屏沉浸，小屏便携", options: [
      { id: "compact", icon: "📱", label: "小屏 (≤9吋)", desc: "单手可握" },
      { id: "standard", icon: "📟", label: "标准 (10-11吋)", desc: "均衡之选" },
      { id: "large", icon: "🖥️", label: "大屏 (≥12吋)", desc: "沉浸体验" }
    ]}
  ];

  function getProgress() {
    return ((currentStep) / steps.length) * 100;
  }

  function renderQuiz(container) {
    if (currentStep >= steps.length) {
      showResult(container);
      return;
    }
    const step = steps[currentStep];
    const progress = getProgress();

    container.innerHTML = `
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${progress}%"></div>
      </div>
      <div class="quiz-step-label">问题 ${currentStep + 1} / ${steps.length}</div>
      <div class="quiz-question">${step.question}</div>
      <div class="quiz-desc">${step.desc}</div>
      <div class="quiz-options">
        ${step.options.map(opt => `
          <div class="quiz-option ${answers[step.key] === opt.id ? 'selected' : ''}"
               onclick="QuizEngine.select('${step.key}', '${opt.id}')">
            <div class="quiz-option-icon">${opt.icon}</div>
            <div class="quiz-option-label">${opt.label}</div>
            ${opt.desc ? `<div class="quiz-option-desc">${opt.desc}</div>` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }

  function select(key, value) {
    answers[key] = value;
    currentStep++;
    const container = document.getElementById('quiz-card');
    renderQuiz(container);
  }

  function showResult(container) {
    const recommended = filterProducts();
    const html = recommended.length > 0
      ? recommended.map(p => renderResultCard(p)).join('')
      : '<div class="text-center mt-6"><p>暂无完全匹配的机型，建议查看全部产品</p></div>';

    container.innerHTML = `
      <div class="flex justify-between items-center mb-4">
        <div class="quiz-step-label">推荐结果</div>
        <button class="btn-outline" onclick="QuizEngine.restart()" style="font-size:13px;padding:8px 16px;">
          🔄 重新选择
        </button>
      </div>
      <div class="fade-in">${html}</div>
    `;
  }

  function filterProducts() {
    let filtered = [...PRODUCTS];

    // 按场景筛选
    if (answers.scenario) {
      filtered = filtered.filter(p => p.scenarios.includes(answers.scenario));
    }
    // 按预算筛选
    if (answers.budget) {
      const budget = BUDGETS.find(b => b.id === answers.budget);
      if (budget) {
        filtered = filtered.filter(p => p.price <= budget.max);
      }
    }
    // 按尺寸筛选
    if (answers.size) {
      if (answers.size === 'compact') filtered = filtered.filter(p => p.size <= 9.5);
      else if (answers.size === 'large') filtered = filtered.filter(p => p.size >= 11.5);
      else filtered = filtered.filter(p => p.size > 9.5 && p.size < 11.5);
    }

    // 按评分排序
    filtered.sort((a, b) => b.rating - a.rating);
    return filtered;
  }

  function renderResultCard(product) {
    return `
      <div class="result-card mb-4">
        <div class="result-header">
          <div class="result-badge">🏆 最佳推荐</div>
          <div class="result-name">${product.name}</div>
          <div class="result-tagline">${product.highlight}</div>
        </div>
        <div class="result-body">
          <div class="result-price">
            HK$${product.price.toLocaleString()}
            <small>/起</small>
          </div>
          <div class="result-specs-grid">
            <div class="spec-item">
              <div class="spec-item-label">屏幕</div>
              <div class="spec-item-value">${product.sizeLabel} ${product.panel}</div>
            </div>
            <div class="spec-item">
              <div class="spec-item-label">处理器</div>
              <div class="spec-item-value">${product.chip}</div>
            </div>
            <div class="spec-item">
              <div class="spec-item-label">电池</div>
              <div class="spec-item-value">${product.battery}mAh / ${product.charging}W</div>
            </div>
            <div class="spec-item">
              <div class="spec-item-label">存储</div>
              <div class="spec-item-value">${product.ram}GB + ${product.storage}GB</div>
            </div>
          </div>
          <div class="mt-4">
            <strong>推荐理由：</strong>
            <p style="margin-top:4px;color:#374151;font-size:14px;">
              适合${product.targetUser}。${product.highlight}。
            </p>
          </div>
          <div class="result-actions">
            <a href="${product.buyLink}" target="_blank" class="btn-primary" style="text-decoration:none;text-align:center;">
              前往购买 →
            </a>
            <button class="btn-outline" onclick="Favorites.toggle('${product.id}')">
              ❤️ 收藏
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function restart() {
    currentStep = 0;
    answers = {};
    const container = document.getElementById('quiz-card');
    renderQuiz(container);
  }

  return { renderQuiz, select, restart, getProgress };
})();
