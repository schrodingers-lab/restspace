import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { useState, useEffect } from 'react'
import { Store } from 'pullstate';
import { addToNewMap, arrayToMap, getPagination } from '../components/util/data';
import { enableMapSet } from 'immer';

enableMapSet();

export const ReportStore = new Store({
  reports: new Map(),
  reportIds: []
});

/**
 * @param {number} reportId load user profile
 * @param {array[number]} reportIds load users profile
 */
export const useReportsStore = (props) => {
  const authUser = useUser();
  const supabase = useSupabaseClient();
  const [reportIds, setReportIds] = useState([])

  // Update when the props changes (effect to listen for [props.reportId])
  useEffect(() => {
    const handleAsync = async () => {
      // return new map to trigger consumer hooks
      const result =  await fetchReport(props.reportId, supabase);
      ReportStore.update(s => {
        s.reports = arrayToMap(result.data,'id')
      });
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
      const result =  await fetchReports(props.reportIds, supabase);
      ReportStore.update(s => {
        s.reports = arrayToMap(result.data,'id')
      });
    }
    if (props.reportIds && props.reportIds.length > 0){
      handleAsync();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.reportIds, supabase])

  return {
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
      ReportStore.update(s => {
        s.reports = arrayToMap(result.data,'id')
      });
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
export const fetchReports = async (reportIds,  supabase) => {
  try {
    const result = await supabase.from('reports').select(`*`).in('id', reportIds)
    ReportStore.update(s => {
      s.reports = arrayToMap(result.data,'id')
    });
    return result
  } catch (error) {
    console.error('error', error)
  }
}

export const fetchReport = async (reportId,  supabase) => {
    try {
      const { data, error } = await supabase.from('reports').select(`*`).eq('id', reportId).single();
      ReportStore.update(s => {
        s.reports = s.reports.set(data.id, data)
      });
      return { data, error }
    } catch (error) {
      console.error('error', error)
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
    ReportStore.update(s => {
      s.reports = s.reports.set(result.data.id, result.data)
    });
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
      debugger;
      const result = await supabase.from('reports')
            .insert(reportData).select().single();
      ReportStore.update(s => {
        s.reports = s.reports.set(result.data.id, result.data)
      });
      return result
    } catch (error) {
      console.error('error createReport', error)
    }
  }
