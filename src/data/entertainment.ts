/** SMS/event copy aligned with /entertainment and FAQ hours. */

export const LIVE_JAZZ_FRIDAY =
  "Live Jazz every Friday 6-9pm (dine-in 11am-9pm)";

export const KARAOKE_SATURDAY =
  "Karaoke every Saturday 6-9pm with DJ Goddess Divine (dine-in 11am-9pm)";

export const SUNDAY_BRUNCH =
  "Sunday Brunch 11am-5pm — free champagne with brunch, no live music";

export const COMEDY_THIRD_THURSDAY =
  "Comedy Night 3rd Thursday monthly 7-9pm";

export function entertainmentScheduleSummary(): string {
  return `${LIVE_JAZZ_FRIDAY}. ${KARAOKE_SATURDAY}. ${COMEDY_THIRD_THURSDAY}. ${SUNDAY_BRUNCH}.`;
}
