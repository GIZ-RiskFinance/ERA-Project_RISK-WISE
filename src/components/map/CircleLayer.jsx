import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

import L from "leaflet";
import { useMap } from "react-leaflet";

const CircleLayer = ({ data, colorScale, radius, activeRPLayer }) => {
  const map = useMap();
  const { t } = useTranslation();

  useEffect(() => {
    const layerGroup = L.layerGroup().addTo(map);

    data.features.forEach((feature) => {
      const { coordinates } = feature.geometry;
      const value = feature.properties[`rp${activeRPLayer}`];
      const level = feature.properties[`rp${activeRPLayer}_level`];
      const country = feature.properties["country"];
      const name = feature.properties["name"];

      L.circle([coordinates[1], coordinates[0]], {
        color: colorScale(value),
        fillColor: colorScale(value),
        fillOpacity: 0.3,
        radius: radius,
      })
        .bindPopup(
          `${t("country")}: ${country}<br>${t("admin")} 2: ${name}<br>` + 
          `${t("level")}: ${level}`
        )
        .addTo(layerGroup);
    });

    return () => layerGroup.clearLayers();
  }, [data, colorScale, map]);

  return null;
};

CircleLayer.propTypes = {
  data: PropTypes.any.isRequired,
  colorScale: PropTypes.any.isRequired,
  radius: PropTypes.number.isRequired,
  activeRPLayer: PropTypes.number.isRequired,
};

export default CircleLayer;
