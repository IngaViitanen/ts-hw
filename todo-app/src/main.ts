import './style.css'
import { getTodos, createTodo, deleteTodo, updateTodo } from "./api.ts";
import type { Todo } from "./api.types.ts";
import { AxiosError } from 'axios';

// Get referenses
const todosEl = document.querySelector<HTMLUListElement>("#todos")!;
const newTodoFormEl = document.querySelector<HTMLFormElement>("#new-todo-form")!;

// Local variable containing all the todos from the server
let todos: Todo[] = [];

const handleError = (err: unknown) => {
	if (err instanceof AxiosError) {
		alert("Network error, response code was: " + err.message);

	} else if (err instanceof Error) {
		alert("Something went wrong: " + err.message);

	} else {
		alert("Someone caused an error that should never have happend 😱");
	}
}

// Get todos from API and render them
export const getTodosAndRender = async () => {
  // Get todos from server and update local copy
  todos = await getTodos();

  renderTodos();
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
					<button class="edit" id="editBtn" data-action="edit">✏️</button>
					<button class="delete" id="deleteBtn" data-action="delete">❌</button>
				</span>
			</li>`
    })
    .join("")
}


// checkbox
todosEl.addEventListener('click', async (e) => {
  // get event target and type it as HTMLElement
  const target = e.target as HTMLElement;

 
	if (target.tagName === "INPUT") {
		// Toggle todo

		// Find the todo id
		const clickedTodoId = target.closest("li")?.dataset.todoId as string;

		// Find the todo with the correct ID
		const todo = todos.find(todo => todo.id === clickedTodoId);
		if (!todo) {
			return;
		}

		try {
			// Update todo
			await updateTodo(clickedTodoId, {
				completed: !todo.completed,
			});

			// Get todos from API (which will include the newly created todo) and re-render the list
			getTodosAndRender();

		} catch (err) {
			handleError(err);
		}

	} else if (target.dataset.action === "delete") {
		
		// Find the todo id
		const clickedTodoId = target.closest("li")?.dataset.todoId as string;

		try {
			// Delete todo
			await deleteTodo(clickedTodoId);

			// Get todos from API (which will include the newly created todo) and re-render the list
			getTodosAndRender();

		} catch (err) {
			handleError(err);
		}

	} else if (target.dataset.action === "edit") {
		// Edit todo

		// Find the todo id
		const clickedTodoId = target.closest("li")?.dataset.todoId as string;

		// Find the todo with the correct ID
		const todo = todos.find(todo => todo.id === clickedTodoId);
		if (!todo) {
			return;
		}

		// Ask user about new title
		const title = prompt("What's the new title?", todo.title);
		if (!title) {
			return;
		}

		try {
			await updateTodo(clickedTodoId, {
				title,
			});

			// Get todos from API (which will include the newly created todo) and re-render the list
			getTodosAndRender();

		} catch (err) {
			handleError(err);
		}
	}

})


//Listen for new todo form being submitted
newTodoFormEl.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newTodoTitleEl = document.querySelector<HTMLInputElement>("#new-todo-title")!;

  const todo = {
    title: newTodoTitleEl.value,
    completed: false
  }

  // Create the todo in the API (and wait for the request to be completed)
  await createTodo(todo)

  // Get todos from API (which will include the newly created todo) and re-render the list
  getTodosAndRender();

  // Clear input field
  newTodoTitleEl.value = "";
});


// Get the todos from the API and *then* render initial list of todos
getTodosAndRender();
