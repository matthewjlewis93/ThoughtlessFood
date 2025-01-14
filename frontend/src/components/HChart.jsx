import { useState, useEffect } from "react";

export default function HChart({ data }) {
  const [percentagePositions, setPercentagePositions] = useState({
    0: [0, 0],
    1: [0, 0],
    2: [0, 0],
    3: [0, 0],
    4: [0, 0],
    5: [0, 0],
    6: [0, 0],
    7: [0, 0],
  });
  const [labels, setLabels] = useState([0, 1, 2, 3, 4, 5, 6, 7]);
  const [labelOpacity, setLabelOpacity] = useState("0%");

  useEffect(() => {
    let positions = { ...percentagePositions };
    Array.from(document.getElementsByClassName("graph-percentage")).forEach(
      (e, i) => {
        positions = {
          ...positions,
          [i]: [
            `${-e.offsetHeight}px`,
            `-${i % 2 == 0 ? e.offsetWidth / 2 + 3 : e.offsetWidth / 2}px`,
          ],
        };
      }
    );
    setPercentagePositions(positions);
    setLabelOpacity("100%");
  }, []);

  return (
    <div
      style={{
        height: "100px",
        width: "100%",
        position: "relative",
        // border: "1px solid #ff0000",
      }}
    >
      <div
        style={{
          height: "70px",
          width: "95%",
          margin: "0px auto",
          borderLeft: "1px solid",
          position: "relative",
          top: "15px",
          left: "calc(10%-2px)",
        }}
      >
        <div
          style={{
            height: "36px",
            width: "100%",
            backgroundColor: "#EEE",
            margin: "0px",
            position: "relative",
            top: "17px",
            zIndex: 2,
          }}
        >
          <span
            style={{
              position: "absolute",
              top: "-15px",
              width: "25%",
              height: "70px",
              borderRight: "1px solid #777",
              zIndex: 0,
            }}
          >
            <p
              className="graph-percentage"
              style={{
                position: "absolute",
                margin: 0,
                top: percentagePositions[0][0],
                right: percentagePositions[0][1],
                opacity: labelOpacity,
                fontSize: "12px",
              }}
            >
              25%
            </p>
            <p
              className="graph-percentage"
              style={{
                position: "absolute",
                margin: 0,
                bottom: percentagePositions[1][0],
                right: percentagePositions[1][1],
                opacity: labelOpacity,
                fontSize: "12px",
              }}
            >
              {Math.floor(1850 / 4)}
            </p>
          </span>
          <span
            style={{
              position: "absolute",
              top: "-15px",
              width: "25%",
              height: "70px",
              borderRight: "1px solid #777",
              zIndex: 0,
              left: "25%",
            }}
          >
            <p
              className="graph-percentage"
              style={{
                position: "absolute",
                margin: 0,
                top: percentagePositions[1][0],
                right: percentagePositions[1][1],
                opacity: labelOpacity,
                fontSize: "12px",
              }}
            >
              50%
            </p>
            <p
              className="graph-percentage"
              style={{
                position: "absolute",
                margin: 0,
                bottom: percentagePositions[1][0],
                right: percentagePositions[1][1],
                opacity: labelOpacity,
                fontSize: "12px",
              }}
            >
              {Math.floor(1850 / 2)}
            </p>
          </span>
          <span
            style={{
              position: "absolute",
              top: "-15px",
              width: "25%",
              height: "70px",
              borderRight: "1px solid #777",
              zIndex: 0,
              left: "50%",
            }}
          >
            <p
              className="graph-percentage"
              style={{
                position: "absolute",
                margin: 0,
                top: percentagePositions[2][0],
                right: percentagePositions[2][1],
                opacity: labelOpacity,
                fontSize: "12px",
              }}
            >
              75%
            </p>
            <p
              className="graph-percentage"
              style={{
                position: "absolute",
                margin: 0,
                bottom: percentagePositions[1][0],
                right: percentagePositions[1][1],
                opacity: labelOpacity,
                fontSize: "12px",
              }}
            >
              {Math.floor(1850 * 0.75)}
            </p>
          </span>
          <span
            style={{
              position: "absolute",
              top: "-15px",
              width: "25%",
              height: "70px",
              borderRight: "1px solid #777",
              zIndex: 0,
              left: "75%",
            }}
          >
            <p
              className="graph-percentage"
              style={{
                position: "absolute",
                margin: 0,
                top: percentagePositions[3][0],
                right: percentagePositions[3][1],
                opacity: labelOpacity,
                fontSize: "12px",
              }}
            >
              100%
            </p>
            <p
              className="graph-percentage"
              style={{
                position: "absolute",
                margin: 0,
                bottom: percentagePositions[1][0],
                right: percentagePositions[1][1],
                opacity: labelOpacity,
                fontSize: "12px",
              }}
            >
              {1850}
            </p>
          </span>
          {/* <p style={{margin: 0, padding: "3px", fontSize:"12px"}}>{data}</p> */}
        </div>
        <div
          id="fill-bar"
          style={{
            height: "20px",
            transitionDuration: "2000ms",
            backgroundColor: "#38E5BA",
            position: "relative",
            top: "-11px",
            width: `${100 * (data / 1850)}%`,
            textAlign: "center",
            zIndex: 5,
          }}
        ></div>
      </div>
    </div>
  );
}
