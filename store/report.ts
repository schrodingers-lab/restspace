import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import addHours from 'date-fns/addHours';
import { useState, useEffect } from 'react'
import { addToNewMap, arrayToMap, getPagination } from '../components/util/data'
import { dateString } from '../components/util/dates';

/**
 * @param {number} reportId load user profile
 * @param {array[number]} reportIds load users profile
 */
export const useStore = (props) => {
  const authUser = useUser();
  const supabase = useSupabaseClient();
  const [reportIds, setReportIds] = useState([])
  const [reports, setReports] = useState(new Map())

  // Update when the props changes (effect to listen for [props.reportId])
  useEffect(() => {
    const handleAsync = async () => {
      // return new map to trigger consumer hooks
      return await fetchReport(props.reportId, (report) => { setReports(addToNewMap(reports, report.id, report))}, supabase);
    }
    
    if (props?.reportId?.length > 0) {
      if(reportIds.includes(props.reportId)){
        return;
      }
      if(!reportIds.includes(props.reportId)){
          setReportIds([...reportIds, props.reportId]);
          handleAsync();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.reportId, supabase])

  useEffect( () => {
    const handleAsync = async () => {
      return await fetchReports(props.reportIds, (reports) => setReports(arrayToMap(reports,'id')), supabase);
    }
    if (props.reportIds && props.reportIds.length > 0){
      handleAsync();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.reportIds, supabase])


//   useEffect( () => {
//     // load auth user profile
//     const handleAsync = async () => {
//       return await fetchUserReports(authUser.id, (reports) => setUserReports(reports)), supabase);
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
    reports,
    reportIds,
  }
}

/**
 * Fetch a users reports
 * @param {number} reportId
 * @param {function} setState Optionally pass in a hook or callback to set the state
 */
export const fetchUserReports = async (userId, setState, supabase) => {
  try {
    let result= await supabase.from('reports').select(`*`).eq('user_id', userId)
    return result
  } catch (error) {
    console.log('error', error)
  }
}
export const fetchUserReportsPaged = async (userId, setState, page=0, pageSize=100, supabase) => {
    try {
      const { from, to } = getPagination(page, pageSize);
      let result= await supabase.from('reports').select(`*`).eq('user_id', userId).range(from, to);
      
      return result
    } catch (error) {
      console.log('error', error)
    }
  }

/**
 * Fetch a multiple reports
 * @param {array} reportIds
 * @param {function} setState Optionally pass in a hook or callback to set the state
 */
export const fetchReports = async (reportIds, setState, supabase) => {
  try {
    const result = await supabase.from('reports').select(`*`).in('id', reportIds)
    if (setState) setState(result.data)
    return result
  } catch (error) {
    console.log('error', error)
  }
}

export const fetchReport = async (reportId, setState, supabase) => {
    try {
      const { data, error } = await supabase.from('reports').select(`*`).eq('id', reportId)
      let report;
      if(data[0]) {
        report = data[0];
        if (setState) setState(report);
      }
      return { report, error }
    } catch (error) {
      console.log('error', error)
    }
  }


/**
 * Update record
 * @param { report } report
 */
export const updateReport = async (report, supabase) => {
  try {
    const result = await supabase.from('reports')
          .update(report).eq('id', report.id);
    return result
  } catch (error) {
    console.log('error', error)
  }
}

/**
 * Update record
 * @param { reportData } reportData
 */
export const createReport = async (reportData, supabase) => {
    try {
      const result = await supabase.from('reports')
            .insert(reportData).select();
      return result
    } catch (error) {
      console.error('error createReport', error)
    }
  }
