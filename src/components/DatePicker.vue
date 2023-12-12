<script setup lang="ts">
import dayjs from 'dayjs'
import { onBeforeMount, defineEmits, defineProps, ref, computed } from 'vue'
import useCalendar from '@/lib/useCalendar'
import vOnClickOutside from '@/lib/clickOutside'
import type { Day, DatePickerProps } from '@/interfaces'

const emit = defineEmits(['selectedDate', 'rangeSelected', 'update:modelValue'])

const props = withDefaults(defineProps<DatePickerProps>(), {
  closeOnClick: false
})

const { dates, firstDay, selectDate, selectedOne, previousMonth, nextMonth, changeContext } =
  useCalendar(emit, props.disabledDates)

onBeforeMount(() => {
  if (props.modelValue) {
    selectDate(props.modelValue)
    // @ts-ignore
    changeContext(props.modelValue.value.month() + 1, props.modelValue.value.year())
  } else {
    changeContext(dayjs().month() + 1, dayjs().year())
  }
})

const selectDateAndEmit = (date: Day) => {
  selectDate(date)
  emit('update:modelValue', date)
  if (props.closeOnClick) {
    datePickerIsOpen.value = false
  }
}

const datePickerIsOpen = ref(false)
const closeDatePicker = () => (datePickerIsOpen.value = false)

const displaySelectedDate = computed(() => {
  if (typeof props.displayValue === 'function') {
    return props.displayValue(selectedOne.value)
  } else {
    return selectedOne.value.id ? selectedOne.value.value.format('DD/MM/YYYY') : ''
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
      <div
        v-if="dates.length"
        class="w-[400px] border border-gray-300 rounded bg-white absolute"
        style="z-index: 500"
      >
        <div
          class="mt-10 text-center lg:col-start-8 lg:col-end-13 lg:row-start-1 bg-white lg:mt-9 xl:col-start-9"
        >
          <div class="flex items-center text-gray-900 px-4">
            <button
              @click="previousMonth"
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
              @click="nextMonth"
              type="button"
              class="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
            >
              <svg const class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
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
              class="span-2 py-1.5 border-none text-gray-900 hover:bg-gray-100"
              :class="{
                'bg-white': date.type === 'date',
                'bg-gray-200 hover:bg-gray-200 cursor-default': date.type !== 'date',
                'cursor-not-allowed !bg-gray-100 !text-gray-300': date.disabled
              }"
              @click="date.type === 'date' && !date.disabled && selectDateAndEmit(date)"
            >
              <time
                v-if="date.type === 'date'"
                :datetime="date.value.format('YYYY-MM-DD')"
                class="mx-auto flex h-7 w-7 items-center justify-center rounded-full"
                :class="{
                  'bg-black !text-white': selectedOne.id === date.id,
                  'text-red-500 font-bold':
                    date.value.format('DD-MM-YYYY') === dayjs().format('DD-MM-YYYY'),
                  'cursor-not-allowed bg-gray-100 !text-gray-300': date.disabled
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
