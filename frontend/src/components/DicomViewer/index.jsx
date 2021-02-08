// export default DicomViewer;
import React from "react";
import Hammer from "hammerjs";
import * as cornerstone from "cornerstone-core";
import * as cornerstoneTools from "cornerstone-tools";
import * as cornerstoneMath from "cornerstone-math";
import * as cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import * as cornerstoneFileImageLoader from "cornerstone-file-image-loader";
import * as cornerstoneWebImageLoader from "cornerstone-web-image-loader";
import { uid } from 'react-uid';
import dicomParser from "dicom-parser";
import '../DicomViewer/dicomViewer.css';
import Button from '@material-ui/core/Button';
import ArrowBackSharpIcon from '@material-ui/icons/ArrowBackSharp';
import TuneSharpIcon from '@material-ui/icons/TuneSharp';
import ZoomOutMapSharpIcon from '@material-ui/icons/ZoomOutMapSharp';
import AllOutSharpIcon from '@material-ui/icons/AllOutSharp';
import TimelineSharpIcon from '@material-ui/icons/TimelineSharp';
import AdjustSharpIcon from '@material-ui/icons/AdjustSharp';
import RadioButtonUncheckedSharpIcon from '@material-ui/icons/RadioButtonUncheckedSharp';
import Crop54SharpIcon from '@material-ui/icons/Crop54Sharp';
import DetailsSharpIcon from '@material-ui/icons/DetailsSharp';
import FeaturedVideoSharpIcon from '@material-ui/icons/FeaturedVideoSharp';
import MaximizeSharpIcon from '@material-ui/icons/MaximizeSharp';
import Loader from 'react-loader-spinner'
import AutorenewIcon from '@material-ui/icons/Autorenew';


class DicomViewerTest extends React.Component {

  constructor(props) {
    super(props);
    console.log("props:", props.location.data);

    this.state = {
      isDicomImage: false, file_image: null, is_detecting: 10, is_visible: true,
      infoPatient: props.location.data, infoPatientImages: {}
    };
    this.handle_detect_click = this.handle_detect_click.bind(this);
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
    cornerstoneWebImageLoader.external.cornerstone = cornerstone
  }

  componentDidMount() {
    this.setupListenner();
    this.resolveListenner();
    // console.log("get data from route", this.props.location.state.data);
  }

  addFile = (file) => {
    let isDicom = false;
    // console.log("File load", file)
    // let imageFormat = file.type.split("/")[1];
    // if (imageFormat.localeCompare("dicom") == 0) {
    //   isDicom = true;
    //   imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);

    // }
    // else {
    //   imageId = cornerstoneFileImageLoader.fileManager.add(file);
    //   isDicom = false;
    // }
    this.setState({ isDicomImage: isDicom });
    return "df";
  }

  // this function gets called once the user drops the file onto the div
  handleFileSelect = (evt) => {
    evt.stopPropagation();
    evt.preventDefault();
    // Get the FileList object that contains the list of files that were dropped
    const files = evt.dataTransfer.files;
    console.log("File load hand select:", files)
    const imageId = this.addFile(files[0]);
    console.log("image id get ittlklds:", imageId)
    console.log("isDicomImage:", this.state.isDicomImage)
    this.loadAndViewImage(imageId, this.state.isDicomImage);
  }

  // This fuction gets a image by drag
  handleDragOver = (evt) => {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  }

  handleReset(){
    this.resolveListenner();
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
  loadAndViewImage = (imageId, isDicom) => {
    console.log("image_idnkdngkdkj", imageId)
    const element = document.getElementById('dicomImage');
    const start = new Date().getTime();
    const loadedView = this.loaded;
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
      // loadProgress.textContent = `Image Load Progress: ${eventData.percentComplete}%`;
    });
  }

  resolveListenner = () => {
    console.log("GET SOMETHING")
    const element = document.getElementById('dicomImage');
    let imageId = "wadouri:http://localhost:3000/assets/b.dcm";
    let isDicom = false;

    cornerstone.enable(element);
    if (this.state.infoPatient != undefined || this.state.infoPatient != null) {
      let url = this.state.infoPatient.url;
      let imageFormat = url.split(".")[1];
      console.log("imageFormat", imageFormat);

      if (imageFormat.localeCompare("dcm") == 0) {
        isDicom = true;
        imageId = "wadouri:http://localhost:3000/" + url;
      }
      else {
        isDicom = false;
        imageId = "http://localhost:3000/" + url;
      }
    }

    console.log("isDicom", isDicom);
    this.loadAndViewImage(imageId, isDicom);
    // const update = (e) => {
    //   let file = e.target.files[0];
    //   console.log("event get image:", file)

    //   const imageId = this.addFile(file);
    //   console.log("Image id dgdfg", imageId)
    //   console.log("isDicomImage:", this.state.isDicomImage)

    //   this.loadAndViewImage(imageId);
    // }
    // const setSate = (e) => {
    //   this.setState({ file_image: e });
    //   console.log("state:", this.state.file_image)
    // }
    // document.getElementById('selectFile').addEventListener('change', function (e) {
    //   setSate(e);
    //   update(e);
    // })
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
  }

  handle_detect_click() {

    if (this.state.infoPatient.url) {
      console.log("START");
      const { history } = this.props;

      this.setState({ is_visible: false });
      console.log("spinner:", this.state.is_detecting)
      let url = this.state.infoPatient.url;
      let id = this.state.infoPatient.id;
      const formData = new FormData();
      console.log("url", url)
      formData.append("url", url);
      let infoPatientResult = this.state.infoPatient;
    
      fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData
      }).then(res => res.json())
      .then(function (file) {
        infoPatientResult["diagnostis_result"]=file["message"];
        history.push({
          pathname: `/result/${id}`,
          data: infoPatientResult
        })
      })
      .catch(function (error) {
        console.log(error);
      });
    setTimeout(() => {
          this.setState({ is_visible: true })
        }, 1500);
    }
  }

  render() {
    const is_visible = this.state.is_visible;
    const { error, isLoaded, items } = this.state;
    return (
      <div className="show_image">
        <div className="back_home">
          <Button onClick={() => this.handleClick()}
            variant="outlined"
            size="small"
            startIcon={<ArrowBackSharpIcon />}
            className="btn_back"
          >
            Data list
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
            className="list_group_item"
            color="primary"
            size="small"
            startIcon={<TuneSharpIcon />}
            title="wwwc"
          >
          </Button>
          <Button onClick={() => {
            this.enableTool("zoom", 5);
          }}
            className="list_group_item"
            color="primary"
            size="small"
            startIcon={<ZoomOutMapSharpIcon />}
            title="Zoom"
          >
          </Button>
          <Button
            onClick={() => {
              this.enableTool("pan", 3);
            }}
            className="list_group_item"
            color="primary"
            size="small"
            startIcon={<AllOutSharpIcon />}
            title="Pan"
          >
          </Button>
          <Button onClick={() => {
            this.enableTool("length", 1);
          }}
            className="list_group_item"
            color="primary"
            size="small"
            startIcon={<MaximizeSharpIcon />}
            title="Length"
          >
          </Button>
          <Button onClick={() => {
            this.enableTool("probe", 1);
          }}
            className="list_group_item"
            color="primary"
            size="small"
            startIcon={<AdjustSharpIcon />}
          >
          </Button>
          <Button onClick={() => {
            this.enableTool("ellipticalRoi", 1);
          }}
            className="list_group_item"
            color="primary"
            size="small"
            startIcon={<RadioButtonUncheckedSharpIcon />}
            title="Elliptical ROI"
          >
          </Button>
          <Button onClick={() => {
            this.enableTool("rectangleRoi", 1);
          }}
            className="list_group_item"
            color="primary"
            size="small"
            startIcon={<Crop54SharpIcon />}
            title="Rectangle ROI"
          >
          </Button>
          <Button onClick={() => {
            this.enableTool("angle", 1);
          }}
            className="list_group_item"
            color="primary"
            size="small"
            startIcon={<DetailsSharpIcon />}
            title="Angle"
          >
          </Button>
          <Button onClick={() => {
            this.enableTool("highlight", 1);
          }}
            className="list_group_item"
            color="primary"
            size="small"
            startIcon={<FeaturedVideoSharpIcon />}
            title="Highlight"
          >
          </Button>
          <Button onClick={() => {
            this.enableTool("freehand", 1);
          }}
            className="list_group_item"
            color="primary"
            size="small"
            startIcon={<TimelineSharpIcon />}
            title="Freeform ROI"
          >
          </Button>
          <Button 
          onClick={() => {
            this.handleReset()
          }}
            className="list_group_item"
            color="primary"
            size="small"
            title="Freeform ROI"
            startIcon={<AutorenewIcon />}
          >
            Reset
          </Button>
          <button className="detect_btn" onClick={() => this.handle_detect_click()} >Detect COVID-19</button>
        </div>
        <div className="layout_display">
          <div className="page-header">
          </div>
          {/* Display */}
          <div className="row">
            <div className="col-md-4">
              {/* Create a position to show info of dicom file */}
              <div className="info_image  ">
                <ul>
                  <li><h4>Patient information</h4></li>

                  <li><span>Id: </span><span id="fullname">{this.state.infoPatient && this.state.infoPatient.id}</span><br /></li>
                  <li><span>Fullname Patient: </span><span id="fullname">{this.state.infoPatient && this.state.infoPatient.fullname}</span><br /></li>
                  <li><span>Created date: </span><span id="created_date">{this.state.infoPatient && this.state.infoPatient.created_date}</span><br /></li>
                  <li><span>Gender: </span><span id="gender">{this.state.infoPatient && this.state.infoPatient.gender}</span><br /></li>
                  <li><span>Date of birth: </span><span id="date_of_birth">{this.state.infoPatient && this.state.infoPatient.date_of_birth}</span><br /></li>
                  <li><span>Adress: </span><span id="address">{this.state.infoPatient && this.state.infoPatient.address}</span><br /></li>
                  <li><span>Phone: </span><span id="phone">{this.state.infoPatient && this.state.infoPatient.phone}</span><br /></li>
                  <li><span>Email: </span><span id="email">{this.state.infoPatient && this.state.infoPatient.email}</span><br /></li>
                  <li><span>Quarantine status: </span><span id="quarantine_status">{this.state.infoPatient && this.state.infoPatient.quarantine_status}</span><br /></li>
                  <li><h4>Image information</h4></li>
                  <li><span>Image id: </span><span id="id_image">{this.state.infoPatient && this.state.infoPatient.id_image}</span><br /></li>
                  <li><span>url: </span><span id="url">{this.state.infoPatient && this.state.infoPatient.url}</span><br /></li>
                  <li><span>Uploaded date: </span><span id="uploaded_date">{this.state.infoPatient && this.state.infoPatient.uploaded_date}</span><br /></li>
                  <li><span>Diagnostis result: </span><span id="diagnostis_result">{this.state.infoPatient && this.state.infoPatient.diagnostis_result}</span><br /></li>
                  <li><h4>Dicom image information</h4></li>
                  <li><span>Transfer Syntax: </span><span id="transferSyntax"></span><br /></li>
                  <li><span>SOP Class: </span><span id="sopClass"></span><br /></li>
                  <li><span>Samples Per Pixel: </span><span id="samplesPerPixel"></span><br /></li>
                  <li><span>Photometric Interpretation: </span><span id="photometricInterpretation"></span><br /></li>
                  <li><span>Number Of Frames: </span><span id="numberOfFrames"></span><br /></li>
                  <li><span>Planar Configuration: </span><span id="planarConfiguration"></span><br /></li>
                  <li><span>Rows: </span><span id="rows"></span><br /></li>
                  <li><span>Columns: </span><span id="columns"></span><br /></li>
                  <li><span>Pixel Spacing: </span><span id="pixelSpacing"></span><br /></li>
                  <li><span>Bits Allocated: </span><span id="bitsAllocated"></span><br /></li>
                  <li><span>Bits Stored: </span><span id="bitsStored"></span><br /></li>
                  <li><span>High Bit: </span><span id="highBit"></span><br /></li>
                  <li><span>Pixel Representation: </span><span id="pixelRepresentation"></span><br /></li>
                  <li><span>WindowCenter: </span><span id="windowCenter"></span><br /></li>
                  <li><span>WindowWidth: </span><span id="windowWidth"></span><br /></li>
                  <li><span>RescaleIntercept: </span><span id="rescaleIntercept"></span><br /></li>
                  <li><span>RescaleSlope: </span><span id="rescaleSlope"></span><br /></li>
                  <li><span>Basic Offset Table Entries: </span><span id="basicOffsetTable"></span><br /></li>
                  <li><span>Fragments: </span><span id="fragments"></span><br /></li>
                  <li><span>Min Stored Pixel Value: </span><span id="minStoredPixelValue"></span><br /></li>
                  <li><span>Max Stored Pixel Value: </span><span id="maxStoredPixelValue"></span><br /></li>
                  <li><span>Total Time: </span><span id="totalTime"></span><br /></li>
                  <li><span>Load Time: </span><span id="loadTime"></span><br /></li>
                  <li><span>Decode Time: </span><span id="decodeTime"></span><br /></li>
                  <li> <div id='result_dianologis'><span >Results Dianologis Machine: </span><span id="result"></span><br /></div></li>
                </ul>
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
                <div id="dicomImage" style={{ width: '100hv', height: '1000px', top: '0px', left: '0px', position: 'relative' }}>
                  <div id="spiner" hidden={is_visible}>
                    <Loader
                      type="Circles"
                      color="#00BFFF"
                      height={100}
                      width={100}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DicomViewerTest;
