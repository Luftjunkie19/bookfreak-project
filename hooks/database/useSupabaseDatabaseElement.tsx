import { createClient } from 'lib/supabase/client';
import React, { useCallback, useEffect, useState } from 'react'

type Props = {
    tableName: string,
    id:string,
}

function useSupabaseDatabaseElement(  tableName: string,
    id:string) {
    const supabase = createClient();
    const [element, setElement] = useState<any>(null); 

    const retrieveItem = useCallback(async () => {
        const { data } = await supabase.from(tableName).select('*').eq('id', id);
        if (data) setElement(data[0]);
    },[tableName, id])

    useEffect(() => {
        retrieveItem();
    }, [retrieveItem]);


    return {element}

}

export default useSupabaseDatabaseElement