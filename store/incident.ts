import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import addHours from 'date-fns/addHours';
import { useState, useEffect } from 'react'
import { addToNewMap, arrayToMap, getPagination } from '../components/util/data'
import { dateString } from '../components/util/dates';

/**
 * @param {number} incidentId load user profile
 * @param {array[number]} incidentIds load users profile
 */
export const useStore = (props) => {
  const authUser = useUser();
  const supabase = useSupabaseClient();
  const [incidentIds, setIncidentIds] = useState([])
  const [incidents, setIncidents] = useState(new Map())

  // Update when the props changes (effect to listen for [props.incidentId])
  useEffect(() => {
    const handleAsync = async () => {
      // return new map to trigger consumer hooks
      return await fetchIncident(props.incidentId, (incident) => { setIncidents(addToNewMap(incidents, incident.id, incident))}, supabase);
    }
    
    if (props?.incidentId?.length > 0) {
      if(incidentIds.includes(props.incidentId)){
        return;
      }
      if(!incidentIds.includes(props.incidentId)){
          setIncidentIds([...incidentIds, props.incidentId]);
          handleAsync();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.incidentId, supabase])

  useEffect( () => {
    const handleAsync = async () => {
      return await fetchIncidents(props.incidentIds, (incidents) => setIncidents(arrayToMap(incidents,'id')), supabase);
    }
    if (props.incidentIds && props.incidentIds.length > 0){
      handleAsync();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.incidentIds, supabase])


//   useEffect( () => {
//     // load auth user profile
//     const handleAsync = async () => {
//       return await fetchUserIncidents(authUser.id, (incidents) => setUserIncidents(incidents)), supabase);
//     }

//     // check if authuser and profile
//     if (authUser){
//       // load from supabase
//       handleAsync();
//     } else{
//       // clear profile
//       setAuthUserProfile(undefined);
//     }
    
//   }, [authUser, supabase])

  return {
    // We can export computed values here to map the authors to each message
    incidents,
    incidentIds,
  }
}

/**
 * Fetch a users incidents
 * @param {number} incidentId
 * @param {function} setState Optionally pass in a hook or callback to set the state
 */
export const fetchUserIncidents = async (userId, setState, supabase) => {
  try {
    let result= await supabase.from('incidents').select(`*`).eq('user_id', userId)
    return result
  } catch (error) {
    console.log('error', error)
  }
}
export const fetchUserIncidentsPages = async (userId, setState, page=0, pageSize=100, supabase) => {
    try {
      const { from, to } = getPagination(page, pageSize);
      let result= await supabase.from('incidents').select(`*`).eq('user_id', userId).range(from, to);
      
      return result
    } catch (error) {
      console.log('error', error)
    }
  }

/**
 * Fetch a multiple incidents
 * @param {array} incidentIds
 * @param {function} setState Optionally pass in a hook or callback to set the state
 */
export const fetchIncidents = async (incidentIds, setState, supabase) => {
  try {
    const result = await supabase.from('incidents').select(`*`).in('id', incidentIds)
    if (setState) setState(result.data)
    return result
  } catch (error) {
    console.log('error', error)
  }
}

export const fetchIncident = async (incidentId, setState, supabase) => {
    try {
      const { data, error } = await supabase.from('incidents').select(`*`).eq('id', incidentId)
      let incident;
      if(data[0]) {
        incident = data[0];
        if (setState) setState(incident);
      }
      return { incident, error }
    } catch (error) {
      console.log('error', error)
    }
  }


/**
 * hide a message from the display
 * @param { incident } incident
 */
export const updateIncident = async (incident, supabase) => {
  try {
    const result = await supabase.from('incidents')
          .update(incident).eq('id', incident.id);
    return result
  } catch (error) {
    console.log('error', error)
  }
}

export const geoTimedSearch = async (lng, lat, distance, caller_id, ageInHours=72, supabase) => {
    const query = supabase
      .rpc('geo_caller_incidents', { x: lng, y: lat, distance: distance, caller_id: caller_id });
    // still visible

    query.eq('visible', true);
    // number of hours visible
    // query.gt('inserted_at', dateString(addHours(new Date(), -ageInHours)));
    debugger;
    
    // temporary-order-creation (not incidented_at, so we see newest, top for clicking)
    const result = await query.select("*").order('inserted_at',{ascending: false});

    return  result;
  }

  export const geoTimedSearchPaged = async (lng, lat, distance, caller_id, ageInHours=72, page=0, pageSize=100, supabase) => {
    const query = supabase
      .rpc('geo_caller_incidents', { x: lng, y: lat, distance: distance, caller_id: caller_id });
    
    // still visible
    query.eq('visible', true);
    // number of hours visible
    query.gt('inserted_at', dateString(addHours(new Date(), -ageInHours)));

    const { from, to } = getPagination(page, pageSize);
    // temporary-order-creation (not incidented_at, so we see newest, top for clicking)
    const result = await query.select("*").order('inserted_at',{ascending: false}).range(from, to);

    return  result;
  }