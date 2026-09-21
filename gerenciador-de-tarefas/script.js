const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");
const taskCounter = document.getElementById("taskCounter");
const emptyMessage = document.getElementById("emptyMessage");
const filterButtons = document.querySelectorAll(".filter");

// Carrega as tarefas salvas no navegador
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";


// Salva as tarefas no navegador
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


// Adiciona uma nova tarefa
function addTask() {
    const text = taskInput.value.trim();

    if (text === "") {
        alert("Digite uma tarefa antes de adicionar.");
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskInput.focus();
}


// Remove uma tarefa
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    renderTasks();
}


// Marca ou desmarca uma tarefa como concluída
function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return {
                ...task,
                completed: !task.completed
            };
        }

        return task;
    });

    saveTasks();
    renderTasks();
}


// Atualiza o contador
function updateCounter() {
    const pendingTasks = tasks.filter(task => !task.completed).length;

    if (pendingTasks === 1) {
        taskCounter.textContent = "1 tarefa pendente";
    } else {
        taskCounter.textContent = `${pendingTasks} tarefas pendentes`;
    }
}


// Mostra as tarefas na tela
function renderTasks() {
    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "pending") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }

    filteredTasks.forEach(task => {
        const li = document.createElement("li");

        li.classList.add("task");

        if (task.completed) {
            li.classList.add("completed");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("check");
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", () => {
            toggleTask(task.id);
        });


        const taskText = document.createElement("span");
        taskText.classList.add("task-text");
        taskText.textContent = task.text;


        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete");
        deleteButton.textContent = "✕";

        deleteButton.addEventListener("click", () => {
            deleteTask(task.id);
        });


        li.appendChild(checkbox);
        li.appendChild(taskText);
        li.appendChild(deleteButton);

        taskList.appendChild(li);
    });

    updateCounter();

    // Controla a mensagem quando não existem tarefas
    if (filteredTasks.length === 0) {
        emptyMessage.style.display = "block";
    } else {
        emptyMessage.style.display = "none";
    }
}


// Botão adicionar
addButton.addEventListener("click", addTask);


// Permite adicionar apertando Enter
taskInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        addTask();
    }
});


// Filtros
filterButtons.forEach(button => {
    button.addEventListener("click", () => {

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        renderTasks();
    });
});


// Mostra as tarefas quando a página abre
renderTasks();