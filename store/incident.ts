import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import addHours from 'date-fns/addHours';
import { useState, useEffect } from 'react'
import { addToNewMap, arrayToMap, getPagination } from '../components/util/data'
import { dateString } from '../components/util/dates';
import { Store } from 'pullstate';
import { enableMapSet } from 'immer';

enableMapSet();

export const IncidentStore = new Store({
  incidents: new Map(),
  incidentIds: []
});
/**
 * @param {number} incidentId load user profile
 * @param {array[number]} incidentIds load users profile
 */
export const useStore = (props) => {
  const authUser = useUser();
  const supabase = useSupabaseClient();

  const incidents = IncidentStore.useState(s => s.incidents);
  const [incidentIds, setIncidentIds] = useState([])

  // Update when the props changes (effect to listen for [props.incidentId])
  useEffect(() => {
    const handleAsync = async () => {
      // return new map to trigger consumer hooks
      const result = await fetchIncident(props.incidentId, supabase);
      if(incidents.has(props.incidentId)){
        IncidentStore.update(s => {
          s.incidents =  s.incidents.set(props.incidentId, result.data);
        })
      }
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
      const result =  await fetchIncidents(props.incidentIds, supabase);
      return result;
    }
    if (props.incidentIds && props.incidentIds.length > 0){
      handleAsync();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.incidentIds, supabase])

  return {
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
export const fetchUserIncidentsPages = async (userId, page=0, pageSize=100, supabase) => {
    try {
      const { from, to } = getPagination(page, pageSize);
      let count = await supabase.from('incidents').select(`*`).eq('user_id', userId).range(from, to);
      let data = await supabase.from('incidents').select(`*`).eq('user_id', userId).range(from, to);
      
      return {data, count, page, pageSize}
    } catch (error) {
      console.log('error', error)
    }
  }

/**
 * Fetch a multiple incidents
 * @param {array} incidentIds
 * @param {function} setState Optionally pass in a hook or callback to set the state
 */
export const fetchIncidents = async (incidentIds, supabase) => {
  try {
    const result = await supabase.from('incidents').select(`*`).in('id', incidentIds)
    IncidentStore.update(s => {
      s.incidents = arrayToMap(result.data,'id')
    });
    return result
  } catch (error) {
    console.log('error', error)
  }
}

export const fetchIncident = async (incidentId, supabase) => {
    try {
      const result = await supabase.from('incidents').select(`*`).eq('id', incidentId).single();
      return result
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
    IncidentStore.update(s => {
      s.incidents = s.incidents.set(incident.id, result.data);
    });
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
    query.gt('inserted_at', dateString(addHours(new Date(), -ageInHours)));

    
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

  /**
 * hide a message from the display
 * @param {number} incident_id
 */
export const hideIncident = async (incident_id, supabase) => {
  try {
    let { data } = await supabase.from('incidents')
          .update({visible: false} ).eq('id', incident_id);
    return data
  } catch (error) {
    console.log('error', error)
  }
}

/**
* unhide a message from the display
* @param {number} incident_id
*/
export const unhideIncident = async (incident_id, supabase) => {
  try {
    let { data } = await supabase.from('incidents')
          .update({visible: true} ).eq('id', incident_id);
    return data
  } catch (error) {
    console.log('error', error)
  }
}


export const createIncident = async (insertData, supabase) => {
  try {
    let { data, error } = await supabase.from('incidents')
          .insert(insertData ).select();
    return  { data, error } 
  } catch (error) {
    console.log('error', error)
  }
}
