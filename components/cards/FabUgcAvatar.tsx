
import { IonFab, IonFabButton } from '@ionic/react';
import React, { useState } from 'react';
import UserProfile from '../modals/UserProfile';
import UserProfileAvatar from '../ui/UserProfileAvatar';

export const FabUgcAvatar = ({profile}) => {
  const [openCreator, setOpenCreator] = useState(false);

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
