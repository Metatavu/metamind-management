import * as React from 'react';

export const NODE_KEY = 'id'; // Key used to identify nodes

export const TEXT_TYPE = 'text';
export const GLOBAL_TYPE = 'global';
export const OPENNLP_EDGE_TYPE = 'openNlp';
export const SPECIAL_CHILD_SUBTYPE = 'specialChild';

export const nodeTypes = [TEXT_TYPE];
export const edgeTypes = [OPENNLP_EDGE_TYPE];

const TextShape = (
  <symbol viewBox="0 0 88 72" id="text" width="88" height="88">
    <path d="M 0 36 18 0 70 0 88 36 70 72 18 72Z"></path>
  </symbol>
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

const GlobalShape = (
  <symbol viewBox="0 0 100 100" id="global" width="100" height="100">
    <circle cx="50" cy="50" r="50" fill="currentColor" />
  </symbol>
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
    }
  }
};
