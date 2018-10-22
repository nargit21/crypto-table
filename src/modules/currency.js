const LOAD_CURRENCIES_START = 'LOAD_CURRENCIES_START';
const LOAD_CURRENCIES_SUCCESS = 'LOAD_CURRENCIES_SUCCESS';
const LOAD_CURRENCIES_ERROR = 'LOAD_CURRENCIES_ERROR';

export const loadCurrenciesStart = () => ({
  type: LOAD_CURRENCIES_START
});

export const loadCurrenciesSuccess = data => ({
  type: LOAD_CURRENCIES_SUCCESS,
  data
});

export const loadCurrenciesError = error => ({
  type: LOAD_CURRENCIES_ERROR,
  error
});

const initialState = {
  isLoading: false,
  data: [],
  error: undefined
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_CURRENCIES_START:
      return {
        ...state,
        isLoading: true
      };
    case LOAD_CURRENCIES_SUCCESS:
      return {
        ...state,
        data: action.data,
        isLoading: false
      };
    case LOAD_CURRENCIES_ERROR:
      return {
        ...state,
        error: action.error,
        isLoading: false
      };
    default:
      return state;
  }
};

export function loadCurrencies(page, pageSize, sort) {
  const sortPath = sort ? `&sort=${sort.id}` : '';
  const start = page * pageSize;
  const url = `https://api.coinmarketcap.com/v2/ticker/?start=${start}&limit=${pageSize}${sortPath}&structure=array`;

  return dispatch => {
    dispatch(loadCurrenciesStart());

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }

        return response.json();
      })
      .then(data => dispatch(loadCurrenciesSuccess(data)))
      .catch(error => dispatch(loadCurrenciesError(error)));
  };
}
