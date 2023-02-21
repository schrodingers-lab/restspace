import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { useState, useEffect } from 'react'

export const generateRandomString = (length: number)=> {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result
}

export const generateRandomFilename = (filenameWithExtension: string) => {
    const fileext = filenameWithExtension.substring(filenameWithExtension.lastIndexOf("."));
    return generateRandomString(32) + fileext;
}

export const updateFileRelatedObject = async (file_id, object_type, object_id, supabase) => {
      const res =  await supabase.from('files')
        .update({object_type: object_type, object_id: ""+ object_id}).eq('id', file_id);
      return res;
}

export const hideFileRecord = async (file_id, supabase) => {
    const res =  await supabase.from('files')
      .update({visible: false}).eq('id', file_id);
    return res;
}

export const fileUrl = (file) => {
    return "https://raxdwowfheboqizcxlur.supabase.co"+ file?.file_name;
}

export const publicFileUrlFragment = () => {
    return '/storage/v1/object/public/public/';
}

export const useStore = (props) => {
    const supabase = useSupabaseClient();
    const authUser = useUser();
}