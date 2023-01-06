import { createSelector } from 'reselect';

const getState = state => state;

export const getIncidents = createSelector(getState, state => state.incidents);
export const getBookmarks = createSelector(getState, state => state.bookmarks);
export const getNotifications = createSelector(getState, state => state.notifications);
export const getSettings = createSelector(getState, state => state.settings);
