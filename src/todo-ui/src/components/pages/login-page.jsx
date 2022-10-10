import {Stack, mergeStyleSets, PrimaryButton, TextField, DefaultButton} from "@fluentui/react";
import React, {useCallback, useMemo, useState} from "react";
import {useTodoState} from "../../providers/todo-state-provider";
import {pages} from "../../pages";

const signIn = {
    iconName: "Signin"
}
const register = {
    iconName: "JoinOnlineMeeting"
}
const LoginPage = () => {
    const [userName, setUserName] = useState("");
    const [nameError, setNameError] = useState(undefined);
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState(undefined);
    const {
        setCurrentPage,
        onLogin
    } = useTodoState();
    const onRegisterClick = useCallback(() => {
        setCurrentPage(pages.register);
    }, [setCurrentPage])

    const onUserNameChange = useCallback((ev, newValue) => {
        setUserName(newValue ?? "");
        if (newValue === undefined || newValue.length === 0) {
            setNameError("Username is mandatory")
        } else {
            setNameError(undefined)
        }
    }, []);

    const onPasswordChange = useCallback((ev, newValue) => {
        setPassword(newValue ?? "");
        if (newValue === undefined || newValue.length === 0) {
            setPasswordError("Password is mandatory")
        } else {
            setPasswordError(undefined)
        }
    }, []);


    const hasError = useMemo(() => userName.length === 0 || password.length === 0, [password.length, userName.length])
    const onLoginClick = useCallback(() => {
        if (!hasError) {
            onLogin(userName, password);
        }
    }, [hasError, onLogin, password, userName])

    const styles = useMemo(() => mergeStyleSets({
        form: {
            width: "min(500px, 100%)",
            display: "flex",
            flexFlow: "column nowrap",
        },
    }), []);


    return <Stack className={styles.form} gap={20}>
        <TextField required={true} value={userName} onChange={onUserNameChange} label={"Username"}
                   underlined placeholder={"Your username..."} errorMessage={nameError}/>
        <TextField required={true} value={password} onChange={onPasswordChange} label={"Password"}
                   placeholder={"Your password..."} errorMessage={passwordError} type="password"
                   underlined canRevealPassword revealPasswordAriaLabel="Show password"/>
        <Stack horizontal gap={5} horizontalAlign={"end"}>
            <PrimaryButton disabled={hasError} iconProps={signIn} onClick={onLoginClick}>Login</PrimaryButton>
            <DefaultButton iconProps={register} onClick={onRegisterClick}>Go to Register</DefaultButton>
        </Stack>
    </Stack>
}

export default React.memo(LoginPage)