import {initializeIcons} from "@fluentui/react";
import {TodoStateProvider} from "./providers/todo-state-provider";
import App from "./App";

initializeIcons();

function AppRoot() {
    return <TodoStateProvider>
        <App />
    </TodoStateProvider>
}

export default AppRoot;
