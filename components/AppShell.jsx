import { IonApp, IonRouterOutlet, IonSplitPane, IonToast, IonModal } from '@ionic/react';
import { StatusBar, Style } from '@capacitor/status-bar';

import React, { useEffect, useState } from 'react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import Menu from './Menu';
import UpgradeCard from './cards/UpgradeCard';

import Tabs from './pages/Tabs';
import Store from '../store';
import * as selectors from '../store/selectors';
import { createClient } from '@supabase/supabase-js';

window.matchMedia("(prefers-color-scheme: dark)").addListener(async (status) => {
  try {
    await StatusBar.setStyle({
      style: status.matches ? Style.Dark : Style.Light,
    });
  } catch {}
});

const AppShell = ({history}) => {

  // Create a single supabase client for interacting with your database 
  const supabase = createClient('https://arvqjbylexvdpyooykji.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFydnFqYnlsZXh2ZHB5b295a2ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTMxMTk1MzUsImV4cCI6MTk2ODY5NTUzNX0.09341SKltY0PCODodzrDD1RQDXB5tA5dnMc-jQbKPag');
  const [remoteAppVersion, setRemoteAppVersion] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const settings = Store.useState(selectors.getSettings);

  useEffect(() => {
    const fetchData = async() => {
      // You can await here
      const { data, error } = await supabase
        .from('ref_data')
        .select('data')
        .eq('ref', 'app_version')
      if(data && data.length > 0){
        const remoteAppVersionData = data[0];
        setRemoteAppVersion(remoteAppVersionData?.data);
     }
    }
    fetchData();
  }, []);

  useEffect(() => { 
    if (remoteAppVersion && settings.appVersion) {
      if (parseFloat(remoteAppVersion) <= parseFloat(settings.appVersion) ){        
        console.log("all good App")
      }else{
        console.log("upgrade App");
        setShowModal(true);
      }
    }
  }, [remoteAppVersion, settings]);



  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <Menu />
          <IonToast
            isOpen={true}
            message="This app should not be used while driving, please be careful on the road."
            duration={4000}
            position={'top'}
            color={'medium'}
          />
          <IonModal
            isOpen={showModal}
            swipeToClose={true}
            onDidDismiss={() => setShowModal(false)}>
           <UpgradeCard/>
          </IonModal>
          <IonRouterOutlet id="main">
            <Route path="/tabs" render={() => <Tabs />} />
            <Route exact path="/" render={() => <Redirect to="/tabs" />} />
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default AppShell;
