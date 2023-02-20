import { Store as PullStateStore } from 'pullstate';

const incidents: any[] = [];
const bookmarks: any[] = [];
const activeNotifications: any[] = [];
const notifications: any[] = [];
 
const Store = new PullStateStore({
  safeAreaTop: 0,
  safeAreaBottom: 0,
  menuOpen: false,
  notificationsOpen: false,
  activeNotifications,
  currentPage: null,
  incidents,
  bookmarks,
  notifications,
  settings: {
    appVersion: 2.4
  },
});

export default Store;
