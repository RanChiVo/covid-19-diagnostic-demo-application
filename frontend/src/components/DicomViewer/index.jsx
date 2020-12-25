// import React from "react";
// import Hammer from "hammerjs";
// import * as cornerstone from "cornerstone-core";
// import * as cornerstoneTools from "cornerstone-tools";
// import * as cornerstoneMath from "cornerstone-math";
// import dicomLoader from "./dicom-loader";
// import * as cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
// // import exampleImageIdLoader from "./exampleImageIdLoader";

// class DicomViewer extends React.Component {

//   componentWillMount() {
//     console.log("willMount")
//     cornerstoneTools.external.cornerstone = cornerstone;
//     cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
//     cornerstoneTools.external.Hammer = Hammer;
//     console.log("cornerstoneTools", cornerstoneTools)
//     dicomLoader(cornerstone);
//   }
//   componentDidMount() {
//     console.log("didMount")

//     this.loadImage();
//   }

//   dicomImage = null;
//   loadImage = () => {
//     const element = this.dicomImage;
//     console.log("Image",this.dicomImage )
//     // Listen for changes to the viewport so we can update the text overlays in the corner
//     function onImageRendered(e) {
//       const viewport = cornerstone.getViewport(e.target);

//       console.log("viewport",viewport )
//       // document.getElementById(
//       //   "mrbottomleft"
//       // ).textContent = `WW/WC: ${Math.round(
//       //   viewport.voi.windowWidth
//       // )}/${Math.round(viewport.voi.windowCenter)}`;
//       // document.getElementById(
//       //   "mrbottomright"
//       // ).textContent = `Zoom: ${viewport.scale.toFixed(2)}`;
//     }
//     element.addEventListener("cornerstoneimagerendered", onImageRendered);
//     const config = {
//       invert: true,
//       minScale: 0.25,
//       maxScale: 20.0,
//       preventZoomOutsideImage: false
//     };

//     console.log("cornerstoneTools", cornerstoneTools)
//     cornerstoneTools.zoom.setConfiguration(config);
//     document.getElementById("chkshadow").addEventListener("change", () => {
//       cornerstoneTools.length.setConfiguration({ shadow: this.checked });
//       cornerstoneTools.angle.setConfiguration({ shadow: this.checked });
//       cornerstone.updateImage(element);
//     });
//     const imageId = "example://1";
//     cornerstone.enable(element);
//     cornerstone.loadImage(imageId).then(image => {
//       cornerstone.displayImage(element, image);
//       cornerstoneTools.mouseInput.enable(element);
//       cornerstoneTools.mouseWheelInput.enable(element);
//       // // Enable all tools we want to use with this element
//       cornerstoneTools.wwwc.activate(element, 1); // ww/wc is the default tool for left mouse button
//       cornerstoneTools.pan.activate(element, 2); // pan is the default tool for middle mouse button
//       cornerstoneTools.zoom.activate(element, 4); // zoom is the default tool for right mouse button
//       cornerstoneTools.zoomWheel.activate(element); // zoom is the default tool for middle mouse wheel
//       cornerstoneTools.probe.enable(element);
//       cornerstoneTools.length.enable(element);
//       cornerstoneTools.ellipticalRoi.enable(element);
//       cornerstoneTools.rectangleRoi.enable(element);
//       cornerstoneTools.angle.enable(element);
//       cornerstoneTools.highlight.enable(element);
//     });
//     };
//   enableTool = (toolName, mouseButtonNumber) => {
//     this.disableAllTools();
//     cornerstoneTools[toolName].activate(this.dicomImage, mouseButtonNumber);
//   };
//   // helper function used by the tool button handlers to disable the active tool
//   // before making a new tool active
//   disableAllTools = () => {
//     cornerstoneTools.wwwc.disable(this.dicomImage);
//     cornerstoneTools.pan.activate(this.dicomImage, 2); // 2 is middle mouse button
//     cornerstoneTools.zoom.activate(this.dicomImage, 4); // 4 is right mouse button
//     cornerstoneTools.probe.deactivate(this.dicomImage, 1);
//     cornerstoneTools.length.deactivate(this.dicomImage, 1);
//     cornerstoneTools.ellipticalRoi.deactivate(this.dicomImage, 1);
//     cornerstoneTools.rectangleRoi.deactivate(this.dicomImage, 1);
//     cornerstoneTools.angle.deactivate(this.dicomImage, 1);
//     cornerstoneTools.highlight.deactivate(this.dicomImage, 1);
//     cornerstoneTools.freehand.deactivate(this.dicomImage, 1);
//   };
//   dicomImageRef = el => {
//     this.dicomImage = el;
//   };
//   render() {
//     return (
//       <div className="container">
//         <div className="page-header">
//           <h1>React Cornerstone DICOM Viewer</h1>
//         </div>
//         <br />
//         <div className="row">
//           <div className="col-3">
//             <ul className="list-group">
//               <button
//                 onClick={() => {
//                   this.enableTool("wwwc", 1);
//                 }}
//                 className="list-group-item"
//               >
//                 WW/WC
//               </button>
//               <button
//                 onClick={() => {
//                   this.enableTool("pan", 3);
//                 }}
//                 className="list-group-item"
//               >
//                 Pan
//               </button>
//               <button
//                 onClick={() => {
//                   this.enableTool("zoom", 5);
//                 }}
//                 className="list-group-item"
//               >
//                 Zoom
//               </button>
//               <button
//                 onClick={() => {
//                   this.enableTool("length", 1);
//                 }}
//                 className="list-group-item"
//               >
//                 Length
//               </button>
//               <button
//                 onClick={() => {
//                   this.enableTool("probe", 1);
//                 }}
//                 className="list-group-item"
//               >
//                 Probe
//               </button>
//               <button
//                 onClick={() => {
//                   this.enableTool("ellipticalRoi", 1);
//                 }}
//                 className="list-group-item"
//               >
//                 Elliptical ROI
//               </button>
//               <button
//                 onClick={() => {
//                   this.enableTool("rectangleRoi", 1);
//                 }}
//                 className="list-group-item"
//               >
//                 Rectangle ROI
//               </button>
//               <button
//                 onClick={() => {
//                   this.enableTool("angle", 1);
//                 }}
//                 className="list-group-item"
//               >
//                 Angle
//               </button>
//               <button
//                 onClick={() => {
//                   this.enableTool("highlight", 1);
//                 }}
//                 className="list-group-item"
//               >
//                 Highlight
//               </button>
//               <button
//                 onClick={() => {
//                   this.enableTool("freehand", 1);
//                 }}
//                 className="list-group-item"
//               >
//                 Freeform ROI
//               </button>
//             </ul>
//             <div className="checkbox">
//               <label htmlFor="chkshadow">
//                 <input type="checkbox" id="chkshadow" />Apply shadow
//               </label>
//             </div>
//             <br />
//           </div>
//           <div className="col-9">
//             <div
//               style={{
//                 width: 1024,
//                 height: 1024,
//                 position: "relative",
//                 display: "inline-block",
//                 color: "white"
//               }}
//               onContextMenu={() => false}
//               className="cornerstone-enabled-image"
//               unselectable="on"
//               onSelectStart={() => false}
//               onMouseDown={() => false}
//             >
//               <div
//                 ref={this.dicomImageRef}
//                 style={{
//                   width: 1024,
//                   height: 1024,
//                   top: 0,
//                   left: 0,
//                   position: "absolute"
//                 }}
//               />
//               <div
//                 id="mrtopleft"
//                 style={{ position: "absolute", top: 3, left: 3 }}
//               >
//                 Patient Name
//               </div>
//               <div
//                 id="mrtopright"
//                 style={{ position: "absolute", top: 3, right: 3 }}
//               >
//                 Hospital
//               </div>
//               <div
//                 id="mrbottomright"
//                 style={{ position: "absolute", bottom: 3, right: 3 }}
//               >
//                 Zoom:
//               </div>
//               <div
//                 id="mrbottomleft"
//                 style={{ position: "absolute", bottom: 3, left: 3 }}
//               >
//                 WW/WC:
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="row">
//           <div className="col-xs-12">
//             <h3>Functionality</h3>
//             <ul>
//               <li>
//                 Activation of a tool for the left mouse button
//                 <ul>
//                   <li>
//                     WW/WC - Adjust the window width and window center of the
//                     image (activated by default)
//                   </li>
//                   <li>Pan - Pan the image</li>
//                   <li>Zoom - Zoom the image</li>
//                   <li>Length - Length measurement tool</li>
//                   <li>
//                     Probe - Display the image x,y coordinate under cursor as
//                     well as the pixel value (stored pixel and modality)
//                   </li>
//                   <li>
//                     Elliptical ROI - An elliptical ROI that shows mean, stddev
//                     and area
//                   </li>
//                   <li>
//                     Rectangle ROI - A rectangular ROI that shows mean, stddev
//                     and area
//                   </li>
//                   <li>
//                     Highlight - Darkens the image around a rectangular ROI
//                   </li>
//                   <li>Angle - Cobb angle tool</li>
//                 </ul>
//               </li>
//               <li>Use the activated tool by dragging the left mouse button</li>
//               <li>Pan by dragging the middle mouse button</li>
//               <li>Zoom by dragging the right mouse button</li>
//               <li>Zoom by rolling the mouse wheel</li>
//               <li>
//                 Tool dragging - left click drag on any measurement tool line to
//                 move it
//               </li>
//               <li>
//                 Tool deletion - left click drag on any measurement tool line and
//                 drop it off the image to delete it
//               </li>
//               <li>
//                 Tool handles - left click drag on any measurement tool handle
//                 (the circle) to change the handles position
//               </li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

// export default DicomViewer;
import React from "react";
import Hammer from "hammerjs";
import * as cornerstone from "cornerstone-core";
import * as cornerstoneTools from "cornerstone-tools";
import * as cornerstoneMath from "cornerstone-math";
import * as cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import * as cornerstoneFileImageLoader from "cornerstone-file-image-loader";
import { uid } from 'react-uid';
import dicomParser from "dicom-parser";
import '/home/mot/Documents/version_control/demo_covid/frontend/src/components/DicomViewer/dicomViewer.css';

class DicomViewer extends React.Component<{}, { isDicomImage: boolean }> {

  constructor(props) {
    super(props);
    this.state = { isDicomImage: false };
  }
  // component start mounting
  // just run only once time
  componentWillMount() {
    console.log("willMount")
    cornerstoneTools.external.cornerstone = cornerstone;
    cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
    cornerstoneTools.external.Hammer = Hammer;
    console.log("cornerstoneTools", cornerstoneTools)
    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
    cornerstoneFileImageLoader.external.cornerstone = cornerstone;
  }

  componentDidMount() {
    this.setupListenner();
    this.resolveListenner();
  }

  addFile = (file) => {
    let isDicom = false;
    let imageFormat = file.type.split("/")[1];
    let imageId = "";
    if (imageFormat.localeCompare("dicom")==0) {
      isDicom = true;
      imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
    }
    else {
      imageId = cornerstoneFileImageLoader.fileManager.add(file);
      isDicom = false;
    }
    this.setState({ isDicomImage: isDicom });
    return imageId;
  }

  // this function gets called once the user drops the file onto the div
  handleFileSelect = (evt) => {
    evt.stopPropagation();
    evt.preventDefault();
    // Get the FileList object that contains the list of files that were dropped
    const files = evt.dataTransfer.files;
    const imageId = this.addFile(files[0]);
    console.log("isDicomImage:",this.state.isDicomImage)
    this.loadAndViewImage(imageId);
  }

  // This fuction gets a image by drag
  handleDragOver = (evt) => {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  }

  setupListenner = () => {
    // Setup the dnd listeners.cornerstoneTools.zoom.setConfiguration(config);
    const dropZone = document.getElementById('dicomImage');
    dropZone.addEventListener('dragover', this.handleDragOver, false);
    dropZone.addEventListener('drop', this.handleFileSelect, false);
    console.log("isDicomImage:",this.state.isDicomImage)
    if (this.state.isDicomImage) {
      cornerstoneWADOImageLoader.configure({  
        beforeSend: function (xhr) {
          // Add custom headers here (e.g. auth tokens)
          //xhr.setRequestHeader('x-auth-token', 'my auth token');
        },
        useWebWorkers: true,
      });
    }
    else {
      cornerstoneFileImageLoader.configure({
        beforeSend: function (xhr) {
          // Add custom headers here (e.g. auth tokens)
          //xhr.setRequestHeader('x-auth-token', 'my auth token');
        },
        useWebWorkers: true,
      });
    }
  }

  //load image
  loaded = false;
  loadAndViewImage = (imageId) => {
    const element = document.getElementById('dicomImage');
    const start = new Date().getTime();
    const loadedView = this.loaded;
    const isDicom = this.state.isDicomImage;
    const config = {
      invert: true,
      minScale: 0.25,
      maxScale: 20.0,
      preventZoomOutsideImage: true
    };
    cornerstoneTools.zoom.setConfiguration(config);
    cornerstone.loadImage(imageId).then(function (image) {
      console.log(image);
      const viewport = cornerstone.getDefaultViewportForImage(element, image);
      document.getElementById('toggleModalityLUT').checked = (viewport.modalityLUT !== undefined);
      document.getElementById('toggleVOILUT').checked = (viewport.voiLUT !== undefined);
      cornerstone.displayImage(element, image, viewport);
      if (loadedView === false) {
        cornerstoneTools.mouseInput.enable(element);
        cornerstoneTools.mouseWheelInput.enable(element);
        cornerstoneTools.wwwc.activate(element, 1); // ww/wc is the default tool for left mouse button
        cornerstoneTools.pan.activate(element, 2); // pan is the default tool for middle mouse button
        cornerstoneTools.zoom.activate(element, 4); // zoom is the default tool for right mouse button
        cornerstoneTools.zoomWheel.activate(element); // zoom is the default tool for middle mouse wheel
        cornerstoneTools.imageStats.enable(element);
        cornerstoneTools.probe.enable(element);
        cornerstoneTools.length.enable(element);
        cornerstoneTools.ellipticalRoi.enable(element);
        cornerstoneTools.rectangleRoi.enable(element);
        cornerstoneTools.angle.enable(element);
        cornerstoneTools.highlight.enable(element);
      }

      if (isDicom) {
      function getTransferSyntax() {
        const value = image.data.string('x00020010');
        return value + ' [' + uid[value] + ']';
      }

      function getSopClass() {
        const value = image.data.string('x00080016');
        return value + ' [' + uid[value] + ']';
      }

      function getPixelRepresentation() {
        const value = image.data.uint16('x00280103');
        if (value === undefined) {
          return;
        }
        return value + (value === 0 ? ' (unsigned)' : ' (signed)');
      }

      function getPlanarConfiguration() {
        const value = image.data.uint16('x00280006');
        if (value === undefined) {
          return;
        }
        return value + (value === 0 ? ' (pixel)' : ' (plane)');
      }

      document.getElementById('transferSyntax').textContent = getTransferSyntax();
      document.getElementById('sopClass').textContent = getSopClass();
      document.getElementById('samplesPerPixel').textContent = image.data.uint16('x00280002');
      document.getElementById('photometricInterpretation').textContent = image.data.string('x00280004');
      document.getElementById('numberOfFrames').textContent = image.data.string('x00280008');
      document.getElementById('planarConfiguration').textContent = getPlanarConfiguration();
      document.getElementById('rows').textContent = image.data.uint16('x00280010');
      document.getElementById('columns').textContent = image.data.uint16('x00280011');
      document.getElementById('pixelSpacing').textContent = image.data.string('x00280030');
      document.getElementById('bitsAllocated').textContent = image.data.uint16('x00280100');
      document.getElementById('bitsStored').textContent = image.data.uint16('x00280101');
      document.getElementById('highBit').textContent = image.data.uint16('x00280102');
      document.getElementById('pixelRepresentation').textContent = getPixelRepresentation();
      document.getElementById('windowCenter').textContent = image.data.string('x00281050');
      document.getElementById('windowWidth').textContent = image.data.string('x00281051');
      document.getElementById('rescaleIntercept').textContent = image.data.string('x00281052');
      document.getElementById('rescaleSlope').textContent = image.data.string('x00281053');
      document.getElementById('basicOffsetTable').textContent = image.data.elements.x7fe00010 && image.data.elements.x7fe00010.basicOffsetTable ? image.data.elements.x7fe00010.basicOffsetTable.length : '';
      document.getElementById('fragments').textContent = image.data.elements.x7fe00010 && image.data.elements.x7fe00010.fragments ? image.data.elements.x7fe00010.fragments.length : '';
      document.getElementById('minStoredPixelValue').textContent = image.minPixelValue;
      document.getElementById('maxStoredPixelValue').textContent = image.maxPixelValue;
    }
    
      const end = new Date().getTime();
      const time = end - start;
      document.getElementById('totalTime').textContent = time + "ms";
      document.getElementById('loadTime').textContent = image.loadTimeInMS + "ms";
      document.getElementById('decodeTime').textContent = image.decodeTimeInMS + "ms";

    }, function (err) {
      alert(err);
    });
    cornerstone.events.addEventListener('cornerstoneimageloadprogress', function (event) {
      const eventData = event.detail;
      const loadProgress = document.getElementById('loadProgress');
      loadProgress.textContent = `Image Load Progress: ${eventData.percentComplete}%`;
    });
  }

  resolveListenner = () => {
    const element = document.getElementById('dicomImage');
    cornerstone.enable(element);
    const update = (e) => {
      let file = e.target.files[0];


      const imageId = this.addFile(file);
      console.log("isDicomImage:",this.state.isDicomImage)

      this.loadAndViewImage(imageId);
    }
    document.getElementById('selectFile').addEventListener('change', function (e) {
      // Add the file to the cornerstoneFileImageLoader and get unique
      // number for that file
      update(e);
    });

    document.getElementById('toggleModalityLUT').addEventListener('click', function () {
      const applyModalityLUT = document.getElementById('toggleModalityLUT').checked;
      console.log('applyModalityLUT=', applyModalityLUT);
      const image = cornerstone.getImage(element);
      const viewport = cornerstone.getViewport(element);
      if (applyModalityLUT) {
        viewport.modalityLUT = image.modalityLUT;
      } else {
        viewport.modalityLUT = undefined;
      }
      cornerstone.setViewport(element, viewport);
    });

    document.getElementById('toggleVOILUT').addEventListener('click', function () {
      const applyVOILUT = document.getElementById('toggleVOILUT').checked;
      console.log('applyVOILUT=', applyVOILUT);
      const image = cornerstone.getImage(element);
      const viewport = cornerstone.getViewport(element);
      if (applyVOILUT) {
        viewport.voiLUT = image.voiLUT;
      } else {
        viewport.voiLUT = undefined;
      }
      cornerstone.setViewport(element, viewport);
    });
  }

  enableTool = (toolName, mouseButtonNumber) => {
    const element = document.getElementById('dicomImage');
    this.disableAllTools();
    cornerstoneTools[toolName].activate(element, mouseButtonNumber);
  };
  // helper function used by the tool button handlers to disable the active tool
  // before making a new tool active
  disableAllTools = () => {
    const element = document.getElementById('dicomImage');
    cornerstoneTools.wwwc.disable(element);
    cornerstoneTools.pan.activate(element, 2); // 2 is middle mouse button
    cornerstoneTools.zoom.activate(element, 4); // 4 is right mouse button
    cornerstoneTools.probe.deactivate(element, 1);
    cornerstoneTools.length.deactivate(element, 1);
    cornerstoneTools.ellipticalRoi.deactivate(element, 1);
    cornerstoneTools.rectangleRoi.deactivate(element, 1);
    cornerstoneTools.angle.deactivate(element, 1);
    cornerstoneTools.highlight.deactivate(element, 1);
    cornerstoneTools.freehand.deactivate(element, 1);
  };

  render() {
    return (
      <div className="container">
        <div className="page-header">
          <h1>A Demo help view medical image from the local file system</h1>
          <p className="lead">
            Click "Choose File" and select a DICOM P10 file on your local file system or drag and drop a DICOM P10
            file.
            </p>
        </div>
        {/* create a form to choose file from system */}
        <div className="row">
          <form id="form" className="form-horizontal">
            <div className="form-group">
              <div className="col-sm-3">
                <input type="file" id="selectFile" />
              </div>
            </div>
          </form>
        </div>

        {/* Create two checkboxes to apply Modality LUT and VOILUT */}
        <input type="checkbox" id="toggleModalityLUT" />Apply Modality LUT
        <input type="checkbox" id="toggleVOILUT" />Apply VOI LUT
        <br />

        {/* Display */}
        <div className="row">
          <div className="col-3">
            <ul className="list-group">
              <button
                onClick={() => {
                  this.enableTool("wwwc", 1);
                }}
                className="list-group-item"
              >
                WW/WC
               </button>
              <button
                onClick={() => {
                  this.enableTool("pan", 3);
                }}
                className="list-group-item"
              >
                Pan
              </button>
              <button
                onClick={() => {
                  this.enableTool("zoom", 5);
                }}
                className="list-group-item"
              >
                Zoom
              </button>
              <button
                onClick={() => {
                  this.enableTool("length", 1);
                }}
                className="list-group-item"
              >
                Length
              </button>
              <button
                onClick={() => {
                  this.enableTool("probe", 1);
                }}
                className="list-group-item"
              >
                Probe
              </button>
              <button
                onClick={() => {
                  this.enableTool("ellipticalRoi", 1);
                }}
                className="list-group-item"
              >
                Elliptical ROI
              </button>
              <button
                onClick={() => {
                  this.enableTool("rectangleRoi", 1);
                }}
                className="list-group-item"
              >
                Rectangle ROI
              </button>
              <button
                onClick={() => {
                  this.enableTool("angle", 1);
                }}
                className="list-group-item"
              >
                Angle
              </button>
              <button
                onClick={() => {
                  this.enableTool("highlight", 1);
                }}
                className="list-group-item"
              >
                Highlight
              </button>
              <button
                onClick={() => {
                  this.enableTool("freehand", 1);
                }}
                className="list-group-item"
              >
                Freeform ROI
              </button>
            </ul>
            <div className="checkbox">
              <label htmlFor="chkshadow">
                <input type="checkbox" id="chkshadow" />Apply shadow
              </label>
            </div>
            <br />
          </div>
          {/* Create a frame to display a dicom file. */}
          <div className="col-md-8">
            <div style={{
              width: '1024px', height: '1024px', position: 'relative',
              color: 'black', display: 'inline-block', borderStyle: 'solid', borderColor: 'black'
            }}
              className='disable-selection noIbar'
              onContextMenu={() => false}
              unselectable="on"
              onMouseDown={() => false}
            >
              <div id="dicomImage" style={{ width: '1024px', height: '1024px', top: '0px', left: '0px', position: 'absolute' }}></div>
            </div>
          </div>

          {/* Create a position to show info of dicom file */}
          <div className="col-md-6">
            <span>Transfer Syntax: </span><span id="transferSyntax"></span><br />
            <span>SOP Class: </span><span id="sopClass"></span><br />
            <span>Samples Per Pixel: </span><span id="samplesPerPixel"></span><br />
            <span>Photometric Interpretation: </span><span id="photometricInterpretation"></span><br />
            <span>Number Of Frames: </span><span id="numberOfFrames"></span><br />
            <span>Planar Configuration: </span><span id="planarConfiguration"></span><br />
            <span>Rows: </span><span id="rows"></span><br />
            <span>Columns: </span><span id="columns"></span><br />
            <span>Pixel Spacing: </span><span id="pixelSpacing"></span><br />
            <span>Bits Allocated: </span><span id="bitsAllocated"></span><br />
            <span>Bits Stored: </span><span id="bitsStored"></span><br />
            <span>High Bit: </span><span id="highBit"></span><br />
            <span>Pixel Representation: </span><span id="pixelRepresentation"></span><br />
            <span>WindowCenter: </span><span id="windowCenter"></span><br />
            <span>WindowWidth: </span><span id="windowWidth"></span><br />
            <span>RescaleIntercept: </span><span id="rescaleIntercept"></span><br />
            <span>RescaleSlope: </span><span id="rescaleSlope"></span><br />
            <span>Basic Offset Table Entries: </span><span id="basicOffsetTable"></span><br />
            <span>Fragments: </span><span id="fragments"></span><br />
            <span>Min Stored Pixel Value: </span><span id="minStoredPixelValue"></span><br />
            <span>Max Stored Pixel Value: </span><span id="maxStoredPixelValue"></span><br />
            <span>Total Time: </span><span id="totalTime"></span><br />
            <span>Load Time: </span><span id="loadTime"></span><br />
            <span>Decode Time: </span><span id="decodeTime"></span><br />
          </div>

        </div>

      </div>
    );
  }
}

export default DicomViewer;
