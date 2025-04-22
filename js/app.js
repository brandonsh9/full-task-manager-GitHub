document.addEventListener('DOMContentLoaded', () => {

    const taskList = document.getElementById('task-list');
    const taskForm = document.getElementById('task-form');
    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description');
    const dueDateInput = document.getElementById('due_date');
    const completedInput = document.getElementById('completed');
    const userIdInput = document.getElementById('user_id');
    const categoryIdInput = document.getElementById('category_id');
    const categoryList = document.getElementById('category-list');
    const categoryForm = document.getElementById('category-form');
    const categoryNameInput = document.getElementById('name');

    let tasks = [];
    let isEditingTask = false;
    let editingTaskId = null;

    let categories = [];
    let isEditingCategory = false;
    let editingCategoryId = null;


    /* ========== TAREAS ========== */
    function renderTasks() {
        taskList.innerHTML = ''; // Limpiamos la lista para evitar duplicados
        const userId = userIdInput.value;
        if (!userId) {
            console.error("No se definió user_id.");
            return;
        }
        fetch('server/task/list.php?user_id=' + userId)
            .then(res => res.json())
            .then(taskArray => {
                console.log("Tareas recibidas:", taskArray);
                tasks = taskArray;
                tasks.forEach(task => {

                    const li = document.createElement('li');

                    if (task.completed) {
                        li.classList.add('task-completed');
                    }

                    const completeCheckbox = document.createElement('input');
                    completeCheckbox.type = 'checkbox';
                    completeCheckbox.checked = task.completed;
                    completeCheckbox.title = "Marcar como completada";
                    completeCheckbox.addEventListener('change', () => {

                        if (completeCheckbox.checked) {
                            li.classList.add('task-completed');
                        } else {
                            li.classList.remove('task-completed');
                        }

                        updateTaskCompletion(task.id, completeCheckbox.checked);
                    });
                    li.insertBefore(completeCheckbox, li.firstChild);

                    const titleSpan = document.createElement('span');
                    titleSpan.textContent = task.title;
                    li.appendChild(titleSpan);

                    const btnDiv = document.createElement('div');

                    const editBtn = document.createElement('button');
                    editBtn.textContent = 'Editar';
                    editBtn.classList.add('edit-btn');
                    editBtn.onclick = () => editTask(task.id);
                    btnDiv.appendChild(editBtn);

                    const deleteBtn = document.createElement('button');
                    deleteBtn.textContent = 'Eliminar';
                    deleteBtn.classList.add('delete-btn');
                    deleteBtn.onclick = () => deleteTask(task.id);
                    btnDiv.appendChild(deleteBtn);

                    li.appendChild(btnDiv);
                    taskList.appendChild(li);
                });
            })
            .catch(err => console.error('Error al cargar tareas:', err));
    }

    function updateTaskCompletion(id, completedStatus) {

        const task = tasks.find(t => t.id === id);
        if (!task) {
            console.error("No se encontró la tarea.");
            return;
        }

        const updatedTaskData = {
            title: task.title,
            description: task.description,
            due_date: task.due_date,
            completed: completedStatus,
            user_id: task.user_id,
            category_id: task.category_id
        };

        fetch('server/task/update.php?id=' + id, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedTaskData)
        })
            .then(res => res.json())
            .then(result => {
                console.log("Respuesta actualización:", result);
                if (result.success) {
                    renderTasks();
                } else {
                    alert(result.error);
                }
            })
            .catch(err => console.error('Error actualizando tarea:', err));
    }

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const taskData = {
            title: titleInput.value,
            description: descriptionInput.value,
            due_date: dueDateInput.value,
            completed: completedInput.checked,
            user_id: userIdInput.value,
            category_id: categoryIdInput.value
        };
        console.log("Datos a enviar:", taskData);

        if (isEditingTask) {

            console.log("Actualizando tarea con ID:", editingTaskId);
            fetch('server/task/update.php?id=' + editingTaskId, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(taskData)
            })
                .then(res => res.json())
                .then(result => {
                    console.log("Respuesta de actualización:", result);
                    if (result.success) {
                        isEditingTask = false;
                        editingTaskId = null;
                        taskForm.querySelector('button[type="submit"]').textContent = 'Enviar';
                        renderTasks();
                        taskForm.reset();
                    } else {
                        alert(result.error);
                    }
                })
                .catch(err => console.error('Error actualizando tarea:', err));
        } else {

            fetch('server/task/create.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(taskData)
            })
                .then(res => res.json())
                .then(result => {
                    console.log("Respuesta de creación:", result);
                    if (result.success) {
                        renderTasks();
                        taskForm.reset();
                    } else {
                        alert(result.error);
                    }
                })
                .catch(err => console.error('Error creando tarea:', err));
        }
    });

    // Función para cargar los datos de una tarea en el formulario para editarla
    function editTask(id) {
        const task = tasks.find(t => t.id === id);
        if (task) {
            console.log("Editando tarea:", task);
            titleInput.value = task.title;
            descriptionInput.value = task.description;
            dueDateInput.value = task.due_date;
            completedInput.checked = task.completed;
            userIdInput.value = task.user_id;
            categoryIdInput.value = task.category_id;
            taskForm.querySelector('button[type="submit"]').textContent = 'Guardar';
            isEditingTask = true;
            editingTaskId = task.id;
        } else {
            console.error("No se encontró la tarea con ID:", id);
        }
    }

    function deleteTask(id) {
        if (confirm('¿Deseas eliminar esta tarea?')) {
            fetch('server/task/delete.php?id=' + id, { method: 'DELETE' })
                .then(res => res.json())
                .then(result => {
                    console.log("Respuesta de eliminación:", result);
                    if (result.success) {
                        renderTasks();
                    } else {
                        alert(result.error);
                    }
                })
                .catch(err => console.error('Error eliminando tarea:', err));
        }
    }
    renderTasks();







    /* ========== CATEGORÍAS ========== */

    function renderCategories() {
        categoryList.innerHTML = '';
        const userId = userIdInput.value.trim();

        if (!userId) {
            console.error("No se definió user_id.");
            return;
        }

        fetch('server/category/list.php?user_id=' + userId)
            .then(res => res.json())
            .then(arr => {
                categories = arr;
                arr.forEach(cat => {
                    const li = document.createElement('li');
                    if (cat.completed) li.classList.add('category-completed');

                    const chk = document.createElement('input');
                    chk.type = 'checkbox';
                    chk.checked = !!cat.completed;
                    chk.title = "Marcar como completada";
                    chk.addEventListener('change', () => {
                        li.classList.toggle('category-completed');
                        updateCategoryCompletion(cat.id, chk.checked);
                    });
                    li.appendChild(chk);

                    const span = document.createElement('span');
                    span.textContent = cat.name;
                    li.appendChild(span);

                    const btnDiv = document.createElement('div');
                    const editBtn = document.createElement('button');
                    editBtn.textContent = 'Editar';
                    editBtn.classList.add('edit-btn');
                    editBtn.onclick = () => loadCategoryIntoForm(cat.id);
                    btnDiv.appendChild(editBtn);

                    const delBtn = document.createElement('button');
                    delBtn.textContent = 'Eliminar';
                    delBtn.classList.add('delete-btn');
                    delBtn.onclick = () => deleteCategory(cat.id);
                    btnDiv.appendChild(delBtn);

                    li.appendChild(btnDiv);
                    categoryList.appendChild(li);
                });
            })
            .catch(err => console.error('Error al cargar categorías:', err));
    }

    // 2) Crear o editar al submit
    categoryForm.addEventListener('submit', e => {
        e.preventDefault();
        const name = categoryNameInput.value.trim();
        const userId = userIdInput.value.trim();
        if (!name || !userId || isNaN(userId) || userId <= 0) {
            return alert('Debe completar nombre y user_id válidos');
        }

        const payload = { name, user_id: Number(userId) };
        if (isEditingCategory) {
            //  EDICIÓN: JSON + PUT
            fetch('server/category/update.php?id=' + editingCategoryId, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
                .then(r => r.json())
                .then(res => {
                    if (res.success) {
                        resetCategoryForm();
                        renderCategories();
                    } else alert(res.error);
                })
                .catch(err => console.error('Error actualizando categoría:', err));

        } else {
            //  CREACIÓN: FormData + POST
            const formData = new FormData(categoryForm);
            fetch('server/category/create.php', {
                method: 'POST',
                body: formData
            })
                .then(r => r.json())
                .then(res => {
                    if (res.success) {
                        // Solo limpio el nombre, dejo el user_id para recarga
                        categoryNameInput.value = '';
                        renderCategories();
                    } else {
                        alert(res.error);
                    }
                })
                .catch(err => console.error('Error creando categoría:', err));
        }
    });

    // 3) Pre cargar formulario para editar
    function loadCategoryIntoForm(id) {

        const cat = categories.find(c => c.id === id);
        if (!cat) return console.error('Categoría no encontrada:', id);
        categoryNameInput.value = cat.name;
        userIdInput.value = cat.user_id;
        categoryForm.querySelector('button[type="submit"]').textContent = 'Guardar';
        isEditingCategory = true;
        editingCategoryId = id;
    }

    function resetCategoryForm() {
        categoryForm.reset();
        categoryForm.querySelector('button[type="submit"]').textContent = 'Crear Categoría';
        isEditingCategory = false;
        editingCategoryId = null;
    }


    function deleteCategory(id) {
        if (!confirm('¿Seguro que deseas eliminar esta categoría?')) return;
        fetch('server/category/delete.php?id=' + id, { method: 'DELETE' })
            .then(r => r.json())
            .then(res => {
                if (res.success) renderCategories();
                else alert(res.error);
            })
            .catch(err => console.error('Error eliminando categoría:', err));
    }

    renderCategories();
});



