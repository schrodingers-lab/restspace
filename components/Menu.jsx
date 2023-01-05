import { StatusBar, Style } from '@capacitor/status-bar';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuToggle,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { cog, bookmark, map, list, newspaper } from 'ionicons/icons';

const pages = [
  {
    title: 'Map',
    icon: map,
    url: '/tabs/map',
  },

  {
    title: 'Lists',
    icon: list,
    url: '/tabs/lists',
  },
  {
    title: 'Settings',
    icon: cog,
    url: '/tabs/settings',
  },
  {
    title: 'Terms of Use',
    icon: newspaper,
    url: '/tabs/terms',
  },
];

// {
//   title: 'Bookmarked',
//   icon: bookmark,
//   url: '/tabs/bookmarked',
// },

const Menu = () => {
  const [isDark, setIsDark] = useState(false);

  const handleOpen = async () => {
    try {
      await StatusBar.setStyle({
        style: isDark ? Style.Dark : Style.Light,
      });
    } catch {}
  };
  const handleClose = async () => {
    try {
      await StatusBar.setStyle({
        style: isDark ? Style.Dark : Style.Light,
      });
    } catch {}
  };

  useEffect(() => {
    setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
  }, []);

  return (
    <IonMenu side="start" contentId="main" onIonDidOpen={handleOpen} onIonDidClose={handleClose} swipeGesture={false}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>RestSpace</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {pages.map((p, k) => (
            <IonMenuToggle autoHide={false} key={k}>
              <IonItem routerLink={p.url} routerDirection="none" detail={false} lines="none">
                <IonIcon icon={p.icon} slot="start" />
                <IonLabel>{p.title}</IonLabel>
              </IonItem>
            </IonMenuToggle>
          ))}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
