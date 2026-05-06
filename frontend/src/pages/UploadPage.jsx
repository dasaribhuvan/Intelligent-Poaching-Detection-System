import { useState, useEffect } from "react";
import API from "../services/api";
import {
  UploadCloud,
  Loader2,
  MapPin,
  RotateCcw
} from "lucide-react";

import { motion } from "framer-motion";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import L from "leaflet";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

const UploadPage = () => {

  const [preview, setPreview] = useState(null);
  const [detections, setDetections] = useState([]);
  const [threat, setThreat] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);

  // =================================================
  // LOAD SAVED DETECTION DATA
  // =================================================

  useEffect(() => {

    const savedData = localStorage.getItem("lastDetection");

    if (savedData) {

      const parsed = JSON.parse(savedData);

      setPreview(parsed.preview);
      setDetections(parsed.detections || []);
      setThreat(parsed.threat);
      setLocation(parsed.location);

    }

  }, []);

  // =================================================
  // RESET FUNCTION
  // =================================================

  const handleReset = () => {

    setPreview(null);

    setDetections([]);

    setThreat(null);

    setLocation(null);

    localStorage.removeItem("lastDetection");

  };

  // =================================================
  // HANDLE UPLOAD
  // =================================================

  const handleUpload = async (file) => {

    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    setPreview(previewUrl);

    setLoading(true);

    const formData = new FormData();

    formData.append("file", file);

    try {

      const response = await API.post("/detect", formData);

      const detectionData = {
        preview: previewUrl,
        detections: response.data.detections || [],
        threat: response.data.threat_level,
        location: {
          lat: response.data.latitude,
          lng: response.data.longitude
        }
      };

      setDetections(detectionData.detections);

      setThreat(detectionData.threat);

      setLocation(detectionData.location);

      // SAVE TO LOCAL STORAGE

      localStorage.setItem(
        "lastDetection",
        JSON.stringify(detectionData)
      );

    } catch (error) {

      console.error(error);

      alert("Detection failed");

    }

    setLoading(false);
  };

  return (

    <div className="flex flex-col gap-6">

      {/* HEADER */}

      <motion.div
        initial={{opacity:0,y:-10}}
        animate={{opacity:1,y:0}}
        className="flex items-center justify-between"
      >

        <div className="flex items-center gap-3">

          <UploadCloud className="text-emerald-400"/>

          <h1 className="text-2xl font-semibold">
            AI Threat Detection Upload
          </h1>

        </div>

        {/* RESET BUTTON */}

        <button
          onClick={handleReset}
          className="flex items-center gap-2
          bg-red-500/10 hover:bg-red-500/20
          text-red-400 px-4 py-2 rounded-lg
          border border-red-500/20 transition-all"
        >

          <RotateCcw size={16}/>

          Reset

        </button>

      </motion.div>



      {/* UPLOAD + PREVIEW */}

      <div className="grid grid-cols-2 gap-6">

        {/* UPLOAD PANEL */}

        <motion.label
          initial={{opacity:0,y:15}}
          animate={{opacity:1,y:0}}
          onDragOver={(e)=>{
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={()=>setDragging(false)}
          onDrop={(e)=>{
            e.preventDefault();
            setDragging(false);

            const file = e.dataTransfer.files[0];

            handleUpload(file);
          }}
          className={`relative flex flex-col items-center justify-center
          border-2 border-dashed rounded-xl p-10 cursor-pointer
          backdrop-blur-xl transition-all duration-300
          ${
            dragging
            ? "border-emerald-400 bg-emerald-500/10"
            : "border-white/20 hover:border-emerald-400 hover:bg-white/5"
          }`}
        >

          <UploadCloud
            size={50}
            className={`mb-3 transition ${
              dragging ? "text-emerald-400 scale-110" : "text-gray-400"
            }`}
          />

          <p className="text-sm text-gray-300">
            Drag & Drop image here
          </p>

          <p className="text-xs text-gray-500 mt-1">
            or click to browse files
          </p>

          <input
            type="file"
            className="hidden"
            onChange={(e)=>handleUpload(e.target.files[0])}
          />

        </motion.label>



        {/* PREVIEW */}

        <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-center">

          {preview ? (

            <img
              src={preview}
              alt="preview"
              className="rounded-lg max-h-[350px]"
            />

          ) : (

            <span className="text-gray-400">
              Image preview
            </span>

          )}

        </div>

      </div>



      {/* RESULTS */}

      <div className="grid grid-cols-2 gap-6">

        {/* DETECTION INFO */}

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">

          <h2 className="text-sm uppercase text-emerald-400 mb-4">
            Detection Results
          </h2>

          {loading && (

            <div className="flex items-center gap-3 text-yellow-400">

              <Loader2 className="animate-spin"/>

              AI analyzing image...

            </div>

          )}

          {!loading && threat && (

            <div className="space-y-4">

              {/* OBJECTS */}

              <div>

                <p className="text-xs text-gray-400 mb-1">
                  Detected Objects
                </p>

                <div className="flex flex-wrap gap-2">

                  {detections.map((d,i)=>(
                    <span
                      key={i}
                      className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs"
                    >
                      {d.label}
                    </span>
                  ))}

                </div>

              </div>


              {/* THREAT LEVEL */}

              <div>

                <p className="text-xs text-gray-400 mb-1">
                  Threat Level
                </p>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold
                  ${threat==="HIGH"
                    ? "bg-red-500/20 text-red-400"
                    : "bg-green-500/20 text-green-400"
                  }`}
                >
                  {threat}
                </span>

              </div>



              {/* LOCATION */}

              {location && (

                <div>

                  <p className="text-xs text-gray-400 mb-1">
                    Incident Location
                  </p>

                  <p className="flex items-center gap-2 text-sm">

                    <MapPin size={14}/>

                    {location.lat}, {location.lng}

                  </p>

                </div>

              )}

            </div>

          )}

        </div>



        {/* MAP */}

        <div className="bg-white/5 border border-white/10 rounded-xl p-4">

          <h2 className="text-sm uppercase text-emerald-400 mb-4">
            Incident Location Map
          </h2>

          {location ? (

            <MapContainer
              center={[location.lat, location.lng]}
              zoom={13}
              style={{
                height:"260px",
                width:"100%",
                borderRadius:"10px"
              }}
            >

              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Marker position={[location.lat, location.lng]}>

                <Popup>
                  Threat detected here
                </Popup>

              </Marker>

            </MapContainer>

          ) : (

            <p className="text-gray-400 text-sm">
              Upload an image to see incident location
            </p>

          )}

        </div>

      </div>

    </div>

  );

};

export default UploadPage;