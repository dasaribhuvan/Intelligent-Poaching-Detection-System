import React, { useEffect, useState } from "react";
import API from "../services/api";
import { motion } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const AlertPage = () => {

  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);

  const [page, setPage] = useState(1);
  const alertsPerPage = 10;

  useEffect(() => {

    const fetchAlerts = async () => {

      try {

        const res = await API.get("/incidents");
        setAlerts(res.data);

      } catch (err) {

        console.error(err);

      }

    };

    fetchAlerts();

  }, []);

  const start = (page - 1) * alertsPerPage;
  const end = start + alertsPerPage;

  const currentAlerts = alerts.slice(start, end);
  const totalPages = Math.ceil(alerts.length / alertsPerPage);

  return (

    <div className="h-full flex flex-col gap-6">

      {/* HEADER */}

      <div className="flex items-center gap-3">

        <AlertTriangle className="text-red-400"/>

        <h1 className="text-2xl font-semibold">
          Incident Alerts
        </h1>

      </div>


      {/* ALERT TABLE */}

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-white/5 text-gray-400 uppercase text-xs">

            <tr>
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Camera</th>
              <th className="p-4 text-left">Threat</th>
              <th className="p-4 text-left">Location</th>
              <th className="p-4 text-left">Time</th>
            </tr>

          </thead>

          <tbody>

            {currentAlerts.map(alert => (

              <motion.tr
                key={alert.id}
                whileHover={{ scale: 1.01 }}
                onClick={() => setSelectedAlert(alert)}
                className="border-t border-white/10 hover:bg-white/5 cursor-pointer"
              >

                <td className="p-4">{alert.id}</td>

                <td className="p-4">{alert.camera_id}</td>

                <td className="p-4">

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold
                    ${alert.threat_level === "HIGH"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-green-500/20 text-green-400"
                    }`}
                  >

                    {alert.threat_level}

                  </span>

                </td>

                <td className="p-4">

                  {alert.latitude}, {alert.longitude}

                </td>

                <td className="p-4 text-gray-400">

                  {new Date(alert.created_at).toLocaleString()}

                </td>

              </motion.tr>

            ))}

          </tbody>

        </table>

      </div>



      {/* PAGINATION */}

      <div className="flex justify-center gap-2">

        {[...Array(totalPages)].map((_, i) => (

          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-4 py-2 rounded-lg text-sm
            ${page === i + 1
              ? "bg-emerald-500 text-black"
              : "bg-white/5 hover:bg-white/10"
            }`}
          >

            {i + 1}

          </button>

        ))}

      </div>



      {/* MAP POPUP MODAL */}

      {selectedAlert && (

        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">

          <div className="bg-slate-900 border border-white/10 rounded-xl p-4 w-[600px]">

            <div className="flex justify-between items-center mb-3">

              <h2 className="font-semibold">
                Incident Location
              </h2>

              <button
                onClick={() => setSelectedAlert(null)}
              >
                <X/>
              </button>

            </div>

            <MapContainer
              center={[selectedAlert.latitude, selectedAlert.longitude]}
              zoom={13}
              style={{ height: "350px", width: "100%" }}
            >

              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Marker position={[selectedAlert.latitude, selectedAlert.longitude]}>

                <Popup>

                  Incident {selectedAlert.id}
                  <br/>
                  Threat: {selectedAlert.threat_level}

                </Popup>

              </Marker>

            </MapContainer>

          </div>

        </div>

      )}

    </div>

  );

};

export default AlertPage;