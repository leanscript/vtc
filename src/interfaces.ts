import { Dayjs } from 'dayjs'

export interface DatesType {
  [key: number]: Day
}

export interface Day {
  id: number
  value: Dayjs | null
  disabled: boolean
  type: string
}

export interface Scope {
  year: number | null
  month: number | null
}

export interface RangeSelected {
  first: Day | {}
  last: Day | {}
}

export interface DisabledDates {
  range: { start: Dayjs; end: Dayjs }
  repeat: { weekdays: number[] }
  dates: number[]
}

export interface DatePickerProps {
  modelValue: Day
  closeOnClick: boolean
  disabledDates: DisabledDates
  displayValue: (date: Day) => string | null
}
