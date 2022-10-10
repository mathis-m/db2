import React, {useCallback, useMemo} from "react";
import {
    DocumentCard,
    DocumentCardActivity,
    DocumentCardDetails,
    DocumentCardTitle, FontWeights, IconButton, mergeStyleSets,
    Stack, Text,
} from "@fluentui/react";
import {useTodoState} from "../../providers/todo-state-provider";

const addButton = {
    iconName: "CircleAddition"
}
const dateFormatter = new Intl.DateTimeFormat('de', {month: 'short', day: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"})
const TodoList = ({title, todos, isCompleted}) => {
    const {openEdit, openCreate, users} = useTodoState();
    const styles = useMemo(() => mergeStyleSets({
        listContainer: {
            display: "grid",
            gridTemplateColumns: "minmax(300px,max-content)",
            gridTemplateRows: "min-content 1fr",
        },
        header: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "5px 0px"
        },
        title: {
            fontWeight: FontWeights.bold
        }
    }), []);
    const items = useMemo(() => todos.map(x => (
        <DocumentCard
            key={x.id}
            onClick={() => openEdit(x)}
        >
            <DocumentCardDetails>
                <DocumentCardTitle title={x.content} shouldTruncate />
            </DocumentCardDetails>
            <DocumentCardActivity activity={`Created ${dateFormatter.format(new Date(x.createdAt))}`} people={[users.find(y => y.userName === x.userName), ...x.sharedWith.map(x => users.find(y => y.id === x))]
                .filter(x => !!x)
                .map(x => ({
                name: `${x.firstName} ${x.lastName}`,
                initials: `${x.firstName[0]}${x.lastName[0]}`
            }))} />
        </DocumentCard>
    )), [openEdit, todos, users]);
    
    const onNewClick = useCallback(() => {
        openCreate(isCompleted);
    }, [isCompleted, openCreate])

    return (
        <div className={styles.listContainer}>
            <div className={styles.header}>
                <Text variant={"mediumPlus"} className={styles.title}>
                    {title}
                </Text>
                <IconButton iconProps={addButton} onClick={onNewClick}/>
            </div>
            <Stack gap={10} wrap>
                {items}
            </Stack>
        </div>
    );
}

const HomePage = () => {
    const {todos} = useTodoState();

    const doneTodos = useMemo(() => todos.filter(x => x.isCompleted), [todos])
    const ongoingTodos = useMemo(() => todos.filter(x => !x.isCompleted), [todos])

    const styles = useMemo(() => mergeStyleSets({
        listsContainer: {
            display: "flex",
            flexFlow: "row nowrap",
            gap: 20
        }
    }), [])

    return (
        <div className={styles.listsContainer}>
            <TodoList title="To do" todos={ongoingTodos} isCompleted={false} />
            <TodoList title="Done" todos={doneTodos} isCompleted={true} />
        </div>
    )
}

export default React.memo(HomePage)