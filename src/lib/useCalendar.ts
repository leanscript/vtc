import { ref, computed } from 'vue'
import dayjs, { Dayjs } from 'dayjs'
import type { Ref } from 'vue'
import type { Day, Scope, RangeSelected, DisabledDates } from '@/interfaces'

export default function useCalendar(emit: any, disabledDates: DisabledDates): any {
  const dates: Ref<Day[]> = ref([])
  const firstDay: Ref<Day | {}> = ref({})
  const currentScope: Ref<Scope> = ref({ year: null, month: null })
  const selected: Ref<RangeSelected> = ref({ first: {}, last: {} })
  const selectedOne: Ref<Day | {}> = ref({})
  const isDragging: Ref<boolean> = ref(false)

  function isDateDisabled(date: Dayjs): boolean {
    if (disabledDates.repeat) return evalDisabledRepeat(date)
    if (disabledDates.range) return evalDisabledRange(date)
    if (disabledDates.dates) return evalDisabledDates(date)
    return false
  }

  function evalDisabledRepeat(date: Dayjs): boolean {
    return disabledDates.repeat && disabledDates.repeat.weekdays.includes(date.day())
  }

  function evalDisabledRange(date: Dayjs): boolean {
    const { start, end } = disabledDates.range

    return start.valueOf() <= date.valueOf() && date.valueOf() <= end.valueOf()
  }

  function evalDisabledDates(date: Dayjs): boolean {
    return disabledDates.dates.includes(date.valueOf())
  }

  function getDaysInMonth(month: number, year: number): Day[] {
    let date = dayjs(`${month}-01-${year}`)
    const days: Day[] = []
    while (date.month() === month - 1) {
      days.push({
        type: 'date',
        disabled: disabledDates ? isDateDisabled(date) : false,
        value: date.clone(),
        id: date.valueOf()
      })
      date = date.add(1, 'day')
    }
    return days
  }

  function getOffset(weekDay: number) {
    const output = []
    for (let i = 0; i < weekDay - 1; i++) {
      output.push({ type: 'offset', id: 1, value: dayjs(), disabled: true })
    }
    return output
  }

  const selectedRange = computed(() => {
    if (selected.value.first && selected.value.last) {
      // @ts-ignore
      if (selected.value.first.id > selected.value.last.id) {
        const tmp = selected.value.first
        selected.value.first = selected.value.last
        selected.value.last = tmp
      }
      return dates.value
        .filter((el) => {
          if (el.type !== 'date') return false
          // @ts-ignore
          if (el.id < selected.value.last.id && el.id > selected.value.first.id) return true
          return false
        })
        .map((el) => el.id)
    }
    return []
  })

  function setRange(dates: RangeSelected) {
    selected.value = dates
  }

  function startSelection(date: Day) {
    if (!selected.value.first) {
      selected.value.first = date
      selected.value.last = {}
      return
    }
    if (!selected.value.last) {
      selected.value.last = date
      isDragging.value = false
      emit('rangeSelected', selected.value)
      return
    }
    if (selected.value.last && selected.value.first) {
      selected.value.first = date
      selected.value.last = {}
      return
    }
  }

  function selectDate(date: Day) {
    selectedOne.value = date
    emit('selectedDate', selectedOne.value)
  }

  function addSelection(date: Day) {
    selected.value.last = date
  }

  function previousMonth() {
    // @ts-ignore
    if (firstDay.value.value) {
      // @ts-ignore
      const previous = firstDay.value.value.subtract(1, 'month')
      changeContext(previous.month() + 1, previous.year())
    }
  }
  function nextMonth() {
    // @ts-ignore
    if (firstDay.value.value) {
      // @ts-ignore
      const nextM = firstDay.value.value.add(1, 'month')
      changeContext(nextM.month() + 1, nextM.year())
    }
  }

  function changeContext(month: number, year: number) {
    dates.value = getDaysInMonth(month, year)
    firstDay.value = dates.value[0]
    // @ts-ignore
    dates.value = [...getOffset(firstDay.value.value.day()), ...dates.value]
    currentScope.value = {
      // @ts-ignore
      month: firstDay.value.value.month() + 1,
      // @ts-ignore
      year: firstDay.value.value.year()
    }
  }

  return {
    dates,
    firstDay,
    selected,
    isDragging,
    getDaysInMonth,
    getOffset,
    addSelection,
    previousMonth,
    setRange,
    nextMonth,
    changeContext,
    selectedRange,
    startSelection,
    selectedOne,
    selectDate,
    currentScope
  }
}
