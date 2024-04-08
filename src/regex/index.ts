/**
 * Per the W3C HTML5 specification: https://html.spec.whatwg.org/multipage/forms.html#valid-e-mail-address
 * - Note: This requirement is a willful violation of RFC 5322, which defines a syntax for e-mail addresses that is simultaneously too strict (before the “@” character), too vague (after the “@” character), and too lax (allowing comments, whitespace characters, and quoted strings in manners unfamiliar to most users) to be of practical use here.
 *
 * - [a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]  Captures one or more characters that are allowed in the username part of the email address. This includes alphanumeric characters, special characters, and certain punctuation marks.
 * - @ Matches the @ symbol that separates the username and domain.
 * - [a-zA-Z0-9] Captures a single alphanumeric character, representing the first character of the domain name.
 * - (?: Starts a non-capturing group for optional domain sections.
 * - [a-zA-Z0-9-]{0,61}[a-zA-Z0-9]  Captures a domain section that consists of alphanumeric characters and hyphens. It allows between 0 and 61 characters, ensuring that the total length does not exceed 63 characters.
 * - )?  Ends the non-capturing group for the optional domain section, making it optional.
 * - (?:  Starts a non-capturing group for optional subdomains.
 * - \.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?  Captures a subdomain section that starts with a dot (.) followed by an alphanumeric character. It allows between 0 and 61 characters of alphanumeric characters and hyphens. The entire subdomain section is optional.
 * - )*  Ends the non-capturing group for the optional subdomains. This allows for zero or more occurrences of subdomain sections.
 */
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/**
 * - /^(?=.{3,20}$)(?![-_.])(?!.*[-_.]{2})[a-zA-Z0-9-_.]+(?<![-_.])$/
 * - (?=.{3,20}$) enforces a minimum of 3 characters and a maximum of 20 characters.
 * - (?![-_.]) ensures that the username does not start with a hyphen, underscore, or period.
 * - (?!.*[-_.]{2}) ensures that the username does not contain two hyphens, underscores, or periods in a row.
 * - [a-zA-Z0-9-_.]+ matches any alphanumeric character, hyphen, underscore, or period.
 * - (?<![-_.]) ensures that the username does not end with a hyphen, underscore, or period.
 * - ^ and $ ensure that the entire string matches the regex.
 */
const USERNAME_REGEX = /^(?=.{3,20}$)(?![-_.])(?!.*[-_.]{2})[a-zA-Z0-9-_.]+(?<![-_.])$/;

/**
 * - /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])(?!.*\s).{8,32}$/
 * - (?=.*[A-Z]) ensures that there is at least one uppercase letter.
 * - (?=.*[a-z]) ensures that there is at least one lowercase letter.
 * - (?=.*[0-9]) ensures that there is at least one number.
 * - (?=.*[!@#$%^&*]) ensures that there is at least one special character.
 * - (?!.*\s) ensures that there are no spaces.
 * - .{8,32} ensures that the password is between 8 and 32 characters long.
 * - ^ and $ ensure that the entire string matches the regex.
 */
const PASSWORD_REGEX =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])(?!.*\s).{8,32}$/;

/**
 * - /^(?!^\s*$)[a-zA-Z0-9!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]{1,100}$/i
 * - (?=.*[A-Za-z0-9]) ensures that there is at least one alphanumeric character, preventing the input from consisting entirely of whitespace.
 * - [A-Za-z0-9!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~] matches any alphanumeric character or special character in the range of special characters commonly used in components, part numbers, and ID numbers.
 * - {1,100} ensures that the text is between 1 and 100 characters long.
 * - ^ and $ ensure that the entire string matches the regex.
 */
const SERIAL_ID_REGEX =
  /^(?!^\s*$)[a-zA-Z0-9!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~\w\s]{1,100}$/i;

/**
 * - /^(?=.*[A-Za-z0-9])[\w\s.,!?():;"'-]{2,75}$/i
 * - (?=.*[A-Za-z0-9]) ensures that there is at least one alphanumeric character, preventing the input from consisting entirely of whitespace.
 * - [\w\s.,!?():;"'-] matches any word characters (\w includes alphanumeric characters and underscores), whitespace, and a range of allowed punctuation marks commonly used in grammar and punctuation: ., ,, !, ?, (, ), :, ;, ", ', -. The hyphen is placed at the end of the list to prevent it from being interpreted as a range of characters.
 * - {2,75} ensures that the text is between 2 and 75 characters long.
 * - ^ and $ ensure that the entire string matches the regex.
 * - i makes the regex case-insensitive.
 */
const NOTE_TEXT_REGEX = /^(?=.*[A-Za-z0-9])[\w\s.,!?():;"'-]{2,75}$/i;

/**
 * - /^(?=.*[A-Za-z0-9])[\w\s.,!?():;"'-]{2,2000}$/i
 * - (?=.*[A-Za-z0-9]) ensures that there is at least one alphanumeric character, preventing the input from consisting entirely of whitespace.
 * - [\w\s.,!?():;"'-] matches any word characters (\w includes alphanumeric characters and underscores), whitespace, and a range of allowed punctuation marks commonly used in grammar and punctuation: ., ,, !, ?, (, ), :, ;, ", ', -. The hyphen is placed at the end of the list to prevent it from being interpreted as a range of characters.
 * - {2,2000} ensures that the text is between 2 and 2000 characters long.
 * - ^ and $ ensure that the entire string matches the regex.
 * - i makes the regex case-insensitive.
 */
const NOTE_TEXT_AREA_REGEX = /^(?=.*[A-Za-z0-9])[\w\s.,!?():;"'-]{2,2000}$/i;

/**
 * - /^(?=.*[0-9])\d{1,6}(?:[,.]\d{0,2})?$/
 * - ^ asserts that the string starts with a digit.
 * - (?=.*[0-9]) is a positive lookahead assertion that requires the presence of at least one digit. This ensures that the string contains at least one digit.
 * - \d{1,6} matches between 1 and 6 digits. This represents the whole number part of a number, allowing for a range of digit lengths from 1 to 6.
 * - (?:[,.]\d{0,2})? is a non-capturing group that matches a decimal point or comma followed by between 0 and 2 digits. This represents the decimal part of a number, allowing for a range of digit lengths from 0 to 2. The entire group is optional, allowing for whole numbers.
 * - $ asserts that the string ends with a digit.
 */
const MONEY_REGEX = /^(?=.*[0-9])\d{1,6}(?:[,.]\d{0,2})?$/;

/**
 * - /^[A-Za-z\s.\-']{2,30}$/i
 * - [A-Za-z\s.\-'] matches any letter, whitespace, period, hyphen, or apostrophe.
 * - {2,30} ensures that the text is between 2 and 30 characters long.
 * - ^ and $ ensure that the entire string matches the regex.
 * - i makes the regex case-insensitive.
 */
const NAME_REGEX = /^[A-Za-z\s.\-']{2,30}$/i;

/**
 * - /^[A-Za-z\s.\-']{2,100}$/i
 * - [A-Za-z\s.\-'] matches any letter, whitespace, period, hyphen, or apostrophe.
 * - {2,100} ensures that the text is between 2 and 100 characters long.
 * - ^ and $ ensure that the entire string matches the regex.
 * - i makes the regex case-insensitive.
 */
const FULL_NAME_REGEX = /^[A-Za-z\s.\-']{2,100}$/i;

/**
 * @see https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
 * - https? matches "http" or "https". The "?" makes the "s" character optional, allowing for both "http" and "https" protocols.
 * - :\/\/ matches "://".
 * - (www\.)? matches "www." or nothing.
 * - [-a-zA-Z0-9@:%._+~#=]{1,256} matches any letter, number, or symbol in the brackets, between 1 and 256 times.
 * - \. matches ".".
 * - [a-zA-Z0-9()]{1,6} matches any letter, number, or symbol in the brackets, between 1 and 6 times.
 * - \b ensures that the URL ends at a word boundary.
 * - ([-a-zA-Z0-9()@:%_+.~#?&//=]*) matches any letter, number, or symbol in the brackets, between 0 and infinity times.
 */
const URL_REGEX =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

/**
 * - \+\(1\) matches "+(1)".
 * - \(\d{3}\) matches exactly 3 digits surrounded by parentheses.
 * - [ ] matches a space.
 * - \d{3}-\d{4} matches exactly 3 digits, followed by a hyphen, followed by exactly 4 digits.
 * - ^ and $ ensure that the entire string matches the regex.
 */
const PHONE_NUMBER_REGEX = /^\+\(1\)\(\d{3}\)[ ]\d{3}-\d{4}$/;

/**
 * - /^[A-Za-z0-9\s.,#-]{2,75}$/i
 * - [A-Za-z0-9\s.,#-] matches any letter, number, whitespace, period, comma, hash, or hyphen.
 * - {2,75} ensures that the text is between 2 and 75 characters long.
 * - ^ and $ ensure that the entire string matches the regex.
 * - i makes the regex case-insensitive.
 */
const ADDRESS_LINE_REGEX = /^[A-Za-z0-9\s.,#-]{2,75}$/i;

/**
 * - /^[A-Za-z\s.\-']{2,75}$/i
 * - [A-Za-z\s.\-'] matches any letter, whitespace, period, hyphen, or apostrophe.
 * - {2,75} ensures that the text is between 2 and 75 characters long.
 * - ^ and $ ensure that the entire string matches the regex.
 * - i makes the regex case-insensitive.
 */
const CITY_REGEX = /^[A-Za-z\s.\-']{2,75}$/i;

/**
 * - [A-Za-z]\d[A-Za-z][ ]?\d[A-Za-z]\d matches any letter, followed by a digit, followed by a letter, followed by a space, followed by a digit, followed by a letter, followed by a digit.
 * - ^ and $ ensure that the entire string matches the regex.
 * - i makes the regex case-insensitive.
 */
const POSTAL_CODE_REGEX_CANADA = /^[A-Za-z]\d[A-Za-z][ ]?\d[A-Za-z]\d$/i;

/**
 * - \d{5}(?:[-\s]\d{4})? matches any digit, followed by 5 digits, followed by a hyphen, followed by 4 digits.
 * - ^ and $ ensure that the entire string matches the regex.
 */
const POSTAL_CODE_REGEX_US = /^\d{5}(?:[-]\d{4})?$/;

/**
 * - /^(pending|approved|rejected)$/
 * - pending matches the string "pending".
 * - approved matches the string "approved".
 * - rejected matches the string "rejected".
 * - ^ and $ ensure that the entire string matches the regex.
 */
const REQUEST_STATUS_REGEX = /^(pending|approved|rejected)$/;

/**
 * - 19[0-9][0-9] matches the years from 1900 to 1999.
 * - 20[0-1][0-9] matches the years from 2000 to 2019.
 * - 202[0-4] matches the years from 2020 to 2024.
 * - - matches a hyphen.
 * - (0[1-9]|1[0-2]) month: matches either 0 followed by a digit between 1 and 9, or 1 followed by a digit between 0 and 2.
 * - - matches a hyphen.
 * - (0[1-9]|[12][0-9]|3[01]) day: matches either 0 followed by a digit between 1 and 9, or 1 or 2 followed by a digit between 0 and 9, or 3 followed by a digit between 0 and 1.
 * - ^ and $ ensure that the entire string matches the regex.
 */
const DATE_REGEX =
  /^(?:19[0-9][0-9]|20[0-1][0-9]|202[0-4])-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])/;

/**
 * - 19[0-9][0-9] matches the years from 1900 to 1999.
 * - 20[0-9][0-9] matches the years from 2000 to 2099.
 * - 202[0-6] matches the years from 2020 to 2026.
 * - - matches a hyphen.
 * - (0[1-9]|1[0-2]) month: matches either 0 followed by a digit between 1 and 9, or 1 followed by a digit between 0 and 2.
 * - - matches a hyphen.
 * - (0[1-9]|[12][0-9]|3[01]) day: matches either 0 followed by a digit between 1 and 9, or 1 or 2 followed by a digit between 0 and 9, or 3 followed by a digit between 0 and 1.
 * - ^ and $ ensure that the entire string matches the regex.
 */
const DATE_FULL_RANGE_REGEX =
  /^(?:19[0-9][0-9]|20[0-9][0-9]|202[0-6])-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])/;

/**
 * - /^(?:202[3-6])-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])/
 * - 202[3-6] matches the years from 2023 to 2026.
 * - - matches a hyphen.
 * - (0[1-9]|1[0-2]) month: matches either 0 followed by a digit between 1 and 9, or 1 followed by a digit between 0 and 2.
 * - - matches a hyphen.
 * - (0[1-9]|[12][0-9]|3[01]) day: matches either 0 followed by a digit between 1 and 9, or 1 or 2 followed by a digit between 0 and 9, or 3 followed by a digit between 0 and 1.
 * - ^ and $ ensure that the entire string matches the regex.
 */
const DATE_NEAR_FUTURE_REGEX = /^(?:202[3-6])-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])/;

/**
 * - /^(?:202[0-3])-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])/
 * - 202[0-3] matches the years from 2020 to 2023.
 * - - matches a hyphen.
 * - (0[1-9]|1[0-2]) month: matches either 0 followed by a digit between 1 and 9, or 1 followed by a digit between 0 and 2.
 * - - matches a hyphen.
 * - (0[1-9]|[12][0-9]|3[01]) day: matches either 0 followed by a digit between 1 and 9, or 1 or 2 followed by a digit between 0 and 9, or 3 followed by a digit between 0 and 1.
 * - ^ and $ ensure that the entire string matches the regex.
 */
const DATE_NEAR_PAST_REGEX = /^(?:202[0-3])-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])/;

/**
 * - 19[0-9][0-9] matches the years from 1900 to 1999.
 * - 20[0-1][0-9] matches the years from 2000 to 2019.
 * - 202[0-3] matches the years from 2020 to 2023.
 * - - matches a hyphen.
 * - (0[1-9]|1[0-2]) month: matches either 0 followed by a digit between 1 and 9, or 1 followed by a digit between 0 and 2.
 * - - matches a hyphen.
 * - (0[1-9]|[12][0-9]|3[01]) day: matches either 0 followed by a digit between 1 and 9, or 1 or 2 followed by a digit between 0 and 9, or 3 followed by a digit between 0 and 1.
 * - ^ and $ ensure that the entire string matches the regex.
 */
const DATE_OF_BIRTH_REGEX =
  /^(?:19[0-9][0-9]|20[0-1][0-9]|202[0-3])-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])/;

/**
 * - /^(?=.*[A-Za-z0-9])[\w\s.,!?():;"'-]{2,2000}$/i
 * - (?=.*[A-Za-z0-9]) is a positive lookahead assertion that requires the presence of at least one alphanumeric character. This ensures that the string contains at least one letter or digit.
 * - [\w\s.,!?():;"'-] matches one or more word characters (letters, digits, or underscores), whitespace characters, period, comma, exclamation mark, question mark, parentheses, colon, semicolon, double quotation marks, single quotation marks, or hyphen.
 * - {2,2000} ensures that the text is between 2 and 2000 characters long.
 * - ^ and $ ensure that the entire string matches the regex.
 * - i makes the regex case-insensitive.
 */
const GRAMMAR_TEXTAREA_INPUT_REGEX = /^(?=.*[A-Za-z0-9])[\w\s.,!?():;"'-]{2,2000}$/i;

/**
 * - /^(?=.*[A-Za-z0-9])[\w\s.,!?():;"'-]{2,100}$/i
 * - (?=.*[A-Za-z0-9]) is a positive lookahead assertion that requires the presence of at least one alphanumeric character. This ensures that the string contains at least one letter or digit.
 * - [\w\s.,!?():;"'-] matches one or more word characters (letters, digits, or underscores), whitespace characters, period, comma, exclamation mark, question mark, parentheses, colon, semicolon, double quotation marks, single quotation marks, or hyphen.
 * - {2,100} ensures that the text is between 2 and 100 characters long.
 * - ^ and $ ensure that the entire string matches the regex.
 * - i makes the regex case-insensitive.
 */
const GRAMMAR_TEXT_INPUT_REGEX = /^(?=.*[A-Za-z0-9])[\w\s.,!?():;"'-]{2,100}$/i;

/**
 * matches the exact Marauder's Map phrase
 */
const ACKNOWLEDGEMENT_TEXT_INPUT_REGEX = /^I solemnly swear that I am up to no good\.$/i;

// /**
//  * - ^[A-Za-z0-9\s.,'()-]{1,50}$/i
//  * - [A-Za-z0-9\s.,'()-] matches any letter, digit, whitespace, period, comma, single quotation mark, hyphen, or parentheses.
//  * - {1,50} ensures that the text is between 1 and 50 characters long.
//  * - ^ and $ ensure that the entire string matches the regex.
//  * - i makes the regex case-insensitive.
//  */
const PRINTER_MAKE_MODEL_REGEX = /^[a-zA-Z0-9\s.,'()-]{1,50}$/i;

/**
 * - ^[A-Za-z0-9\s.,'()-]{1,50}$/i
 * - [A-Za-z0-9\s.,'()-] matches any letter, digit, whitespace, period, comma, single quotation mark, hyphen, or parentheses.
 * - {1,50} ensures that the text is between 1 and 50 characters long.
 * - ^ and $ ensure that the entire string matches the regex.
 * - i makes the regex case-insensitive.
 */
const PRINTER_SERIAL_NUMBER_REGEX = /^[a-zA-Z0-9]{1,50}$/i;

/**
 * - /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
 * ([0-1]?[0-9]|2[0-3]) matches either 0 followed by a digit between 0 and 9, or 1 followed by a digit between 0 and 9, or 2 followed by a digit between 0 and 3.
 * : matches a colon.
 * [0-5][0-9] matches a digit between 0 and 5 followed by a digit between 0 and 9.
 * ^ and $ ensure that the entire string matches the regex.
 */
const TIME_RAILWAY_REGEX = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

/**
 * - /^\d{1,6}$/
 * - ^ asserts that the string starts with a digit.
 * - \d{1,6} matches between 1 and 6 digits. This represents the whole number part of a number, allowing for a range of digit lengths from 1 to 6.
 * - $ asserts that the string ends with a digit.
 */
const INTEGER_REGEX = /^\d{1,6}$/;

/**
 * - /^(?=.*[0-9])\d{1,6}(?:[,.]\d{0,2})?$/
 * - ^ asserts that the string starts with a digit.
 * - (?=.*[0-9]) is a positive lookahead assertion that requires the presence of at least one digit. This ensures that the string contains at least one digit.
 * - \d{1,6} matches between 1 and 6 digits. This represents the whole number part of a number, allowing for a range of digit lengths from 1 to 6.
 * - (?:[,.]\d{0,2})? is a non-capturing group that matches a decimal point or comma followed by between 0 and 2 digits. This represents the decimal part of a number, allowing for a range of digit lengths from 0 to 2. The entire group is optional, allowing for whole numbers.
 * - $ asserts that the string ends with a digit.
 */
const FLOAT_REGEX = /^\d{1,6}(?:[,.]\d{0,2})?$/;

/**
 * - /^[a-zA-Z0-9\s.,'()-]{1,50}$/i
 * - [a-zA-Z0-9\s.,'()-] matches any letter, digit, whitespace, period, comma, single quotation mark, hyphen, or parentheses.
 * - {1,50} ensures that the text is between 1 and 50 characters long.
 * - ^ and $ ensure that the entire string matches the regex.
 * - i makes the regex case-insensitive.
 */
const FILE_NAME_REGEX = /^[a-zA-Z0-9\s.,'()-]{1,50}$/i;

/**
 * - /^\d{4} \d{4} \d{4} \d{4}$/
 * - ^ asserts that the string starts with a digit.
 * - \d{4} matches exactly 4 digits.
 * - [ ] matches a space.
 * - $ asserts that the string ends with a digit.
 */
const CREDIT_CARD_NUMBER_REGEX = /^\d{4} \d{4} \d{4} \d{4}$/;

/**
 * - /^(0[1-9]|1[0-2])\/([0-9]{4}|[0-9]{2})$/
 * - ^ asserts that the string starts with a digit.
 * - (0[1-9]|1[0-2]) matches either 0 followed by a digit between 1 and 9, or 1 followed by a digit between 0 and 2.
 * - \/ matches "/".
 * - ([0-9]{4}|[0-9]{2}) matches either 4 digits or 2 digits.
 * - $ asserts that the string ends with a digit.
 * - This regex matches the following date formats: MM/YYYY, MM/YY.
 */
const CREDIT_CARD_EXPIRATION_DATE_REGEX = /^(0[1-9]|1[0-2])\/([0-9]{4}|[0-9]{2})$/;

/**
 * - /^\d{3,4}$/
 * - ^ asserts that the string starts with a digit.
 * - \d{3,4} matches between 3 and 4 digits.
 * - $ asserts that the string ends with a digit.
 */
const CREDIT_CARD_CVV_REGEX = /^\d{3,4}$/;

/**
 * - /\.(jpg|jpeg|png|webp)$
 * - \. matches a period.
 * - (jpg|jpeg|png|webp) matches either "jpg", "jpeg", "png", or "webp".
 * - $ asserts that the string ends with one of the file extensions.
 */
const FILE_EXTENSIONS_REGEX = /\.(jpg|jpeg|png|webp)$/;

/**
 * - /^\d{1,6}$/
 * - ^ asserts that the string starts with a digit.
 * - \d{1,6} matches between 1 and 6 digits. This represents the file size in bytes, allowing for a range of digit lengths from 1 to 6.
 * - $ asserts that the string ends with a digit.
 * - technically a SI prefix is used here, as binary size of 1MB = 1,048,576 bytes
 */
const FILE_SIZE_REGEX = /^\d{1,6}$/;

/**
 * - /^image\/(jpeg|png|webp)$/
 * - ^ asserts that the string starts with "image/".
 * - (jpeg|png|webp) matches either "jpeg", "png", or "webp".
 * - $ asserts that the string ends with one of the file extensions.
 */
const FILE_MIME_TYPES_REGEX = /^image\/(jpeg|png|webp)$/;

/**
 * - /^(7bit|8bit|binary|quoted-printable|base64)$/
 * - (7bit|8bit|binary|quoted-printable|base64) matches either "7bit", "8bit", "binary", "quoted-printable", or "base64".
 * - ^ asserts that the string starts with one of the file encodings.
 * - $ asserts that the string ends with one of the file encodings.
 */
const FILE_ENCODING_REGEX = /^(7bit|8bit|binary|quoted-printable|base64)$/;

/**
 * - (?=.*[A-Za-z0-9]) is a positive lookahead assertion that requires the presence of at least one alphanumeric character. This ensures that the string contains at least one letter or digit.
 * - [\w\s.,!?():;"'-]{1,50} matches any word character, whitespace, or punctuation character between 1 and 50 times. This ensures that the string contains between 1 and 50 word characters, whitespace, or punctuation characters.
 * - The ^ and $ anchors ensure that the entire string is matched.
 * - The i flag makes the regex case insensitive.
 */
const PLAN_NAME_REGEX = /^(?=.*[A-Za-z0-9])[\w\s.,!?():;"'-]{1,50}$/i;

/**
 * - (?=.*[A-Za-z0-9]) ensures that there is at least one alphanumeric character, preventing the input from consisting entirely of whitespace.
 * - [\w\s.,!?():;"'-] matches any word characters (\w includes alphanumeric characters and underscores), whitespace, and a range of allowed punctuation marks commonly used in grammar and punctuation: ., ,, !, ?, (, ), :, ;, ", ', -. The hyphen is placed at the end of the list to prevent it from being interpreted as a range of characters.
 * - {1,300} ensures that the text is between 1 and 300 characters long.
 * - ^ and $ ensure that the entire string matches the regex.
 * - i makes the regex case-insensitive.
 */
const PLAN_DESCRIPTION_REGEX = /^(?=.*[A-Za-z0-9])[\w\s.,!?():;"'-]{1,300}$/i;

/**
 * - /^(Health|Dental|Vision|Life|Disability|Retirement|Education|Other)$/
 * - matches the following benefits plan kinds: Health, Dental, Vision, Life, Disability, Retirement, Education, Other
 * - ^ and $ ensure that the entire string matches the regex.
 */
const BENEFITS_PLAN_KIND_REGEX =
  /^(Health|Dental|Vision|Life|Disability|Retirement|Education|Other)$/;

/**
 * - /^(USD|EUR|GBP|CAD|AUD|JPY|CNY)$/
 * - matches the following currency codes: USD, EUR, GBP, CAD, AUD, JPY, CNY
 * - ^ and $ ensure that the entire string matches the regex.
 */
const CURRENCY_REGEX = /^(USD|EUR|GBP|CAD|AUD|JPY|CNY)$/;

/**
 * - /^(Travel and Accommodation|Equipment and Supplies|Communication and Utilities|Training and Certifications|Software and Licenses|Marketing and Advertising|Insurance|Rent and Leasing|Legal and Professional Fees|Miscellaneous)$/
 * - matches the following expense claim kinds: Travel and Accommodation, Equipment and Supplies, Communication and Utilities, Training and Certifications, Software and Licenses, Marketing and Advertising, Insurance, Rent and Leasing, Legal and Professional Fees, Miscellaneous
 * - ^ and $ ensure that the entire string matches the regex.
 */
const EXPENSE_CLAIM_KIND_REGEX =
  /^(Travel and Accommodation|Equipment and Supplies|Communication and Utilities|Training and Certifications|Software and Licenses|Marketing and Advertising|Insurance|Rent and Leasing|Legal and Professional Fees|Miscellaneous)$/;

/**
 * - /^(Vacation|Medical|Parental|Bereavement|Jury Duty|Military|Education|Religious|Other)$/
 * - matches the following reasons for leave: Vacation, Medical, Parental, Bereavement, Jury Duty, Military, Education, Religious, Other
 * - ^ and $ ensure that the entire string matches the regex.
 */
const REASON_FOR_LEAVE_REGEX =
  /^(Vacation|Medical|Parental|Bereavement|Jury Duty|Military|Education|Religious|Other)$/;

/**
 * - /^(Executive Management|Store Administration|Office Administration|Accounting|Human Resources|Sales|Marketing|Information Technology|Repair Technicians|Field Service Technicians|Logistics and Inventory|Customer Service|Maintenance)$/
 * - matches the following department names: Executive Management, Store Administration, Office Administration, Accounting, Human Resources, Sales, Marketing, Information Technology, Repair Technicians, Field Service Technicians, Logistics and Inventory, Customer Service, Maintenance
 * - ^ and $ ensure that the entire string matches the regex.
 */
const DEPARTMENT_REGEX =
  /^(Executive Management|Store Administration|Office Administration|Accounting|Human Resources|Sales|Marketing|Information Technology|Repair Technicians|Field Service Technicians|Logistics and Inventory|Customer Service|Maintenance)$/;

/**
 * - /^(Hardware|Software|Access|Other)$/
 * - matches the following request resource kinds: Hardware, Software, Access, Other
 * - ^ and $ ensure that the entire string matches the regex.
 */
const REQUEST_RESOURCE_KIND_REGEX = /^(Hardware|Software|Access|Other)$/;

/**
 * - /^(Low|Medium|High)$/
 * - matches the following urgency levels: Low, Medium, High
 * - ^ and $ ensure that the entire string matches the regex.
 */
const URGENCY_REGEX = /^(low|medium|high)$/;

/**
 * - /^(Benefits and compensation|Bullying and intimidation|Company security|Customer service|Discrimination|Diversity and inclusion|Employee conflict|Ethical concerns|LGBTQIA+|Managerial issues|Environmental concerns|Workload and stress|Workplace safety|Workplace harassment)$/
 * - matches the following anonymous request kinds: Benefits and compensation, Bullying and intimidation, Company security, Customer service, Discrimination, Diversity and inclusion, Employee conflict, Ethical concerns, LGBTQIA+, Managerial issues, Environmental concerns, Workload and stress, Workplace safety, Workplace harassment
 * - ^ and $ ensure that the entire string matches the regex.
 */
const ANONYMOUS_REQUEST_KIND_REGEX =
  /^(Benefits and compensation|Bullying and intimidation|Company security|Customer service|Discrimination|Diversity and inclusion|Employee conflict|Ethical concerns|LGBTQIA+|Managerial issues|Environmental concerns|Workload and stress|Workplace safety|Workplace harassment)$/;

/**
 * - /^(teamwork and collaboration|leadership and mentorship|technical expertise|adaptibility and flexibility|problem solving|customer service|initiative and proactivity|communication|reliability and dependability)$/
 * - matches the following employee attributes: teamwork and collaboration, leadership and mentorship, technical expertise, adaptibility and flexibility, problem solving, customer service, initiative and proactivity, communication, reliability and dependability
 * - ^ and $ ensure that the entire string matches the regex.
 */
const EMPLOYEE_ATTRIBUTES_REGEX =
  /^(teamwork and collaboration|leadership and mentorship|technical expertise|adaptibility and flexibility|problem solving|customer service|initiative and proactivity|communication|reliability and dependability)$/;

/**
 * - /^(HP|Canon|Epson|Brother|Xerox|Ricoh|Lexmark|Dell|Kyocera|Sharp|Konica Minolta|Toshiba TEC|OKI|Panasonic|Fujitsu|Zebra Technologies)$/
 * - matches the following printer makes: HP, Canon, Epson, Brother, Xerox, Ricoh, Lexmark, Dell, Kyocera, Sharp, Konica Minolta, Toshiba TEC, OKI, Panasonic, Fujitsu, Zebra Technologies
 * - ^ and $ ensure that the entire string matches the regex.
 */
const PRINTER_MAKE_REGEX =
  /^(HP|Canon|Epson|Brother|Xerox|Ricoh|Lexmark|Dell|Kyocera|Sharp|Konica Minolta|Toshiba TEC|OKI|Panasonic|Fujitsu|Zebra Technologies)$/;

/**
 * - /^(ExecutiveManagement|StoreAdministration|OfficeAdministration|Sales|Marketing|InformationTechnology|RepairTechnicians|FieldServiceTechnicians|LogisticsAndInventory|CustomerService|HumanResources|Accounting|Maintenance)$/
 * - matches the following job positions: ExecutiveManagement, StoreAdministration, OfficeAdministration, Sales, Marketing, InformationTechnology, RepairTechnicians, FieldServiceTechnicians, LogisticsAndInventory, CustomerService, HumanResources, Accounting, Maintenance
 * - ^ and $ ensure that the entire string matches the regex.
 */
const JOB_POSITION_REGEX =
  /^(ExecutiveManagement|StoreAdministration|OfficeAdministration|Sales|Marketing|InformationTechnology|RepairTechnicians|FieldServiceTechnicians|LogisticsAndInventory|CustomerService|HumanResources|Accounting|Maintenance)$/;

export {
  PRINTER_MAKE_REGEX,
  JOB_POSITION_REGEX,
  EMPLOYEE_ATTRIBUTES_REGEX,
  ANONYMOUS_REQUEST_KIND_REGEX,
  DEPARTMENT_REGEX,
  REQUEST_RESOURCE_KIND_REGEX,
  URGENCY_REGEX,
  ACKNOWLEDGEMENT_TEXT_INPUT_REGEX,
  ADDRESS_LINE_REGEX,
  BENEFITS_PLAN_KIND_REGEX,
  CITY_REGEX,
  CREDIT_CARD_CVV_REGEX,
  CREDIT_CARD_EXPIRATION_DATE_REGEX,
  CREDIT_CARD_NUMBER_REGEX,
  CURRENCY_REGEX,
  DATE_FULL_RANGE_REGEX,
  DATE_NEAR_FUTURE_REGEX,
  DATE_NEAR_PAST_REGEX,
  DATE_OF_BIRTH_REGEX,
  DATE_REGEX,
  EMAIL_REGEX,
  EXPENSE_CLAIM_KIND_REGEX,
  FILE_ENCODING_REGEX,
  FILE_EXTENSIONS_REGEX,
  FILE_MIME_TYPES_REGEX,
  FILE_NAME_REGEX,
  FILE_SIZE_REGEX,
  FLOAT_REGEX,
  FULL_NAME_REGEX,
  GRAMMAR_TEXTAREA_INPUT_REGEX,
  GRAMMAR_TEXT_INPUT_REGEX,
  INTEGER_REGEX,
  MONEY_REGEX,
  NAME_REGEX,
  NOTE_TEXT_AREA_REGEX,
  NOTE_TEXT_REGEX,
  PASSWORD_REGEX,
  PHONE_NUMBER_REGEX,
  PLAN_DESCRIPTION_REGEX,
  PLAN_NAME_REGEX,
  POSTAL_CODE_REGEX_CANADA,
  POSTAL_CODE_REGEX_US,
  PRINTER_MAKE_MODEL_REGEX,
  PRINTER_SERIAL_NUMBER_REGEX,
  REASON_FOR_LEAVE_REGEX,
  REQUEST_STATUS_REGEX,
  SERIAL_ID_REGEX,
  TIME_RAILWAY_REGEX,
  URL_REGEX,
  USERNAME_REGEX,
};
