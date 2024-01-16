import { useEffect } from "react";

function ExpandedBar({ children }) {
  useEffect(() => {
    console.log("hello");
  }, []);

  return (
    <div
      className="bg-light"
      style={{
        position: "absolute",
        height: "100%",
        width: "calc(25% + 16px)",
        padding: "10px",
        zIndex: "99"
      }}
    >
      {children}
    </div>
  );
}

export default ExpandedBar;
