import {initializeIcons, mergeStyleSets} from "@fluentui/react";
import {useCallback, useMemo} from "react";
import NavBar from "./components/nav-bar";
import {pages} from "./pages";
import WelcomePage from "./components/pages/welcome-page";
import PageRenderer from "./components/pages/page-renderer";
import LoginPage from "./components/pages/login-page";
import {useTodoState} from "./providers/todo-state-provider";
import RegisterPage from "./components/pages/register-page";
import HomePage from "./components/pages/home-page";
import EditPage from "./components/pages/edit-page";

initializeIcons();

function App() {
    const styles = useMemo(() => mergeStyleSets({
        root: {
            width: "100%",
            display: "grid",
            girdTemplateColumns: "1fr",
            girdTemplateRows: "max-content 1fr",
        }
    }), []);
    const {currentPage, user, editMode} = useTodoState();
    const isLoggedIn = useMemo(() => user !== null, [user])

    const title = useMemo(() => {
        switch (currentPage) {
            case pages.main:
                return "Welcome to the Todo App"
            case pages.login:
                return "Login"
            case pages.register:
                return "Create Account";
            case pages.edit:
                return editMode === "create" ? "Create Todo" : "Edit Todo";
            default:
                return "Page does not exist"
        }
    }, [currentPage, editMode])

    const renderPage = useCallback(
        () => {
            switch (currentPage) {
                case pages.main:
                    if(isLoggedIn)
                        return <HomePage />;
                    return <WelcomePage />;
                case pages.login:
                    return <LoginPage />
                case pages.register:
                    return <RegisterPage />
                case pages.edit:
                    return <EditPage />
                default:
                    return null;
            }
        },
        [currentPage, isLoggedIn],
    );


    return (
        <div className={styles.root}>
            <NavBar isLoggedIn={isLoggedIn}/>
            <PageRenderer title={title} onRender={renderPage}/>
        </div>
    );
}

export default App;
