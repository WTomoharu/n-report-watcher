import React, { useState } from "react"

import { NavBar } from "./components/nav-bar"
import { ReportTable } from "./components/report-table"
import { UserInfoFrom } from "./components/user-info-form"

import { Report } from "@/lib/report"
import { ItemOf } from "@/lib/type-utils"
import { WithFnc } from "@/lib/with-fnc"

// モックデータを利用
import { getReports, logout } from "@/lib/back-mock"

type AppStatus = ItemOf<[
  "Standby",
  "Form",
  "Table",
]>

export const App = () => {
  let [reports, setReports] = useState<Report[]>([])
  let [appStatus, setAppStatus] = useState<AppStatus>("Standby")
  let [appTheme, setAppTheme] = useState<string>("light")
  let [isLoading, setIsLoading] = useState<boolean>(false)

  const withLoading = new WithFnc(
    () => {
      setIsLoading(true)
    },
    () => {
      setIsLoading(false)
    },
  )

  return (
    <div
      style={{
        position: "relative",
        height: "calc(100% - 16px)",
        padding: "8px",
      }}
      className={`app theme-${appTheme}`}
    >
      <NavBar
        onChangeTheme={() => {
          setAppTheme(
            appTheme === "dark" ? "light" : "dark"
          )
        }}
        onReload={() => {
          withLoading(getReports()
            .then(_reports => {
              // レポート取得成功時
              setReports(_reports)
              setAppStatus("Table")
            })
            .catch(err => {
              console.log(err)
            })
          )
        }}
        onLogout={() => {
          withLoading(logout()
            .then(() => {
              switch (appStatus) {
                case "Table":
                  setAppStatus("Form")
                  return
                case "Form":
                  setAppStatus("Form")
                  return
                case "Standby":
                  setAppStatus("Standby")
                  return
              }
            })
            .catch(err => {
              console.log(err)
            })
          )
        }}
        disabled={{
          reload: isLoading || !(appStatus === "Table"),
          logout: isLoading,
        }}
      />

      {(!isLoading && appStatus === "Form") && (
        <UserInfoFrom
          onSubmit={e => {
            console.log(e)
            withLoading(getReports(e)
              .then(_reports => {
                // レポート取得成功時
                setReports(_reports)
                setAppStatus("Table")
              })
              .catch(err => {
                console.log(err)
              })
            )
          }}
          onCancel={() => {
            setAppStatus("Standby")
          }}
        />
      )}

      {(!isLoading && appStatus === "Standby") && (
        <button
          className="tmp-btn"
          style={{ fontSize: "1.2em" }}
          onClick={() => {
            withLoading(getReports()
              .then(_reports => {
                // セッション有効時
                setReports(_reports)
                setAppStatus("Table")
              })
              .catch(err => {
                // セッション無効時
                console.log(err)
                setAppStatus("Form")
                return logout()
              })
              .catch(err => {
                console.log(err)
              })
            )
          }}>
          Get Report!
        </button>
      )}

      {isLoading && "Now loading"}

      {(!isLoading && appStatus === "Table") && (
        <ReportTable reports={reports} />
      )}
    </div>
  )
}
