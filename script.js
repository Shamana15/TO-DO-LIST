document.addEventListener('DOMContentLoaded', () => {
  loadTasks();

  document.getElementById('add-task-btn').addEventListener('click', addTask);
  document.getElementById('clear-all-btn').addEventListener('click', clearAllTasks);
  document.getElementById('search-input').addEventListener('input', filterTasks);
  document.getElementById('dark-mode-toggle').addEventListener('click', toggleDarkMode);

  // Load dark mode state
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
  }
});

function addTask() {
  const taskInput = document.getElementById('task-input');
  const dueDateInput = document.getElementById('due-date');

  const text = taskInput.value.trim();
  const dueDate = dueDateInput.value;

  if (text === '') {
    alert('Please enter a task!');
    return;
  }

  createTaskElement(text, false, dueDate);
  saveTaskToStorage(text, false, dueDate);

  taskInput.value = '';
  dueDateInput.value = '';
}

function createTaskElement(text, isCompleted = false, dueDate = '') {
  const taskList = document.getElementById('task-list');
  const li = document.createElement('li');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = isCompleted;
  checkbox.addEventListener('change', () => {
    li.classList.toggle('completed', checkbox.checked);
    updateStorage();
  });

  const span = document.createElement('span');
  span.textContent = text;

  span.addEventListener('dblclick', () => {
    const newText = prompt('Edit task:', span.textContent);
    if (newText && newText.trim() !== '') {
      span.textContent = newText.trim();
      updateStorage();
    }
  });

  const dateLabel = document.createElement('div');
  dateLabel.className = 'due-date';
  if (dueDate) {
    const formatted = new Date(dueDate).toLocaleDateString();
    dateLabel.textContent = `Due: ${formatted}`;
  }

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.className = 'delete-btn';
  deleteBtn.addEventListener('click', () => {
    li.remove();
    updateStorage();
  });

  li.appendChild(checkbox);
  li.appendChild(span);
  if (dueDate) li.appendChild(dateLabel);
  li.appendChild(deleteBtn);

  if (isCompleted) li.classList.add('completed');

  taskList.appendChild(li);
}

function saveTaskToStorage(text, completed, dueDate) {
  const tasks = getStoredTasks();
  tasks.push({ text, completed, dueDate });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = getStoredTasks();
  tasks.forEach(task => {
    createTaskElement(task.text, task.completed, task.dueDate);
  });
}

function getStoredTasks() {
  return JSON.parse(localStorage.getItem('tasks')) || [];
}

function updateStorage() {
  const taskList = document.getElementById('task-list');
  const tasks = [];

  taskList.querySelectorAll('li').forEach(li => {
    const text = li.querySelector('span').textContent;
    const completed = li.querySelector('input[type="checkbox"]').checked;
    const dueEl = li.querySelector('.due-date');
    const dueText = dueEl ? dueEl.textContent.replace('Due: ', '') : '';
    const dueDate = dueText ? new Date(dueText).toISOString().split('T')[0] : '';

    tasks.push({ text, completed, dueDate });
  });

  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function clearAllTasks() {
  if (confirm('Are you sure you want to delete all tasks?')) {
    localStorage.removeItem('tasks');
    document.getElementById('task-list').innerHTML = '';
  }
}

function filterTasks() {
  const searchText = document.getElementById('search-input').value.toLowerCase();
  const tasks = document.querySelectorAll('#task-list li');

  tasks.forEach(li => {
    const text = li.querySelector('span').textContent.toLowerCase();
    li.style.display = text.includes(searchText) ? '' : 'none';
  });
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}
