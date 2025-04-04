// document.addEventListener('DOMContentLoaded', function() {
//     console.log('DOM loaded');
// }); ()=>{es una función directamente} 
document.addEventListener('DOMContentLoaded', () =>  {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    
    let tasks = [];
    let isEditing = false;
    let EditingId = null;

    taskForm.addEventListener('click', (e) => {
        var vti = taskInput.value.trim();
        if (vti !== '') {
            if (isEditing) {
                tasks = tasks.map(task => 
                    task.id === EditingId ? {
                        ...task, text: vti
                    }: task);
                
                isEditing = false;
                EditingId = null;
                taskForm.innerText = 'Agregar';
            } 
            else {
            const task = {
                id: Date.now(),
                text: vti,
                completed: false
            };
            tasks.push(task);
            console.log(tasks);
            }
            renderTasks();
            taskInput.value = '';
        }
    });
    
    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = task.completed ? 'completed' : '';

            // Crear el checkbox
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.completed;
            checkbox.addEventListener('change', () => {
                task.completed = checkbox.checked;
                renderTasks();
            });

            // Crear el texto de la tarea
            const span = document.createElement('span');
            span.textContent = task.text;

            // Crear los botones
            const buttons = document.createElement('div');
            buttons.className = task.completed ? 'hidden' : 'task-buttons';

            const editButton = document.createElement('button');
            editButton.textContent = 'Editar';
            editButton.className = 'edit-btn';
            editButton.addEventListener('click', () => editTask(task.id));

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.className = 'delete-btn';
            deleteButton.addEventListener('click', () => deleteTask(task.id));

            buttons.appendChild(editButton);
            buttons.appendChild(deleteButton);

            // Ensamblar elementos
            li.appendChild(checkbox);
            li.appendChild(span);
            li.appendChild(buttons);
            taskList.appendChild(li);
        });
    }

    window.deleteTask = function(id) {
        tasks = tasks.filter(task => task.id !== id);
        renderTasks();
    }
    window.editTask = function(id) {
        console.log(id);
        const et = tasks.find(t => t.id === id);
        if (et) {
            taskInput.value = et.text;
            taskForm.innerText = 'Guardar';
            isEditing = true
            EditingId = et.id;
        }
    }

});