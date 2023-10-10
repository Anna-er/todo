
import { useState } from "react";
import { useEffect } from "react";
import * as React from 'react';


const TODO_LIST_ENDPOINT = 'http://localhost:3000/todos/'


interface item {
    id: number;
    text: string;
    completed: boolean;
}


export const TodoList: React.FC = () => {
    const [todos, setTodos] = useState<item[]>([]);

    const [input, setInput] = useState<string>("");

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
        if (input != "" && input.split(' ').join('') != "") {
            fetch(TODO_LIST_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: input, completed: false })
            }).then(
                response => response.json()
            ).then(
                data => setTodos(todos.concat(data))
            );

            setInput("");
        }
        (document.getElementById("inp") as HTMLInputElement).value = "";
    };


    const handleDelete = (id: number) => {
        fetch(TODO_LIST_ENDPOINT + id.toString(), {
            method: 'DELETE'
        }).then(r => {
            if (r.ok) {
                const newTodos = todos.filter(todo => todo.id !== id);
                console.log(newTodos);
                setTodos(newTodos);
            }
        })
    }



    return (
        <div className="main-container">
            <h1>Todo List</h1>
            <div className="list">
                {todos.map((todo) => (
                    <div className="items"
                        key={todo.id}
                        onClick={() => handleToggle(todo.id)}
                        style={{ textDecoration: todo.completed ? "line-through" : "none", color: todo.completed ? "#8E8E8E" : "#000000" }}
                    >
                        <input type="checkbox" style={{ margin: '0.4rem' }} name="todo" id="item" value={todo.id} checked={todo.completed} readOnly />
                        <label id="item">
                            {todo.text}
                        </label>
                        <button className='remove-button' onClick={() => handleDelete(todo.id)}>×</button>
                    </div>
                ))}
            </div>
            <input className="input-text" type="text" id="inp" placeholder="Add todo item" onChange={(e) => setInput(e.currentTarget.value)} />
            <button onClick={handleClick}>Add</button>
        </div>
    );
}