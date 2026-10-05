/**
 * Business facts used across the site. Fill every field from .sitegen/brief.json during
 * the build. Leave a field empty when the brief doesn't have it: components render a
 * visible <Todo> for empty values. Never invent a value to fill a gap.
 */
export const site = {
  name: '',
  /** Online booking page (Fresha, Timely, Kitomba, ClientDiary, Square, Vagaro…). */
  bookingUrl: '',
  /**
   * Set only if the brief confirms the booking provider accepts these query params for
   * preselecting a service/stylist. Otherwise leave null and BookLink sends the plain URL.
   */
  bookingParams: null as null | { service?: string; stylist?: string },
  /** Display format, e.g. "0430 209 064". */
  phone: '',
  /** E.164 for tel: links, e.g. "+61430209064". */
  phoneHref: '',
  email: '',
  address: '',
  instagram: '',
  facebook: '',
};
