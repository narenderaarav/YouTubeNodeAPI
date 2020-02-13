import React from "react";
import "./App.css";
import axios from "axios";
import videoImage from "./video-image.png";
import youtubeIcon from "./youtube.svg";

function App() {
const [form, setForm] = React.useState({ 
  title:"",
  description:"",
  file: null,
 
})

function handleChange(event){
  const {name, files, value} = event.target  
  const inputValue = name === 'file' ? files[0] : value
  setForm({
    ...form,
    [name]: inputValue
  })
}

function handleSubmit(event){
  event.preventDefault();
  const videoData = new FormData()
  videoData.append("videoFile",form.file)
  videoData.append("title",form.title)
  videoData.append("description",form.description)

  
  axios.post('http://localhost:9000/upload',videoData)
  .then(response => {
    console.log(response.data)
  })
  //console.log({ form });
}

  return (
    <div
      className="App"
      style={{
        backgroundImage: `linear-gradient(0deg,rgba(20,20,20,0.7), rgba(9, 93, 225, 0.5)), url(${videoImage})`
      }}
    >
      <img src={youtubeIcon} alt="Youtube Icon" className="youtube" />
      <h1 className="title">Upload Your Video</h1>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <input
            autoComplete="off"
            className="input"
            name="title"
            placeholder="Title"
            onChange = {handleChange}
          />
        </div>
        <div className="field">
          <textarea
            autoComplete="off"
            className="textarea"
            name="description"
            placeholder="Description"
            onChange = {handleChange}
          />
        </div>
        <div>
          <input
            className="input"
            name="file"
            type="file"
            accept="video/mp4"
            placeholder="Add Video File"
            onChange = {handleChange}
          />
        </div>
     
        <button className="is-success button" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}

export default App;
