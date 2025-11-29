const state = { tasks: [] };

function updateTaskCount() {
  document.getElementById('taskCount').textContent = `${state.tasks.length} task${state.tasks.length !== 1 ? 's' : ''}`;
}

function renderLocalTasks() {
  const div = document.getElementById('localTasks');
  updateTaskCount();
  if (!state.tasks.length) { 
    div.innerHTML = '<p class="small">No tasks added yet. Add one above or paste JSON.</p>'; 
    return; 
  }
  div.innerHTML = state.tasks.map((t, i) => `
    <div class="task-item">
      <strong>${i + 1}. ${t.title}</strong><br>
      <span class="small">Due: ${t.due_date} | Importance: ${t.importance}/10 | Effort: ${t.estimated_hours}h</span>
      ${t.dependencies.length ? `<br><span class="small">Depends on: ${t.dependencies.join(', ')}</span>` : ''}
    </div>
  `).join('');
}

function parseDependencies(input) {
  if (!input) return [];
  return input.split(',').map(s => s.trim()).filter(Boolean);
}

document.getElementById('taskForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value.trim();
  const due_date = document.getElementById('due_date').value;
  const estimated_hours = parseInt(document.getElementById('estimated_hours').value || '1', 10);
  const importance = parseInt(document.getElementById('importance').value || '5', 10);
  const dependencies = parseDependencies(document.getElementById('dependencies').value);
  if (!title || !due_date) { alert('Title and Due Date are required'); return; }
  if (importance < 1 || importance > 10) { alert('Importance must be between 1 and 10'); return; }
  if (estimated_hours < 0) { alert('Estimated hours must be positive'); return; }
  state.tasks.push({ title, due_date, estimated_hours, importance, dependencies });
  e.target.reset();
  document.getElementById('title').focus();
  renderLocalTasks();
});

document.getElementById('loadJsonBtn').addEventListener('click', () => {
  try {
    const raw = document.getElementById('taskInput').value.trim();
    if (!raw) { alert('Paste a JSON array first.'); return; }
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) throw new Error('Expected JSON array');
    state.tasks = arr;
    renderLocalTasks();
  } catch (e) {
    alert('Invalid JSON: ' + e.message);
  }
});

document.getElementById('clearTasksBtn').addEventListener('click', () => {
  if (state.tasks.length === 0) { alert('No tasks to clear'); return; }
  if (confirm('Are you sure you want to clear all tasks?')) {
    state.tasks = [];
    document.getElementById('results').innerHTML = '';
    document.getElementById('resultCount').textContent = '-';
    renderLocalTasks();
  }
});

function priorityBadge(score) {
  if (score >= 120) return '<span class="badge high">High</span>';
  if (score >= 70) return '<span class="badge medium">Medium</span>';
  return '<span class="badge low">Low</span>';
}

function renderResults(tasks) {
  const res = document.getElementById('results');
  document.getElementById('resultCount').textContent = tasks.length > 0 ? `${tasks.length} result${tasks.length !== 1 ? 's' : ''}` : '-';
  if (!tasks.length) { res.innerHTML = '<p class="small">No results. Try analyzing with different settings.</p>'; return; }
  res.innerHTML = tasks.map((t, i) => `
    <div class="card">
      <div class="card-title">${i + 1}. ${priorityBadge(t.score)} ${t.title}</div>
      <div class="card-meta">
        <div class="card-meta-item"><strong>Due:</strong> ${t.due_date}</div>
        <div class="card-meta-item"><strong>Effort:</strong> ${t.estimated_hours}h</div>
        <div class="card-meta-item"><strong>Importance:</strong> ${t.importance}/10</div>
        <div class="card-meta-item"><strong>Score:</strong> ${Math.round(t.score)}</div>
      </div>
      ${t.explanation ? `<div class="explanation"><strong>Reasoning:</strong> ${t.explanation}</div>` : ''}
    </div>
  `).join('');
}

async function postJSON(url, data) {
  const strategy = document.getElementById('strategy').value;
  const resp = await fetch(`${url}?strategy=${encodeURIComponent(strategy)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!resp.ok) throw new Error(await resp.text());
  return resp.json();
}

async function analyze() {
  try {
    if (!state.tasks.length) { alert('Add or load some tasks first.'); return; }
    const btn = document.getElementById('analyzeBtn');
    btn.disabled = true;
    btn.textContent = 'Analyzing...';
    const data = await postJSON('/api/tasks/analyze/', state.tasks);
    renderResults(data);
  } catch (e) {
    alert('Analyze failed: ' + e.message);
  } finally {
    const btn = document.getElementById('analyzeBtn');
    btn.disabled = false;
    btn.textContent = 'Analyze';
  }
}

async function suggest() {
  try {
    if (!state.tasks.length) { alert('Add or load some tasks first.'); return; }
    const btn = document.getElementById('suggestBtn');
    btn.disabled = true;
    btn.textContent = 'Getting suggestions...';
    const data = await postJSON('/api/tasks/suggest/', state.tasks);
    renderResults(data);
  } catch (e) {
    alert('Suggest failed: ' + e.message);
  } finally {
    const btn = document.getElementById('suggestBtn');
    btn.disabled = false;
    btn.textContent = 'Suggest Top 3';
  }
}

document.getElementById('analyzeBtn').addEventListener('click', analyze);

document.getElementById('suggestBtn').addEventListener('click', suggest);

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    e.target.classList.add('active');
    document.getElementById(e.target.dataset.tab + 'Tab').classList.add('active');
  });
});

// Strategy hint updater
document.getElementById('strategy').addEventListener('change', (e) => {
  const hints = {
    smart: 'Balances urgency, importance, and effort',
    fastest: 'Prioritizes quick wins to build momentum',
    impact: 'Focuses on high-importance tasks first',
    deadline: 'Prioritizes by due date urgency'
  };
  document.getElementById('strategyHint').textContent = hints[e.target.value];
});

// init
renderLocalTasks();
