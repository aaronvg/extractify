import React from 'react';

declare module "@redheadphone/react-json-grid" {
  export interface JSONGridProps {
    data: any;
  }

  const JSONGrid: React.FC<JSONGridProps>;
  export default JSONGrid;
}