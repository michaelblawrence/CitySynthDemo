export const setParamValueFactory = (actionType) => {
  return value => ({
    type: actionType,
    payload: {
      value
    }
  });
}

export const setAllParamsActionFactory = (actionType) => {
  return dump => ({
    type: actionType,
    payload: dump
  });
}