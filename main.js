document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. 디렉토리 링크 데이터 (나중에 링크를 추가/수정할 땐 여기만 편집하세요!)
     ========================================================================== */
  const DIRECTORY_DATA = {
    quickAccess: [
      { name: 'GitHub', url: 'https://github.com', desc: '리포지토리 및 배포 관리', icon: 'ph-github-logo' },
      { name: 'Workspace', url: 'https://mail.google.com', desc: '사내 메일 및 캘린더', icon: 'ph-google-logo' }
    ],
    operation: [
      { name: '인트라넷 / 노션', url: '#', desc: '사내 공지사항 및 업무 매뉴얼 아카이빙 룸', icon: 'ph-file-text', tags: ['Internal', 'Daily'] }
    ],
    marketing: [
      { name: 'Google Analytics 4', url: 'https://analytics.google.com', desc: '클라이언트 웹사이트 로그 분석 및 데이터 트래킹', icon: 'ph-trend-up', tags: ['Google', 'Analytics'] },
      { name: 'Search Console', url: 'https://search.google.com/search-console', desc: '색인 생성 여부 확인 및 기술 SEO 퍼포먼스 모니터링', icon: 'ph-google-chrome-logo', tags: ['SEO', 'Console'] }
    ],
    designDev: [
      { name: 'Framer', url: 'https://www.framer.com', desc: '인터랙티브 웹 디자인 프로토타이핑 및 프로덕션', icon: 'ph-framer-logo', tags: ['Design', 'Interaction'] }
    ]
  };

  /* ==========================================================================
     2. 동적 카드 렌더링 함수 (HTML에 자동으로 링크 생성)
     ========================================================================== */
  function renderDashboard() {
    // 퀵 액세스 렌더링
    const quickGrid = document.querySelector('.quick-grid');
    if (quickGrid && DIRECTORY_DATA.quickAccess) {
      quickGrid.innerHTML = DIRECTORY_DATA.quickAccess.map(item => `
        <a href="${item.url}" target="_blank" class="quick-card">
          <div class="card-glow"></div>
          <div class="quick-icon"><i class="ph ${item.icon}"></i></div>
          <div class="quick-info">
            <h3>${item.name}</h3>
            <p>${item.desc}</p>
          </div>
        </a>
      `).join('');
    }

    // 일반 카테고리 렌더링 매핑
    const categories = [
      { id: 'operation', data: DIRECTORY_DATA.operation },
      { id: 'marketing', data: DIRECTORY_DATA.marketing },
      { id: 'design-dev', data: DIRECTORY_DATA.designDev }
    ];

    categories.forEach(cat => {
      const section = document.getElementById(cat.id);
      if (section) {
        const grid = section.querySelector('.directory-grid');
        if (grid && cat.data) {
          grid.innerHTML = cat.data.map(item => `
            <a href="${item.url}" target="_blank" class="link-card">
              <div class="card-glow"></div>
              <div class="card-header">
                <i class="ph ${item.icon} card-icon"></i>
                <i class="ph ph-arrow-square-out-up-right link-arrow"></i>
              </div>
              <div class="card-body">
                <h3>${item.name}</h3>
                <p>${item.desc}</p>
              </div>
              <div class="card-tags">
                ${item.tags ? item.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : ''}
              </div>
            </a>
          `).join('');
        }
      }
    });

    // 렌더링 직후 마우스 이벤트 바인딩
    initGlowEffect();
  }

  /* ==========================================================================
     3. 마우스 커서 반응형 글로우(Glow) 효과 인터랙션
     ========================================================================== */
  function initGlowEffect() {
    const cards = document.querySelectorAll('.quick-card, .link-card');
    
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        // 카드 내 마우스 커서의 상대적 X, Y 좌표 연산
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // CSS Custom Properties 변수로 좌표 전달
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  }

  /* ==========================================================================
     4. 실시간 타이포그래피 시계 위젯
     ========================================================================== */
  const clockEl = document.getElementById('live-clock');
  function updateClock() {
    if (!clockEl) return;
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    clockEl.textContent = `${hours}:${minutes}:${seconds}`;
  }
  setInterval(updateClock, 1000);
  updateClock();

  /* ==========================================================================
     5. 로컬스토리지 연동형 퀵 메모 (새로고침해도 유지)
     ========================================================================== */
  const memoArea = document.getElementById('quick-memo');
  if (memoArea) {
    const savedMemo = localStorage.getItem('gloim_memo');
    if (savedMemo) memoArea.value = savedMemo;

    // 입력할 때마다 브라우저 로컬 저장소에 실시간 자동저장
    memoArea.addEventListener('input', (e) => {
      localStorage.setItem('gloim_memo', e.target.value);
    });
  }

  /* ==========================================================================
     6. 실시간 검색 필터링 및 페이드 애니메이션 효과
     ========================================================================== */
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const keyword = e.target.value.toLowerCase().trim();
      const cards = document.querySelectorAll('.link-card, .quick-card');
      
      cards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const desc = card.querySelector('p').textContent.toLowerCase();
        const tags = Array.from(card.querySelectorAll('.tag')).map(t => t.textContent.toLowerCase());
        const hasTag = tags.some(tag => tag.includes(keyword));

        if (title.includes(keyword) || desc.includes(keyword) || hasTag) {
          // 일치할 경우: 요소를 드러내고 자연스럽게 페이드인 효과를 주도록 스타일 제어 가능
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; }, 10);
        } else {
          // 일치하지 않을 경우: 부드럽게 감추기
          card.style.opacity = '0';
          card.style.display = 'none';
        }
      });

      // 섹션 내부에 보여지는 카드가 하나도 없다면 해당 섹션 자체를 숨김 처리하여 깔끔하게 정돈
      document.querySelectorAll('.directory-section').forEach(section => {
        const visibleCards = section.querySelectorAll('.link-card[style*="display: flex"], .quick-card[style*="display: flex"]');
        if (visibleCards.length === 0 && keyword !== '') {
          section.style.display = 'none';
        } else {
          section.style.display = 'flex';
        }
      });
    });
  }

  // 실행 및 초기화
  renderDashboard();
});