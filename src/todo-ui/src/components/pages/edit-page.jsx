import {DefaultButton, mergeStyleSets, PrimaryButton, Stack, TextField, Toggle} from "@fluentui/react";
import React, {useCallback, useMemo, useState} from "react";
import {useTodoState} from "../../providers/todo-state-provider";
import {pages} from "../../pages";
import UserPicker from "../UserPicker";

const EditPage = () => {
    const {editTodo, setEditTodo, setCurrentPage, editMode, createTodo, updateTodo, users: allUsers, deleteTodo} = useTodoState();
    const [priority, setPriority] = useState(editTodo.priority);
    const [content, setContent] = useState(editTodo.content);
    const [users, setUsers] = useState(editTodo.sharedWith.map(x => allUsers.find(y => y.id === x)));
    const [isCompleted, setIsCompleted] = useState(editTodo.isCompleted);

    const onContentChange = useCallback(
        (ev, value) => {
            setContent(value ?? "")
        },
        [],
    );
    const onPriorityChange = useCallback(
        (ev, value) => {
            if(value === undefined) {
              return;
            }
            const num = parseInt(value);
            if(!isNaN(num))
                setPriority(num)
        },
        [],
    );

    const onStateChange = useCallback((ev, checked) => {
        setIsCompleted(checked ?? false)
    }, [])


    const styles = useMemo(() => mergeStyleSets({
        form: {
            width: "min(500px, 100%)",
            display: "flex",
            flexFlow: "column nowrap",
        },
        actions: {
            paddingTop: 20
        }
    }), []);
    
    const onCancel = useCallback(() => {
        setEditTodo(null);
        setCurrentPage(pages.main);
    }, [setCurrentPage, setEditTodo])
    
    
    const onDelete = useCallback(() => {
        if(editMode === "update")
            deleteTodo(editTodo.id);
    }, [deleteTodo, editMode, editTodo.id])
    
    const onSave = useCallback(() => {
        setEditTodo(null);
        setCurrentPage(pages.main);
        if(editMode === "create") {
            createTodo({
                content: content,
                isCompleted: isCompleted,
                sharedWith: users.map(x => x.id),
                priority: priority
            });
        } else {
            updateTodo({
                id: editTodo.id,
                content: content,
                isCompleted: isCompleted,
                sharedWith: users.map(x => x.id),
                priority: priority
            })
        }
    }, [content, createTodo, editMode, editTodo.id, isCompleted, priority, setCurrentPage, setEditTodo, updateTodo, users])

    

    return <Stack className={styles.form} gap={5}>
        <TextField value={content} multiline onChange={onContentChange} label={"Content"}/>
        <TextField value={priority + ""} onChange={onPriorityChange} label={"Priority"} type={"number"}/>
        <Toggle label="Completion" onText="Done" offText={"On going"} checked={isCompleted} onChange={onStateChange}/>
        <UserPicker label={"Shared With"} selectedChanged={setUsers} initialSelectedUsersIds={editTodo.sharedWith} />
        <Stack horizontal gap={5} horizontalAlign={"end"} className={styles.actions}>
            <PrimaryButton onClick={onSave}>Save</PrimaryButton>
            <DefaultButton onClick={onCancel}>Cancel</DefaultButton>
            <DefaultButton disabled={editMode === "create"} onClick={onDelete}>Delete</DefaultButton>
        </Stack>
    </Stack>
}

export default React.memo(EditPage)