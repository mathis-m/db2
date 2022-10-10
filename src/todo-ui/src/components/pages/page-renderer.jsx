import React, {useMemo} from "react";
import {ActionButton, mergeStyleSets, Stack, StackItem, Text} from "@fluentui/react";
const signIn = {
    iconName: "Signin"
}
const PageRenderer = ({title, onRender}) => {
    const styles = useMemo(() => mergeStyleSets({
        root: {
            padding: 28
        },
    }), [])
    return (
        <Stack className={styles.root} gap={20}>
            <Text block variant={"xxLarge"}>
                {title}
            </Text>
            <StackItem grow={1} shrink={0} basis={"0%"}>
                {onRender()}
            </StackItem>
        </Stack>
    )
}

export default React.memo(PageRenderer)