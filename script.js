document.addEventListener('DOMContentLoaded', function () {
    const columns = document.querySelectorAll('.column');
    const dropSound = document.getElementById('drop-sound');
    const themeToggleBtn = document.getElementById('theme-toggle');

    loadTasks();
    applyTheme();

    columns.forEach(column => {
        column.addEventListener('dragover', dragOver);
        column.addEventListener('drop', drop);
        column.querySelector('.add-task-btn').addEventListener('click', function () {
            addTask(column);
        });
    });

    themeToggleBtn.addEventListener('click', toggleTheme);

    function createTaskElement(id, content) {
        const task = document.createElement('div');
        task.classList.add('task');
        task.draggable = true;
        task.id = id;

        const taskContent = document.createElement('div');
        taskContent.classList.add('task-content');
        taskContent.textContent = content;

        const editInput = document.createElement('input');
        editInput.classList.add('edit-input', 'hide');
        editInput.type = 'text';
        editInput.value = content;

        const taskButtons = document.createElement('div');
        taskButtons.classList.add('task-buttons');

        const editBtn = document.createElement('button');
        editBtn.classList.add('edit-btn');
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';

        editBtn.addEventListener('click', function () {
            editInput.classList.toggle('hide');
            taskContent.classList.toggle('hide');
            editInput.focus();
        });

        editInput.addEventListener('blur', function () {
            const newContent = editInput.value;
            taskContent.textContent = newContent;
            taskContent.classList.remove('hide');
            editInput.classList.add('hide');
            saveTasks();
        });

        deleteBtn.addEventListener('click', function () {
            task.remove();
            saveTasks();
        });

        taskButtons.appendChild(editBtn);
        taskButtons.appendChild(deleteBtn);
        task.appendChild(taskContent);
        task.appendChild(editInput);
        task.appendChild(taskButtons);

        task.addEventListener('dragstart', dragStart);
        task.addEventListener('dragend', dragEnd);

        return task;
    }

    function addTask(column) {
        const id = `task${Date.now()}`;
        const task = createTaskElement(id, 'New Task');
        column.appendChild(task);
        saveTasks();
    }

    function dragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.id);
        setTimeout(() => {
            e.target.classList.add('hide');
        }, 0);
    }

    function dragEnd(e) {
        e.target.classList.remove('hide');
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function drop(e) {
        e.preventDefault();
        const id = e.dataTransfer.getData('text/plain');
        const draggable = document.getElementById(id);
        e.target.closest('.column').appendChild(draggable);
        dropSound.play();
        saveTasks();
    }

    function saveTasks() {
        const tasks = {};
        columns.forEach(column => {
            tasks[column.id] = [];
            column.querySelectorAll('.task').forEach(task => {
                tasks[column.id].push({
                    id: task.id,
                    content: task.querySelector('.task-content').textContent
                });
            });
        });
        localStorage.setItem('kanbanTasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('kanbanTasks')) || {};
        for (const columnId in tasks) {
            const column = document.getElementById(columnId);
            tasks[columnId].forEach(taskData => {
                const task = createTaskElement(taskData.id, taskData.content);
                column.appendChild(task);
            });
        }
    }

    function toggleTheme() {
        document.body.classList.toggle('dark-mode');
        document.body.classList.toggle('light-mode');
        saveTheme();
    }

    function saveTheme() {
        const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('kanbanTheme', theme);
    }

    function applyTheme() {
        const theme = localStorage.getItem('kanbanTheme') || 'light';
        document.body.classList.add(theme + '-mode');
    }
});
