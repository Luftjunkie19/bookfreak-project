'use client';
import { usePathname } from 'next/navigation';
import React from 'react'


export function useCheckPathname() {

    const pathname = usePathname();

    const includesElements = (includingElements:string) => {
        return  pathname.includes(includingElements)
    }

    return {
        includesElements
    }
}

