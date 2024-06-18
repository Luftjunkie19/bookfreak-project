'use client';
import React, { RefObject } from 'react'
import AvatarEditor from 'react-avatar-editor'

type Props = { userEditImage: string | File, editorRef: RefObject<AvatarEditor>, handleZoom: (zoomLevel: number) => void, handleSaveImg: () => void, zoomLevel: number }

function Editor({ userEditImage, editorRef, handleSaveImg, handleZoom, zoomLevel }: Props) {
    return (
        <div className="fixed top-0 left-0 flex justify-center items-center w-full h-full bg-imgCover p-4">
            <div className="flex gap-2 flex-col max-w-md w-full">
                <AvatarEditor
                    image={userEditImage}
                    ref={editorRef}
                    width={300}
                    height={300}
                    color={[0, 0, 0, 0.5]}
                    scale={zoomLevel}
                />

                <label className="flex flex-col my-3">
                    <span>Zoom:</span>
                    <input
                        className="range range-xs range-info sm:w-32 md:w-64"
                        type="range"
                        min={1}
                        max={3}
                        step={0.1}
                        value={zoomLevel}
                        onChange={(e) => handleZoom(+e.target.value)}
                    />
                </label>
                <button
                    className="btn bg-accColor text-white border-none hover:bg-green-400 hover:text-black"
                    onClick={handleSaveImg}
                >

                </button>
            </div>
        </div>
    )
}

export default Editor