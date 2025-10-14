import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import { formatNumberDivisor } from "../../utils/formatters";
import "./LegendLegacy.css";

const LegendLegacy = ({ colorScale, minValue, maxValue, type, unit }) => {
  const { t } = useTranslation();
  const getSuffixAndDivisor = (value) => {
    if (value >= 1e9) return { suffix: t("map_legend_title_billions_suffix"), divisor: 1e9 };
    if (value >= 1e6) return { suffix: t("map_legend_title_millions_suffix"), divisor: 1e6 };
    if (value >= 1e3) return { suffix: t("map_legend_title_thousands_suffix"), divisor: 1e3 };
    return { suffix: "", divisor: 1 };
  };

  const updateLegendTitle = (unit, suffix) => {
    return `${
      type === "economic"
        ? t("map_legend_legacy_title_ecenomic_suffix")
        : t("map_legend_legacy_title_non_ecenomic_suffix")
    } ${
      unit
        ? ` (${unit}${suffix ? ` ${t("map_legend_legacy_title_in_suffix")} ${suffix}` : ""})`
        : ""
    }`;
  };

  const { suffix, divisor } = getSuffixAndDivisor(Math.max(Math.abs(minValue), Math.abs(maxValue)));
  const updatedTitle = updateLegendTitle(unit, suffix);

  // Generate the CSS for the gradient
  const gradientCSS = `linear-gradient(to right, 
    ${colorScale(minValue)} 0%, 
    ${colorScale((minValue + maxValue) / 2)} 50%, 
    ${colorScale(maxValue)} 100%)`;

  return (
    <div className="legend-container">
      <div className="legend-title">{updatedTitle}</div>
      <div className="color-gradient" style={{ backgroundImage: gradientCSS }}>
        <div className="gradient-line"></div>
      </div>
      <div className="legend-values">
        {minValue === maxValue ? (
          <span>{formatNumberDivisor(minValue, divisor)}</span>
        ) : (
          <>
            <span>{formatNumberDivisor(minValue, divisor)}</span>
            <span>{formatNumberDivisor((minValue + maxValue) / 2, divisor)}</span>
            <span>{formatNumberDivisor(maxValue, divisor)}</span>
          </>
        )}
      </div>
    </div>
  );
};

LegendLegacy.propTypes = {
  colorScale: PropTypes.func.isRequired,
  minValue: PropTypes.number.isRequired,
  maxValue: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  unit: PropTypes.string.isRequired,
};

export default LegendLegacy;
