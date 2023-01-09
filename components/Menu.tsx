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
import { cog, bookmark, map,home, list, newspaper, person, earthOutline } from 'ionicons/icons';

import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'

const pages = [
  {
    title: 'Home',
    icon: home,
    url: '/tabs/home',
  },{
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
    title: 'Bookmarked',
    icon: bookmark,
    url: '/tabs/bookmarked',
  },
  {
    title: 'Tour',
    icon: earthOutline,
    url: '/tour',
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



const Menu = () => {
  const [isDark, setIsDark] = useState(false);
  const user = useUser();
  const supabase = useSupabaseClient();

  const signOut = async() => {
    const { error } = await supabase.auth.signOut()
  }

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
          <IonTitle>WeWatch</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          { user &&
            <IonMenuToggle autoHide={false} key='user'>
              <IonItem onClick={signOut} detail={false} lines="none">
                <IonIcon icon={person} slot="start" />
                <IonLabel>Sign Out</IonLabel>
              </IonItem>
            </IonMenuToggle>
          }

           { !user &&
            <IonMenuToggle autoHide={false} key='user'>
              <IonItem routerLink={'/tabs/login'} routerDirection="none" detail={false} lines="none">
                <IonIcon icon={person} slot="start" />
                <IonLabel>Sign In</IonLabel>
              </IonItem>
            </IonMenuToggle>
          }

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
