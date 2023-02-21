import { createSelector } from 'reselect';

const getState = state => state;

export const getIncidents = createSelector(getState, state => state.incidents);

export const getChats = createSelector(getState, state => state.chats);
export const getPublicChats = createSelector(getState, state => state.chats.filter(chat =>  chat?.public));
export const getMembershipChats = createSelector(getState, state => state.membershipChats);
export const getMessages = createSelector(getState, state => state.messages);
export const getAuthors = createSelector(getState, state => state.authors);

export const getSettings = createSelector(getState, state => state.settings);

export const getNotifications = createSelector(getState, state => state.notifications);
export const getActiveNotifications = createSelector(getState, state => state.notifications.filter(notification =>  !notification?.completed));

export const getAuthUser = createSelector(getState, state => state.authUser);
export const getAuthUserProfile = createSelector(getState, state => state.authUserProfile);
export const getUserIds = createSelector(getState, state => state.userIds);
export const getUserProfiles = createSelector(getState, state => state.userProfiles);
