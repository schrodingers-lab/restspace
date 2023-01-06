import { IonApp, IonRouterOutlet, IonSplitPane, IonToast, IonModal } from '@ionic/react';
import { StatusBar, Style } from '@capacitor/status-bar';
import { setupIonicReact } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import Menu from './Menu';
import UpgradeCard from './cards/UpgradeCard';

import Tabs from './pages/Tabs';
import Store from '../store';
import * as selectors from '../store/selectors';
import { createClient } from '@supabase/supabase-js';
import {LoginPage} from './pages/Login';
import SignupPage from './pages/Signup';
import ForgotPage from './pages/Forgot';
import UpdatePasswordPage from './pages/UpdatePassword';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import TourPage from './pages/Tour';

window.matchMedia("(prefers-color-scheme: dark)").addListener(async (status) => {
  try {
    await StatusBar.setStyle({
      style: status.matches ? Style.Dark : Style.Light,
    });
  } catch {}
});



const AppShell = ({history}) => {

  setupIonicReact({
    mode: 'md'
  });

  // Create a single supabase client for interacting with your database 
  // const supabase = createClient('https://raxdwowfheboqizcxlur.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJheGR3b3dmaGVib3FpemN4bHVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzI4OTgyNjEsImV4cCI6MTk4ODQ3NDI2MX0.uXdXBjH92OIJgIidgvP-iRHCNW3clm2D7fWVniCX5dg');
  const supabase = useSupabaseClient();
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
            isOpen={false}
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
            <Route path="/tour" component={TourPage}  exact={true} />
            <Route path="/tabs" render={() => <Tabs />} />
            <Route exact path="/" render={() => <Redirect to="/tabs" />} />
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default AppShell;
