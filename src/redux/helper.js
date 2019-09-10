import { InversedParam } from "./types";

// @ts-check
export const getParamSetter = (state, action, param, refresh = false) => ({
    ...state,
    meta: {
        prevState: state,
        refresh
    },
    [InversedParam[param]]: action.payload.value,
});