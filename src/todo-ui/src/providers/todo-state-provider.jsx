import {createContext, useCallback, useContext, useMemo, useState} from "react";
import {pages} from "../pages";
import {getBaseUrl} from "../api";

const TodoStateContext = createContext(undefined);

export const useTodoState = () => {
    const context = useContext(TodoStateContext);
    if (context === undefined)
        throw Error("Cannot use useTodoState outside of TodoStateProvider")

    return context;
}

const fetchTodos = async (jwt) => {
    const res = await fetch(`${getBaseUrl()}/todos`, {
        headers: {
            Authorization: `Bearer ${jwt}`
        },
        method: "GET"
    })
    if (!res.ok)
        return [];

    return await res.json();
}

const fetchUsers = async (jwt) => {
    const res = await fetch(`${getBaseUrl()}/users`, {
        headers: {
            Authorization: `Bearer ${jwt}`
        },
        method: "GET"
    })
    if (!res.ok)
        return [];

    return await res.json();
}

export const TodoStateProvider = ({children}) => {
    const [editTodo, setEditTodo] = useState(null);
    const [user, setUser] = useState(null);
    const [jwt, setJwt] = useState(null);
    const [todos, setTodos] = useState([]);
    const [currentPage, setCurrentPage] = useState(pages.main);
    const [editMode, setEditMode] = useState("create");
    const [users, setUsers] = useState([]);

    const openEdit = useCallback((todo) => {
        setEditTodo(todo);
        setEditMode("update")
        setCurrentPage(pages.edit)
    }, []);
    const openCreate = useCallback((isCompleted = false) => {
        setEditTodo({
            content: "",
            isCompleted: isCompleted,
            priority: 0,
            sharedWith: []
        });
        setEditMode("create")
        setCurrentPage(pages.edit)
    }, [])
    const loadUsers = useCallback((jwt) => {
        const load = async () => {
            setUsers(await fetchUsers(jwt));
        }

        // noinspection JSIgnoredPromiseFromCall
        load()
    }, [])
    const loadTodosInternal = useCallback((jwt) => {
        const load = async () => {
            setTodos(await fetchTodos(jwt));
        }

        // noinspection JSIgnoredPromiseFromCall
        load()
    }, [])
    const loadTodos = useCallback(() => {
        loadTodosInternal(jwt)
    }, [jwt, loadTodosInternal]);


    const onLogin = useCallback((username, password) => {
        const login = async () => {
            const res = await fetch(`${getBaseUrl()}/authenticate/login`, {
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    password
                }),
                method: "POST",
            });
            if (!res.ok)
                return;

            const body = await res.json();
            setJwt(body.token);
            setUser(body.user)
            loadTodosInternal(body.token)
            loadUsers(body.token);
            setCurrentPage(pages.main)
        }

        // noinspection JSIgnoredPromiseFromCall
        login()
    }, [loadTodosInternal, loadUsers]);

    const onRegister = useCallback((username, password, email, firstName, lastName) => {
        const register = async () => {
            const res = await fetch(`${getBaseUrl()}/authenticate/register`, {
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    password,
                    email,
                    firstName,
                    lastName
                }),
                method: "POST",
            });
            if (!res.ok)
                return;

            setCurrentPage(pages.login)
        }

        // noinspection JSIgnoredPromiseFromCall
        register()
    }, []);

    const deleteTodo = useCallback((id) => {
        const deleteTodo = async () => {
            const res = await fetch(`${getBaseUrl()}/todos/${id}`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                    "Content-Type": "application/json"
                },
                method: "DELETE",
            });
            if (!res.ok)
                return;

            setEditTodo(null);
            setCurrentPage(pages.main)
            loadTodos();
        }

        // noinspection JSIgnoredPromiseFromCall
        deleteTodo()
    }, [jwt, loadTodos]);

    const createTodo = useCallback((todo) => {
        const createTodo = async () => {
            const res = await fetch(`${getBaseUrl()}/todos`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(todo),
                method: "POST",
            });
            if (!res.ok)
                return;

            setEditTodo(null);
            setCurrentPage(pages.main)
            loadTodos();
        }

        // noinspection JSIgnoredPromiseFromCall
        createTodo()
    }, [jwt, loadTodos]);

    const updateTodo = useCallback((todo) => {
        const update = async () => {
            const res = await fetch(`${getBaseUrl()}/todos`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: todo.id,
                    content: todo.content,
                    isCompleted: todo.isCompleted,
                    sharedWith: todo.sharedWith,
                    priority: todo.priority
                }),
                method: "PUT",
            });
            if (!res.ok)
                return;

            setEditTodo(null);
            setCurrentPage(pages.main)
            loadTodos();
        }

        // noinspection JSIgnoredPromiseFromCall
        update()
    }, [jwt, loadTodos]);


    const state = useMemo(() => ({
        onLogin,
        onRegister,
        user,
        jwt,
        todos,
        loadTodos,
        currentPage,
        setCurrentPage,
        openEdit,
        editTodo,
        setEditTodo,
        openCreate,
        editMode,
        createTodo,
        updateTodo,
        users,
        deleteTodo
    }), [createTodo, currentPage, deleteTodo, editMode, editTodo, jwt, loadTodos, onLogin, onRegister, openCreate, openEdit, todos, updateTodo, user, users])

    return <TodoStateContext.Provider value={state}>
        {children}
    </TodoStateContext.Provider>
}

export const useQuery = (query) => {
    const [response, setResponse] = useState(null);
    const [body, setBody] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [error, setError] = useState();

    const execute = useCallback(() => {
        const internalExec = async () => {
            try {
                const res = await query();

                if (!res.ok) {
                    try {
                        const body = await res.json();
                        setError(body);
                        setHasError(true);
                    } catch {
                        setError(await res.text());
                        setHasError(true);
                    } finally {
                        setResponse(res)
                    }
                    return;
                }

                const body = await res.json();
                setResponse(res)
                setBody(body);
                setError(null);
                setHasError(false);
            } catch (e) {
                setError(e);
                setHasError(true);
            }
        }

        setIsLoading(true)
        // noinspection JSIgnoredPromiseFromCall
        internalExec();
        setIsLoading(false)
    }, [query])

    return useMemo(() => ({
        response,
        body,
        isLoading,
        error,
        hasError,
        execute,
    }), [body, error, execute, hasError, isLoading, response]);
}