import React, { useState } from "react"; // import React hooks
import TopNav from "./TopNav";
import "../styles/disease.css";
import "../styles/loading.css";
import Modal from "react-bootstrap/Modal"; // Import the modal component from react-bootstrap
import Button from "react-bootstrap/Button";
// import pexels1 from "../images/peakpx.jpg";
// import pexels2 from "../images/pexels.jpg";
// import pexels4 from "../images/pexels.jpg";
// import pexels3 from "../images/banner_1.jpg";
import axios from "axios"; 
import Footer from "./footer";

function Disease() {
  const [image, setImage] = useState(null); // state for storing the image file
  const [model, setModel] = useState("tumor"); // state for storing the text output
  // const [popup, setPopup] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const handleModelChange = (e) => {
    // function for handling the model selection change
    setModel(e.target.value); // set the model state to the selected value
  };

  const handleImageChange = (e) => {
    // function for handling the image input change
    if (e.target.files && e.target.files[0]) {
      // check if there is a file selected
      setImage(e.target.files[0]); // set the image state to the file
    }
  };

  const handleSubmit = async (e) => {
    // function for handling the button click
    e.preventDefault(); // prevent the default behavior
    if (image) {
      // check if there is an image selected
      try {
        // try to make a POST request to Flask with the image file as data
        setLoading(true);
        let formData = new FormData(); 
        formData.append("file", image); 
        formData.append("model", model);
        const response = await axios.post(
          "http://127.0.0.1:5000/predict", 
          formData, 
          {
            headers: {
              "Content-Type": "multipart/form-data", // set the content type header
            },
          }
        );
        setResult(response.data); 
        setImage(null);
        setShow(true); // show the result
      } catch (error) {
        
        console.error(error);
      } finally{
        setLoading(false)
      }
    } else {
      alert("Please select an image"); 
    }
  };

  const handleClose = () => {
    // function for handling the modal close
    setShow(false); // hide the modal
  };

  return (
    // <div style={{ height: "100vh" }}>
    //   <TopNav />
    //   <div aria-label="Detection Section" style={{ zIndex: "auto" }}>
    //     <h1 className="font-bold text-xl sm:text-2xl lg:text-5xl py-4 text-cyan-700 heading">
    //       Detect Tumor or Pneumonia
    //     </h1>
    //   </div>
    //   {/* <div className="w-full flex m-auto pt-11 pb-11" style={{ height: "70%" }}>
        
    //   </div> */}
    //   <div className="w-full flex m-auto justify-center">
    //     <form onSubmit={handleSubmit}>
    //       <label htmlFor="file">Upload an image:</label>
    //       <input type="file" id="file" name="file" accept="image/*" onChange={handleImageChange} />
    //       <label htmlFor="model">Select a model:</label>
    //       <select id="model" name="model" value={model} onChange={handleModelChange}>
    //         <option value="tumor">Brain Tumor</option>
    //         <option value="pneumonia">Pneumonia</option>
    //       </select>
    //       <button type="submit" name="file"disabled={loading}>Predict</button>
    //     </form>
    //     {loading && (
    //       <div
    //         style={{
    //           position: "fixed",
    //           top: "50%",
    //           left: "50%",
    //           transform: "translate(-50%, -50%)",
    //           zIndex: "9999",
    //         }}
    //       >
    //         <div className="loader"></div>
    //       </div>
    //     )}
    //     {result && (
    //       <div className="result">
    //       {model === "tumor" && <p>The result for tumor is: {result.result}</p>}
    //       {model === "pneumonia" && <p>The result for pneumonia is: {result.result}</p>}
    //     </div>
    //     )}
        
    //   </div>
    //   <Footer/>
    // </div>

    <div style={{ height: "100vh" }}>
      <TopNav />
      <div aria-label="Detection Section" style={{ zIndex: "auto" }}>
        <h1 className="font-bold text-xl sm:text-2xl lg:text-5xl py-4 text-cyan-700 heading">
          Detect Tumor or Pneumonia
        </h1>
      </div>
      <div
        className="w-full flex m-auto justify-center"
        style={{ height: "70%" }}
      >
        <div
          className="w-96 h-96 bg-blue-300 flex items-center justify-center" // Use a div with a fixed width and height and a background color
        >
          <form onSubmit={handleSubmit} className="px-4">
          <label htmlFor="file">Upload an image:</label>
          <input
            type="file"
            id="file"
            name="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          <label htmlFor="model">Select a model:</label>
          <select
            id="model"
            name="model"
            value={model}
            onChange={handleModelChange}
          >
            <option value="tumor">Brain Tumor</option>
            <option value="pneumonia">Pneumonia</option>
          </select>
          <button type="submit" name="file" disabled={loading}>
            Predict
          </button>
        </form>
        {loading && (
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: "9999",
            }}
          >
            <div className="loader"></div>
          </div>
        )}
        {result && (
          <Modal show={show} onHide={handleClose}> 
            <Modal.Header closeButton>
              <Modal.Title>Prediction Result</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {model === "tumor" && (
                <p>The result for tumor is: {result.result}</p>
              )}
              {model === "pneumonia" && (
                <p>The result for pneumonia is: {result.result}</p>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        )}
          {/* <p className="text-white text-4xl font-bold">Upload Image</p>  */}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default Disease;
