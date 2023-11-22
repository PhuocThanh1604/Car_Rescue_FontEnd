
let eventGuid = 0
let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today

export const INITIAL_EVENTS = [
  {
    id: createEventId(),
    title: 'All-day event',
    start: todayStr,
    resourceId: 'a',
  },
  {
    id: createEventId(),
    title: 'Timed event',
    start: todayStr + 'T12:00:00',
    resourceId: 'b',
  }
  ,
  {
    id: createEventId(),
    title: 'Timed event 2',
    start: todayStr + 'T2:00:00',
    resourceId: 'c',
  }
]

export function createEventId() {
  return String(eventGuid++)
}
