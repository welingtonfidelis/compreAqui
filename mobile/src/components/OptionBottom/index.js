import React, { useRef, useEffect, useState } from 'react';
import RBSheet from "react-native-raw-bottom-sheet";

export default function PhotoModal({ show, setShow, children }) {
    const refRBSheet = useRef();
    const [ctrl, setCtrl] = useState(false);

    useEffect(() => {
        if(ctrl) refRBSheet.current.open(); 
        else refRBSheet.current.close();

        setCtrl(!ctrl);
    }, [show]);

    return (
        <RBSheet
            ref={refRBSheet}
            animationType={"fade"}
            dragFromTopOnly={true}
            closeOnDragDown={true}
            closeOnPressMask={false}
            onClose={() => setShow(false)}
            customStyles={{
                wrapper: {
                    //backgroundColor: "transparent",
                },
                container: {
                    borderRadius: 20,
                    marginBottom: -17,
                    // height: 220,
                    backgroundColor: '#444',
                },
                draggableIcon: {
                    backgroundColor: "#F2BB16"
                }
            }}
        >
            {children}

        </RBSheet>
    )
}