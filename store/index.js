import { Store as PullStateStore } from 'pullstate';

const restAreas = [];
const notifications = [];
const bookmarks = [];
 
const Store = new PullStateStore({
  safeAreaTop: 0,
  safeAreaBottom: 0,
  menuOpen: false,
  notificationsOpen: false,
  currentPage: null,
  restAreas,
  bookmarks,
  notifications,
  settings: {
    appVersion: 2.1
  },
});

export default Store;
