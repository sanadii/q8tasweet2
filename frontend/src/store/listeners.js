import { getElections, getCategories } from './actions'; // Import your action creators

export function setupListeners(listenerMiddleware) {
  listenerMiddleware.startListening({
    actionCreator: getElections,
    effect: async (action, listenerApi) => {
      const { dispatch, getState } = listenerApi;
      console.log('Get Elections:', action.payload);

      // Dispatch actions or perform side effects here
      if (!getState().elections.isElectionSuccess) {
        dispatch(getElections('admin'));
        dispatch(getCategories());
      }
    }
  });
}
