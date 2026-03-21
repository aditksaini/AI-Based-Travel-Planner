import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import Leaflet Map to avoid SSR window errors
const MapRoute = dynamic(() => import("./MapRoute"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-cyber border-t-transparent rounded-full animate-spin"></div>
    </div>
  ),
});

export default function MapPlaceholder({ sourceString, destinationString }: { sourceString?: string; destinationString?: string }) {
  const [mapData, setMapData] = useState<any>(null); // destination
  const [sourceData, setSourceData] = useState<any>(null); // source
  const [routeInfo, setRouteInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch Geocoding for both Source and Destination
  useEffect(() => {
    if (!sourceString && !destinationString) {
      setLoading(false);
      return;
    }

    const fetchGeocoding = async () => {
      try {
        setLoading(true);
        if (destinationString) {
          const res = await fetch(`/api/graphhopper?q=${encodeURIComponent(destinationString)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.hits && data.hits.length > 0) setMapData(data.hits[0]);
          }
        }

        if (sourceString) {
          const res = await fetch(`/api/graphhopper?q=${encodeURIComponent(sourceString)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.hits && data.hits.length > 0) setSourceData(data.hits[0]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch graphhopper geocoding data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGeocoding();
  }, [sourceString, destinationString]);

  // Fetch Route whenever we have both Source and Destination
  useEffect(() => {
    if (!sourceData || !mapData) {
      return;
    }

    const fetchRoute = async () => {
      setLoading(true);
      try {
        // Enforce points_encoded=false to get coordinate array
        const res = await fetch(
          `/api/graphhopper?point=${sourceData.point.lat},${sourceData.point.lng}&point=${mapData.point.lat},${mapData.point.lng}&profile=car&points_encoded=false`
        );
        if (res.ok) {
          const data = await res.json();
          if (data.paths && data.paths.length > 0) {
            setRouteInfo(data.paths[0]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch route data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoute();
  }, [sourceData, mapData]);

  if (!destinationString && !sourceString) return null;

  // Formatting utilities for distance and time
  const formatDistance = (meters: number) => (meters / 1000).toFixed(1) + " km";
  const formatTime = (ms: number) => {
    const mins = Math.floor(ms / 60000);
    const hrs = Math.floor(mins / 60);
    if (hrs > 0) return `${hrs}h ${mins % 60}m`;
    return `${mins}m`;
  };

  return (
    <div className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 mt-4">
      <h4 className="text-cyber font-outfit uppercase tracking-widest text-xs font-bold mb-4">
        Route Map (Source → Destination)
      </h4>

      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-white/5 border border-white/10">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-cyber border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : mapData || sourceData ? (
          <>
            <div className="absolute inset-0 z-0">
              <MapRoute sourceData={sourceData} mapData={mapData} routeInfo={routeInfo} />
            </div>

            {/* 🔥 SOURCE INFO OVERLAY */}
            {sourceData && (
              <div className="absolute bottom-16 left-4 bg-black/80 px-3 py-2 rounded-lg text-xs border border-white/10 backdrop-blur-md z-10 pointer-events-none">
                <div className="text-green-400 font-mono mb-1">
                  SRC → {sourceData.name}, {sourceData.country}
                </div>
                <div className="text-white/50 font-mono">
                  LAT: {sourceData.point.lat.toFixed(4)}, LNG: {sourceData.point.lng.toFixed(4)}
                </div>
              </div>
            )}

            {/* 🔥 DESTINATION & ROUTE INFO OVERLAY */}
            {mapData && (
              <div className="absolute bottom-4 right-4 bg-black/80 px-3 py-2 rounded-lg text-xs border border-white/10 backdrop-blur-md text-right z-10 pointer-events-none">
                <div className="text-cyber font-mono mb-1">
                  DEST → {mapData.name}, {mapData.country}
                </div>
                {routeInfo && (
                  <div className="text-white font-bold opacity-90">
                    Distance: {formatDistance(routeInfo.distance)} • ETA: {formatTime(routeInfo.time)}
                  </div>
                )}
              </div>
            )}

            <div className="absolute top-4 left-4 bg-black/80 border border-white/10 px-3 py-1 rounded-md text-[10px] z-10 pointer-events-none">
              Powered by GraphHopper
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400">
            Map Data Unavailable
          </div>
        )}
      </div>
    </div>
  );
}
