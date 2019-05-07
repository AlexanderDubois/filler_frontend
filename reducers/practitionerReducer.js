const practitionerReducer = (state = {}, action) => {

    const {type, payload} = action
    switch(type) {
        case 'ADD_CURRENT_PRACTITIONER':
            return payload
        default:
            return state
    }

}

export default practitionerReducer