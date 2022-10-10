import React, {useCallback} from "react";
import {PrimaryButton, Stack, StackItem, Text} from "@fluentui/react";
import {useTodoState} from "../../providers/todo-state-provider";
import {pages} from "../../pages";
const signIn = {
    iconName: "Signin"
}
const WelcomePage = () => {
    const {
        setCurrentPage
    } = useTodoState();
    const onLoginClick = useCallback(() => {
        setCurrentPage(pages.login);
    }, [setCurrentPage])
    return (
        <Stack gap={10}>
            <Text block variant={"mediumPlus"}>
                Using the app requires you to login!
            </Text>
            <StackItem grow={0}>
                <PrimaryButton iconProps={signIn} onClick={onLoginClick}>Login</PrimaryButton>
            </StackItem>
        </Stack>
    )
}

export default React.memo(WelcomePage)