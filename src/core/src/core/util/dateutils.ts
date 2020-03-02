export const dateFormat = (timestamp: number) => {
  const date = new Date(new Date().setTime(timestamp));
  let day = date.getDate().toString();
  day = day.length < 2 ? `0${day}` : day;
  let month = (date.getMonth() + 1).toString();
  month = month.length < 2 ? `0${month}` : month;

  return `${day}.${month}.${date.getFullYear()}`;
};
