import './style.css'
import { getTodos, createTodo, finishTodo, deleteTodo, editTodo } from "./api.ts";
import type { Todo } from "./api.types.ts";

// Get referenses
const todosEl = document.querySelector<HTMLUListElement>("#todos")!;
const newTodoFormEl = document.querySelector<HTMLFormElement>("#new-todo-form")!;

// Local variable containing all the todos from the server
let todos: Todo[] = [];

// Get todos from API and render them
export const getTodosAndRender = async () => {
  // Get todos from server and update local copy
  todos = await getTodos();

  // Render them todos
  renderTodos();

  //Attach onclick/onchange actions to rendered todos
  deleteTask()
  checkboxTodo()
  editTodoTitle()
}

//Render todos to DOM
const renderTodos = () => {
  todosEl.innerHTML = todos
    .map((todo) => {
      return `<li class="list-group-item d-flex justify-content-between align-items-center" id="list" data-todo-id="${todo.id}">
				<span class="todo-item">
          <input type="checkbox" id="checkbox" class="me-2" ${todo.completed ? "checked" : ""}  />
          <span class="todo-title ${todo.completed ? " finished" : ""}">${todo.title}</span>
				</span>
				<span class="todo-actions">
					<button class="edit" id="editBtn">✏️</button>
					<button class="delete" id="deleteBtn">❌</button>
				</span>
			</li>`
    })
    .join("")
}



//Listen for new todo form being submitted
newTodoFormEl.addEventListener("submit", (e) => {
  e.preventDefault();

  const newTodoTitleEl = document.querySelector<HTMLInputElement>("#new-todo-title")!;

  const todo = {
    id: Math.random().toString(), //installing uuid feels like overkill for this project
    title: newTodoTitleEl.value,
    completed: false
  }

  // Create the todo in the API (and wait for the request to be completed)
  createTodo(todo)

  // Get todos from API (which will include the newly created todo) and re-render the list
  getTodosAndRender();

  // Clear input field
  newTodoTitleEl.value = "";

  console.log("GREAT SUCCESS!", todos);
});



const deleteTask = () => {
   // Get to all delete button elements
   const deleteBtn = document.querySelectorAll<HTMLButtonElement>("#deleteBtn")

   // Loop over each delete button and add click event to each btn
   deleteBtn.forEach(btn => btn.addEventListener("click", () => {
     // get data set from parent list element
     const id = btn.parentElement?.parentElement?.getAttribute('data-todo-id')

     //since the ul list can be empty we need to check that the id exists and is a string::Type Narrowing
     if(id) {
       deleteTodo(id)
     }
    }))
}



const checkboxTodo = () => {
  const checkbox = document.querySelectorAll<HTMLInputElement>("#checkbox")

  checkbox.forEach(box => box.addEventListener("change", () => {
    const id = box.parentElement?.parentElement?.getAttribute('data-todo-id')

    if(id){
      finishTodo(box.checked, id)
    }
  }))
}



// edit todo
const editTodoTitle = () => {
  const editBtn = document.querySelectorAll<HTMLButtonElement>("#editBtn")

  editBtn.forEach(btn => btn.addEventListener('click', () => {
    // e.preventDefault()
    const id = btn.parentElement?.parentElement?.getAttribute('data-todo-id')!
    console.log('click',  id)

    const editTodoForm = document.querySelector<HTMLFormElement>("#edit-todo-form")!
    const editModal = document.querySelector<HTMLDivElement>("#edit-modal")!
    const editInput = document.querySelector<HTMLInputElement>("#edit-todo")!

    //FIX: patch behaves weird with the id

    // if(id){
      todos.find((todo) => {
        if(todo.id === id){
          console.log(todo.id, id)
          // editTodoForm.style.display = "flex"
          editModal.style.display = "block"
          editInput.value = todo.title
          editTodoForm.addEventListener("submit", (e) => {
            // e.preventDefault() reloading resets the id but mm idk

            editTodo(editInput.value, id)
            // editTodoForm.style.display = "none"
            editModal.style.display = "none"
            editTodoForm.
            console.log(id)
            // id = ""
          })
        }
      })
     
    // }
  }));
}

// Get the todos from the API and *then* render initial list of todos
getTodosAndRender();
