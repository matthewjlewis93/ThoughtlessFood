export default function MacroLabel({ macro, macroValue}) {
  return (
    <>
      <div style={{display: "inline-block", borderLeft: "1px dashed", borderBottom: "1px dashed", padding: "3px", width: "60px"}}>
        <h2 style={{ margin: 0, padding: 0, textAlign: "right"}}>{macroValue}g</h2>
        <p style={{ margin: 0, padding: 0, textAlign: "left" }}>{macro}</p>
      </div>
    </>
  );
}
