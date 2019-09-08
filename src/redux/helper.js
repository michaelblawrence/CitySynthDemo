import { InversedParam } from "./types";

// @ts-check
export const getParamSetter = (state, action, param) => ({
    ...state,
    meta: {
        prevState: state,
    },
    [InversedParam[param]]: action.payload.value,
});