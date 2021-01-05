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
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import KeyboardVoiceIcon from '@material-ui/icons/KeyboardVoice';
import Icon from '@material-ui/core/Icon';
import SaveIcon from '@material-ui/icons/Save';
import ArrowBackSharpIcon from '@material-ui/icons/ArrowBackSharp';
import TuneSharpIcon from '@material-ui/icons/TuneSharp';
import SearchSharpIcon from '@material-ui/icons/SearchSharp';
import ZoomOutMapSharpIcon from '@material-ui/icons/ZoomOutMapSharp';
import AllOutSharpIcon from '@material-ui/icons/AllOutSharp';
import TimelineSharpIcon from '@material-ui/icons/TimelineSharp';
import AdjustSharpIcon from '@material-ui/icons/AdjustSharp';
import RadioButtonUncheckedSharpIcon from '@material-ui/icons/RadioButtonUncheckedSharp';
import Crop54SharpIcon from '@material-ui/icons/Crop54Sharp';
import DetailsSharpIcon from '@material-ui/icons/DetailsSharp';
import FeaturedVideoSharpIcon from '@material-ui/icons/FeaturedVideoSharp';
import MaximizeSharpIcon from '@material-ui/icons/MaximizeSharp';

class DicomViewer extends React.Component<{}, { isDicomImage: boolean }> {

  constructor(props) {
    super(props);
    this.state = { isDicomImage: false, file_image:null };
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
    console.log("File load", file)
    let imageFormat = file.type.split("/")[1];
    let imageId = "";
    if (imageFormat.localeCompare("dicom") == 0) {
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
    console.log("File load hand select:", files)
    const imageId = this.addFile(files[0]);
    console.log("isDicomImage:", this.state.isDicomImage)
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
    console.log("isDicomImage:", this.state.isDicomImage)
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
    console.log("image_id", imageId)
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
      console.log("event get image:", file)

      const imageId = this.addFile(file);
      console.log("isDicomImage:", this.state.isDicomImage)

      this.loadAndViewImage(imageId);
    }
    const setSate = (e) =>{
      this.setState({ file_image: e });
      console.log("state:", this.state.file_image)
    }
    document.getElementById('selectFile').addEventListener('change', function (e) {
      setSate(e);
      update(e);
    })
  }

  enableTool = (toolName, mouseButtonNumber) => {
    const element = document.getElementById('dicomImage');
    const image = cornerstone.getImage(element);
    console.log("element.image", image)
    if (image) {
      this.disableAllTools();
      cornerstoneTools[toolName].activate(element, mouseButtonNumber);
    }
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

  handleClick() {
    const { history } = this.props;
    history.push({
      pathname: `/`,
    })
    window.location.reload();
  }

  handle_detect_click() {
    console.log("click detect", this.state.file_image);
    if (this.state.file_image) {
      let file = this.state.file_image.target.files[0];
      const formData = new FormData();
      console.log("image_path", file)
      formData.append("file",file);
      console.log("image_path", file)
      const res = fetch("http://127.0.0.1:5000/file-upload", {
        method: "POST",
        body: formData
      }).then(res => res.json())
        .then(function (file) {
          alert('Upload image successfully');
          console.log(file);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }
  render() {
    return (
      <div className="show_image">
        <div className="back_home">
          <Button onClick={() => this.handleClick()}
            variant="outlined"
            size="small"
            startIcon={<ArrowBackSharpIcon />}
            className="btn_back"
          >
            Back
            </Button>
        </div>
        <div className="feature_button">
          {/* create a form to choose file from system */}
          <div className="choose image">
            <input type="file" id="selectFile" />
          </div>
          <Button onClick={() => {
            this.enableTool("wwwc", 1);
          }}
            className="list-group-item"
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<TuneSharpIcon />}
          >
            wwwc
            </Button>
          <Button onClick={() => {
            this.enableTool("zoom", 5);
          }}
            className="list-group-item"
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<ZoomOutMapSharpIcon />}
          >
            Zoom
            </Button>
          <Button
            onClick={() => {
              this.enableTool("pan", 3);
            }}
            className="list-group-item"
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<AllOutSharpIcon />}
          >
            Pan
          </Button>
          <Button onClick={() => {
            this.enableTool("length", 1);
          }}
            className="list-group-item"
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<MaximizeSharpIcon />}
          >
            Length
            </Button>
          <Button onClick={() => {
            this.enableTool("probe", 1);
          }}
            className="list-group-item"
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<AdjustSharpIcon />}
          >
            Probe
            </Button>
          <Button onClick={() => {
            this.enableTool("ellipticalRoi", 1);
          }}
            className="list-group-item"
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<RadioButtonUncheckedSharpIcon />}
          >
            Elliptical ROI
            </Button>
          <Button onClick={() => {
            this.enableTool("rectangleRoi", 1);
          }}
            className="list-group-item"
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<Crop54SharpIcon />}
          >
            Rectangle ROI
            </Button>
          <Button onClick={() => {
            this.enableTool("angle", 1);
          }}
            className="list-group-item"
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<DetailsSharpIcon />}
          >
            Angle
            </Button>
          <Button onClick={() => {
            this.enableTool("highlight", 1);
          }}
            className="list-group-item"
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<FeaturedVideoSharpIcon />}
          >
            Highlight
            </Button>
          <Button onClick={() => {
            this.enableTool("freehand", 1);
          }}
            className="list-group-item"
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<TimelineSharpIcon />}
          >
            Freeform ROI
            </Button>
          <button className="detect_btn" onClick={() => this.handle_detect_click()}>DECTECT</button>
        </div>
        <div className="layout_display">
          <div className="page-header">
          </div>
          {/* Display */}
          <div className="row">
            <div className="col-md-4">
              {/* Create a position to show info of dicom file */}
              <div className="info_image  ">
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
            {/* Create a frame to display a dicom file. */}
            <div className="col-md-8">
              <div style={{
                 width: '100hv',
                height: '1000px', position: 'relative',
                color: 'black', borderStyle: 'solid',
                borderBottomColor: 'rgb(29, 153, 175)',
                borderRightColor: 'rgb(29, 153, 175)',
                borderLeftColor: 'rgb(29, 153, 175)',
              }}
                className='disable-selection noIbar'
                onContextMenu={() => false}
                unselectable="on"
                onMouseDown={() => false}
              >
                <div id="dicomImage" style={{ width: '100hv', height: '1000px', top: '0px', left: '0px', position: 'relative' }}></div>
              </div>
            </div>

          </div>

        </div>
      </div>
    );
  }
}

export default DicomViewer;
