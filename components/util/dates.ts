export const getRoundedTime = () => {
    const date = new Date()
    const minutes = date.getMinutes()
    const remainder = minutes % 15
    if (remainder < 8) {
      date.setMinutes(minutes - remainder)
    } else {
      date.setMinutes(minutes + (15 - remainder))
    }
    return date
}

export const secondsToMins = (secs) => {
  if (secs == undefined || secs == null || secs< 1) return 1;
  const mins = secs / 60;
  return Math.floor(mins);
}