import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TodoApp from "./components/TodoApp";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TodoApp />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
