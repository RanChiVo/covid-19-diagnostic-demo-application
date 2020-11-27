import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import '../App.css';
import ReactPanZoom from "react-image-pan-zoom-rotate";

var image = null;
const Form = () => {
  const { register, handleSubmit } = useForm();
  const [selectedFile, setSelectedFile] = useState()
  const [preview, setPreview] = useState()
  const [datas, setData] = useState([]);
  

  const onSubmit = async (image_path) => {
    const formData = new FormData();
    if(image_path){
    formData.append("file", image_path.file[0]);
    const res = await fetch("http://127.0.0.1:5000/file-upload", {
      method: "POST",
      body: formData
    }).then(res => res.json())
      .then(function (image_path) {
        console.log(image_path);
        setData(image_path);
        alert('Upload image successfully');
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }

  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined)
      return
    }

    const objectUrl = URL.createObjectURL(selectedFile)
    setPreview(objectUrl)

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile]);

  const onSelectFile = e => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined)
      return
    }

    // I've kept this example simple by using the first image instead of multiple
    setSelectedFile(e.target.files[0])
  }
  const [isDiagnose, setDiagnose] = useState(false)
  useEffect(()=> {
    async function fetchPostList() {
      const requestUrl = "http://127.0.0.1:5000/predict";
      const response = await fetch(requestUrl);
      const responseJSON = await response.json();
      console.log("response:",{responseJSON});
      const {data_result} = responseJSON
      setData(data_result);
    }
    if(isDiagnose){
      fetchPostList();
      setDiagnose(false);
   }
  }, [isDiagnose]);

  return (
    <div>
    <form className="show_image" onSubmit={handleSubmit(onSubmit)} >
      <div className="upload_display">
        <input className="up_load_input" ref={register} type="file" name="file" onChange={onSelectFile} />
        <button className="up_load_btn">Detect</button>
        {selectedFile && <ReactPanZoom alt="cool image" image={preview} />}
      </div>
    </form>
    <div className="display_result">
    <h1>Result</h1>
    <div>{datas.message}</div>
    </div>
    </div>
  );
}


export default Form