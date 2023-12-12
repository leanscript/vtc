<script setup lang="ts">
import dayjs from 'dayjs'
import { onBeforeMount, defineEmits, ref, computed, defineProps } from 'vue'
import vOnClickOutside from '@/lib/clickOutside'
import type { Day } from '@/interfaces'

import useCalendar from '@/lib/useCalendar'
const emit = defineEmits([
  'selectedDate',
  'rangeSelected',
  'update:modelValue',
  'clickOutside',
  'pageChanged'
])
const props = defineProps(['modelValue', 'closeOnClick', 'disabledDates', 'displayValue'])

const {
  dates,
  firstDay,
  selected,
  isDragging,
  addSelection,
  setRange,
  currentScope,
  previousMonth,
  nextMonth,
  changeContext,
  selectedRange,
  startSelection
} = useCalendar(emit, props.disabledDates)

const addSelectionAndEmit = (date: Day) => {
  addSelection(date)
  emit('update:modelValue', selected.value)
}
const startSelectionAndEmit = (date: Day) => {
  startSelection(date)
  emit('update:modelValue', selected.value)
}

onBeforeMount(() => {
  if (props.modelValue.first && props.modelValue.last) {
    setRange(props.modelValue)
    changeContext(props.modelValue.first.value.month() + 1, props.modelValue.first.value.year())
  } else {
    changeContext(dayjs().month() + 1, dayjs().year())
  }
})

const nextMonthAndEmit = () => {
  nextMonth()
  emit('pageChanged', currentScope.value)
}
const prevMonthAndEmit = () => {
  previousMonth()
  emit('pageChanged', currentScope.value)
}

const datePickerIsOpen = ref(false)
const closeDatePicker = () => (datePickerIsOpen.value = false)

const displaySelectedDate = computed(() => {
  if (typeof props.displayValue === 'function') {
    return props.displayValue(selected)
  } else {
    return selected.value.first && selected.value.last
      ? `${selected.value.first.value.format('DD/MM/YYYY')} - ${selected.value.last.value.format(
          'DD/MM/YYYY'
        )}`
      : ''
  }
})
</script>
<template>
  <div class="w-full">
    <button
      @click="datePickerIsOpen = !datePickerIsOpen"
      id="inputDatepicker"
      class="form-input w-full h-9 border-gray-300 dark:bg-slate-900 dark:border-slate-900 rounded-md focus:border-sn-secondary focus:ring-sn-secondary sm:text-sm text-left"
    >
      {{ displaySelectedDate }}
    </button>
    <div v-if="datePickerIsOpen" v-on-click-outside:inputDatepicker="closeDatePicker">
      <div v-if="dates.length" class="w-[400px] border rounded bg-white z-50 absolute">
        <div
          class="mt-10 text-center lg:col-start-8 lg:col-end-13 lg:row-start-1 bg-white lg:mt-9 xl:col-start-9"
        >
          <div class="flex items-center text-gray-900 px-4">
            <button
              @click="prevMonthAndEmit"
              type="button"
              class="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
            >
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path
                  fill-rule="evenodd"
                  d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
            <div class="flex-auto text-sm font-semibold">
              {{ dates.length && firstDay.value.format('MMMM YYYY') }}
            </div>
            <button
              @click="nextMonthAndEmit"
              type="button"
              class="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
            >
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path
                  fill-rule="evenodd"
                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
          <div class="mt-6 grid grid-cols-7 text-xs leading-6 text-gray-500">
            <div>L</div>
            <div>M</div>
            <div>M</div>
            <div>J</div>
            <div>V</div>
            <div>S</div>
            <div>D</div>
          </div>
          <div
            class="isolate mt-2 grid grid-cols-7 gap-px bg-gray-200 text-sm shadow ring-1 ring-gray-200"
          >
            <button
              v-for="(date, i) in dates"
              :key="i"
              type="button"
              class="span-2 py-1.5 text-gray-900 hover:bg-gray-100 focus:z-10"
              :class="{
                'bg-white': date.type === 'date',
                'bg-gray-200 hover:bg-gray-200 cursor-default': date.type !== 'date',
                'cursor-not-allowed !bg-gray-100 !text-gray-300': date.disabled
              }"
              @click="date.type === 'date' && !date.disabled && startSelectionAndEmit(date)"
              @mouseover="isDragging && addSelectionAndEmit(date)"
            >
              <time
                v-if="date.type === 'date'"
                :datetime="date.value.format('YYYY-MM-DD')"
                class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
                :class="{
                  'bg-black !text-white':
                    (selected.first && selected.first.id === date.id) ||
                    (selected.last && selected.last.id === date.id),
                  'cursor-not-allowed bg-gray-100 !text-gray-300': date.disabled,
                  'bg-slate-200 hover:bg-red-300':
                    selectedRange.includes(date.id) && !date.disabled,
                  'text-red-500 font-bold':
                    date.value.format('DD-MM-YYYY') === dayjs().format('DD-MM-YYYY')
                }"
              >
                {{ date.value.date() }}
              </time>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
