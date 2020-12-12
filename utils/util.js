const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const parseStringDate = (stringDate) => {
  if (!stringDate) { return null }

  const dateRegex = /(\d{4})\-(\d{2})\-(\d{2})\s+(\d{2})\:(\d{2})/ig
  const result = dateRegex.exec(stringDate)

  if (!result) { return null }

  const year = result[1]
  const month = result[2]
  const day = result[3]
  const hour = result[4]
  const minute = result[5]

  return new Date(Date.UTC(year, month, day, hour, minute, 0))
}

const formatDateTime = (dateTime) => {
  if (!dateTime) { return null }

  const stringDate = dateTime.toDateString()
  const hours = dateTime.getHours()
  let minutes = dateTime.getMinutes()

  if (minutes < 10) {
    minutes = `0${minutes}`
  }

  return `${stringDate} ${hours}:${minutes}`
}

module.exports = {
  formatTime,
  formatDateTime,
  parseStringDate,
}
