import { Report } from "@/lib/report"
import MockReports from "@/assets/mock.json"

function sleep(time: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, time))
}

export async function logout(): Promise<void> {
  await sleep(500)
  return
}

export async function getReports(e?: any): Promise<Report[]> {
  await sleep(500)
  return MockReports as any
}