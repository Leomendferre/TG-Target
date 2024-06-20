import dayjs from "dayjs"
import { useEffect, useState } from "react"
import { api } from "../lib/axios"
import { generateDatesFromMonthBeginning } from "../utils/generate-dates-from-month-beginning"
import { TargetDay } from "./TargetDay"

const weekDays = [
  'Seg',
  'Ter',
  'Qua',
  'Qui',
  'Sex',
  'Sáb',
  'Dom',
];

const summaryDates = generateDatesFromMonthBeginning()

const minimumSummaryDatesSize = 18 * 7 // 18 weeks
const amountOfDaysToFill = minimumSummaryDatesSize - summaryDates.length

type Summary = {
  id: string;
  date: string;
  amount: number;
  completed: number;
}[]

export function SummaryTable() {

  const [summary, setSummary] = useState<Summary>([])


  useEffect(() => {
    api.get('summary').then(response => {
      setSummary(response.data)
    })
  }, [])

  return (
    <div className="w-full flex ">
      <div className="text-left grid grid-rows-7 grid-flow-row gap-5 mr-2">
        {weekDays.map((weekDays, i) => {
          return (
            <div 
            key={`${weekDays}-${i}`} 
            className="text-zinc-400 text-xl h-10 w-10 font-bold flex items-left justify-start"
            >
              {weekDays}
            </div>
          )
        })}
      </div>
      
      <div className="grid grid-rows-7 grid-flow-col gap-3">
      {summary.length > 0 && summaryDates.map(date => {     
      const dayInSummary = summary.find(day => {
        return dayjs(date).isSame(day.date, 'day')
      })

        return (
          <TargetDay 
            key={date.toString()}
            date={date}
            amount={dayInSummary?.amount} 
            defaultCompleted={dayInSummary?.completed} 
          />
        )
      })}

        {amountOfDaysToFill > 0 && Array.from({ length: amountOfDaysToFill }) .map((_, i) => {
          return (
            <div 
            key={i} 
            className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-40 cursor-not-allowed"
            />
          )
        })}
      </div>
    </div>
  );
}