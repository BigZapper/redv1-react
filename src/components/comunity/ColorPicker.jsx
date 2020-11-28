import React from 'react'
import { SketchPicker } from 'react-color';
import PropTypes from 'prop-types'
import { useState, useEffect, useRef } from 'react';

ColorPicker.propTypes = {
    onSubmitColor: PropTypes.func,
    onClickOutSide: PropTypes.func,
}

ColorPicker.defaultProps = {
    onSubmitColor: null,
    onClickOutSide: null
}

function ColorPicker(props) {
    const [background, setBackground] = useState(props.currentColor);
    function handleChangeComplete(color) {
        setBackground(color.hex);
        if (!props.onSubmitColor) return;
        props.onSubmitColor(color.hex);
    }

    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef);
    function useOutsideAlerter(ref) {
        useEffect(() => {
            /**
             * Alert if clicked on outside of element
             */
            function handleClickOutside(event) {
                if (ref.current && !ref.current.contains(event.target)) {
                    if(!props.onClickOutSide) return
                    props.onClickOutSide(true);
                }
            }

            // Bind the event listener
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                // Unbind the event listener on clean up
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [ref]);
    }
    return (
        <div ref={wrapperRef} className="picker-color">
            <SketchPicker
                color={background}
                onChangeComplete={handleChangeComplete}
            />
        </div>
    )
}


export default ColorPicker

