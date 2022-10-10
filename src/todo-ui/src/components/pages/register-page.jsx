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
const RegisterPage = () => {
    const {
        setCurrentPage,
        onRegister
    } = useTodoState();
    const onLoginClick = useCallback(() => {
        setCurrentPage(pages.login);
    }, [setCurrentPage])
    const [userName, setUserName] = useState("");
    const [nameError, setNameError] = useState(undefined);
    const [firstName, setFirstName] = useState("");
    const [firstNameError, setFirstNameError] = useState(undefined);
    const [lastName, setLastName] = useState("");
    const [lastNameError, setLastNameError] = useState(undefined);
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState(undefined);
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState(undefined);

    const onUserNameChange = useCallback((ev, newValue) => {
        setUserName(newValue ?? "");
        if (newValue === undefined || newValue.length === 0) {
            setNameError("Username is mandatory")
        } else {
            setNameError(undefined)
        }
    }, []);

    const onFirstNameChange = useCallback((ev, newValue) => {
        setFirstName(newValue ?? "");
        if (newValue === undefined || newValue.length === 0) {
            setFirstNameError("Firstname is mandatory")
        } else {
            setFirstNameError(undefined)
        }
    }, []);

    const onLastNameChange = useCallback((ev, newValue) => {
        setLastName(newValue ?? "");
        if (newValue === undefined || newValue.length === 0) {
            setLastNameError("Lastname is mandatory")
        } else {
            setLastNameError(undefined)
        }
    }, []);

    const onEmailChange = useCallback((ev, newValue) => {
        setEmail(newValue ?? "");
        if (newValue === undefined || newValue.length === 0) {
            setEmailError("Username is mandatory")
        } else {
            setEmailError(undefined)
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


    const hasError = useMemo(() => userName.length === 0 || password.length === 0 || email.length === 0 || firstName.length === 0 || lastName.length === 0, [email.length, firstName.length, lastName.length, password.length, userName.length])
    const onRegisterClick = useCallback(() => {
        if (!hasError) {
            onRegister(userName, password, email, firstName, lastName);
        }
    }, [email, firstName, hasError, lastName, onRegister, password, userName])

    const styles = useMemo(() => mergeStyleSets({
        form: {
            width: "min(500px, 100%)",
            display: "flex",
            flexFlow: "column nowrap",
        },
    }), []);

    return <Stack className={styles.form} gap={20}>
        <TextField required={true} value={userName} onChange={onUserNameChange} label={"Username"}
                   underlined placeholder={"Your username..."} errorMessage={nameError} type={""}/>
        <TextField required={true} value={email} onChange={onEmailChange} label={"Email"} type={"email"}
                   underlined placeholder={"Your email..."} errorMessage={emailError}/>
        <TextField required={true} value={firstName} onChange={onFirstNameChange} label={"Firstname"}
                   underlined placeholder={"Your firstname..."} errorMessage={firstNameError}/>
        <TextField required={true} value={lastName} onChange={onLastNameChange} label={"Lastname"} underlined
                   placeholder={"Your lastname..."} errorMessage={lastNameError}/>
        <TextField required={true} value={password} onChange={onPasswordChange} label={"Password"}
                   placeholder={"Your password..."} errorMessage={passwordError} type="password"
                   underlined canRevealPassword revealPasswordAriaLabel="Show password"/>
        <Stack horizontal gap={5} horizontalAlign={"end"}>
            <PrimaryButton disabled={hasError} iconProps={register} onClick={onRegisterClick}>Register</PrimaryButton>
            <DefaultButton iconProps={signIn} onClick={onLoginClick}>Go to Login</DefaultButton>
        </Stack>
    </Stack>
}

export default React.memo(RegisterPage)