import React, { useContext, useReducer } from 'react';
import ReactDOM from 'react-dom';

import Store from './context';
import reducer from './reducer';

import { usePersistedContext, usePersistedReducer } from './usePersist';

import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';

import './App.css';

function App() {
  const globalStore = usePersistedContext(useContext(Store), 'state');

  const [state, dispatch] = usePersistedReducer(
    useReducer(reducer, globalStore),
    'state',
  );

  return (
    <Store.Provider value={{ state, dispatch }}>
      <div className="todoapp">
        <TodoForm />
        <TodoList />
      </div>
    </Store.Provider>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
