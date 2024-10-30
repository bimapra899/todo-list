const task = document.getElementById('new-task');
const form = document.getElementById('todo-form');
const taskList = document.getElementById('todo-list');
const filterButtons = document.querySelectorAll('.filter-btn');

// Memuat tugas dari localStorage saat halaman dimuat
document.addEventListener('DOMContentLoaded', loadTasks);

// Fungsi untuk menambahkan task
function addTask() {
  const taskValue = task.value.trim();

  if (taskValue !== "") {
    const li = createTaskElement(taskValue);
    
    // Tambahkan task baru ke dalam daftar (ul)
    taskList.appendChild(li);

    // Simpan tugas ke localStorage
    saveTaskToLocalStorage(taskValue);

    // Kosongkan input setelah task ditambahkan
    task.value = "";
  }
}

// Fungsi untuk membuat elemen tugas
function createTaskElement(taskValue) {
  const li = document.createElement('li');
  li.classList.add('todo-item');
  
  const taskText = document.createElement('span');
  taskText.textContent = taskValue;
  taskText.classList.add('task-text');

  const removeBtn = document.createElement('button');
  removeBtn.textContent = 'Remove';
  removeBtn.classList.add('remove-btn');

  removeBtn.addEventListener('click', function(event) {
    event.stopPropagation();
    this.parentElement.remove();
    removeTaskFromLocalStorage(taskValue); // Hapus dari localStorage
  });

  taskText.addEventListener('click', function() {
    li.classList.toggle('completed');
    updateTaskInLocalStorage(taskValue, li.classList.contains('completed'));
  });

  li.appendChild(taskText);
  li.appendChild(removeBtn);

  return li;
}

// Fungsi untuk menyimpan tugas ke localStorage
function saveTaskToLocalStorage(taskValue) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push({ text: taskValue, completed: false });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Fungsi untuk memuat tugas dari localStorage
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach(task => {
    const li = createTaskElement(task.text);
    if (task.completed) {
      li.classList.add('completed');
    }
    taskList.appendChild(li);
  });
}

// Fungsi untuk menghapus tugas dari localStorage
function removeTaskFromLocalStorage(taskValue) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks = tasks.filter(task => task.text !== taskValue);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Fungsi untuk memperbarui status tugas di localStorage
function updateTaskInLocalStorage(taskValue, completed) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const taskToUpdate = tasks.find(task => task.text === taskValue);
  if (taskToUpdate) {
    taskToUpdate.completed = completed;
  }
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Fungsi untuk memfilter tugas
function filterTasks(filter) {
  const tasks = taskList.querySelectorAll('.todo-item');
  tasks.forEach(task => {
    switch (filter) {
      case 'all':
        task.style.display = 'flex';
        break;
      case 'completed':
        task.style.display = task.classList.contains('completed') ? 'flex' : 'none';
        break;
      case 'active':
        task.style.display = !task.classList.contains('completed') ? 'flex' : 'none';
        break;
    }
  });
}

// Event listener untuk filter buttons// Event listener untuk filter buttons
filterButtons.forEach(button => {
  button.addEventListener('click', (event) => {
    const filter = event.target.dataset.filter;

    // Hapus kelas aktif dari semua tombol
    filterButtons.forEach(btn => btn.classList.remove('active'));

    // Tambahkan kelas aktif ke tombol yang dipilih
    event.target.classList.add('active');

    // Filter tasks sesuai dengan filter yang dipilih
    filterTasks(filter);
  });
});


// Event listener untuk input Enter dan submit form
task.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    addTask();
  }
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  addTask();
});
