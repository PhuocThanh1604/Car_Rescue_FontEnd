import React, { useEffect, useState } from "react";
import { Box, useTheme } from "@mui/material";
import { tokens } from "../theme";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { fetchDashboard } from "../redux/orderSlice";

const ProgressCircle = ({ size = 50 }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const colors = tokens(theme.palette.mode);
  const [loading, setLoading] = useState(false);
  const [dataDashboard, setDataDashboard] = useState({ cash: 0, banking: 0 });
  const [cashProgress, setCashProgress] = useState(0);
  const [bankingProgress, setBankingProgress] = useState(0);
  const cashAngle = cashProgress * 360;
  const bankingAngle = bankingProgress * 360;
  // SVG circle configuration
  const radius = size / 2 - 10;
  const viewBoxSize = size;

  ProgressCircle.propTypes = {
    progress: PropTypes.string.isRequired,
    size: PropTypes.string.isRequired,
  };
  useEffect(() => {
    setLoading(true);
    dispatch(fetchDashboard())
      .then((response) => {
        const apiData = response.payload;
        if (apiData) {
          // Update the state with the individual values
          setDataDashboard({
            cash: apiData.cash,
            banking: apiData.banking,
          });

          // Calculate progress for cash and banking separately
          const totalValue = apiData.cash + apiData.banking;
          setCashProgress(totalValue > 0 ? apiData.cash / totalValue : 0);
          setBankingProgress(totalValue > 0 ? apiData.banking / totalValue : 0);

          setLoading(false);
        }
      })
      .catch((error) => {
        // Handle error
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch]);
  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: "50%",
        width: `${size}px`,
        height: `${size}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `radial-gradient(${colors.primary[400]} 55%, transparent 56%),
                     conic-gradient(transparent 0deg ${cashAngle}deg, ${colors.blueAccent[500]} ${bankingAngle}deg 360deg),
                     ${colors.greenAccent[500]}`,
      }}
    >
      <svg
        width={viewBoxSize}
        height={viewBoxSize}
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      >
        {/* Define the circular path */}
        <path
          id="circlePath"
          d={`M ${radius + 10}, ${
            radius + 10
          } m -${radius}, 0 a ${radius},${radius} 0 1,1 ${
            radius * 2
          },0 a ${radius},${radius} 0 1,1 -${radius * 2},0`}
          fill="none"
          style={{ stroke: "none" }}
        />

        <text fill="white" fontSize="12" fontWeight="bold">
          <textPath
            xlinkHref="#circlePath"
            startOffset="12%"
            textAnchor="middle"
          >
            Banking : {(bankingProgress * 100).toFixed(0)}%
          </textPath>
        </text>
        <text fill="white" fontSize="12" fontWeight="bold">
          <textPath
            xlinkHref="#circlePath"
            startOffset="60%"
            textAnchor="middle"
          >
            Cash: {(cashProgress * 100).toFixed()}%
          </textPath>
        </text>
      </svg>
    </Box>
  );
};

ProgressCircle.propTypes = {
  size: PropTypes.number,
};

export default ProgressCircle;
