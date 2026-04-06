import axios from "axios";
import React, { useState } from "react";
import "../App.css";
import { MoonLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import useStore from "./UseStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const Home = () => {
  const { userData } = useStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [addTodoTitle, setAddTodoTitle] = useState("");
  const [addPopup, setAddPopup] = useState(false);
  const [view, setView] = useState(false);
  const [editTodo, setEditTodo] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");

  const {
    data: querydata,
    isPending,
    error,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const { data } = await axios.get(
        "https://jsonplaceholder.typicode.com/todos",
      );
      return data;
    },
    staleTime: 10000,
  });
  // function fetchData() {
  //   setTimeout(async () => {}, 1000);
  // }

  // useEffect(() => {
  //   fetchData();
  // }, []);
  const addTodoMutation = useMutation({
    mutationFn: (newTodo) =>
      axios.post("https://jsonplaceholder.typicode.com/todos", newTodo),
    onSuccess: (res) => {
      queryClient.setQueryData(["todos"], (old) => [...old, res.data]);
    },
  });
  function handleAddTodo() {
    addTodoMutation.mutate({ title: addTodoTitle });
    setAddPopup(false);
    setAddTodoTitle("");
  }

  function handleLogout() {
    const updatedUsers = userData.map((u) => ({ ...u, isLoggedIn: false }));
    useStore.setState({ userData: updatedUsers });

    // const fetchUser = JSON.parse(localStorage.getItem("formData"));
    // const updated = fetchUser.map((u) => ({ ...u, isLoggedIn: false }));
    // localStorage.setItem("formData", JSON.stringify(updated));
    // console.log(updated, "yahya");
    // localStorage.setItem("formData", JSON.stringify(updated));
    navigate("/");
  }

  const deleteTodoMutation = useMutation({
    mutationFn: (id) =>
      axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`),
    onSuccess: (res, id) => {
      // console.log(res);
      queryClient.setQueryData(["todos"], (old) =>
        old.filter((item) => item.id !== id),
      );
    },
  });
  function handleDelete(id) {
    deleteTodoMutation.mutate(id);
  }

  const editTodoMutation = useMutation({
    mutationFn: ({ id, title }) =>
      axios.put(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        title,
      }),
    onSuccess: (res, variables) => {
      const { id, title } = variables;

      queryClient.setQueryData(["todos"], (old) =>
        old.map((item) => (item.id === id ? { ...item, title } : item)),
      );
    },
  });

  function handleEditTodo() {
    editTodoMutation.mutate({
      id: selectedId,
      title: editTodo,
    });
    setView(false);
    setEditTodo("");

    // await axios.put(`https://jsonplaceholder.typicode.com/todos/${id}`, {
    //   title: editTodo,
    // });
    // const updatedItem = data.map((item) =>
    //   item.id === id ? { ...item, title: editTodo } : item,
    // );
    // useStore.setState({ userData: updatedItem });
    // setData(updatedItem);
  }

  const filteredData = querydata?.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()),
  );
  if (isPending)
    return (
      <div
        style={{
          height: "100vh",
          width: "100vw",
          background: "#0f172a",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px",
        }}
      >
        <MoonLoader
          color="#a5b4fc"
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  if (error) return <span>Oops!</span>;
  return (
    <>
      <div className="dashboard">
        <input
          name="search"
          className="search-input"
          type="text"
          placeholder="search a todo item..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="card">
          <h1 className="title">Todo Manager</h1>
          <div className="buttons">
            <button className="btn-glass" onClick={handleLogout}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Logout
            </button>
            <button className="btn-glass" onClick={() => setAddPopup(true)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Todo
            </button>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData?.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td className="task">{item.title}</td>
                  <td>
                    <span
                      className={
                        item.completed ? "badge done" : "badge pending"
                      }
                    >
                      {item.completed ? "Completed" : "Pending"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="action view"
                      onClick={() => {
                        setView(true);
                        setEditTodo(item.title);
                        setSelectedId(item.id);
                      }}
                    >
                      View
                    </button>
                    <button
                      className="action delete"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {addPopup && (
          <div className="popup-overlay">
            <div className="popup-glow popup-glow--top" />
            <div className="popup-glow popup-glow--bottom" />

            <div className="popup-card">
              <div className="popup-header">
                <div>
                  <h2 className="popup-title">Add a Todo</h2>
                  <p className="popup-subtitle">
                    Enter a new todo below to continue.
                  </p>
                </div>
                <button
                  className="popup-close"
                  onClick={() => setAddPopup(false)}
                >
                  ✕
                </button>
              </div>

              <div className="input-group">
                <svg
                  className="input-icon"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#a5b4fc"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
                <input
                  type="text"
                  placeholder="Enter name... "
                  onChange={(e) => setAddTodoTitle(e.target.value)}
                  value={addTodoTitle}
                />
              </div>

              <div className="popup-actions">
                <button
                  className="btn btn--cancel"
                  onClick={() => setAddPopup(false)}
                >
                  Cancel
                </button>
                <button className="btn btn--confirm" onClick={handleAddTodo}>
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
        {view && (
          <div className="popup-overlay">
            <div className="popup-glow popup-glow--top" />
            <div className="popup-glow popup-glow--bottom" />

            <div className="popup-card">
              <div className="popup-header">
                <div>
                  <h2 className="popup-title">Edit a Todo NO #{selectedId} </h2>
                  <p className="popup-subtitle">
                    Enter a new title below to continue.
                  </p>
                </div>
                <button className="popup-close" onClick={() => setView(false)}>
                  ✕
                </button>
              </div>

              <div className="input-group">
                <svg
                  className="input-icon"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#a5b4fc"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
                <input
                  type="text"
                  placeholder="Enter name... "
                  onChange={(e) => setEditTodo(e.target.value)}
                  value={editTodo}
                />
              </div>

              <div className="popup-actions">
                <button
                  className="btn btn--cancel"
                  onClick={() => setView(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn--confirm"
                  onClick={() => handleEditTodo(selectedId)}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
