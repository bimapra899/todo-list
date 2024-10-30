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
// Seleksi elemen dari DOM
const todoForm = document.getElementById("todo-form");
const newTaskInput = document.getElementById("new-task");
const todoList = document.getElementById("todo-list");

// Fungsi untuk mengambil data dari localStorage
const getTodosFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem("todos")) || [];
};

// Fungsi untuk menyimpan data ke localStorage
const saveTodosToLocalStorage = (todos) => {
    localStorage.setItem("todos", JSON.stringify(todos));
};

// Fungsi untuk membuat elemen tugas
const createTodoItem = (task, index) => {
    const li = document.createElement("li");
    li.classList.add("todo-item");
    if (task.completed) {
        li.classList.add("completed");
    }

    li.innerHTML = `
        <div>
            <input type="checkbox" ${task.completed ? "checked" : ""} />
            <span>${task.text}</span>
        </div>
        <button class="remove-btn">Remove</button>
    `;

    // Event listener untuk checkbox (centang tugas)
    li.querySelector('input[type="checkbox"]').addEventListener("change", () => {
        toggleCompleteTask(index);
    });

    // Event listener untuk tombol "Remove" dengan SweetAlert konfirmasi
    li.querySelector(".remove-btn").addEventListener("click", () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                removeTask(index);
                Swal.fire(
                    'Deleted!',
                    'Your task has been deleted.',
                    'success'
                );
            }
        });
    });

    return li;
};

// Fungsi untuk memperbarui tampilan daftar tugas berdasarkan filter
const renderTodos = (filter = 'all') => {
    todoList.innerHTML = ""; // Kosongkan daftar
    const todos = getTodosFromLocalStorage(); // Ambil data dari localStorage
    
    todos.forEach((task, index) => {
        if (filter === 'all' || (filter === 'completed' && task.completed) || (filter === 'active' && !task.completed)) {
            todoList.appendChild(createTodoItem(task, index));
        }
    });
};

// Fungsi untuk menambahkan tugas baru dengan SweetAlert notifikasi
const addTask = (taskText) => {
    const todos = getTodosFromLocalStorage();
    todos.push({ text: taskText, completed: false });
    saveTodosToLocalStorage(todos);
    renderTodos();

    // SweetAlert notifikasi setelah tugas berhasil ditambahkan
    Swal.fire({
        title: 'Task Added!',
        text: `Your task "${taskText}" has been successfully added to the list.`,
        icon: 'success',
        confirmButtonText: 'OK'
    });
};

// Fungsi untuk menandai tugas sebagai selesai atau belum selesai
const toggleCompleteTask = (index) => {
    const todos = getTodosFromLocalStorage();
    todos[index].completed = !todos[index].completed;
    saveTodosToLocalStorage(todos);
    renderTodos(); // Refresh daftar tugas setelah status berubah
};

// Fungsi untuk menghapus tugas
const removeTask = (index) => {
    const todos = getTodosFromLocalStorage();
    todos.splice(index, 1);
    saveTodosToLocalStorage(todos);
    renderTodos();
};

// Event listener untuk form submit (menambahkan tugas)
todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const taskText = newTaskInput.value.trim();
    if (taskText) {
        addTask(taskText);
        newTaskInput.value = ""; // Kosongkan input setelah menambahkan
    }
});

// Event listeners untuk tombol filter
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');
        renderTodos(filter);

        // Tambahkan class active pada tombol yang dipilih
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    });
});

// Render tugas saat halaman dimuat
window.addEventListener("load", () => renderTodos());
