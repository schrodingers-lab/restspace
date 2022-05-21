import { createSelector } from 'reselect';

const getState = state => state;

export const getRestAreas = createSelector(getState, state => state.restAreas);
export const getLists = createSelector(getState, state => state.lists);
export const getNotifications = createSelector(getState, state => state.notifications);
export const getSettings = createSelector(getState, state => state.settings);
