function createTodoElement(todo) {
  if (!todo) return null;

  // find template
  const todoTemplate = document.getElementById('todoTemplate');
  if (!todoTemplate) return null;

  // clone li element
  const todoElement = todoTemplate.content.firstElementChild.cloneNode(true);
  todoElement.dataset.id = todo.id;
  todoElement.dataset.status = todo.status;

  //show todo status
  const divElement = todoElement.querySelector('div.todo');
  if (!divElement) return null;

  const alertClass = todo.status === 'completed' ? 'alert-success' : 'alert-secondary';
  divElement.classList.add(alertClass);

  //update content
  const titleElement = todoElement.querySelector('.todo__title');
  if (titleElement) titleElement.textContent = todo.title;

  //TODO attach event
  const markAsDoneButton = todoElement.querySelector('button.mark-as-done');
  const styleClass = todo.status === 'pending' ? 'btn-success' : 'btn-dark';
  markAsDoneButton.classList.add(styleClass);

  const buttonContent = todo.status === 'pending' ? 'Finish' : 'Reset';
  markAsDoneButton.textContent = buttonContent;

  if (markAsDoneButton) {
    markAsDoneButton.addEventListener('click', () => {
      const currentStatus = todoElement.dataset.status;
      const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';

      const todoList = getTodoList();
      const index = todoList.findIndex((x) => x.id === todo.id);
      if (index >= 0) {
        todoList[index].status = newStatus;
        localStorage.setItem('todo_list', JSON.stringify(todoList));
      }

      todoElement.dataset.status = newStatus;
      const newAlertClass = currentStatus === 'pending' ? 'alert-success' : 'alert-secondary';
      const newStyleClass = currentStatus === 'pending' ? 'btn-dark' : 'btn-success';
      const newContent = currentStatus === 'pending' ? 'Reset' : 'Finish';
      divElement.classList.remove('alert-success', 'alert-secondary');
      divElement.classList.add(newAlertClass);

      markAsDoneButton.textContent = newContent;
      markAsDoneButton.classList.remove('btn-success', 'btn-dark');
      markAsDoneButton.classList.add(newStyleClass);
    });
  }

  const removeButton = todoElement.querySelector('button.remove');
  if (removeButton) {
    removeButton.addEventListener('click', () => {
      const todoList = getTodoList();
      const newTodoList = todoList.filter((x) => x.id !== todo.id);
      localStorage.setItem('todo_list', JSON.stringify(newTodoList));
      todoElement.remove();
    });
  }

  const editButton = todoElement.querySelector('button.edit');
  if (editButton) {
    editButton.addEventListener('click', () => {
      //lated data get localStorage
      const todoList = getTodoList();
      const latestTodo = todoList.find((x) => x.id === todo.id);
      if (!latestTodo) return;
      populateTodoForm(latestTodo);
    });
  }

  return todoElement;
}

function populateTodoForm(todo) {
  //dataset id = todo.id
  const todoForm = document.getElementById('todoFormId');
  if (!todoForm) return;
  todoForm.dataset.id = todo.id;
  const todoInput = document.getElementById('todoText');
  if (!todoInput) return;
  todoInput.value = todo.title;
}

function renderTodoList(todoList, ulElementId) {
  if (!Array.isArray(todoList) || todoList.length === 0) return;

  //find element -> loop through todoList -> each todo, create li element -> append to ul
  const ulElement = document.getElementById(ulElementId);
  if (!ulElement) return;

  for (const todo of todoList) {
    const liElement = createTodoElement(todo);
    ulElement.appendChild(liElement);
  }
}

function getTodoList() {
  try {
    return JSON.parse(localStorage.getItem('todo_list')) || [];
  } catch {
    return [];
  }
}

function handleTodoFormSubmit(event) {
  event.preventDefault();

  const todoForm = document.getElementById('todoFormId');
  if (!todoForm) return;

  //get value
  const todoInput = document.getElementById('todoText');
  if (!todoInput) return;

  // check xem add hay edit mode, form co ton tai dataset khong
  const isEdit = Boolean(todoForm.dataset.id);
  if (isEdit) {
    const todoList = getTodoList();
    const index = todoList.findIndex((x) => x.id.toString() === todoForm.dataset.id);
    if (index < 0) return;
    todoList[index].title = todoInput.value;
    localStorage.setItem('todo_list', JSON.stringify(todoList));
    // thay doi tren DOM
    const liElement = document.querySelector(`ul#todoList > li[data-id="${todoForm.dataset.id}"]`);
    if (liElement) {
      const titleElement = liElement.querySelector('.todo__title');
      if (titleElement) titleElement.textContent = todoInput.value;
    }
  } else {
    const newTodo = { id: Date.now(), title: todoInput.value, status: 'pending' };

    const todoList = getTodoList();
    todoList.push(newTodo);
    localStorage.setItem('todo_list', JSON.stringify(todoList));
    const newLiElement = createTodoElement(newTodo);
    const ulElement = document.getElementById('todoList');
    if (!ulElement) return;
    ulElement.appendChild(newLiElement);
  }

  //reset form
  delete todoForm.dataset.id;
  if (todoForm) todoForm.reset();
  //validate form
  //add localStorage
}

// main
(() => {
  const todoList = getTodoList();

  renderTodoList(todoList, 'todoList');
  //register submit event for todo form
  const todoForm = document.getElementById('todoFormId');
  if (todoForm) {
    todoForm.addEventListener('submit', handleTodoFormSubmit);
  }
})();
