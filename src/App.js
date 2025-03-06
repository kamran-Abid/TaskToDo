import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import TodoList from "./TodoList";

function App() {
  return (
    <div
      className="App"
      style={{ backgroundColor: "#ECF0EF", minHeight: "100vh" }}
    >
      <TodoList />
    </div>
  );
}

export default App;
