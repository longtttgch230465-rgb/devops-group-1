import { useState, useEffect } from 'react';
import './style.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://40.81.18.199:8080';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  const pendingTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const res = await fetch(`${API_URL}/api/todos`);
    const data = await res.json();
    setTodos(data);
  };

  const addTodo = async () => {
    if (!newTodo.trim()) return;

    await fetch(`${API_URL}/api/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTodo, completed: false })
    });

    setNewTodo('');
    fetchTodos();
  };

  return (
    <div className="page">
      <header className="hero">
        <h1>Todo App</h1>
      </header>

      <main className="content">
        <div className="top-row">
          <h2>Tasks</h2>
          <button onClick={addTodo}> Add Task</button>
        </div>

        <div className="input-row">
          <input
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Enter new task..."
          />
        </div>

        <div className="task-list">
          {pendingTodos.map((todo) => (
            <div className="task-card" key={todo.id}>
              <div className="task-left">
                <span className="checkbox"></span>
                <strong>{todo.title}</strong>
              </div>

              <div className="task-right">
                <span className="status pending">Pending</span>
                <span className="dot yellow"></span>
              </div>
            </div>
          ))}
        </div>

        <h3 className="completed-title">Completed ▲</h3>

        <div className="task-list">
          {completedTodos.map((todo) => (
            <div className="task-card completed" key={todo.id}>
              <div className="task-left">
                <span className="checkbox checked">✓</span>
                <strong className="completed-text">{todo.title}</strong>
              </div>

              <div className="task-right">
                <span className="status done">Done</span>
                <span className="dot green"></span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;