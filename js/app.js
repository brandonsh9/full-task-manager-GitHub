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
        tasks.forEach(
            task => {
                console.log(task)

                const li = document.createElement('li');
                li.innerHTML = 
                '<span>' + task.text + '</span>' +
                '<div>'+
                //forma correcta de margin hacer una clase para ir a css y ponerle el margin
                '<button class="edit-btn" onclick="editTask(' + task.id+')">'+
                'Editar</button>&nbsp'+
                // '<button onclick="editTask(' + task.id+')">'+
                // 'Editar</button>&nbsp'+
                '<button class="delete-btn" onclick="deleteTask(' + task.id+')">'+
                'Eliminar</button>'+
                '</div>';
                taskList.appendChild(li);
            }
        );
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