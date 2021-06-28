import React from "react";
import ReactDOM from "react-dom";
import { App } from "@/popup/app";

const Page: React.FC = () => {
  return (
    <>
      {/* max-width: 800, max-height: 600 */}
      <div style={{ width: 500, height: 600 }}>
        <App />
      </div>
    </>
  )
}

ReactDOM.render(<Page />, document.getElementById("root"))