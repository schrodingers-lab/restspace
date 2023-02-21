import { IonItem, IonLabel, IonNote, IonButton, IonIcon } from "@ionic/react";
import { closeCircleOutline, flash } from "ionicons/icons";
import { useEffect, useState } from "react";
import { fetchChat } from "../../store/chat";
import { fetchIncident } from "../../store/incident";
import CategoriesIcons from "../ui/CategoriesIcons";
import ToggleDateDisplay from "../ui/ToggleDatesDisplay";



export const NotificationIncidentItem = ({ notification, supabase, itemKey, history, onDidDismiss, doCompleteNotification }) => {
    const [incident, setIncident] = useState<any>(null);
    const [error, setError] = useState<string>();

    useEffect(() => {
        const handleAsync = async () => {
            await setIncident(null);
            if (notification?.object_type == 'incidents' && notification?.object_id) {
                const { data, error } = await fetchIncident(notification.object_id,  supabase );
                setIncident(data)
                if(error){
                    setError(error.message)
                }
            }
        }
        if(notification){
            handleAsync();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [notification])

    const visitNotificationObject = () => {
        if (incident) {
            history.push('/tabs/incidents/' + incident.id);
        } 
        if(onDidDismiss){
            onDidDismiss();
        }
    }

    return (
        <IonItem key={itemKey}>
            <IonIcon slot="start" icon={flash} onClick={(e) => {e.preventDefault(); visitNotificationObject()}}/>
            <IonLabel >
                <h4 onClick={(e) => {e.preventDefault(); visitNotificationObject()}} >{`#${incident?.id}-${incident?.name}`}</h4>
                {incident &&<CategoriesIcons incident={incident} showAll={false}/>}
                <IonNote slot="end"><ToggleDateDisplay input_date={notification?.created_at} /></IonNote>
            </IonLabel>
         
        {/*  */}
        <IonButton slot="end" color="dark" onClick={(e) => {e.preventDefault(); doCompleteNotification(notification, supabase)}}>
            <IonIcon icon={closeCircleOutline} />
        </IonButton>
        </IonItem>
    );  
}

export default  NotificationIncidentItem ;