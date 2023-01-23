import React, { useState } from 'react';
import classNames from 'classnames';
import { IonButton, IonIcon } from '@ionic/react';
import { information } from 'ionicons/icons';

export const Categories = ({incident, showAll=false}) => {

    return (
      <>
        <div id="categories">
            { (incident.stolenvehicle || showAll) && 
                <IonButton slot="icon-only"   shape="round" color={incident.stolenvehicle ? "primary" : "medium" }  >
                    <IonIcon src="/svgs/wewatch/stolen-vehicle.svg" />
                </IonButton>
            }
             { (incident.breakenter || showAll) && 
                <IonButton slot="icon-only"   shape="round" color={incident.breakenter ? "primary" : "medium" }  >
                <IonIcon src="/svgs/wewatch/break-enter.svg" />
                </IonButton>
            }

            { (incident.propertydamage || showAll) && 
                <IonButton slot="icon-only"   shape="round" color={incident.propertydamage ? "primary" : "medium" }  >
                <IonIcon src="/svgs/wewatch/property-damage.svg" />
                </IonButton>
            }

            { (incident.violencethreat || showAll) && 
                <IonButton slot="icon-only"   shape="round" color={incident.violencethreat ? "primary" : "medium" }  >
                <IonIcon src="/svgs/wewatch/violence-threats.svg" />
                </IonButton>
            }

            { (incident.theft || showAll) && 
                <IonButton slot="icon-only"   shape="round" color={incident.theft ? "primary" : "medium" }>
                <IonIcon src="/svgs/wewatch/theft.svg" />
                </IonButton>
            }

            { (incident.loitering || showAll) && 
                <IonButton slot="icon-only"   shape="round" color={incident.loitering ? "secondary" : "medium" }  >
                <IonIcon src="/svgs/wewatch/loitering.svg" />
                </IonButton>
            }

            { (incident.disturbance || showAll) && 
                <IonButton slot="icon-only"   shape="round" color={incident.disturbance ? "secondary" : "medium" } >
                <IonIcon src="/svgs/wewatch/disturbance.svg" />
                </IonButton>
            }

            { (incident.suspicious || showAll) && 
                <IonButton slot="icon-only"   shape="round" color={incident.suspicious ? "secondary" : "medium" } >
                <IonIcon src="/svgs/wewatch/suspicious.svg" />
                </IonButton>
            }

            { (incident.unfamiliar || showAll) && 
                <IonButton slot="icon-only"   shape="round" color={incident.unfamiliar ? "secondary" : "medium" } >
                <IonIcon src="/svgs/wewatch/unfamiliar-person.svg" />
                </IonButton>
            }
        </div>
      </>
    )
  }

export default Categories;




