import React, {useCallback, useMemo, useRef} from "react";
import {CompactPeoplePicker, Label, ValidationState} from "@fluentui/react";
import {useTodoState} from "../providers/todo-state-provider";
const suggestionProps = {
    suggestionsHeaderText: 'Suggested People',
    mostRecentlyUsedHeaderText: 'Suggested Contacts',
    noResultsFoundText: 'No results found',
    loadingText: 'Loading',
    showRemoveButtons: false,
    suggestionsAvailableAlertText: 'People Picker Suggestions available',
    suggestionsContainerAriaLabel: 'Suggested contacts',
};

const UserPicker = ({label, selectedChanged, initialSelectedUsersIds, author}) => {
    const {users} = useTodoState();

    const peopleList = useMemo(() => users.map(x => ({
        key: x.id,
        imageInitials: `${x.firstName[0]}${x.lastName[0]}`,
        text: `${x.firstName} ${x.lastName}`
    })), [users]);

    const [selected, setSelected] = React.useState(peopleList.filter(x => initialSelectedUsersIds.includes(x.key)));

    const picker = useRef(null);

    const filterPersonasByText = useCallback((filterText) => {
        return peopleList.filter(item => doesTextStartWith(item.text, filterText));
    }, [peopleList])

    const onFilterChanged = useCallback((
        filterText,
        currentPersonas,
        limitResults,
    ) => {
        if (filterText) {
            let filteredPersonas = filterPersonasByText(filterText);

            filteredPersonas = removeDuplicates(filteredPersonas, currentPersonas);
            filteredPersonas = limitResults ? filteredPersonas.slice(0, limitResults) : filteredPersonas;
            return filteredPersonas;
        } else {
            return [];
        }
    }, [filterPersonasByText]);

    const onItemsChange = useCallback((items) => {
        setSelected(items);
        selectedChanged(items.map(x => users.find(y => y.id === x.key)))
    }, [selectedChanged, users])

    return <div>
        <Label>
            {label}
        </Label>
        <CompactPeoplePicker
            onChange={onItemsChange}
            selectedItems={selected}
            onResolveSuggestions={onFilterChanged}
            onEmptyInputFocus={() => peopleList}
            getTextFromItem={getTextFromItem}
            pickerSuggestionsProps={suggestionProps}
            onValidateInput={validateInput}
            componentRef={picker}
            resolveDelay={300}
        />
    </div>
}


function doesTextStartWith(text, filterText) {
    return text.toLowerCase().indexOf(filterText.toLowerCase()) === 0;
}

function removeDuplicates(personas, possibleDupes) {
    return personas.filter(persona => !listContainsPersona(persona, possibleDupes));
}

function listContainsPersona(persona, personas) {
    if (!personas || !personas.length || personas.length === 0) {
        return false;
    }
    return personas.filter(item => item.text === persona.text).length > 0;
}

function getTextFromItem(persona) {
    return persona.text;
}

function validateInput(input) {
    if (input.indexOf('@') !== -1) {
        return ValidationState.valid;
    } else if (input.length > 1) {
        return ValidationState.warning;
    } else {
        return ValidationState.invalid;
    }
}


export default React.memo(UserPicker);