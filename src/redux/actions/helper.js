export const setParamValueFactory = (actionType) => {
    return value => ({
      type: actionType,
      payload: {
        value
      }
    });
  }