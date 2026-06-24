/* ═══════════════════════════════════════════════════
   RESUME BUILDER — APP LOGIC (app.js)
   Data model + live render + PDF export
═══════════════════════════════════════════════════ */

// ──────────────── DATA MODEL ────────────────
const appState = {
  screen: 'login', // login, templates, editor
  template: 'tpl-classic',
  color: '#1a237e'
};

const data = {
  personal: {
    name: '',
    location: '',
    phone: '',
    email: '',
    linkedin: '',
    linkedinUrl: '',
    github: '',
    githubUrl: ''
  },
  summary: '',
  skills: [],
  experience: [],
  projects: [],
  achievements: [],
  certifications: [],
  education: []
};

// ──────────────── NAVIGATION & STATE ────────────────
function switchScreen(screenName) {
  appState.screen = screenName;
  document.querySelectorAll('.app-screen').forEach(el => {
    el.style.display = el.id === `screen-${screenName}` ? 'flex' : 'none';
  });
}

function handleLogin(e) {
  e.preventDefault();
  const name = document.getElementById('login-name').value;
  if(name) {
    data.personal.name = name;
    setVal('f-name', name);
  }
  switchScreen('templates');
}

function selectTemplate(tplId) {
  appState.template = tplId;
  document.querySelectorAll('.template-card').forEach(c => {
    c.classList.toggle('selected', c.dataset.tpl === tplId);
  });
  render();
  switchScreen('editor');
}

function updateThemeColor(color) {
  appState.color = color;
  document.documentElement.style.setProperty('--resume-primary', color);
  render();
}

// ──────────────── TAB SWITCHING ────────────────
function switchTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.id === 'tab-' + tab));
}

// ──────────────── INIT FORM ────────────────
function initForm() {
  // Personal
  setVal('f-name',        data.personal.name);
  setVal('f-location',    data.personal.location);
  setVal('f-phone',       data.personal.phone);
  setVal('f-email',       data.personal.email);
  setVal('f-linkedin',    data.personal.linkedin);
  setVal('f-linkedin-url',data.personal.linkedinUrl);
  setVal('f-github',      data.personal.github);
  setVal('f-github-url',  data.personal.githubUrl);
  // Summary
  setVal('f-summary',  data.summary);
  // Dynamic sections
  renderSkillsForm();
  renderExperienceForm();
  renderProjectsForm();
  renderAchievementsForm();
  renderCertificationsForm();
  renderEducationForm();
}

function setVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val;
}
function getVal(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

// ──────────────── SKILLS FORM ────────────────
function renderSkillsForm() {
  const container = document.getElementById('skills-list');
  container.innerHTML = '';
  data.skills.forEach((s, i) => {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
      <div class="item-card-header">
        <span class="item-card-title">Skill Category ${i + 1}</span>
        <button class="btn-remove" onclick="removeSkill(${i})" title="Remove">×</button>
      </div>
      <div class="form-group">
        <label>Category Name</label>
        <input type="text" value="${escHtml(s.category)}" oninput="data.skills[${i}].category=this.value;render()" />
      </div>
      <div class="form-group">
        <label>Skills (comma-separated)</label>
        <input type="text" value="${escHtml(s.items)}" oninput="data.skills[${i}].items=this.value;render()" />
      </div>`;
    container.appendChild(card);
  });
}
function addSkill() {
  data.skills.push({ category: 'New Category', items: 'skill1, skill2' });
  renderSkillsForm(); render();
}
function removeSkill(i) {
  data.skills.splice(i, 1);
  renderSkillsForm(); render();
}

// ──────────────── EXPERIENCE FORM ────────────────
function renderExperienceForm() {
  const container = document.getElementById('exp-list');
  container.innerHTML = '';
  data.experience.forEach((e, i) => {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
      <div class="item-card-header">
        <span class="item-card-title">${escHtml(e.title) || 'Experience ' + (i+1)}</span>
        <button class="btn-remove" onclick="removeExperience(${i})" title="Remove">×</button>
      </div>
      <div class="form-group">
        <label>Job Title</label>
        <input type="text" value="${escHtml(e.title)}" oninput="data.experience[${i}].title=this.value;renderExperienceForm();render()" />
      </div>
      <div class="form-group">
        <label>Company</label>
        <input type="text" value="${escHtml(e.company)}" oninput="data.experience[${i}].company=this.value;render()" />
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>From</label>
          <input type="text" value="${escHtml(e.dateFrom)}" placeholder="Jun 2025" oninput="data.experience[${i}].dateFrom=this.value;render()" />
        </div>
        <div class="form-group">
          <label>To</label>
          <input type="text" value="${escHtml(e.dateTo)}" placeholder="Aug 2025 / Present" oninput="data.experience[${i}].dateTo=this.value;render()" />
        </div>
      </div>
      <div class="form-group">
        <label>Bullet Points</label>
        <div class="bullet-list" id="exp-bullets-${i}"></div>
        <button class="btn-add-bullet" onclick="addExpBullet(${i})">+ Add bullet</button>
      </div>`;
    container.appendChild(card);
    renderBullets(`exp-bullets-${i}`, e.bullets, (val, bi) => {
      data.experience[i].bullets[bi] = val; render();
    }, (bi) => { data.experience[i].bullets.splice(bi, 1); renderExperienceForm(); render(); });
  });
}
function addExperience() {
  data.experience.push({ title: 'Job Title', company: 'Company', dateFrom: '', dateTo: '', bullets: [''] });
  renderExperienceForm(); render();
}
function removeExperience(i) {
  data.experience.splice(i, 1);
  renderExperienceForm(); render();
}
function addExpBullet(i) {
  data.experience[i].bullets.push('');
  renderExperienceForm(); render();
}

// ──────────────── PROJECTS FORM ────────────────
function renderProjectsForm() {
  const container = document.getElementById('proj-list');
  container.innerHTML = '';
  data.projects.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
      <div class="item-card-header">
        <span class="item-card-title">${escHtml(p.title) || 'Project ' + (i+1)}</span>
        <button class="btn-remove" onclick="removeProject(${i})" title="Remove">×</button>
      </div>
      <div class="form-group">
        <label>Project Title</label>
        <input type="text" value="${escHtml(p.title)}" oninput="data.projects[${i}].title=this.value;renderProjectsForm();render()" />
      </div>
      <div class="form-group">
        <label>Technologies Used</label>
        <input type="text" value="${escHtml(p.tech)}" placeholder="Python, Streamlit, Plotly" oninput="data.projects[${i}].tech=this.value;render()" />
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>From (optional)</label>
          <input type="text" value="${escHtml(p.dateFrom)}" placeholder="Jul" oninput="data.projects[${i}].dateFrom=this.value;render()" />
        </div>
        <div class="form-group">
          <label>To / Date</label>
          <input type="text" value="${escHtml(p.dateTo)}" placeholder="Aug 2025" oninput="data.projects[${i}].dateTo=this.value;render()" />
        </div>
      </div>
      <div class="form-group">
        <label>Bullet Points</label>
        <div class="bullet-list" id="proj-bullets-${i}"></div>
        <button class="btn-add-bullet" onclick="addProjBullet(${i})">+ Add bullet</button>
      </div>`;
    container.appendChild(card);
    renderBullets(`proj-bullets-${i}`, p.bullets, (val, bi) => {
      data.projects[i].bullets[bi] = val; render();
    }, (bi) => { data.projects[i].bullets.splice(bi, 1); renderProjectsForm(); render(); });
  });
}
function addProject() {
  data.projects.push({ title: 'Project Title', tech: 'Python', dateFrom: '', dateTo: '', bullets: [''] });
  renderProjectsForm(); render();
}
function removeProject(i) {
  data.projects.splice(i, 1);
  renderProjectsForm(); render();
}
function addProjBullet(i) {
  data.projects[i].bullets.push('');
  renderProjectsForm(); render();
}

// ──────────────── ACHIEVEMENTS FORM ────────────────
function renderAchievementsForm() {
  const container = document.getElementById('ach-list');
  container.innerHTML = '';
  renderBullets('ach-list', data.achievements,
    (val, i) => { data.achievements[i] = val; render(); },
    (i) => { data.achievements.splice(i, 1); render(); }
  );
}
function addAchievement() {
  data.achievements.push('');
  renderAchievementsForm(); render();
}

// ──────────────── CERTIFICATIONS FORM ────────────────
function renderCertificationsForm() {
  const container = document.getElementById('cert-list');
  container.innerHTML = '';
  renderBullets('cert-list', data.certifications,
    (val, i) => { data.certifications[i] = val; render(); },
    (i) => { data.certifications.splice(i, 1); render(); }
  );
}
function addCertification() {
  data.certifications.push('');
  renderCertificationsForm(); render();
}

// ──────────────── EDUCATION FORM ────────────────
function renderEducationForm() {
  const container = document.getElementById('edu-list');
  container.innerHTML = '';
  data.education.forEach((e, i) => {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
      <div class="item-card-header">
        <span class="item-card-title">Education ${i + 1}</span>
        <button class="btn-remove" onclick="removeEducation(${i})" title="Remove">×</button>
      </div>
      <div class="form-group">
        <label>Degree / Program</label>
        <input type="text" value="${escHtml(e.degree)}" oninput="data.education[${i}].degree=this.value;render()" />
      </div>
      <div class="form-group">
        <label>School / University</label>
        <input type="text" value="${escHtml(e.school)}" oninput="data.education[${i}].school=this.value;render()" />
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Graduation Date</label>
          <input type="text" value="${escHtml(e.dateTo)}" placeholder="Expected 2028" oninput="data.education[${i}].dateTo=this.value;render()" />
        </div>
        <div class="form-group">
          <label>GPA / CGPA</label>
          <input type="text" value="${escHtml(e.cgpa)}" placeholder="CGPA: 9.4/10" oninput="data.education[${i}].cgpa=this.value;render()" />
        </div>
      </div>`;
    container.appendChild(card);
  });
}
function addEducation() {
  data.education.push({ degree: '', school: '', dateFrom: '', dateTo: '', cgpa: '' });
  renderEducationForm(); render();
}
function removeEducation(i) {
  data.education.splice(i, 1);
  renderEducationForm(); render();
}

// ──────────────── BULLET HELPER ────────────────
function renderBullets(containerId, arr, onChange, onRemove) {
  const container = document.getElementById(containerId);
  if (!container) return;
  arr.forEach((bullet, i) => {
    const row = document.createElement('div');
    row.className = 'bullet-item';
    const inp = document.createElement('input');
    inp.type = 'text';
    inp.value = bullet;
    inp.placeholder = 'Describe your contribution...';
    inp.addEventListener('input', () => onChange(inp.value, i));
    const btn = document.createElement('button');
    btn.textContent = '×';
    btn.title = 'Remove bullet';
    btn.addEventListener('click', () => onRemove(i));
    row.appendChild(inp);
    row.appendChild(btn);
    container.appendChild(row);
  });
}

// ──────────────── BOLD MARKDOWN PARSER ────────────────
// Converts **text** to <strong>text</strong>
function parseBold(str) {
  if (!str) return '';
  return escHtml(str).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

// ──────────────── ESCAPE HTML ────────────────
function escHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ──────────────── RENDER RESUME ────────────────
function render() {
  // Sync personal from form
  data.personal.name        = getVal('f-name');
  data.personal.location    = getVal('f-location');
  data.personal.phone       = getVal('f-phone');
  data.personal.email       = getVal('f-email');
  data.personal.linkedin    = getVal('f-linkedin');
  data.personal.linkedinUrl = getVal('f-linkedin-url');
  data.personal.github      = getVal('f-github');
  data.personal.githubUrl   = getVal('f-github-url');
  data.summary              = getVal('f-summary');

  const p = data.personal;
  let html = '';

  // ── HEADER ──
  if (p.name) {
    html += `<div class="r-name">${escHtml(p.name)}</div>`;
  }

  // Contact line
  const contacts = [];
  if (p.location) contacts.push(`<span class="r-contact-item">${escHtml(p.location)}</span>`);
  if (p.phone)    contacts.push(`<span class="r-contact-item">${escHtml(p.phone)}</span>`);
  if (p.email)    contacts.push(`<span class="r-contact-item"><a href="mailto:${escHtml(p.email)}">${escHtml(p.email)}</a></span>`);
  if (p.linkedin) contacts.push(`<span class="r-contact-item"><a href="${escHtml(p.linkedinUrl || '#')}">${escHtml(p.linkedin)}</a></span>`);
  if (p.github)   contacts.push(`<span class="r-contact-item"><a href="${escHtml(p.githubUrl || '#')}">${escHtml(p.github)}</a></span>`);

  if (contacts.length) {
    html += `<div class="r-contact">${contacts.join('<span class="r-contact-sep">•</span>')}</div>`;
  }

  // ── SUMMARY ──
  if (data.summary) {
    html += section('SUMMARY', `<div class="r-summary">${escHtml(data.summary)}</div>`);
  }

  // ── TECHNICAL SKILLS ──
  if (data.skills.length) {
    const items = data.skills
      .filter(s => s.category || s.items)
      .map(s => `<li><strong>${escHtml(s.category)}:</strong> ${escHtml(s.items)}</li>`)
      .join('');
    if (items) {
      html += section('TECHNICAL SKILLS', `<ul class="r-skills-list">${items}</ul>`);
    }
  }

  // ── EXPERIENCE ──
  if (data.experience.length) {
    let body = '';
    data.experience.forEach(e => {
      if (!e.title && !e.company) return;
      const dateStr = [e.dateFrom, e.dateTo].filter(Boolean).join(' – ');
      const titleStr = e.company
        ? `${escHtml(e.title)} — <em>${escHtml(e.company)}</em>`
        : escHtml(e.title);
      const bullets = (e.bullets || []).filter(b => b.trim());
      body += `<div class="r-item">
        <div class="r-item-header">
          <div class="r-item-title">${titleStr}</div>
          ${dateStr ? `<div class="r-item-date">${escHtml(dateStr)}</div>` : ''}
        </div>
        ${bullets.length ? `<ul class="r-item-bullets">${bullets.map(b => `<li>${parseBold(b)}</li>`).join('')}</ul>` : ''}
      </div>`;
    });
    if (body) html += section('EXPERIENCE', body);
  }

  // ── PROJECTS ──
  if (data.projects.length) {
    let body = '';
    data.projects.forEach(p => {
      if (!p.title) return;
      const dateStr = p.dateFrom ? `${p.dateFrom} – ${p.dateTo}` : p.dateTo;
      const titleStr = p.tech
        ? `${escHtml(p.title)} | <em>${escHtml(p.tech)}</em>`
        : escHtml(p.title);
      const bullets = (p.bullets || []).filter(b => b.trim());
      body += `<div class="r-item">
        <div class="r-item-header">
          <div class="r-item-title">${titleStr}</div>
          ${dateStr ? `<div class="r-item-date">${escHtml(dateStr)}</div>` : ''}
        </div>
        ${bullets.length ? `<ul class="r-item-bullets">${bullets.map(b => `<li>${parseBold(b)}</li>`).join('')}</ul>` : ''}
      </div>`;
    });
    if (body) html += section('PROJECTS', body);
  }

  // ── ACHIEVEMENTS ──
  const achFiltered = data.achievements.filter(a => a.trim());
  if (achFiltered.length) {
    const items = achFiltered.map(a => `<li>${parseBold(a)}</li>`).join('');
    html += section('ACHIEVEMENTS', `<ul class="r-ach-list">${items}</ul>`);
  }

  // ── CERTIFICATIONS ──
  const certFiltered = data.certifications.filter(c => c.trim());
  if (certFiltered.length) {
    const items = certFiltered.map(c => `<li>${escHtml(c)}</li>`).join('');
    html += section('CERTIFICATIONS', `<ul class="r-cert-list">${items}</ul>`);
  }

  // ── EDUCATION ──
  if (data.education.length) {
    let body = '';
    data.education.forEach(e => {
      if (!e.degree && !e.school) return;
      body += `<div class="r-edu-item">
        <div class="r-edu-header">
          <div class="r-edu-degree">${escHtml(e.degree)}</div>
          ${e.dateTo ? `<div class="r-edu-date">${escHtml(e.dateTo)}</div>` : ''}
        </div>
        <div class="r-edu-school">
          <span>${escHtml(e.school)}</span>
          ${e.cgpa ? `<span class="r-edu-cgpa">${parseCGPA(e.cgpa)}</span>` : ''}
        </div>
      </div>`;
    });
    if (body) html += section('EDUCATION', body);
  }

  if (!html) {
    html = `<div class="r-empty">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 7h6M9 11h6M9 15h4"/><circle cx="17" cy="17" r="4" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M17 15v2l1 1"/></svg>
      <h3>Your resume will appear here</h3>
      <p>Fill in the form on the left to start building your ATS-friendly resume.</p>
    </div>`;
  }

  const paper = document.getElementById('resume-paper');
  paper.className = appState.template;
  paper.innerHTML = html;
}

// ── Section wrapper helper ──
function section(title, body) {
  return `<div class="r-section">
    <div class="r-section-title">${title}</div>
    ${body}
  </div>`;
}

// ── Parse CGPA – handles "2nd", "3rd" superscripts ──
function parseCGPA(str) {
  return escHtml(str).replace(/(\d+)(st|nd|rd|th)/g, '$1<sup>$2</sup>');
}

// ──────────────── PDF EXPORT ────────────────
function downloadPDF() {
  const btn = document.getElementById('btn-download');
  const origText = btn.innerHTML;
  btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Generating…`;
  btn.disabled = true;

  const name = data.personal.name || 'Resume';
  const element = document.getElementById('resume-paper');

  const opt = {
    margin:       [0, 0, 0, 0],
    filename:     name.replace(/\s+/g, '_') + '_Resume.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true, logging: false },
    jsPDF:        { unit: 'pt', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(element).save().then(() => {
    btn.innerHTML = origText;
    btn.disabled = false;
  }).catch(() => {
    btn.innerHTML = origText;
    btn.disabled = false;
  });
}

// ──────────────── BOOT ────────────────
document.addEventListener('DOMContentLoaded', () => {
  initForm();
  
  // Set default theme color CSS variable
  document.documentElement.style.setProperty('--resume-primary', appState.color);
  
  // Initialize to login screen
  switchScreen('login');
});
