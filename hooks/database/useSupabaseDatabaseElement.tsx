import { createClient } from 'lib/supabase/client';
import React, { useEffect, useState } from 'react'

type Props = {
    tableName: string,
    id:string,
}

function useSupabaseDatabaseElement({ tableName, id }: Props) {
    const supabase = createClient();
    const [element, setElement] = useState<any>(null); 

    useEffect(() => {
        const elements = supabase.realtime.channel(tableName).on('*');
    },[])



}

export default useSupabaseDatabaseElement