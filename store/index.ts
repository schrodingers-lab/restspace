import { Store as PullStateStore } from 'pullstate';

const restAreas: any[] = [];
const notifications: any[] = [];
const bookmarks: any[] = [];
 
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
    appVersion: 2.3
  },
});

export default Store;
