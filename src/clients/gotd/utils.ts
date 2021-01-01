import { GameImage, Game } from '.';

export function selectImage(image: GameImage) {
  return `${
    image.super_url ||
    image.screen_url ||
    image.medium_url ||
    image.small_url ||
    image.thumb_url ||
    image.icon_url ||
    image.tiny_url ||
    ''
  }`;
}

const dateFormatter = (date: string | number) =>
  new Intl.DateTimeFormat('en', {
    timeZone: 'UTC',
    month: 'short',
    year: 'numeric',
    day: 'numeric',
  }).format(new Date(date));

const months = [
  'unknown month',
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export function formatDateFromGame(response: Partial<Game>) {
  const {
    original_release_date,
    expected_release_day,
    expected_release_month,
    expected_release_quarter,
    expected_release_year,
  } = response;
  let date = 'No date listed';

  if (original_release_date) {
    date = dateFormatter(original_release_date);
  } else if (expected_release_year) {
    if (expected_release_month) {
      if (expected_release_day) {
        const str = `${expected_release_year}-${expected_release_month}-${expected_release_day}`;
        date = dateFormatter(str);
      } else {
        date = `${
          months[Number(expected_release_month)]
        } ${expected_release_year}`;
      }
    } else if (expected_release_quarter) {
      date = `${expected_release_quarter} ${expected_release_year}`;
    } else {
      date = `${expected_release_year}`;
    }
  }

  return date;
}
