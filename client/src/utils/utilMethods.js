export const getDateKey = (timestamp) => {
  if(!timestamp){
    return ""
  }
  const date = new Date(timestamp);
  const dateKey = date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  return dateKey;
}

export const getDayText = (timestamp, type) => {
  if(!timestamp){
    return ""
  }
  const now = new Date();
  const msgDate = new Date(timestamp);

  const dateKey = (d) =>
    `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

  const todayKey = dateKey(now);

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const yesterdayKey = dateKey(yesterday);

  const twoDaysAgo = new Date(now);
  twoDaysAgo.setDate(now.getDate() - 2);
  const twoDaysAgoKey = dateKey(twoDaysAgo);

  const threeDaysAgo = new Date(now);
  threeDaysAgo.setDate(now.getDate() - 3);
  const threeDaysAgoKey = dateKey(threeDaysAgo);

  const msgKey = dateKey(msgDate);

  if (msgKey === todayKey) {
    return type === 'card'
      ? formatTime12Hour(msgDate)
      : 'Today';
  }

  if (msgKey === yesterdayKey) return 'Yesterday';

  if (msgKey === twoDaysAgoKey || msgKey === threeDaysAgoKey) {
    return msgDate.toLocaleDateString('en-IN', { weekday: 'long' });
  }

  if (type === 'card') {
    const day = msgDate.getDate().toString().padStart(2, '0');
    const month = (msgDate.getMonth() + 1).toString().padStart(2, '0');
    const year = msgDate.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const isSameYear = msgDate.getFullYear() === now.getFullYear();

  return msgDate.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    ...(isSameYear ? {} : { year: 'numeric' }),
  });
};

export const formatTime12Hour = (timestamp) => {
  if(!timestamp){
    return ""
  }
  const date = new Date(timestamp);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12 || 12;
  const paddedMinutes = minutes.toString().padStart(2, '0');

  return `${hours}:${paddedMinutes} ${ampm}`;
}