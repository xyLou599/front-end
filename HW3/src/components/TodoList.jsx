import React, { useContext, useState } from "react";
import Store from "../context";
import { TodoHeader } from "./TodoHeader";
import { TodoFooter } from './TodoFooter';

export default function TodoList() {
  const { state, dispatch } = useContext(Store);
  const [todo, setTodo] = useState('');
  const completedState = false;

  const pluralize = count =>
    count === 1 ? ` ${count} item left.` : `${count} items left.`;


  let footer =
    <TodoFooter>
      <span>{pluralize(state.todos.length)}</span>
    </TodoFooter>
  ;

  function toggleAll(event) {
    let newTodos = [];
    for (const todo of state.todos) {
      newTodos.push(dispatch({ type: 'COMPLETE', payload: todo }));
    }
    setTodo(newTodos);
  }

  let main = <section className="main">
  <input
      onChange={toggleAll}
      type="checkbox"
      id="toggle-all"
      className="toggle-all"
    />
  <label htmlFor="toggle-all" />

  <ul className="todo-list">
    {state.todos.map(t => (
      <li
        key={t}
      >
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
          />
          <label>{t}</label>
          <button
          className="destroy"
          onClick={() => dispatch({ type: "COMPLETE", payload: t })}
        />
        </div>

      </li>
    ))}
  </ul>
</section>

  return (
    <div>
    {main}
    {footer}
    </div>
  );
}
