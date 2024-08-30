import { firestore } from 'app/firebase';
import { deleteDoc, doc, getFirestore, setDoc, updateDoc } from 'firebase/firestore';




export function useFirestore() {
    const insertTo = async (col: string, insertObject: any, id:string) => { 
        const reference = doc(firestore, col, id);

        await setDoc(reference, insertObject);
    };

    const updateDocument = async (col: string, id: string, data:any) => {
             const reference = doc(firestore, col, id);
        await updateDoc(reference, data);
    }
    
    const deleteDocument = async (col: string, id: string) => { 
        const reference = doc(firestore, col, id);
        await deleteDoc(reference);
    }

    return {insertTo, updateDocument, deleteDocument}
}

