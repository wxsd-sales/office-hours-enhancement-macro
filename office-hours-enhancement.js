/********************************************************
 * 
 * Macro Author:      	William Mills
 *                    	Technical Solutions Specialist 
 *                    	wimills@cisco.com
 *                    	Cisco Systems
 * 
 * Version: 1-0-0
 * Released: 12/12/23
 * 
 * This is an example macro which enhances the current 
 * Office Hours feature on Webex Devices by immediately 
 * activating or deactivating standby at the start and 
 * end of the configured Office Hours.
 * 
 * This is useful in situations in which you have 
 * Automatic Standby disabled or your device is in Kiosk 
 * Mode and you would like it to full exit standby once 
 * Office Hours have started.
 * 
 * Full Readme, source code and license details for this 
 * macro are available on Github:
 * https://github.com/wxsd-sales/office-hours-enhancement-macro
 * 
 ********************************************************/
import xapi from 'xapi';


// Variables for storing our timers
let activateStandbyTimer = null;
let deactivateStandbyTimer = null;

// Subscribe to Office Hours Config changes and update scheduled actions
xapi.Config.Time.OfficeHours.on(() => {
  console.log('Office Hours Config Change Occurred - Recalculating Timers')
  createTimers();
  });


// Create our initial scheduled action timers
createTimers();


// This function reads the Devices Office Hours Config and creates new
// scheduled actions for the calculated dates
async function createTimers() {
  console.log('Calculating Auto Wake and Standby Timers')

  const startDate = new Date();
  const endDate = new Date();

  const endTime = await xapi.Config.Time.OfficeHours.WorkDay.End.get().then(result => result.split(":"));
  const startTime = await xapi.Config.Time.OfficeHours.WorkDay.Start.get().then(result => result.split(":"));
  const workWeek = await xapi.Config.Time.OfficeHours.WorkWeek.get();

  startDate.setHours(startTime[0], startTime[1], 0);
  endDate.setHours(endTime[0], endTime[1], 0);

  // Find next wakeup date
  const wakeDate = calculateNextDate(startDate, workWeek)
  const standbyDate = calculateNextDate(endDate, workWeek)
 
  // If no next standby or wake dates were calculated, stop all timers
  if (wakeDate == null) {
    console.log('No Auto Wake timer was created')
    clearTimers();
    return
  }

  if (standbyDate == null) {
    console.log('No Standby timer was created')
    clearTimers();
    return
  }

  // Reset any active timers
  clearTimers();

  // Create our schedules tasks and store to our timers
  deactivateStandbyTimer = schedule(wakeDate, deactivateStandby)
  activateStandbyTimer = schedule(standbyDate, activateStandby)
}


/**
 * Calculates the next valid date to perform an operation
 * @param {object}  date      - Date object with the correct time set
 * @param {Array}   workWeek  - An array of the Work Week days from the devices config 
*/
function calculateNextDate(date, workWeek) {
  const currentDate = new Date();
  const nextDate = new Date(date);
  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const currentDay = nextDate.getDay() - 1;
  let days = 0;
  while (true) {
    if (days == 7 && workWeek[weekDays[currentDay]] == 'True'){
      return addDays(nextDate, days)
    }
    if (days == 8) return null
    if (workWeek[weekDays[currentDay + days]] == 'True') {
      if (addDays(nextDate, days) > currentDate) {
        return addDays(nextDate, days)
      }
    }
    days = days + 1;
  }
}


// Clears the current timers if they are not null
function clearTimers(){
  console.log('Clearing any active timers');
  if(deactivateStandbyTimer != null){
    clearTimeout(deactivateStandbyTimer);
    deactivateStandbyTimer = null;
  }

  if(activateStandbyTimer != null){
    clearTimeout(activateStandbyTimer);
    activateStandbyTimer = null;
  }
}

// Activates Standby and triggers timer update
function activateStandby(){
  console.log('Activating Standby')
  xapi.Command.Standby.Activate();
  createTimers();
}

// Deactivates Standby and triggers timer update
function deactivateStandby(){
  console.log('Deactivating Standby')
  xapi.Command.Standby.Deactivate();
  createTimers();
}

// Adds a day to the given date
function addDays(date, days) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}

// Creates a scheduled action for the given date
function schedule(scheduleDate, action) {
  const currentDate = new Date();
  if (scheduleDate < currentDate) {
    console.log('Cannot schedule action for the past')
    return
  }
  const difference = scheduleDate - currentDate;
  console.log(`Scheduling [${action.name}] @`, scheduleDate)

  return setTimeout(action, difference);
}
