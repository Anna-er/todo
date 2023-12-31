import { useState, useEffect, FC } from 'react';


const TODO_LIST_ENDPOINT = 'http://localhost:8000/todos/'


interface item {
    id: number;
    text: string;
    completed: boolean;
}


export const TodoList: React.FC = () => {
    const [todos, setTodos] = useState<item[]>([]);

    const [newTodoText, setNewTodoText] = useState("");

    useEffect(() => {
        fetch(TODO_LIST_ENDPOINT)
            .then(res => {
                return res.json()
            })
            .then(data => {
                setTodos(data);
            })
    }, []);

    const handleToggle = (id: number) => {
        setTodos(
            todos.map((todo) => {
                if (todo.id === id) {
                    const updatedTodo = { ...todo, completed: !todo.completed };
                    fetch(TODO_LIST_ENDPOINT + id.toString(), {
                        method: 'PATCH',
                        body: JSON.stringify(updatedTodo),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    return updatedTodo;
                }
                return todo;
            })
        );
    };


    const handleClick = () => {
        if (newTodoText.trim() !== "") {
            fetch(TODO_LIST_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: newTodoText, completed: false })
            }).then(
                response => response.json()
            ).then(
                data => setTodos(todos.concat(data))
            );

            setNewTodoText("");
        }
    };


    const handleDelete = (id: number) => {
        fetch(`${TODO_LIST_ENDPOINT}/${id}`, {
            method: 'DELETE'
        }).then(r => {
            if (r.ok) {
                const newTodos = todos.filter(todo => todo.id !== id);
                setTodos(newTodos);
            }
        })
    }



    return (
        <div className="main-container">
            <h1>Todo List</h1>
            <div className="list">
                {todos.map((todo) => (
                    <div className="item"
                        key={todo.id}
                        style={{ textDecoration: todo.completed ? "line-through" : "none", color: todo.completed ? "#8E8E8E" : "#000000" }}
                    >
                        <input type="checkbox" onClick={() => handleToggle(todo.id)} className='checkbox' name="todo" id={todo.id.toString()} checked={todo.completed} readOnly />
                        <label htmlFor={todo.id.toString()}>
                            {todo.text}
                        </label>
                        <button className='remove-button' onClick={() => handleDelete(todo.id)}>×</button>
                    </div>
                ))}
            </div>
            <input className="input-text" type="text" value={newTodoText} placeholder="Add todo item" onChange={(e) => setNewTodoText(e.currentTarget.value)} />
            <button onClick={handleClick}>Add</button>
        </div>
    );
}
