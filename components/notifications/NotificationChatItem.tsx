import { IonItem, IonLabel, IonNote, IonButton, IonIcon } from "@ionic/react";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { chatbubble, chatbubbles, closeCircleOutline, flash } from "ionicons/icons";
import { useEffect, useState } from "react";
import { fetchChat } from "../../store/chat";
import { fetchIncident } from "../../store/incident";
import CategoriesIcons from "../ui/CategoriesIcons";
import ToggleDateDisplay from "../ui/ToggleDatesDisplay";



export const NotificationChatItem = ({ notification, supabase, itemKey, history, onDidDismiss, doCompleteNotification }) => {
    const [incident, setIncident] = useState<any>(null);
    const [chat, setChat] = useState<any>();
    const [error, setError] = useState<string>();
    const [title, setTitle] = useState<string>();
    const [icon, setIcon] = useState<any>();

    useEffect(() => {
        const handleAsync = async () => {
            await setIncident(null);
            if (chat?.object_type == 'incidents' && chat?.object_id) {
                const { incident, error } = await fetchIncident(chat.object_id, setIncident, supabase );
                if(error){
                    setError(error.message)
                }
                setTitle(`#${incident.id}-${incident.name}`)
                setIcon(chatbubble)
            } else {
                setTitle(`#${chat.id}- ${chat.slug}`)
                setIcon(chatbubbles)
            }
        }
        if(chat){
            handleAsync();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chat])


    useEffect(() => {
        const handleAsync = async () => {
            await setChat(null);
            if (notification?.object_type == 'chats' && notification?.object_id) {
                const { data, error } = await fetchChat(notification.object_id, setChat, supabase );
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
        } else if (notification?.object_type == 'chats') {
            history.push('/tabs/chats/' + chat.id);
        } else {
            history.push('/tabs/chats/' + chat.id);
        }
        if(onDidDismiss){
            onDidDismiss();
        }
    }

    return (
        <IonItem key={itemKey}>
            <IonIcon slot="start" icon={icon} onClick={(e) => {e.preventDefault(); visitNotificationObject()}}/>
            <IonLabel >
                <h2 onClick={(e) => {e.preventDefault(); visitNotificationObject()}} >{title}</h2>
                {incident &&<CategoriesIcons incident={incident} showAll={false}/>}
                <IonNote slot="end"><ToggleDateDisplay input_date={notification.created_at} /></IonNote>
            </IonLabel>
         
        {/*  */}
        <IonButton slot="end" color="dark" onClick={(e) => {e.preventDefault(); doCompleteNotification(notification, supabase)}}>
            <IonIcon icon={closeCircleOutline} />
        </IonButton>
        </IonItem>
    );  
}

export default  NotificationChatItem ;