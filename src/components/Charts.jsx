import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, Area, AreaChart, PieChart, Pie, Cell } from 'recharts'

const pastel = ['#F9A8D4','#A9F9CD','#D5F9A9','#A9D5F9','#F24AA7']

export function SalesLine({data, metric='gross'}){
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{top:10,right:10,left:0,bottom:0}}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1e7fb" />
          <XAxis dataKey="date" tick={{fontSize:12}}/>
          <YAxis tick={{fontSize:12}}/>
          <Tooltip />
          <Line type="monotone" dataKey={metric} stroke={metric==='gross'?'#F24AA7':metric==='net'?'#A9D5F9':'#A9F9CD'} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function UnitsBar({data}){
  return (
    <div className="w-full h-40">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1e7fb" />
          <XAxis dataKey="date" hide/>
          <YAxis />
          <Tooltip />
          <Bar dataKey="units" fill="#D5F9A9" radius={[8,8,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function Donut({valueA=60,valueB=40}){
  const data=[{name:'A',value:valueA},{name:'B',value:valueB}]
  return (
    <div className="w-full h-40">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} innerRadius={50} outerRadius={70} paddingAngle={6} dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`c-${index}`} fill={pastel[index%pastel.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
