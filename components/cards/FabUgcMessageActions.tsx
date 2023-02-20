import { Camera, CameraResultType } from '@capacitor/camera';
import { IonFab, IonFabButton, IonFabList, IonIcon, IonToast } from '@ionic/react';
import { arrowDown, alert, information, alertCircle, eyeOff, flashOff, flag, phoneLandscape, flash, person, image, eye, chatboxEllipses } from 'ionicons/icons';
import React, { useEffect, useRef, useState } from 'react';
import Report from '../modals/Report';
import Card from '../ui/Card';

export const FabUgcMessageActions = ({message, chat=null, creator=null}) => {
  const [actionsOpen, setActionsOpen] = useState(false);
  const [openReporter, setOpenReporter] = useState(false);
  const [reportMode, setReportMode] = useState('file');

  return (
    <>
    <IonFab slot="fixed" vertical="bottom" horizontal="end"  activated={actionsOpen} >
      <IonFabButton
        onClick={() => {
          setActionsOpen(!actionsOpen);
        }}
        size="small"
        color={"secondary"}
      >
        <IonIcon icon={flag} size="small"/>
      </IonFabButton>
      <IonFabList side="start">        
        <IonFabButton
          onClick={event => {
            console.log('clicked');
            setReportMode('person');
            setActionsOpen(false);
            setOpenReporter(true);
          }}
          color={"secondary"}
          size="small"
        >
        <IonIcon icon={person} /> 
        </IonFabButton>
        <IonFabButton
          onClick={event => {
            console.log('clicked');
            setReportMode('message');
            setActionsOpen(false);
            setOpenReporter(true);
          }}
          color={"secondary"}
          size="small"
        >
        <IonIcon icon={chatboxEllipses} /> 
        </IonFabButton>
      </IonFabList>
    </IonFab>
    <Report open={openReporter} onDidDismiss={() => setOpenReporter(false)} reportMode={reportMode}  message={message} personId={message.userId} />
    </>
  );
};
