document.addEventListener("DOMContentLoaded", loadTasks);

const titleInput = document.getElementById("taskTitle");
const descInput = document.getElementById("taskDesc");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const darkToggle = document.getElementById("darkModeToggle");

// ADD TASK
addBtn.addEventListener("click", () => {
    if (titleInput.value.trim() === "") return alert("Task title is required!");

    const now = new Date();
    const time = now.toLocaleString();

    createTaskElement(titleInput.value, descInput.value, time, false);
    saveTask(titleInput.value, descInput.value, time);

    titleInput.value = "";
    descInput.value = "";
});

// CREATE TASK ELEMENT
function createTaskElement(title, desc, time, completed = false) {
    const li = document.createElement("li");
    if (completed) li.classList.add("completed");

    li.innerHTML = `
        <div>
            <div class="task-title">${title}</div>
            <div class="task-desc">${desc}</div>
            <div class="time-added">Added: ${time}</div>
        </div>

        <div class="actions">
            <button class="complete-btn">✔</button>
            <button class="edit-btn">✎</button>
            <button class="del-btn">🗑</button>
        </div>
    `;

    // COMPLETE
    li.querySelector(".complete-btn").addEventListener("click", () => {
        li.classList.toggle("completed");
        updateStorage();
    });

    // DELETE
    li.querySelector(".del-btn").addEventListener("click", () => {
        li.remove();
        updateStorage();
    });

    // EDIT
    li.querySelector(".edit-btn").addEventListener("click", () => {
        let newTitle = prompt("Edit title:", title);
        let newDesc = prompt("Edit description:", desc);

        if (newTitle) li.querySelector(".task-title").innerText = newTitle;
        if (newDesc) li.querySelector(".task-desc").innerText = newDesc;

        updateStorage();
    });

    list.appendChild(li);
}

// SAVE TASK TO LOCALSTORAGE
function saveTask(title, desc, time) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push({ title, desc, time, completed: false });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// LOAD TASKS
function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks.forEach(t => {
        createTaskElement(t.title, t.desc, t.time, t.completed);
    });
}

// UPDATE STORAGE AFTER EDIT/DELETE/COMPLETE
function updateStorage() {
    const allTasks = [];

    document.querySelectorAll("#taskList li").forEach(li => {
        allTasks.push({
            title: li.querySelector(".task-title").innerText,
            desc: li.querySelector(".task-desc").innerText,
            time: li.querySelector(".time-added").innerText.replace("Added: ", ""),
            completed: li.classList.contains("completed")
        });
    });

    localStorage.setItem("tasks", JSON.stringify(allTasks));
}

// SEARCH FEATURE
searchInput.addEventListener("keyup", () => {
    const filter = searchInput.value.toLowerCase();

    document.querySelectorAll("#taskList li").forEach(li => {
        const title = li.querySelector(".task-title").innerText.toLowerCase();
        if (title.includes(filter)) {
            li.style.display = "block";
        } else {
            li.style.display = "none";
        }
    });
});

// DARK MODE
darkToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
});
