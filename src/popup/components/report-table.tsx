import React, { useMemo } from "react"
import { Grid } from "gridjs-react"
import { TData } from "gridjs/dist/src/types"
import { Report } from "@/lib/report"
import { h } from "preact"

function dateToNum(date: string): number {
  const [t1, t2] = date.split("/")
  return Number(t1 + "00") + Number(t2)
}

function sortDate(a: any, b: any): number {
  if (dateToNum(a) > dateToNum(b)) {
    return 1
  } else if (dateToNum(b) > dateToNum(a)) {
    return -1
  } else {
    return 0
  }
}

const Color = {
  Orange: "#FF6F00", // amber darken-4
  Green: "#43A047", // green darken-1
  Red: "#DD2C00", // deep-orange accent-4
  Purple: "#BA68C8", // purple lighten-1
  Bluck: "#333333" // original
} as const

export const ReportTable: React.FC<{ reports: Report[] }> = ({ reports }) => {
  return useMemo(() => (
    <Grid
      data={reports as unknown as TData}
      columns={[
        {
          id: "subject",
          name: "教科",
          sort: {
            enabled: false
          },
          formatter: (cell: string) => {
            return cell.replace(/\(.+\)/gm, "")
          },
        },
        {
          id: "index",
          name: "番号",
          sort: {
            enabled: false
          },
          formatter(cell: number) {
            return `No.${cell + 1}`
          }
        },
        {
          id: "limit",
          name: "期限",
          sort: {
            compare: sortDate
          },
          width: "65px",
        },
        {
          id: "progress",
          name: "進捗",
          sort: {
            enabled: false
          },
          formatter(cell: string) {
            const num = Number(
              cell.match(/\d+/gm)?.[0] ?? "0"
            )

            let color: string

            if (num <= 0) {
              color = Color.Purple
            } else if (0 < num && num < 25) {
              color = Color.Purple
            } else if (25 <= num && num < 75) {
              color = Color.Red
            } else if (75 <= num && num < 100) {
              color = Color.Orange
            } else { // 100 <= num 
              color = Color.Green
            }

            return h("b", { style: { color } }, cell)
          },
        },
        {
          id: "score",
          name: "得点",
          sort: {
            enabled: false
          },
          formatter(cell: string) {
            let dict: {
              color?: string
              text?: string
            }

            if (cell === "") {
              dict = {
                color: Color.Orange,
                text: "未提出"
              }
            } else {
              dict = {
                color: Color.Green,
                text: cell
              }
            }

            return h("b", {
              style: {
                color: dict.color,
              }
            }, dict.text)
          },
        },
      ]}
      height={'520px'}
      width={'calc(100% - 4px)'}
      style={{
        table: {
          width: "100%"
        },
        th: {
          padding: "8px 12px",
        },
        td: {
          padding: "8px 12px",
        },
      }}
      search={true}
      sort={true}
      className={{
        search: "tmp-input",
      }}
    />
  ), [reports])
}
