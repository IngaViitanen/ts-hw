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
    const response = await axios.post(baseUrl + '/todos', todo, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      console.log(response.data)
}

// Mark todo finished or unfinished
export const updateTodo = async (todo: Todo, id: number) => {
    // Send a PATCH-request to update completed state
    const response = await axios.patch(baseUrl + `/todos/${id}`, {
        completed: true
    })

    // console.log(response)
}

export const deleteTodo = async (id: string) => {
        console.log('hej from deleteTodo', id)
        const response = await axios.delete(baseUrl + `/todos/${id}`)
        if(response.status === 200) {
            getTodosAndRender()
        }
        console.log(response)
}