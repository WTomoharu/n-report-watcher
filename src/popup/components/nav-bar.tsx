import React from "react"

interface DisabledProps {
  reload?: boolean
  logout?: boolean
}

interface NavBarProps {
  onChangeTheme?: () => void
  onReload?: () => void
  onLogout?: () => void
  disabled?: DisabledProps
}

export const NavBar: React.FC<NavBarProps> = ({ onChangeTheme, onReload, onLogout, disabled }) => {
  return (
    <div style={{ position: "absolute", right: 0, top: 0, padding: 8, zIndex: 10 }}>
      <button
        className="tmp-btn" style={{ margin: "0 2px" }}
        onClick={onChangeTheme}
        value=""
      >
        Theme
      </button>

      <button
        className="tmp-btn" style={{ margin: "0 2px" }}
        disabled={disabled?.reload} onClick={onReload}
        value=""
      >
        Reload
      </button>

      <button
        className="tmp-btn" style={{ margin: "0 2px" }}
        disabled={disabled?.logout} onClick={onLogout}
        value=""
      >
        Logout
      </button>
    </div>
  )
}
