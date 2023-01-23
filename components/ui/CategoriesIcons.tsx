import React from 'react';
import classNames from 'classnames';
import { IonIcon } from '@ionic/react';

export const CategoriesIcons = ({incident, showAll=false })  => {

    return (
        <div id="categories">
            { (incident.stolenvehicle || showAll) && 
                <IonIcon src="/svgs/wewatch/stolen-vehicle.svg" color={incident.stolenvehicle ? "primary" : "medium"  } className="px-2" />
                 
            }
             { (incident.breakenter || showAll) && 
                <IonIcon src="/svgs/wewatch/break-enter.svg" color={incident.breakenter ? "primary" : "medium"  } className="px-2" />
                 
            }

            { (incident.propertydamage || showAll) && 
                <IonIcon src="/svgs/wewatch/property-damage.svg" color={incident.propertydamage ? "primary" : "medium"  } className="px-2" />
                 
            }

            { (incident.violencethreat || showAll) && 
                <IonIcon src="/svgs/wewatch/violence-threats.svg" color={incident.violencethreat ? "primary" : "medium"  } className="px-2" />
                 
            }

            { (incident.theft || showAll) && 
                <IonIcon src="/svgs/wewatch/theft.svg"  color={incident.theft ? "primary" : "medium"  } className="px-2" />
            }

            { (incident.loitering || showAll) && 
                <IonIcon src="/svgs/wewatch/loitering.svg"  color={incident.loitering ? "secondary" : "medium"  } className="px-2" />
                 
            }

            { (incident.disturbance || showAll) && 
                <IonIcon src="/svgs/wewatch/disturbance.svg" color={incident.disturbance ? "secondary" : "medium"  } className="px-2" />
                 
            }

            { (incident.suspicious || showAll) && 
                <IonIcon src="/svgs/wewatch/suspicious.svg" color={incident.suspicious ? "secondary" : "medium"  } className="px-2" />
                 
            }

            { (incident.unfamiliar || showAll) && 
                <IonIcon src="/svgs/wewatch/unfamiliar-person.svg" color={incident.unfamiliar ? "secondary" : "medium"  } className="px-2" />
            }
        </div>
    )
  }

export default CategoriesIcons;




