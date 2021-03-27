import React, { useState } from 'react';
import { Range, getTrackBackground } from 'react-range';

const YearsRange = ({ values, setValues }) => {
  return (
    <Range
      step={1}
      min={2000}
      max={2021}
      values={values}
      onChange={(values) => setValues(values)}
      renderTrack={({ props, children }) => (
        <div
          onMouseDown={props.onMouseDown}
          onTouchStart={props.onTouchStart}
          style={{
            ...props.style,
            height: '20px',
            display: 'flex',
            width: '100%',
          }}
        >
          <div
            ref={props.ref}
            style={{
              height: '5px',
              width: '100%',
              borderRadius: '4px',
              background: getTrackBackground({
                values,
                colors: ['#EBEBF9', '#00d555', '#EBEBF9'],
                min: 2000,
                max: 2021,
              }),
              alignSelf: 'center',
            }}
          >
            {children}
          </div>
        </div>
      )}
      renderThumb={({ index, props, isDragged }) => (
        <div
          {...props}
          style={{
            ...props.style,
            height: '13px',
            width: '13px',
            borderRadius: '50%',
            outline: 'none',
            backgroundColor: '#00d555',
          }}
        >
          <div
            style={{
              position: 'absolute',
              bottom: '-20px',
              right: '-50%',
              fontFamily: 'Poppins',
              fontStyle: 'normal',
              fontWeight: '500',
              fontSize: '12px',
              lineHeight: '20px',
              color: '#8E94A7',
            }}
          >
            {values[index]}
          </div>
        </div>
      )}
    />
  );
};

export default YearsRange;
