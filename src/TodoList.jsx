import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "./config/firebase";
import Swal from "sweetalert2";

const TodoList = () => {
    const [todos, setTodos] = useState([]);
    const [taskTitle, setTaskTitle] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    const [taskType, setTaskType] = useState("");
    const [editId, setEditId] = useState(null);

    // Fetch todos from Firestore
    const fetchTodos = async () => {
        const querySnapshot = await getDocs(collection(db, "todos"));
        const todosList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        console.log("databse : ", db);
        setTodos(todosList);
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    // Add or Update Todo
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!taskTitle || !taskDescription || !taskType) {
            Swal.fire("Error", "Please fill all fields", "error");
            return;
        }

        const todoData = {
            title: taskTitle,
            description: taskDescription,
            type: taskType,
            createdDate: new Date().toLocaleString(),
        };

        try {
            if (editId) {
                // Update existing todo
                await updateDoc(doc(db, "todos", editId), todoData);
                Swal.fire("Success", "Todo updated successfully", "success");
            } else {
                // Add new todo
                await addDoc(collection(db, "todos"), todoData);
                Swal.fire("Success", "Todo added successfully", "success");
            }
            setTaskTitle("");
            setTaskDescription("");
            setTaskType("");
            setEditId(null);
            fetchTodos();
        } catch (error) {
            Swal.fire("Error", "Something went wrong", "error");
        }
    };

    // Edit Todo
    const handleEdit = (todo) => {
        setTaskTitle(todo.title);
        setTaskDescription(todo.description);
        setTaskType(todo.type);
        setEditId(todo.id);
    };

    // Delete Todo
    const handleDelete = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                await deleteDoc(doc(db, "todos", id));
                Swal.fire("Deleted!", "Your todo has been deleted.", "success");
                fetchTodos();
            }
        });
    };

    return (
        <div className="container">
            <h1>Todo List</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Task Title"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Task Description"
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                />
                <select value={taskType} onChange={(e) => setTaskType(e.target.value)}>
                    <option value="">Select Task Type</option>
                    <option value="Personal">Personal</option>
                    <option value="Work">Work</option>
                    <option value="Other">Other</option>
                </select>
                <button className="btn btn-primary my-3" type="submit">{editId ? "Update" : "Add"} Todo</button>
            </form>
            <table className="todo-table table table-striped table-bordered">
                <thead className="bg-primary text-light">
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Type</th>
                        <th>Created Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {todos.map((todo) => (
                        <tr key={todo.id}>
                            <td>{todo.title}</td>
                            <td>{todo.description}</td>
                            <td>{todo.type}</td>
                            <td>{todo.createdDate}</td>
                            <td className="d-flex m-1">
                                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(todo)}>Edit</button>
                                <button className="btn btn-danger btn-sm me-2" onClick={() => handleDelete(todo.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TodoList;