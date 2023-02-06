import { Redirect, Route } from 'react-router-dom';
import { IonRouterOutlet, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonToast, IonContent, IonPopover } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { person, bookmark, map, chatbox, add, home  } from 'ionicons/icons';
import Bookmarked from './Bookmarked';
import Map from './Map';
import Lists from './Lists';
import ListDetail from './ListDetail';
import Settings from './Settings';
import Terms from './Terms';
import LoginPage from './Login';
import React, { useEffect, useRef, useState } from 'react';
import SignupPage from './Signup';
import ForgotPage from './Forgot';
import UpdatePasswordPage from './UpdatePassword';
import TourPage from './Tour';
import NewDetail from './NewDetail';
import Home from './Home';
import ChatsPage from './Chats';
import ProfilePage from './Profile';
import ChatDetail from './ChatDetail';
import Mine from './Mine';
import EditDetail from './EditDetail';

const Tabs = () => {



  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route path="/tabs/login" component={LoginPage}  exact={true} />
        <Route path="/tabs/signup" component={SignupPage}  exact={true} />
        <Route path="/tabs/forgot" component={ForgotPage}  exact={true} />
        <Route path="/tabs/update" component={UpdatePasswordPage}  exact={true} />

        <Route path="/tabs/settings" component={Settings} exact={true} />
        <Route path="/tabs/terms" component={Terms} exact={true} />

        <Route path="/tabs/new" component={NewDetail} exact={true} />
        <Route path="/tabs/home" component={Home} exact={true} />
        <Route path="/tabs/map" component={Map} exact={true} />
        <Route path="/tabs/incidents" component={Lists} exact={true} />
        <Route path="/tabs/incidents/:incidentId" component={ListDetail} exact={true} />
        <Route path="/tabs/incident/edit/:incidentId" component={EditDetail} exact={true} />
        <Route path="/tabs/chats" component={ChatsPage} exact={true} />
        <Route path="/tabs/chats/:chatId" component={ChatDetail} exact={true} />
        <Route path="/tabs/profile" component={ProfilePage} exact={true} />
        <Route path="/tabs/bookmarked" component={Bookmarked} exact={true} />
        <Route path="/tabs/mine" component={Mine} exact={true} />
      
        <Route path="/tabs" render={() => <Redirect to="/tabs/home" />} exact={true} />
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        <IonTabButton tab="tab1" href="/tabs/home">
          <IonIcon icon={home} />
          <IonLabel>Home</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab2" href="/tabs/chats">
          <IonIcon icon={chatbox} />
          <IonLabel>Messages</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab3" href="/tabs/new">
          <IonIcon icon={add} size="large"/>
          <IonLabel></IonLabel>
        </IonTabButton>
         <IonTabButton tab="tab4" href="/tabs/map">
          <IonIcon icon={map} />
          <IonLabel>Map</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab5" href="/tabs/profile">
          <IonIcon icon={person} />
          <IonLabel>Profile</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default Tabs;
