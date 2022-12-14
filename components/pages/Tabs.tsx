import { Redirect, Route } from 'react-router-dom';
import { IonRouterOutlet, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonToast } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { cog, bookmark, map, list, add } from 'ionicons/icons';
import Bookmarked from './Bookmarked';
import Map from './Map';
import Lists from './Lists';
import ListDetail from './ListDetail';
import Settings from './Settings';
import Terms from './Terms';
import LoginPage from './Login';
import React from 'react';
import SignupPage from './Signup';
import ForgotPage from './Forgot';
import UpdatePasswordPage from './UpdatePassword';
import VerifyPage from './Verify';

const Tabs = () => {

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route path="/tabs/map" component={Map} exact={true} />
        <Route path="/tabs/bookmarked" component={Bookmarked} exact={true} />
        <Route path="/tabs/lists" component={Lists} exact={true} />
        <Route path="/tabs/lists/:listId" component={ListDetail} exact={true} />
        <Route path="/tabs/settings" component={Settings} exact={true} />
        <Route path="/tabs/terms" component={Terms} exact={true} />
        <Route path="/tabs/login" component={LoginPage}  exact={true} />
        <Route path="/tabs/signup" component={SignupPage}  exact={true} />
        <Route path="/tabs/forgot" component={ForgotPage}  exact={true} />
        <Route path="/tabs/update" component={UpdatePasswordPage}  exact={true} />
        <Route path="/tabs" render={() => <Redirect to="/tabs/map" />} exact={true} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="tab1" href="/tabs/map">
          <IonIcon icon={map} />
          <IonLabel>Map</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab3" href="/tabs/lists">
          <IonIcon icon={list} />
          <IonLabel>Lists</IonLabel>
        </IonTabButton>
        {/* <IonTabButton tab="tab2" href="/tabs/bookmarked">
          <IonIcon icon={add} size="large"/>
          <IonLabel></IonLabel>
        </IonTabButton> */}
         <IonTabButton tab="tab2" href="/tabs/bookmarked">
          <IonIcon icon={bookmark} />
          <IonLabel>Bookmarked</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab4" href="/tabs/settings">
          <IonIcon icon={cog} />
          <IonLabel>Settings</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default Tabs;
