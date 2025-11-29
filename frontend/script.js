const state = { tasks: [] };

function renderLocalTasks() {
  const div = document.getElementById('localTasks');
  if (!state.tasks.length) { div.innerHTML = '<p class="small">No tasks added yet.</p>'; return; }
  div.innerHTML = state.tasks.map(t => `<div class="small">• ${t.title} (due ${t.due_date}, imp ${t.importance}, ${t.estimated_hours}h)</div>`).join('');
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
  state.tasks.push({ title, due_date, estimated_hours, importance, dependencies });
  e.target.reset();
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
  state.tasks = [];
  renderLocalTasks();
});

function priorityBadge(score) {
  if (score >= 120) return '<span class="badge high">High</span>';
  if (score >= 70) return '<span class="badge medium">Medium</span>';
  return '<span class="badge low">Low</span>';
}

function renderResults(tasks) {
  const res = document.getElementById('results');
  if (!tasks.length) { res.innerHTML = '<p class="small">No results.</p>'; return; }
  res.innerHTML = tasks.map(t => `
    <div class="card">
      <div>${priorityBadge(t.score)} <strong>${t.title}</strong></div>
      <div class="small">Due: ${t.due_date} | Effort: ${t.estimated_hours}h | Importance: ${t.importance}</div>
      <div class="small">${t.explanation || ''}</div>
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
    const data = await postJSON('http://127.0.0.1:8000/api/tasks/analyze/', state.tasks);
    renderResults(data);
  } catch (e) {
    alert('Analyze failed: ' + e.message);
  }
}

async function suggest() {
  try {
    if (!state.tasks.length) { alert('Add or load some tasks first.'); return; }
    const data = await postJSON('http://127.0.0.1:8000/api/tasks/suggest/', state.tasks);
    renderResults(data);
  } catch (e) {
    alert('Suggest failed: ' + e.message);
  }
}

document.getElementById('analyzeBtn').addEventListener('click', analyze);

document.getElementById('suggestBtn').addEventListener('click', suggest);

// init
renderLocalTasks();
