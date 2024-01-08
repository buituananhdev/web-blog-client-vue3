<script setup>
import { ref, defineProps, defineEmits } from "vue";
import { RRule } from "rrule";

const emit = defineEmits();
const props = defineProps(["startDate", "locale"]);
const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const defaultLocale = {
  'Repeat every': 'Repeat every',
  'Second': 'Second',
  'Minute': 'Minute',
  'Hour': 'Hour',
  'Day': 'Day',
  'Week': 'Week',
  'Month': 'Month',
  'Year': 'Year',
  'Mon': 'Mon',
  'Tue': 'Tue',
  'Wed': 'Wed',
  'Thu': 'Thu',
  'Fri': 'Fri',
  'Sat': 'Sat',
  'Sun': 'Sun',
  'Day of the month': 'Day of the month',
  'Ends': 'Ends',
  'Never': 'Never',
  'On date': 'On date',
  'After': 'After',
  'Select end date': 'Select end date',
  'Number of occurrences': 'Number of occurrences',
  'Cancel': 'Cancel',
  'Confirm': 'Confirm'
};
const repeatValue = ref(1);
const repeatUnit = ref("WEEKLY");
const dayOfMonth = ref("1");
const endType = ref("never");
const endDate = ref("");
const occurrences = ref(1);
const generatedRule = ref("");
const startDate = props.startDate || new Date();
const locale = props.locale || defaultLocale;
const selectedDaysOfWeek = ref([]);

const toggleDayOfWeek = (day) => {
  if (selectedDaysOfWeek.value.includes(day)) {
    selectedDaysOfWeek.value = selectedDaysOfWeek.value.filter(d => d !== day);
  } else {
    selectedDaysOfWeek.value = [...selectedDaysOfWeek.value, day];
  }
  console.log(selectedDaysOfWeek.value)
};

const generateRecurrenceRule = () => {
  const rruleOptions = getRRuleOptions();

  const rule = new RRule(rruleOptions);
  generatedRule.value = rule.toString();
  console.log(generatedRule.value);
  emit("generatedRule", generatedRule.value);
};

const getRRuleOptions = () => {
  const options = {
    dtstart: startDate.value,
    freq: RRule[repeatUnit.value],
    interval: repeatValue.value,
  };

  if (repeatUnit.value === "WEEKLY") {
    options.byweekday = selectedDaysOfWeek.value.map(day => daysOfWeek.indexOf(day));
  } else if (repeatUnit.value === "MONTHLY") {
    options.bymonthday = parseInt(dayOfMonth.value);
  }

  if (endType.value === "specificDate") {
    options.until = new Date(endDate.value);
  } else if (endType.value === "afterOccurrences") {
    options.count = occurrences.value;
  }

  return options;
};

const cancel = () => {
  emit("cancel");
};
</script>

<template>
  <div class="rrule-builder">
    <div class="rrule-builder__section">
      <label for="repeat" class="rrule-builder__label">{{ locale['Repeat every'] }}:</label>
      <div class="rrule-builder__inputs rrule-builder__repeat">
        <input v-model="repeatValue" type="number" min="1" class="rrule-builder__repeat-input" />
        <select v-model="repeatUnit" class="rrule-builder__repeat-select">
          <option value="SECONDLY">{{ locale['Second'] }}</option>
          <option value="MINUTELY">{{ locale['Minute'] }}</option>
          <option value="HOURLY">{{ locale['Hour'] }}</option>
          <option value="DAILY">{{ locale['Day'] }}</option>
          <option value="WEEKLY">{{ locale['Week'] }}</option>
          <option value="MONTHLY">{{ locale['Month'] }}</option>
          <option value="YEARLY">{{ locale['Year'] }}</option>
        </select>
      </div>
    </div>

    <template v-if="repeatUnit === 'WEEKLY'">
      <div class="rrule-builder__section rrule-builder__section--weekly">
        <div v-for="day in daysOfWeek" :key="day" class="rrule-builder__checkbox"
          :class="{ 'rrule-builder__checkbox--active': selectedDaysOfWeek.includes(day) }" @click="toggleDayOfWeek(day)">
          <input type="checkbox" @change="toggleDayOfWeek(day)" />
          <span>{{ locale[day] }}</span>
        </div>
      </div>
    </template>

    <template v-if="repeatUnit === 'MONTHLY'">
      <div class="rrule-builder__section rrule-builder__section--monthly">
        <label for="dayOfMonth" class="rrule-builder__label">{{ locale['Day of the month']}}:</label>
        <input v-model="dayOfMonth" type="number" min="1" max="31" class="rrule-builder__input" />
      </div>
    </template>

    <div class="rrule-builder__section rrule-builder__section--end">
      <label for="endType" class="rrule-builder__label">{{ locale['Ends'] }}:</label>
      <div class="rrule-builder__inputs rule-builder__end">
        <div class="rrule-builder__end-item">
          <input v-model="endType" type="radio" name="never" id="never" value="never" />
          <label for="never">{{ locale['Never'] }}</label>
        </div>
        <div class="rrule-builder__end-item">
          <input v-model="endType" type="radio" name="specificDate" id="specificDate" value="specificDate" />
          <label for="specificDate">{{ locale['On date'] }}</label>
        </div>
        <div class="rrule-builder__end-item">
          <input v-model="endType" type="radio" name="afterOccurrences" id="afterOccurrences" value="afterOccurrences" />
          <label for="afterOccurrences">{{ locale['After'] }}</label>
        </div>
      </div>

      <template v-if="endType === 'specificDate'">
        <div class="rrule-builder__section">
          <label for="endDate" class="rrule-builder__label">{{ locale['Select end date'] }}:</label>
          <input v-model="endDate" type="date" class="rrule-builder__input" />
        </div>
      </template>

      <template v-if="endType === 'afterOccurrences'">
        <div class="rrule-builder__section">
          <label for="occurrences" class="rrule-builder__label">{{ locale['Number of occurrences'] }}:</label>
          <input v-model="occurrences" type="number" min="1" class="rrule-builder__input" />
        </div>
      </template>
    </div>

    <div class="rrule-builder__section rrule-builder__action">
      <button class="rrule-builder__button rrule-builder__button--cancel" @click="cancel">{{ locale['Cancel']
      }}</button>
      <button @click="generateRecurrenceRule" class="rrule-builder__button">{{ locale['Confirm'] }}</button>
    </div>
  </div>
</template>

<style scoped>
/* General styles */
.rrule-builder {
  width: 400px;
  height: max-content;
  padding: 12px;
  background-color: #fff;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rrule-builder__section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.rrule-builder__inputs {
  display: flex;
  gap: 8px;
}

.rrule-builder__input,
.rrule-builder__select {
  max-height: 60px;
  border-radius: 6px;
}

/* Repeat section styles */
.rrule-builder__repeat-input {
  width: 65px;
  border-radius: 4px;
}

.rrule-builder__repeat-select {
  width: 150px;
  border-radius: 4px;
}

/* Weekly section styles */
.rrule-builder__section--weekly {
  padding: 0 12px;
  display: flex;
  justify-content: space-evenly;
}

.rrule-builder__checkbox {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  border: solid 1px #0039d7;
  color: #0039d7;
  cursor: pointer;
}

.rrule-builder__checkbox input {
  display: none;
}

.rrule-builder__checkbox span {
  font-size: 12px;
}

.rrule-builder__checkbox--active {
  background-color: #1652f0;
  color: #fff;
}

/* Monthly section styles */
.rrule-builder__section--monthly {
  display: flex;
  gap: 8px;
}

/* End type section styles */
.rrule-builder__section--end {
  flex-direction: column;
  align-items: flex-start;
}

.rrule-builder__end {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.rrule-builder__end-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Action section styles */
.rrule-builder__action {
  justify-content: flex-end;
}

.rrule-builder__button {
  appearance: button;
  background-color: #1652f0;
  border: 1px solid #1652f0;
  border-radius: 4px;
  box-sizing: border-box;
  color: #ffffff;
  cursor: pointer;
  font-size: 14px;
  line-height: 1.15;
  overflow: visible;
  padding: 12px 16px;
  position: relative;
  text-align: center;
  text-transform: none;
  transition: all 80ms ease-in-out;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  width: fit-content;
}

/* Button states */
.rrule-builder__button:disabled {
  opacity: 0.5;
}

.rrule-builder__button:focus {
  outline: 0;
}

.rrule-builder__button:hover {
  background-color: #0a46e4;
  border-color: #0a46e4;
}

.rrule-builder__button:active {
  background-color: #0039d7;
  border-color: #0039d7;
}

/* Cancel button styles */
.rrule-builder__button--cancel {
  background-color: #fff;
  color: #0039d7;
  border: 1px solid #1652f0;
}
</style>