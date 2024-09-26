/**
 * All communication with the backend REST API `json-server’
 */
import axios from "axios";
import type { Todo } from "./api.types";
import { getTodosAndRender } from "./main";

const baseUrl = import.meta.env.VITE_API_BASEURL as string;

// Get todos from API using axios
export const getTodos = async () => {
	const response = await axios.get<Todo[]>(baseUrl + "/todos");
	return response.data;
}

/**
 * Create a new todo in the API
 *
 * @param todo
 */
export const createTodo = async (todo: Todo) => {
	// Send a POST-request to http://localhost:3000/todos with the contents of `todo` as body
    await axios.post(baseUrl + '/todos', todo, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
}

// Mark todo finished or unfinished
export const finishTodo = async (isCompleted: boolean, id: string) => {
    await axios.patch(baseUrl + `/todos/${id}`, {
        completed: isCompleted
    })
}

export const deleteTodo = async (id: string) => {
        const response = await axios.delete(baseUrl + `/todos/${id}`)
        if(response.status === 200) {
            getTodosAndRender()
        }
}