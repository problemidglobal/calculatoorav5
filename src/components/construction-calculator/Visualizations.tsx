import React, { useRef, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import html2canvas from 'html2canvas';
import { Download, LayoutGrid, Layers, Milestone, ChartPie, BarChart3, HelpCircle } from 'lucide-react';
import { RoomData, UnitSystem } from './types';
import { MaterialEstimate } from './helpers';

interface VisualizationsProps {
  areaSqM: number;
  volumeCuM: number;
  length: number;
  width: number;
  height: number;
  unitSystem: UnitSystem;
  materials: MaterialEstimate[];
  rooms: RoomData[];
  costDetails: {
    materials: number;
    labor: number;
    equipment: number;
    transport: number;
    tax: number;
    other: number;
    grandTotal: number;
  };
  timeline: {
    workingDaysPerWeek: number;
    crewSize: number;
    daysNeeded: number;
  };
}

const COLORS = ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'];

export default function Visualizations({
  areaSqM,
  volumeCuM,
  length,
  width,
  height,
  unitSystem,
  materials,
  rooms,
  costDetails,
  timeline
}: VisualizationsProps) {
  const [activeTab, setActiveTab] = useState<'floorplan' | '3d' | 'materials' | 'cost' | 'timeline' | 'rooms'>('floorplan');
  const captureRef = useRef<HTMLDivElement>(null);
  const isMetric = unitSystem === 'metric';

  const downloadPNG = async () => {
    if (!captureRef.current) return;
    try {
      // Temporarily add a white background or theme support for clean capture
      const canvas = await html2canvas(captureRef.current, {
        backgroundColor: '#171717', // dark cosmic preview layout
        scale: 2,
        useCORS: true
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `calculatoora_construction_diagram_${activeTab}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error('Failed to capture png:', e);
    }
  };

  // 1. Material Chart Data
  const materialChartData = materials
    .filter(m => m.quantity > 0)
    .slice(0, 8)
    .map(m => ({
      name: m.name,
      value: parseFloat(m.quantity.toFixed(1)),
      cost: m.estimatedCost,
      unit: m.unit
    }));

  // 2. Cost Pie Data
  const costPieData = [
    { name: 'Materials', value: costDetails.materials, color: '#3b82f6' },
    { name: 'Labor', value: costDetails.labor, color: '#06b6d4' },
    { name: 'Equipment', value: costDetails.equipment, color: '#10b981' },
    { name: 'Transportation', value: costDetails.transport, color: '#f59e0b' },
    { name: 'Tax', value: costDetails.tax, color: '#ef4444' },
    { name: 'Other', value: costDetails.other, color: '#8b5cf6' }
  ].filter(item => item.value > 0);

  // 3. Room Chart Data
  const roomChartData = rooms.map(r => {
    const rLen = parseFloat(r.length) || 0;
    const rWid = parseFloat(r.width) || 0;
    const rArea = rLen * rWid;
    return {
      name: r.name || 'Unnamed Room',
      area: parseFloat(rArea.toFixed(1))
    };
  }).filter(r => r.area > 0);

  return (
    <div className="bg-neutral-900 text-white rounded-2xl p-6 border border-neutral-800 shadow-xl overflow-hidden">
      
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-neutral-800 pb-4 mb-6 gap-4">
        <div>
          <h3 className="text-lg font-bold tracking-tight text-neutral-100 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse" />
            Interactive Project Blueprint &amp; Data Hub
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            Real-time graphical projections of your dimensions, materials, and construction allocations.
          </p>
        </div>
        
        <button
          onClick={downloadPNG}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-900 border border-neutral-700 text-neutral-200 text-xs font-bold rounded-lg transition select-none cursor-pointer"
          title="Download PNG image of this visualization"
        >
          <Download className="w-3.5 h-3.5" />
          Download PNG
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-neutral-800 pb-3">
        {[
          { id: 'floorplan', label: 'Floor Plan', icon: LayoutGrid },
          { id: '3d', label: '3D Building Block', icon: Layers },
          { id: 'materials', label: 'Materials', icon: BarChart3 },
          { id: 'cost', label: 'Cost Split', icon: ChartPie },
          { id: 'timeline', label: 'Timeline', icon: Milestone },
          { id: 'rooms', label: 'Room Compare', icon: BarChart3 }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer select-none ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-750 hover:text-neutral-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Render Canvas/Capture Target */}
      <div
        ref={captureRef}
        className="relative bg-neutral-950 rounded-xl p-6 min-h-[340px] flex flex-col justify-center border border-neutral-850 overflow-hidden"
      >
        {/* Visualizer content based on active state */}
        {activeTab === 'floorplan' && (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <h4 className="text-xs font-bold text-neutral-400 tracking-wider uppercase">
              Project Area Diagram (Floor Plan Scale)
            </h4>
            
            {length > 0 && width > 0 ? (
              <div className="w-full max-w-[280px] aspect-video border-2 border-dashed border-blue-500 bg-blue-500/10 rounded-lg relative flex items-center justify-center shadow-lg animate-fade-in">
                {/* Length marker */}
                <div className="absolute -top-6 left-0 right-0 text-center text-xs font-mono text-blue-400">
                  {length} {isMetric ? 'm' : 'ft'} (Length)
                </div>
                {/* Width marker */}
                <div className="absolute -right-16 top-0 bottom-0 flex items-center text-xs font-mono text-blue-400">
                  {width} {isMetric ? 'm' : 'ft'} (Width)
                </div>
                {/* Area marker inside */}
                <div className="text-center p-4">
                  <div className="text-lg font-bold text-blue-300">
                    {areaSqM > 0 ? (isMetric ? areaSqM : areaSqM * 10.76391).toFixed(1) : '—'}
                  </div>
                  <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
                    {isMetric ? 'Square Meters' : 'Square Feet'}
                  </div>
                </div>
                {/* Compass or Grid background lines for blueprint touch */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f61a_1px,transparent_1px),linear-gradient(to_bottom,#3b82f61a_1px,transparent_1px)] bg-[size:14px_14px]" />
              </div>
            ) : (
              <div className="text-center py-10">
                <HelpCircle className="w-10 h-10 text-neutral-600 mx-auto mb-2 animate-bounce" />
                <p className="text-sm text-neutral-500">Enter Length and Width values to view the Floor Plan</p>
              </div>
            )}
          </div>
        )}

        {activeTab === '3d' && (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <h4 className="text-xs font-bold text-neutral-400 tracking-wider uppercase">
              Isometric 3D Building Block
            </h4>
            
            {length > 0 && width > 0 && height > 0 ? (
              <div className="relative w-full max-w-[320px] h-[220px] flex items-center justify-center animate-fade-in">
                {/* Beautiful Isometric cube styled with pure SVG */}
                <svg viewBox="0 0 200 160" className="w-full h-full max-h-[180px]">
                  {/* Top Face */}
                  <polygon
                    points="100,20 150,45 100,70 50,45"
                    fill="#3b82f6"
                    fillOpacity="0.2"
                    stroke="#3b82f6"
                    strokeWidth="1.5"
                  />
                  {/* Left Face */}
                  <polygon
                    points="50,45 100,70 100,130 50,105"
                    fill="#1d4ed8"
                    fillOpacity="0.3"
                    stroke="#1d4ed8"
                    strokeWidth="1.5"
                  />
                  {/* Right Face */}
                  <polygon
                    points="100,70 150,45 150,105 100,130"
                    fill="#1e3a8a"
                    fillOpacity="0.4"
                    stroke="#1e3a8a"
                    strokeWidth="1.5"
                  />
                  {/* Dimension Markers */}
                  <text x="135" y="32" fill="#60a5fa" fontSize="8" fontFamily="monospace">L: {length} {isMetric ? 'm' : 'ft'}</text>
                  <text x="60" y="32" fill="#60a5fa" fontSize="8" fontFamily="monospace">W: {width} {isMetric ? 'm' : 'ft'}</text>
                  <text x="160" y="80" fill="#60a5fa" fontSize="8" fontFamily="monospace">H: {height} {isMetric ? 'm' : 'ft'}</text>
                  {/* Volume Summary overlay */}
                  <text x="100" y="152" textAnchor="middle" fill="#10b981" fontSize="9" fontWeight="bold">
                    Vol: {(isMetric ? volumeCuM : volumeCuM / 0.76455).toFixed(1)} {isMetric ? 'm³' : 'yd³'}
                  </text>
                </svg>
              </div>
            ) : (
              <div className="text-center py-10">
                <HelpCircle className="w-10 h-10 text-neutral-600 mx-auto mb-2" />
                <p className="text-sm text-neutral-500">Enter Length, Width, and Height values to construct the 3D block</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'materials' && (
          <div className="w-full h-[280px] flex flex-col justify-between">
            <h4 className="text-xs font-bold text-neutral-400 tracking-wider uppercase mb-2 text-center">
              Material Estimates (Top Quantities)
            </h4>
            {materialChartData.length > 0 ? (
              <div className="w-full h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={materialChartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                    <XAxis dataKey="name" stroke="#a3a3a3" fontSize={10} tickLine={false} />
                    <YAxis stroke="#a3a3a3" fontSize={10} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#171717', border: '1px solid #404040', borderRadius: '8px' }}
                      labelStyle={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                      itemStyle={{ color: '#60a5fa', fontSize: '11px' }}
                    />
                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                      {materialChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-10 flex-1 flex flex-col justify-center items-center">
                <p className="text-sm text-neutral-500">No materials currently estimated.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'cost' && (
          <div className="w-full h-[280px] flex flex-col justify-between">
            <h4 className="text-xs font-bold text-neutral-400 tracking-wider uppercase mb-2 text-center">
              Overall Cost Breakdown
            </h4>
            {costPieData.length > 0 ? (
              <div className="flex flex-col sm:flex-row items-center justify-around h-[240px]">
                <div className="w-[180px] h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={costPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={70}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {costPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(val: number) => `$${val.toLocaleString()}`}
                        contentStyle={{ backgroundColor: '#171717', border: '1px solid #404040', borderRadius: '8px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-1.5 text-xs">
                  {costPieData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
                      <span className="text-neutral-400">{item.name}:</span>
                      <span className="font-bold text-neutral-100">${item.value.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-neutral-800 text-neutral-300 font-bold">
                    Grand Total: ${costDetails.grandTotal.toLocaleString()}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 flex-1 flex flex-col justify-center items-center">
                <p className="text-sm text-neutral-500">Enter cost and tax metrics to view breakdown.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <h4 className="text-xs font-bold text-neutral-400 tracking-wider uppercase">
              Project Schedule Milestone
            </h4>
            {timeline.daysNeeded > 0 ? (
              <div className="w-full max-w-[340px] space-y-4 animate-fade-in text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between font-semibold text-neutral-200">
                    <span>Structural Phase Planning</span>
                    <span className="text-blue-400 font-bold">{Math.ceil(timeline.daysNeeded)} Working Days</span>
                  </div>
                  <div className="w-full h-2.5 bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full w-2/3 animate-pulse" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-neutral-900/80 p-2.5 rounded-lg border border-neutral-800">
                    <div className="text-neutral-400 text-[10px]">CREW CAPACITY</div>
                    <div className="text-sm font-bold text-neutral-100">{timeline.crewSize} Workers</div>
                  </div>
                  <div className="bg-neutral-900/80 p-2.5 rounded-lg border border-neutral-800">
                    <div className="text-neutral-400 text-[10px]">SCHEDULE PACE</div>
                    <div className="text-sm font-bold text-neutral-100">{timeline.workingDaysPerWeek} Days/Wk</div>
                  </div>
                </div>
                <p className="text-[10px] text-center text-neutral-500">
                  Includes typical alignment tolerances and site prep periods.
                </p>
              </div>
            ) : (
              <div className="text-center py-10">
                <HelpCircle className="w-10 h-10 text-neutral-600 mx-auto mb-2" />
                <p className="text-sm text-neutral-500">Enter Labor &amp; Timeline inputs to generate project duration schedule.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'rooms' && (
          <div className="w-full h-[280px] flex flex-col justify-between">
            <h4 className="text-xs font-bold text-neutral-400 tracking-wider uppercase mb-2 text-center">
              Room-by-Room Area Comparison ({isMetric ? 'm²' : 'sq ft'})
            </h4>
            {roomChartData.length > 0 ? (
              <div className="w-full h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={roomChartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                    <XAxis dataKey="name" stroke="#a3a3a3" fontSize={10} tickLine={false} />
                    <YAxis stroke="#a3a3a3" fontSize={10} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#171717', border: '1px solid #404040', borderRadius: '8px' }}
                      labelStyle={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                      itemStyle={{ color: '#22d3ee', fontSize: '11px' }}
                    />
                    <Bar dataKey="area" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-10 flex-1 flex flex-col justify-center items-center">
                <HelpCircle className="w-10 h-10 text-neutral-600 mx-auto mb-2" />
                <p className="text-sm text-neutral-500">Add rooms with length &amp; width inside the Room Estimator to compare floor allocations.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
