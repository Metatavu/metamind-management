import * as React from 'react';

export const NODE_KEY = 'id'; // Key used to identify nodes

export const TEXT_TYPE = 'text';
export const PENDING_TYPE = 'pending';
export const GLOBAL_TYPE = 'global';
export const OPENNLP_EDGE_TYPE = 'openNlp';
export const SPECIAL_CHILD_SUBTYPE = 'specialChild';

export const nodeTypes = [TEXT_TYPE, PENDING_TYPE];
export const edgeTypes = [OPENNLP_EDGE_TYPE];

const TextShape = (width,height,color)=>(
  <svg  width={width} height={height} id="text" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <path d="M62,31c0-2.344-1.012-4.449-2.619-5.912C59.779,24.137,60,23.095,60,22c0-4.08-3.054-7.446-7-7.938 l-0.072,1.145c-0.347-2.607-2.348-4.69-4.926-5.124l-0.015,0.184C47.989,10.177,48,10.09,48,10c0-4.418-3.582-8-8-8s-8,3.582-8,8 v45c0,3.866,3.134,7,7,7c2.809,0,5.225-1.659,6.34-4.047C45.559,57.974,45.776,58,46,58c3.866,0,7-3.134,7-7v-0.422 c1.564-0.684,2.708-2.143,2.949-3.893L56,46.71c2.891-0.861,5-3.539,5-6.71c0-1.347-0.387-2.601-1.047-3.669 C61.222,34.915,62,33.051,62,31z M44,41l0.104,0.05C43.911,41.293,43.853,41.311,44,41z"
      fill={color} />
      <path d="M32,47c-8.271,0-15-6.729-15-15s6.729-15,15-15v2c-7.168,0-13,5.832-13,13s5.832,13,13,13V47z"
      fill="#e56565" />
      <path d="M28.843,51.728c-5.251-0.834-10.041-3.804-13.141-8.146l1.628-1.162 c2.791,3.909,7.101,6.582,11.826,7.333L28.843,51.728z"
      fill="#e56565" />
      <path d="M14.387,41.473C12.825,38.583,12,35.307,12,32c0-9.879,7.083-18.176,16.843-19.728l0.314,1.975 C20.375,15.644,14,23.11,14,32c0,2.977,0.742,5.923,2.146,8.521L14.387,41.473z"
      fill="#e56565" />
      <g fill="#3f3a34">
          <path d="M63,31c0-2.306-0.891-4.511-2.461-6.175C60.834,23.936,61,22.987,61,22 c0-4.444-3.26-8.215-7.622-8.887c-0.825-1.832-2.417-3.25-4.415-3.829C48.597,4.656,44.721,1,40,1c-2.826,0-5.349,1.312-7,3.356V1 h-7.781l-1.596,6.382c-1.051,0.358-2.091,0.791-3.103,1.291l-5.646-3.388l-9.59,9.589l3.388,5.646 c-0.501,1.015-0.934,2.055-1.291,3.104L1,25.22V38.78l6.382,1.596c0.417,1.223,0.936,2.434,1.545,3.605l1.774-0.922 c-0.646-1.241-1.18-2.527-1.588-3.82l-0.168-0.534L3,37.219V26.781l5.945-1.486l0.168-0.534c0.409-1.293,0.943-2.579,1.588-3.82 l0.258-0.496l-3.157-5.26l7.381-7.382l5.261,3.157l0.497-0.259c1.236-0.644,2.521-1.178,3.819-1.587l0.534-0.169L26.781,3H31v58 h-4.219l-1.486-5.945l-0.534-0.169c-1.297-0.409-2.583-0.943-3.819-1.587l-0.497-0.259l-5.261,3.157l-7.933-7.934l-1.414,1.414 l9.038,9.037l5.646-3.388c1.012,0.5,2.052,0.933,3.103,1.291L25.219,63H33v-2.726C34.467,61.941,36.61,63,39,63 c2.956,0,5.536-1.615,6.921-4.006C45.947,58.995,45.974,59,46,59c4.346,0,7.886-3.485,7.99-7.806 c1.387-0.802,2.421-2.14,2.822-3.732C59.886,46.3,62,43.323,62,40c0-1.236-0.289-2.453-0.842-3.559C62.351,34.877,63,32.971,63,31 z M59.103,36.856C59.689,37.807,60,38.894,60,40c0,2.179-1.215,4.159-3.058,5.208C56.552,42.274,54.04,40,51,40v2 c2.206,0,4,1.794,4,4s-1.794,4-4,4s-4-1.794-4-4h-2c0,3.309,2.691,6,6,6c0.314,0,0.62-0.032,0.922-0.078 c-0.408,2.627-2.521,4.693-5.172,5.026C46.907,56.323,47,55.673,47,55c0-4.411-3.589-8-8-8v2c3.309,0,6,2.691,6,6s-2.691,6-6,6 s-6-2.691-6-6V10c0-3.859,3.14-7,7-7s7,3.141,7,7s-3.14,7-7,7v2c4.493,0,8.216-3.312,8.883-7.621C50.735,12.128,52,13.923,52,16 c0,2.757-2.243,5-5,5v2c3.86,0,7-3.141,7-7c0-0.242-0.015-0.48-0.039-0.716C56.897,16.139,59,18.852,59,22c0,3.859-3.14,7-7,7v2 c3.196,0,6.001-1.679,7.598-4.197C60.499,28.004,61,29.474,61,31c0,1.718-0.636,3.374-1.792,4.664l-0.499,0.557L59.103,36.856z"
          />
          <rect height="2" width="2" x="37" y="54" />
          <rect height="2" width="2" x="42" y="31" />
          <rect height="2" width="2" x="36" y="9" />
          <rect height="2" width="2" x="53" y="24" />
          <rect height="2" width="2" x="35" y="38" />
          <rect height="2" width="2" x="54" y="36" />
      </g>
  </svg>
);

const PendingShape = (
  <svg width="150" id="pending" height="150" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"
  preserveAspectRatio="xMidYMid" className="lds-eclipse" style={{ backgroundColor:
  "rgba(0,0,0,0)" }}>
      <path d="M10 50A40 40 0 0 0 90 50A40 42 0 0 1 10 50" fill="currentColor">
          <animateTransform attributeName="transform" type="rotate" calcMode="linear"
          values="0 50 51;360 50 51" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"
          />
      </path>
  </svg>
);

const SpecialChildShape = (
  <symbol viewBox="0 0 154 154" id="specialChild">
    <rect x="2.5" y="0" width="154" height="154" fill="rgba(30, 144, 255, 0.12)" />
  </symbol>
);

const OpenNlpEdgeShape = (
  <symbol viewBox="0 0 50 50" id="openNlp">
    <circle cx="25" cy="25" r="8" fill="currentColor" />
  </symbol>
);

const GlobalShape = (width,height,color)=>(
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} id="global" viewBox="0 0 64 64">
    <g id="g1278">
      <g id="g1130">
          <polygon points="20,31 25,27 44,27 44,49 20,49" id="polygon1128" fill={color}
          />
      </g>
      <g id="g1134">
          <rect height="6" width="2" x="25" y="18" id="rect1132" fill="#e56565"
          />
      </g>
      <g id="g1138">
          <rect height="2" width="2" x="25" y="14" id="rect1136" fill="#e56565"
          />
      </g>
      <g id="g1142">
          <rect height="6" width="2" x="29" y="18" id="rect1140" fill="#e56565"
          />
      </g>
      <g id="g1146">
          <rect height="2" width="2" x="29" y="14" id="rect1144" fill="#e56565"
          />
      </g>
      <g id="g1150">
          <rect height="6" width="2" x="37" y="18" id="rect1148" fill="#e56565"
          />
      </g>
      <g id="g1154">
          <rect height="2" width="2" x="37" y="14" id="rect1152" fill="#e56565"
          />
      </g>
      <g id="g1158">
          <rect height="6" width="2" x="33" y="18" id="rect1156" fill="#e56565"
          />
      </g>
      <g id="g1162">
          <rect height="2" width="2" x="33" y="14" id="rect1160" fill="#e56565"
          />
      </g>
      <g id="g1166">
          <rect height="2" width="4" x="13" y="43" id="rect1164" fill="#e56565"
          />
      </g>
      <g id="g1170">
          <rect height="2" width="2" x="9" y="43" id="rect1168" fill="#e56565" />
      </g>
      <g id="g1174">
          <rect height="2" width="4" x="13" y="39" id="rect1172" fill="#e56565"
          />
      </g>
      <g id="g1178">
          <rect height="2" width="2" x="9" y="39" id="rect1176" fill="#e56565" />
      </g>
      <g id="g1182">
          <rect height="2" width="4" x="13" y="31" id="rect1180" fill="#e56565"
          />
      </g>
      <g id="g1186">
          <rect height="2" width="2" x="9" y="31" id="rect1184" fill="#e56565" />
      </g>
      <g id="g1190">
          <rect height="2" width="4" x="13" y="35" id="rect1188" fill="#e56565"
          />
      </g>
      <g id="g1194">
          <rect height="2" width="2" x="9" y="35" id="rect1192" fill="#e56565" />
      </g>
      <g id="g1198">
          <rect height="7" width="2" x="37" y="52" id="rect1196" fill="#e56565"
          />
      </g>
      <g id="g1202">
          <rect height="2" width="2" x="37" y="61" id="rect1200" fill="#e56565"
          />
      </g>
      <g id="g1206">
          <rect height="7" width="2" x="33" y="52" id="rect1204" fill="#e56565"
          />
      </g>
      <g id="g1210">
          <rect height="2" width="2" x="33" y="61" id="rect1208" fill="#e56565"
          />
      </g>
      <g id="g1214">
          <rect height="7" width="2" x="25" y="52" id="rect1212" fill="#e56565"
          />
      </g>
      <g id="g1218">
          <rect height="2" width="2" x="25" y="61" id="rect1216" fill="#e56565"
          />
      </g>
      <g id="g1222">
          <rect height="7" width="2" x="29" y="52" id="rect1220" fill="#e56565"
          />
      </g>
      <g id="g1226">
          <rect height="2" width="2" x="29" y="61" id="rect1224" fill="#e56565"
          />
      </g>
      <g id="g1230">
          <rect height="2" width="4" x="47" y="31" id="rect1228" fill="#e56565"
          />
      </g>
      <g id="g1234">
          <rect height="2" width="2" x="53" y="31" id="rect1232" fill="#e56565"
          />
      </g>
      <g id="g1238">
          <rect height="2" width="4" x="47" y="35" id="rect1236" fill="#e56565"
          />
      </g>
      <g id="g1242">
          <rect height="2" width="2" x="53" y="35" id="rect1240" fill="#e56565"
          />
      </g>
      <g id="g1246">
          <rect height="2" width="4" x="47" y="43" id="rect1244" fill="#e56565"
          />
      </g>
      <g id="g1250">
          <rect height="2" width="2" x="53" y="43" id="rect1248" fill="#e56565"
          />
      </g>
      <g id="g1254">
          <rect height="2" width="4" x="47" y="39" id="rect1252" fill="#e56565"
          />
      </g>
      <g id="g1258">
          <rect height="2" width="2" x="53" y="39" id="rect1256" fill="#e56565"
          />
      </g>
      <g id="g1276" fill="#3f3a34">
          <path d="M 61.208,15.441 36.235,2.063 c -2.596,-1.391 -5.875,-1.391 -8.471,0 L 2.792,15.441 C 1.687,16.033 1,17.18 1,18.435 v 0.169 C 1,20.477 2.523,22 4.396,22 c 0.56,0 1.116,-0.141 1.61,-0.406 L 30.594,8.354 c 0.861,-0.464 1.951,-0.464 2.812,0 l 24.588,13.239 c 0.494,0.266 1.05,0.406 1.61,0.406 C 61.477,22 63,20.477 63,18.604 V 18.435 C 63,17.18 62.313,16.033 61.208,15.441 Z M 61,18.604 C 61,19.374 60.374,20 59.604,20 59.374,20 59.146,19.942 58.942,19.833 L 34.354,6.594 C 33.633,6.205 32.819,6 32,6 31.181,6 30.367,6.205 29.646,6.594 L 5.058,19.833 C 4.854,19.942 4.626,20 4.396,20 3.626,20 3,19.374 3,18.604 v -0.169 c 0,-0.516 0.282,-0.987 0.737,-1.23 L 28.709,3.826 c 2.018,-1.08 4.564,-1.08 6.582,0 L 60.263,17.204 C 60.718,17.448 61,17.919 61,18.435 Z"
          id="path1260" />
          <polygon points="23,56 23,54 7,54 7,24 5,24 5,56" id="polygon1262" />
          <polygon points="59,56 59,24 57,24 57,54 41,54 41,56" id="polygon1264"
          />
          <path d="M 45,26 H 24.649 L 19,30.52 V 50 H 45 Z M 43,48 H 21 V 31.48 L 25.351,28 H 43 Z"
          id="path1266" />
      </g>
    </g>
  </svg>
);


export default {
  EdgeTypes: {
    openNlp: {
      shape: OpenNlpEdgeShape,
      shapeId: '#openNlp'
    }
  },
  NodeSubtypes: {
    specialChild: {
      shape: SpecialChildShape,
      shapeId: '#specialChild'
    }
  },
  NodeTypes: {
    text: {
      shape: TextShape,
      shapeId: "#text",
      typeText: 'Text'
    },
    global: {
      shape: GlobalShape,
      shapeId: "#global",
      typeText: 'Global'
    },
    pending: {
      shape: PendingShape,
      shapeId: "#pending",
      typeText: "Pending"
    }
  }
};
