import React, { useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";
import axios from "axios";
import { Divider } from "antd";

const Address = () => {
  const [positions, setPositions] = useState<any[]>([]);
  const URL_ENV = process.env.REACT_APP_BASE_URL || "http://localhost:9000";

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await axios.get(`${URL_ENV}/orders`);
        const fetchedPositions = response?.data?.map(
          (item: any, index: any) => ({
            name: item.position.name,
            position: {
              lat: parseFloat(item.position.lat),
              lng: parseFloat(item.position.lng),
            },
          })
        );
        setPositions(fetchedPositions);
      } catch (error) {
        console.log("Error fetching location:", error);
      }
    };

    fetchLocation();
  }, [URL_ENV]);

  const renderMarkers = (map: any, maps: any) => {
    positions.forEach((marker: any) => {
      new maps.Marker({
        position: marker.position,
        map,
        title: marker.name,
      });
    });
  };

  const vietnamCenter = {
    lat: 14.0583,
    lng: 108.2772,
  };

  const vietnamZoom = 5;

  return (
    <div className="Address">
      <div className="delivery active">
        <Divider>Vị trí khách hàng đã đặt hàng</Divider>
        {positions.length > 0 && (
          <div style={{ height: "50vh", width: "100%" }}>
            <GoogleMapReact
              bootstrapURLKeys={{
                key: "AIzaSyDc7PnOq3Hxzq6dxeUVaY8WGLHIePl0swY",
              }}
              defaultCenter={vietnamCenter}
              defaultZoom={vietnamZoom}
              yesIWantToUseGoogleMapApiInternals={true}
              onGoogleApiLoaded={({ map, maps }) => renderMarkers(map, maps)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Address;
