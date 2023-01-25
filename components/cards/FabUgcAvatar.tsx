import { Camera, CameraResultType } from '@capacitor/camera';
import { IonFab, IonFabButton, IonFabList, IonIcon, IonToast } from '@ionic/react';
import { arrowDown, alert, information, alertCircle, eyeOff, flashOff, flag, phoneLandscape, flash, person, image, eye } from 'ionicons/icons';
import React, { useEffect, useRef, useState } from 'react';
import { publicFileUrlFragment } from '../../store/file';
import { useStore } from '../../store/user';
import Report from '../modals/Report';
import UserProfile from '../modals/UserProfile';
import Card from '../ui/Card';
import UserProfileAvatar from '../ui/UserProfileAvatar';

export const FabUgcAvatar = ({profile}) => {
  const [actionsOpen, setActionsOpen] = useState(false);
  const [openCreator, setOpenCreator] = useState(false);
  const { userProfiles} = useStore({userId: profile.id});

  const toggleUserModal = () => {
    setOpenCreator(!openCreator);
  }

  return (
    <>
    <IonFab horizontal="start" vertical="bottom" slot="fixed" onClick={()=>{toggleUserModal()}} >
      <IonFabButton
        
        size="small"
        color={"medium"}
      >
        <UserProfileAvatar userProfile={profile} size={12}/>
      </IonFabButton>
    </IonFab>
    <UserProfile open={openCreator} onDidDismiss={()=>{setOpenCreator(false)}} userProfile={profile} />
    </>
  );
};
