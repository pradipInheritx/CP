import React from "react";

type HeartProps = {
  on: boolean;
  color?: string;
  size?:number;
};

const HeartSave = ({ on, color = "#6352e8",size }: HeartProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size ?? "16.429"}
      height={size ?? "15.404"}
      viewBox="0 0 16.429 15.404"
    >
      <g
        id="heart_save"
        data-name="heart save"
        transform="translate(0.595 0.517)"
      >
        <path
          id="Path_3325"
          data-name="Path 3325"
          d="M7.621,14.288C-6.985,4.637,3.124-2.9,7.453,1.089c.057.052.113.107.168.163q.081-.084.168-.162C12.117-2.9,22.226,4.636,7.621,14.288Z"
          transform="translate(0 0)"
          fill={on ? color : "transparent"}
          stroke={size&& !on ?'white':color}
          strokeWidth="1"
          fillRule="evenodd"
        />
      </g>
    </svg>
  );
};

export default HeartSave;
