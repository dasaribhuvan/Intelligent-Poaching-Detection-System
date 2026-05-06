import React, { useEffect, useState } from "react";
import API from "../services/api";
import CountUp from "react-countup";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Bar
} from "recharts";

import {
  ShieldAlert,
  AlertTriangle,
  Activity,
  TrendingUp
} from "lucide-react";

const COLORS = ["#ef4444", "#22c55e"];

const Dashboard = () => {

  const [incidents, setIncidents] = useState([]);

  useEffect(() => {

    const fetchIncidents = async () => {

      try {

        const res = await API.get("/incidents");
        setIncidents(res.data);

      } catch (err) {

        console.error(err);

      }

    };

    fetchIncidents();

  }, []);

  /* KPI */

  const totalAlerts = incidents.length;

  const highThreat = incidents.filter(
    i => i.threat_level === "HIGH"
  ).length;

  const lowThreat = incidents.filter(
    i => i.threat_level === "LOW"
  ).length;

  const detectionRate = totalAlerts
    ? Math.round((highThreat / totalAlerts) * 100)
    : 0;


  /* PIE DATA */

  const pieData = [

    { name: "High Threat", value: highThreat },

    { name: "Low Threat", value: lowThreat }

  ];


  /* TIMELINE */

  const timeline = {};

  incidents.forEach(i => {

    if (!i.created_at) return;

    const date = new Date(i.created_at);

    const key =
      `${date.getDate()}-${date.getMonth()+1} ${date.getHours()}:00`;

    timeline[key] = (timeline[key] || 0) + 1;

  });

  const chartData = Object.keys(timeline).map(key => ({

    time: key,
    alerts: timeline[key]

  }));


  /* RISK LEVEL */

  const riskLevel =
    highThreat > 10 ? "Critical" :
    highThreat > 5 ? "High" :
    "Normal";


  return (

    <div className="h-full flex flex-col gap-6 relative">

      {/* background glow */}

      <div className="absolute -top-40 -left-40 w-[350px] h-[350px] bg-emerald-500/20 blur-[120px] rounded-full"></div>

      <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-green-400/20 blur-[120px] rounded-full"></div>



      {/* HEADER */}

      <div className="flex justify-between items-center">

        <h1 className="text-2xl font-semibold tracking-wide">
          Wildlife Intelligence Dashboard
        </h1>

        <span className="text-sm text-emerald-400">
          AI Monitoring Active
        </span>

      </div>



      {/* KPI CARDS */}

      <div className="grid grid-cols-4 gap-4">

        {/* TOTAL */}

        <div className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-xl">

          <div className="flex justify-between">

            <p className="text-xs text-gray-400 uppercase">
              Total Alerts
            </p>

            <Activity size={18} className="text-emerald-400"/>

          </div>

          <p className="text-3xl font-bold text-emerald-400 mt-2">

            <CountUp end={totalAlerts}/>

          </p>

        </div>



        {/* HIGH */}

        <div className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-xl">

          <div className="flex justify-between">

            <p className="text-xs text-gray-400 uppercase">
              High Threat
            </p>

            <AlertTriangle size={18} className="text-red-400"/>

          </div>

          <p className="text-3xl font-bold text-red-400 mt-2">

            <CountUp end={highThreat}/>

          </p>

        </div>



        {/* LOW */}

        <div className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-xl">

          <div className="flex justify-between">

            <p className="text-xs text-gray-400 uppercase">
              Low Threat
            </p>

            <ShieldAlert size={18} className="text-green-400"/>

          </div>

          <p className="text-3xl font-bold text-green-400 mt-2">

            <CountUp end={lowThreat}/>

          </p>

        </div>



        {/* ACCURACY */}

        <div className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-xl">

          <div className="flex justify-between">

            <p className="text-xs text-gray-400 uppercase">
              Detection Accuracy
            </p>

            <TrendingUp size={18} className="text-cyan-400"/>

          </div>

          <p className="text-3xl font-bold text-cyan-400 mt-2">

            {detectionRate}%

          </p>

        </div>

      </div>



      {/* ANALYTICS */}

      <div className="grid grid-cols-2 gap-6 flex-1">

        {/* PIE */}

        <div className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-xl">

          <h2 className="text-sm text-emerald-400 uppercase mb-4">
            Threat Distribution
          </h2>

          <ResponsiveContainer width="100%" height={220}>

            <PieChart>

              <Pie
                data={pieData}
                dataKey="value"
                outerRadius={90}
                innerRadius={50}
              >

                {pieData.map((entry,index)=>(
                  <Cell key={index} fill={COLORS[index]} />
                ))}

              </Pie>

              <Tooltip/>

            </PieChart>

          </ResponsiveContainer>

        </div>



        {/* TIMELINE */}

        <div className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-xl">

          <h2 className="text-sm text-emerald-400 uppercase mb-4">
            Alert Timeline
          </h2>

          <ResponsiveContainer width="100%" height={220}>

            <BarChart data={chartData}>

              <CartesianGrid strokeDasharray="3 3" stroke="#334155"/>

              <XAxis dataKey="time" stroke="#94a3b8"/>

              <YAxis stroke="#94a3b8"/>

              <Tooltip/>

              <Bar
                dataKey="alerts"
                fill="#10b981"
                radius={[6,6,0,0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>



      {/* INSIGHTS */}

      <div className="grid grid-cols-2 gap-4">

        <div className="bg-white/5 border border-white/10 rounded-xl p-4">

          <p className="text-xs uppercase text-gray-400">
            System Status
          </p>

          <p className="text-emerald-400 font-semibold mt-1">
            AI Monitoring Active
          </p>

        </div>



        <div className="bg-white/5 border border-white/10 rounded-xl p-4">

          <p className="text-xs uppercase text-gray-400">
            Threat Level
          </p>

          <p className={`font-semibold mt-1 ${
            riskLevel === "Critical"
              ? "text-red-400"
              : riskLevel === "High"
              ? "text-yellow-400"
              : "text-green-400"
          }`}>

            {riskLevel}

          </p>

        </div>

      </div>

    </div>

  );

};

export default Dashboard;