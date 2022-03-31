import React, { useContext, useState } from 'react';
import Store from '../context';

export default function TodoForm() {
  const { dispatch } = useContext(Store);
  const [todo, setTodo] = useState('');

  function handleTodoChange(e) {
    setTodo(e.target.value);
  }

  function handleTodoAdd() {
    dispatch({ type: 'ADD_TODO', payload: todo });
    setTodo('');
  }

  function handleSubmitForm(event) {
    if (event.keyCode === 13) {
      handleTodoAdd();
    }
  }

  return (
    <header className="header">
      <h1>todos</h1>
      <input
        className="new-todo"
        placeholder="What needs to be done?"
        value={todo}
        autoFocus={true}
        onKeyUp={handleSubmitForm}
        onChange={handleTodoChange}
      />
    </header>
  );
}
