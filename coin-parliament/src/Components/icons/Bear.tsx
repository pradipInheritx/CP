import React from "react";

const Bear = ({ color = "#6352e8" }: { color?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="56.494"
      height="57.66"
      viewBox="0 0 56.494 57.66"
    >
      <g id="bear" transform="translate(0.604 0.5)">
        <path
          id="Path_3657"
          data-name="Path 3657"
          d="M55.028,25.093l.292-.078a19.3,19.3,0,0,0-.38-2.164,29.556,29.556,0,0,0-4.8-9.039,1.5,1.5,0,0,1-.162-1.8,13.129,13.129,0,0,0,1.516-6.846A5,5,0,0,0,46.055.157,14.257,14.257,0,0,0,40.224,1.9a8.467,8.467,0,0,1-3.993,1.107,12.27,12.27,0,0,0-6.479.731c-1.6.753-3.086.409-4.684-.1A10.388,10.388,0,0,0,20.7,3a8.855,8.855,0,0,1-5.936-1.406A10.528,10.528,0,0,0,8.313.048,4.854,4.854,0,0,0,3.822,4.214a11.663,11.663,0,0,0,1.6,7.944,1.468,1.468,0,0,1-.085,1.7C3.789,16.5,2.262,19.166.863,21.893A15.438,15.438,0,0,0,0,25.075l.366.112c.123-.221.248-.44.368-.663s.228-.438.342-.657l.3.226c-.843,4.055-1.063,8.074.48,12.159l.65-.844a15.674,15.674,0,0,0,6.912,9.239l-.191-1.439a39.53,39.53,0,0,0,3.35,2.935,39.03,39.03,0,0,0,3.944,2.149c-.747-1.58-1.361-2.761-1.848-3.991-.119-.3.175-.767.279-1.156.324.173.784.263.95.534a15.737,15.737,0,0,1,1.785,3.31,14.759,14.759,0,0,0,9.024,9.469,2.837,2.837,0,0,0,1.972,0,19.667,19.667,0,0,0,2.946-1.713,9.96,9.96,0,0,0,2.636-1.881,34.417,34.417,0,0,0,2.814-4.624c.735-1.345,1.28-2.794,2.041-4.121.263-.458.922-.69,1.4-1.024a5.149,5.149,0,0,1,.016,1.864A27.521,27.521,0,0,1,38.9,48.037c3.236-.771,5.429-2.87,7.519-5.173-.148.5-.3,1-.535,1.816,3.991-2.257,5.882-5.655,7.075-9.724l.71,1.118c1.48-4.083,1.274-8.028.568-12.058Z"
          fill="none"
          stroke={color}
          strokeMiterlimit="10"
          strokeWidth="1"
        />
      </g>
    </svg>
  );
};

export default Bear;
