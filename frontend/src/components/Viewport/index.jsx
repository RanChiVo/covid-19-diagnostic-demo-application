import React, { Component } from 'react';
import CornerstoneViewport from 'react-cornerstone-viewport'
// https://github.com/conorhastings/react-syntax-highlighter
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

import initCornerstone from './initCornerstone.js';

class ExamplePageBasic extends Component {
    componentWillMount() {
        initCornerstone();
      }
  
  state = {
    tools: [
      // Mouse
      {
        name: 'Wwwc',
        mode: 'active',
        modeOptions: { mouseButtonMask: 1 },
      },
      {
        name: 'Zoom',
        mode: 'active',
        modeOptions: { mouseButtonMask: 2 },
      },
      {
        name: 'Pan',
        mode: 'active',
        modeOptions: { mouseButtonMask: 4 },
      },
      // Scroll
      { name: 'StackScrollMouseWheel', mode: 'active' },
      // Touch
      { name: 'PanMultiTouch', mode: 'active' },
      { name: 'ZoomTouchPinch', mode: 'active' },
      { name: 'StackScrollMultiTouch', mode: 'active' },
    ],
    "assets/a.dcm"s: [
        "example://1",
    ],
  };

  render() {
    return (
      <div>
        <h2>Basic Demo</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          <CornerstoneViewport
            tools={this.state.tools}
            "assets/a.dcm"s={this.state."assets/a.dcm"s}
            style={{ minWidth: '100%', height: '512px', flex: '1' }}
          />
        </div>

        <h2>Source / Usage</h2>
        <div style={{ marginTop: '35px' }}>
          <SyntaxHighlighter
            language="jsx"
            showLineNumbers={true}
            style={atomDark}
          >
            {`state = {
  tools: [
    // Mouse
    {
      name: 'Wwwc',
      mode: 'active',
      modeOptions: { mouseButtonMask: 1 },
    },
    {
      name: 'Zoom',
      mode: 'active',
      modeOptions: { mouseButtonMask: 2 },
    },
    {
      name: 'Pan',
      mode: 'active',
      modeOptions: { mouseButtonMask: 4 },
    },
    // Scroll
    { name: 'StackScrollMouseWheel', mode: 'active' },
    // Touch
    { name: 'PanMultiTouch', mode: 'active' },
    { name: 'ZoomTouchPinch', mode: 'active' },
    { name: 'StackScrollMultiTouch', mode: 'active' },
  ],
  "assets/a.dcm"s: [
    'dicomweb://s3.amazonaws.com/lury/PTCTStudy/1.3.6.1.4.1.25403.52237031786.3872.20100510032220.11.dcm',
    'dicomweb://s3.amazonaws.com/lury/PTCTStudy/1.3.6.1.4.1.25403.52237031786.3872.20100510032220.12.dcm',
  ],
};
{/* RENDER */}
<CornerstoneViewport
  tools={this.state.tools}
  "assets/a.dcm"s={this.state."assets/a.dcm"s}
  style={{ minWidth: '100%', height: '512px', flex: '1' }}
/>`}
          </SyntaxHighlighter>
        </div>
      </div>
    );
  }
}

export default ExamplePageBasic;