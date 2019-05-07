const initialState = null

const userReducer = (state = initialState, action) => {
    console.log("REDUCER CALLED WITH TYPE", action.type)
    const {type, payload } = action
    switch(type) {
      case "LOGIN":
        console.log("ACTION", payload)
        return {...payload.user, ...payload.token}
      default:
        return state
    }
  }

  export default userReducer