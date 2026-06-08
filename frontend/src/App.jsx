import { useState, useEffect } from 'react';
import './style.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  const fetchTodos = async () => {
    const res = await fetch(`${API_URL}/api/todos`);
    const data = await res.json();
    setTodos(data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const pendingTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);

  const addTodo = async () => {
    if (!newTodo.trim()) return;

    await fetch(`${API_URL}/api/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTodo.trim(), completed: false })
    });

    setNewTodo('');
    fetchTodos();
  };

  const toggleTodo = (id) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
  };

  const saveTodos = async () => {
    await Promise.all(
      todos.map((todo) =>
        fetch(`${API_URL}/api/todos/${todo.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: todo.title,
            completed: todo.completed
          })
        })
      )
    );

    await fetchTodos();
    alert('Saved to database!');
  };

  const renderTodo = (todo) => (
    <div className={`task-card ${todo.completed ? 'completed' : ''}`} key={todo.id}>
      <div className="task-left">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => toggleTodo(todo.id)}
          className="todo-checkbox"
        />

        <strong className={todo.completed ? 'completed-text' : ''}>
          {todo.title}
        </strong>
      </div>

      <div className="task-right">
        <span className={todo.completed ? 'status done' : 'status pending'}>
          {todo.completed ? 'Done' : 'Pending'}
        </span>
        <span className={todo.completed ? 'dot green' : 'dot yellow'}></span>
      </div>
    </div>
  );

  return (
    <div className="page">
      <header className="hero">
        <h1>Todo App</h1>
      </header>

      <main className="content">
        <div className="top-row">
          <h2>Tasks</h2>
          <div className="button-group">
            <button onClick={addTodo}>Add Task</button>
            <button onClick={saveTodos}>Save</button>
          </div>
        </div>

        <div className="input-row">
          <input
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Enter new task..."
          />
        </div>

        <div className="task-list">
          {pendingTodos.map((todo) => renderTodo(todo))}
        </div>

        <h3 className="completed-title">Completed</h3>

        <div className="task-list">
          {completedTodos.map((todo) => renderTodo(todo))}
        </div>
      </main>
    </div>
  );
}

export default App;