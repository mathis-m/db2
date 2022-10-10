import React, {useCallback, useMemo} from "react"
import {mergeStyleSets, Pivot, PivotItem} from "@fluentui/react";
import {pages} from "../pages";
import {useTodoState} from "../providers/todo-state-provider";

const NavBar = ({isLoggedIn}) => {
    const {
        currentPage,
        setCurrentPage,
        loadTodos
    } = useTodoState();
    const styles = useMemo(() => mergeStyleSets({
        navWrapper: {
            padding: "0px 20px",
            boxShadow: "0px 2px 4px 0px rgb(0 0 0 / 13%), 0px 1px 1px 0px rgb(0 0 0 / 11%)"
        },
    }), [])


    const handleLinkClick = useCallback((item) => {
        if (item) {
            setCurrentPage(item.props.itemKey);
            if(item.props.itemKey === pages.main) {
                loadTodos();
            }
        }
    }, [loadTodos, setCurrentPage]);

    return <Pivot
        linkSize="large"
        selectedKey={currentPage}
        onLinkClick={handleLinkClick}
        headersOnly={true}
        className={styles.navWrapper}
    >
        <PivotItem headerText="Todo App" itemKey={pages.main}/>
        {
            !isLoggedIn && <PivotItem headerText="Login" itemKey={pages.login}/>
        }
        {
            !isLoggedIn && <PivotItem headerText="Register" itemKey={pages.register}/>
        }
    </Pivot>
}

export default React.memo(NavBar);