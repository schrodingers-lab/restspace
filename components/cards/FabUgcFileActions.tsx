import { Camera, CameraResultType } from '@capacitor/camera';
import { IonFab, IonFabButton, IonFabList, IonIcon, IonToast } from '@ionic/react';
import { arrowDown, alert, information, alertCircle, eyeOff, flashOff, flag, phoneLandscape, flash, person, image, eye } from 'ionicons/icons';
import React, { useEffect, useRef, useState } from 'react';
import { publicFileUrlFragment } from '../../store/file';
import { useStore } from '../../store/user';
import Report from '../modals/Report';
import Card from '../ui/Card';

export const FabUgcFileActions = ({file, creator=null}) => {
  const [actionsOpen, setActionsOpen] = useState(false);
  const [openReporter, setOpenReporter] = useState(false);
  const [reportMode, setReportMode] = useState('file');
  const { authUser } = useStore({})

  return (
    <>
    <IonFab horizontal="end" vertical="bottom" slot="fixed" activated={actionsOpen}>
      <IonFabButton
        onClick={() => {
          setActionsOpen(!actionsOpen);
        }}
        size="small"
        color={"medium"}
      >
        <IonIcon icon={flag} />
      </IonFabButton>
      <IonFabList side="top">        
        <IonFabButton
          onClick={event => {
            console.log('clicked');
            setReportMode('person');
            setActionsOpen(false);
            setOpenReporter(true);
          }}
          color={'medium'}
        >
        <IonIcon icon={person} /> 
        </IonFabButton>
        <IonFabButton
          onClick={event => {
            console.log('clicked');
            setReportMode('image');
            setActionsOpen(false);
            setOpenReporter(true);
          }}
          color={'medium'}
        >
        <IonIcon icon={image} /> 
        </IonFabButton>
      </IonFabList>
    </IonFab>
    <Report open={openReporter} onDidDismiss={() => setOpenReporter(false)} reportMode={reportMode} file={file} />
    </>
  );
};
