import { createClient } from 'lib/supabase/client';
import React from 'react'
import toast from 'react-hot-toast';

type Props = {}

function useSupabaseDatabaseActions() {
    const supabase = createClient();

    const insertToDatabase = async (tableName: string, object: any) => {
        try {
            await supabase.from(tableName).insert(object);
        } catch (error) {
            console.log(error);
        }
    }

    const deleteFromDatabase = async (tableName: string, id:string) => {
try {
    const { data, error } = await supabase.from(tableName).delete().eq('id', id);
    
    if (error) {
        toast.error(error.message);
        return;
    }
    
} catch (error) {
    console.log(error);
}
    }


    const updateElement = async (tableName: string, object: any) => {
        try {
            const { data, error } = await supabase.from(tableName).upsert(object, {
                'ignoreDuplicates': false,
            });

            if (error) {
                toast.error(error.message);
                return;
            }

            console.log(data);
            
        } catch (error) {
            console.log(error);
        }
    }
    



    return {
        insertToDatabase,
        deleteFromDatabase,
        updateElement
  }
}

export default useSupabaseDatabaseActions