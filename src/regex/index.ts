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

/**
 * - (?=.*[A-Za-z0-9]) ensures that there is at least one alphanumeric character, preventing the input from consisting entirely of whitespace.
 * - [\w\s.,!?():;"'-] matches any word characters (\w includes alphanumeric characters and underscores), whitespace, and a range of allowed punctuation marks commonly used in grammar and punctuation: ., ,, !, ?, (, ), :, ;, ", ', -. The hyphen is placed at the end of the list to prevent it from being interpreted as a range of characters.
 * - {1,2000} ensures that the text is between 1 and 2000 characters long.
 * - ^ and $ ensure that the entire string matches the regex.
 * - i makes the regex case-insensitive.
 */
const ARTICLE_CONTENT_REGEX = /^(?=.*[A-Za-z0-9])[\w\s.,!?():;"'-]{1,2000}$/i;

/**
 * - (?=.*[A-Za-z0-9]) ensures that there is at least one alphanumeric character, preventing the input from consisting entirely of whitespace.
 * - [\w\s.,!?():;"'-] matches any word characters (\w includes alphanumeric characters and underscores), whitespace, and a range of allowed punctuation marks commonly used in grammar and punctuation: ., ,, !, ?, (, ), :, ;, ", ', -. The hyphen is placed at the end of the list to prevent it from being interpreted as a range of characters.
 * - {3,150} ensures that the text is between 3 and 150 characters long.
 * - ^ and $ ensure that the entire string matches the regex.
 * - i makes the regex case-insensitive.
 */
const ARTICLE_TITLE_REGEX = /^(?=.*[A-Za-z0-9])[\w\s.,!?():;"'-]{3,150}$/i;

/**
 * - /^(Admin|Employee|Manager)$/
 * - matches the following user roles: Admin, Employee, Manager
 * - ^ and $ ensure that the entire string matches the regex.
 */
const USER_ROLES_REGEX = /^(Admin|Employee|Manager)$/;

/**
 * - /^(Webinar|Workshop|Seminar|Conference|Networking|Tech Talk|Charity|Team Building|Awards|Other)$/
 * - matches the following event kinds: Webinar, Workshop, Seminar, Conference, Networking, Tech Talk, Charity, Team Building, Awards, Other
 * - ^ and $ ensure that the entire string matches the regex.
 */
const EVENT_KIND_REGEX =
  /^(Webinar|Workshop|Seminar|Conference|Networking|Tech Talk|Charity|Team Building|Awards|Other)$/;

/**
 * - /^(Executive Management|Store Administration|Office Administration|Accounting|Human Resources|Sales|Marketing|Information Technology|Repair Technicians|Field Service Technicians|Logistics and Inventory|Customer Service|Maintenance|All)$/
 * - matches the following survey recipient options: Executive Management, Store Administration, Office Administration, Accounting, Human Resources, Sales, Marketing, Information Technology, Repair Technicians, Field Service Technicians, Logistics and Inventory, Customer Service, Maintenance, All
 * - ^ and $ ensure that the entire string matches the regex.
 */
const SURVEY_RECIPIENT_REGEX =
  /^(Executive Management|Store Administration|Office Administration|Accounting|Human Resources|Sales|Marketing|Information Technology|Repair Technicians|Field Service Technicians|Logistics and Inventory|Customer Service|Maintenance|All)$/;

/**
 * - /^(chooseOne|chooseAny|rating)$/
 * - matches the following survey response kinds: chooseOne, chooseAny, rating
 * - ^ and $ ensure that the entire string matches the regex.
 */
const SURVEY_RESPONSE_KIND_REGEX = /^(chooseOne|chooseAny|rating)$/;

/**
 * - /^(agreeDisagree|radio|checkbox|emotion|stars)$/
 * - matches the following survey response input types: agreeDisagree, radio, checkbox, emotion, stars
 * - ^ and $ ensure that the entire string matches the regex.
 */
const SURVEY_RESPONSE_INPUT_REGEX = /^(agreeDisagree|radio|checkbox|emotion|stars)$/;

/**
 * - /^(He\/Him|She\/Her|They\/Them|Other|Prefer not to say)$/
 * - matches the following preferred pronouns: He/Him, She/Her, They/Them, Other, Prefer not to say
 * - ^ and $ ensure that the entire string matches the regex.
 */
const PREFERRED_PRONOUNS_REGEX =
  /^(He\/Him|She\/Her|They\/Them|Other|Prefer not to say)$/;

/**
 * - /^(?![0-9])[^"'\s\\]{1,75}$/;
 * - (?![0-9]) ensures that the first character is not a digit.
 * - [^"'\s\\] ensures that the input does not contain any of the following characters: ", ', whitespace, \.
 * - {1,75} matches the preceding token between 1 and 75 times.
 * - ^ and $ ensure that the entire string matches the regex.
 * ex: 'username' or 'username123' or 'username-123' or 'u123-sername'
 */
const OBJECT_KEY_REGEX = /^(?![0-9])[^"'\s\\]{1,75}$/;

/**
 * - /^(?!^\s*$)[a-zA-Z0-9!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]{2,2000}$/i
 * - (?=.*[A-Za-z0-9]) ensures that there is at least one alphanumeric character, preventing the input from consisting entirely of whitespace.
 * - [A-Za-z0-9!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~] matches any alphanumeric character or special character in the range of special characters commonly used in components, part numbers, and ID numbers.
 * - {2,2000} ensures that the text is between 2 and 2000 characters long.
 * - ^ and $ ensure that the entire string matches the regex.
 */
const USER_DEFINED_VALUE_REGEX =
  /^(?!^\s*$)[a-zA-Z0-9!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~\w\s]{2,2000}$/i;

/**
 * - /^(?!^$|^0*$)[0-9]{1,6}(\.[0-9]{1,2})?$/
 * - (?!^$|^0*$): Negative lookahead assertion to ensure that the entire string is not empty (^$) or consists entirely of zeroes (^0*$).
 * - [0-9]{1,6}: Matches one to six digits for the integral part of the weight.
 * - (\.[0-9]{1,2})?: This part is in a capturing group and is optional (?). It allows for an optional decimal point followed by one or two digits, representing the decimal part of the weight.
 * - ^ and $ ensure that the entire string matches the regex.
 * - ex: 123456.78 or 123456
 */
const WEIGHT_REGEX = /^(?!^$|^0*$)[0-9]{1,6}(\.[0-9]{1,2})?$/;

/**
 * - /^(?!^$|^0*$)[0-9]{1,3}(\.[0-9]{1,2})?$/
 * - (?!^$|^0*$): Negative lookahead assertion to ensure that the entire string is not empty (^$) or consists entirely of zeroes (^0*$).
 * - (?!^0*\.?0*$): Negative lookahead assertion to ensure that the entire string is not empty (^0*$) or consists entirely of zeroes (^0*), optionally followed by a decimal point (\.?0*$).
 * - [0-9]{1,3}: Matches one to three digits for the integral part of the length, width, or height.
 * - (\.[0-9]{1,2})?: This part is in a capturing group and is optional (?). It allows for an optional decimal point followed by one or two digits, representing the decimal part of the length, width, or height.
 * - ^ and $ ensure that the entire string matches the regex.
 * - ex: 123.45 or 123
 */
const DIMENSIONS_REGEX = /^(?!^$|^0*$)(?!^0*\.?0*$)[0-9]{1,3}(\.[0-9]{1,2})?$/;

/**
 * - /^(?!^$|^0*$)[0-9]{1,2}(\.[0-9]{1,2})?$/
 * - (?!^$|^0*$): Negative lookahead assertion to ensure that the entire string is not empty (^$) or consists entirely of zeroes (^0*$).
 * - (?!^0*\.?0*$): Negative lookahead assertion to ensure that the entire string is not empty (^0*$) or consists entirely of zeroes (^0*), optionally followed by a decimal point (\.?0*$).
 * - [0-9]{1,2}: Matches one to two digits for the integral part of the frequency.
 * - (\.[0-9]{1,2})?: This part is in a capturing group and is optional (?). It allows for an optional decimal point followed by one or two digits, representing the decimal part of the frequency.
 * - ^ and $ ensure that the entire string matches the regex.
 * - ex: 12.34 or 12
 */
const CPU_FREQUENCY_REGEX = /^(?!^$|^0*$)(?!^0*\.?0*$)[0-9]{1}(\.[0-9]{1,2})?$/;

/**
 * - /^(?!^$|^0*$)[0-9]{1,2}$/
 * - (?!^$|^0*$): Negative lookahead assertion to ensure that the entire string is not empty (^$) or consists entirely of zeroes (^0*$).
 * - [0-9]{1,2}: Matches one to two digits for the integral part
 * - ^ and $ ensure that the entire string matches the regex.
 * - ex: 12
 */
const SMALL_INTEGER_REGEX = /^(?!^$|^0*$)[0-9]{1,2}$/;

/**
 * - /^(?!^$|^0*$)[0-9]{1,4}$/
 * - (?!^$|^0*$): Negative lookahead assertion to ensure that the entire string is not empty (^$) or consists entirely of zeroes (^0*$).
 * - [0-9]{1,4}: Matches one to four digits for the integral part
 * - ^ and $ ensure that the entire string matches the regex.
 * - ex: 1234
 */
const MEDIUM_INTEGER_REGEX = /^(?!^$|^0*$)[0-9]{1,4}$/;

/**
 * - /^(?!^$|^0*$)[0-9]{1,6}$/
 * - (?!^$|^0*$): Negative lookahead assertion to ensure that the entire string is not empty (^$) or consists entirely of zeroes (^0*$).
 * - [0-9]{1,6}: Matches one to six digits for the integral part of the quantity.
 * - ^ and $ ensure that the entire string matches the regex.
 * - ex: 123456
 */
const LARGE_INTEGER_REGEX = /^(?!^$|^0*$)[0-9]{1,6}$/;

/**
 * - /^(?!^$|^0*$)[0-1]{1}(\.[0-9]{1,2})?$/
 * - (?!^$|^0*$): Negative lookahead assertion to ensure that the entire string is not empty (^$) or consists entirely of zeroes (^0*$).
 * - (?!^0*\.?0*$): Negative lookahead assertion to ensure that the entire string is not empty (^0*$) or consists entirely of zeroes (^0*), optionally followed by a decimal point (\.?0*$).
 * - [0-1]{1}: Matches one digit between 0 and 1 for the integral part of the voltage.
 * - (\.[0-9]{1,2})?: This part is in a capturing group and is optional (?). It allows for an optional decimal point followed by one or two digits, representing the decimal part of the voltage.
 * - ^ and $ ensure that the entire string matches the regex.
 * - ex: 0.12 or 0.1 or 0. or 0 or 1.12 or 1.1 or 1
 */
const RAM_VOLTAGE_REGEX = /^(?!^$|^0*$)(?!^0*\.?0*$)[0-1]{1}(\.[0-9]{1,2})?$/;

/**
 * - /^[a-zA-Z0-9- ]{2,30}$/;
 * - [a-zA-Z0-9\s-] matches any character between a-z, A-Z, 0-9, whitespace and -.
 * - {2,30} matches between 2 and 30 of the preceding token.
 * - ^ and $ ensure that the entire string matches the regex.
 */
const BRAND_REGEX = /^[a-zA-Z0-9\s-]{2,30}$/;

/**
 * - /^[a-zA-Z0-9\s.,'()-]{2,30}$/i;
 * - [a-zA-Z0-9\s.,'()-] matches any character between a-z, A-Z, 0-9, whitespace, ., ,, ', (, ), -.
 * - {2,30} matches between 2 and 30 of the preceding token.
 * - ^ and $ ensure that the entire string matches the regex.
 */
const CPU_SOCKET_REGEX = /^[a-zA-Z0-9\s.,'()-]{2,30}$/;
const GPU_CHIPSET_REGEX = CPU_SOCKET_REGEX;
const MOTHERBOARD_SOCKET_REGEX = CPU_SOCKET_REGEX;
const MOTHERBOARD_CHIPSET_REGEX = CPU_SOCKET_REGEX;

/**
 * - /^[0-9]{1,2}-[0-9]{1,2}-[0-9]{1,2}-[0-9]{1,2}$/
 * - [0-9] matches any digit between 0 and 9.
 * - {1,2} matches the preceding token between 1 and 2 times.
 * - matches the character - literally.
 * - ^ and $ ensure that the entire string matches the regex.
 * - ex: 16-18-18-36 or 16-8-18-6
 */
const RAM_TIMING_REGEX = /^[0-9]{1,2}-[0-9]{1,2}-[0-9]{1,2}-[0-9]{1,2}$/;

/**
 * - /^[a-zA-Z0-9#()%,.\s-]{2,30}$/
 * - [a-zA-Z0-9#()%,.\s-] matches any character between a-z, A-Z, 0-9, #, (, ), %, ,, ., whitespace and -.
 * - {2,30} matches between 2 and 30 of the preceding token.
 * - ^ and $ ensure that the entire string matches the regex.
 * - ex: #e0e0e0 or hsl(0, 0%, 88%) or rgb(224, 224, 224) or rgba(224, 224, 224, 0.5) or hsla(0, 0%, 88%, 0.5)
 */
const COLOR_VARIANT_REGEX = /^[a-zA-Z0-9#()%,.\s-]{2,30}$/;

/**
 * - /^[0-9]{1,2}:[0-9]{1,2}$/
 * - [0-9] matches any digit between 0 and 9.
 * - {1,2} matches the preceding token between 1 and 2 times.
 * - matches the character : literally.
 * - ^ and $ ensure that the entire string matches the regex.
 * - ex: 16:9
 */
const DISPLAY_ASPECT_RATIO_REGEX = /^[0-9]{1,2}:[0-9]{1,2}$/;

/**
 * - /^[0-9]{1,2}[\s]{0,1}Hz[\s]{0,1}-[\s]{0,1}[0-9]{1,2}[\s]{0,1}kHz$/
 * - [0-9] matches any digit between 0 and 9.
 * - {1,2} matches the preceding token between 1 and 2 times.
 * - [\s]{0,1} matches the character whitespace literally between 0 and 1 times.
 * - matches the character Hz literally.
 * - matches the character - literally.
 * - matches the character kHz literally.
 * - ^ and $ ensure that the entire string matches the regex.
 * - ex: 20Hz-20kHz or 20 Hz - 20 kHz or 20 Hz-20 kHz or 20Hz - 20kHz
 */
const FREQUENCY_RESPONSE_REGEX =
  /^[0-9]{1,2}[\s]{0,1}Hz[\s]{0,1}-[\s]{0,1}[0-9]{1,2}[\s]{0,1}kHz$/;

const SMARTPHONE_CHIPSET_REGEX = CPU_SOCKET_REGEX;
const TABLET_CHIPSET_REGEX = CPU_SOCKET_REGEX;

/**
 * - /^([0-9]{1,3} MP)(?:, ([0-9]{1,3} MP)){1,12}$/
 * - [0-9] matches any digit between 0 and 9.
 * - {1,3} matches the preceding token between 1 and 3 times.
 * - matches the character MP literally.
 * - (?:, ([0-9]{1,3} MP)) matches the characters , and a space literally, followed by a group of 1 to 3 digits, followed by the character MP literally.
 * - {1,12} matches the preceding token between 1 and 12 times.
 * - ^ and $ ensure that the entire string matches the regex.
 * - ex: '12 MP, 12 MP, 12 MP' or '12 MP'
 */

const MOBILE_CAMERA_REGEX = /^([0-9]{1,3} MP)(?:, ([0-9]{1,3} MP)){0,12}$/;

const ACCESSORY_TYPE_REGEX = BRAND_REGEX;

/**
 * - /^(In Stock|Out of Stock|Pre-order|Discontinued|Other)$/
 * - matches the following product availability statuses: In Stock, Out of Stock, Pre-order, Discontinued, Other
 * - ^ and $ ensure that the entire string matches the regex.
 */
const PRODUCT_AVAILABILITY_REGEX =
  /^(In Stock|Out of Stock|Pre-order|Discontinued|Other)$/;

/**
 * - /^(mm|cm|m|in|ft)$/
 * - matches the following dimension units: mm, cm, m, in, ft
 * - ^ and $ ensure that the entire string matches the regex.
 */
const DIMENSION_UNIT_REGEX = /^(mm|cm|m|in|ft)$/;

/**
 * - /^(g|kg|lb)$/
 * - matches the following weight units: g, kg, lb
 * - ^ and $ ensure that the entire string matches the regex.
 */
const WEIGHT_UNIT_REGEX = /^(g|kg|lb)$/;

/**
 * - /^(Hz|kHz|MHz|GHz|THz)$/
 * - matches the following frequency units: Hz, kHz, MHz, GHz, THz
 * - ^ and $ ensure that the entire string matches the regex.
 */
const MEMORY_TYPE_REGEX = /^(DDR5|DDR4|DDR3|DDR2|DDR)$/;

/**
 * - /^(KB|MB|GB|TB)$/
 * - matches the following memory units: KB, MB, GB, TB
 * - ^ and $ ensure that the entire string matches the regex.
 */
const MEMORY_UNIT_REGEX = /^(KB|MB|GB|TB)$/;

/**
 * -  /^(Accessory|Central Processing Unit \(CPU\)|Computer Case|Desktop Computer|Display|Graphics Processing Unit \(GPU\)|Headphone|Keyboard|Laptop|Memory \(RAM\)|Microphone|Motherboard|Mouse|Power Supply Unit \(PSU\)|Smartphone|Speaker|Storage|Tablet|Webcam)$/
 * - matches the following product categories: Accessory, Central Processing Unit (CPU), Computer Case, Desktop Computer, Display, Graphics Processing Unit (GPU), Headphone, Keyboard, Laptop, Memory (RAM), Microphone, Motherboard, Mouse, Power Supply Unit (PSU), Smartphone, Speaker, Storage, Tablet, Webcam
 * - ^ and $ ensure that the entire string matches the regex.
 */
const PRODUCT_CATEGORY_REGEX =
  /^(Accessory|Central Processing Unit \(CPU\)|Computer Case|Desktop Computer|Display|Graphics Processing Unit \(GPU\)|Headphone|Keyboard|Laptop|Memory \(RAM\)|Microphone|Motherboard|Mouse|Power Supply Unit \(PSU\)|Smartphone|Speaker|Storage|Tablet|Webcam)$/;

/**
 * - /^(USB|Bluetooth|PS\/2|Wi-Fi|Other)$
 * - matches the following peripherals interfaces: USB, Bluetooth, PS/2, Wi-Fi, Other
 * - ^ and $ ensure that the entire string matches the regex.
 */
const PERIPHERALS_INTERFACE_REGEX = /^(USB|Bluetooth|PS\/2|Wi-Fi|Other)$/;

/**
 * - /^(Android|iOS|Windows|Linux|Other)$/
 * - matches the following operating systems: Android, iOS, Windows, Linux, Other
 * - ^ and $ ensure that the entire string matches the regex.
 */
const MOBILE_OS_REGEX = /^(Android|iOS|Windows|Linux|Other)$/;

/**
 * - /^(ATX|Micro ATX|Mini ITX|E-ATX|XL-ATX)$/
 * - matches the following motherboard form factors: ATX, Micro ATX, Mini ITX, E-ATX, XL-ATX
 * - ^ and $ ensure that the entire string matches the regex.
 */
const MOTHERBOARD_FORM_FACTOR_REGEX = /^(ATX|Micro ATX|Mini ITX|E-ATX|XL-ATX)$/;

/**
 * - /^(SSD|HDD|SSHD|Other)$/
 * - matches the following storage types: SSD, HDD, SSHD, Other
 * - ^ and $ ensure that the entire string matches the regex.
 */
const STORAGE_TYPE_REGEX = /^(SSD|HDD|SSHD|Other)$/;

/**
 * - /^(2.5"|3.5"|M.2 2280|M.2 22110|M.2 2242|M.2 2230|mSATA|U.2|Other)$/
 * - matches the following storage form factors: 2.5", 3.5", M.2 2280, M.2 22110, M.2 2242, M.2 2230, mSATA, U.2, Other
 * - ^ and $ ensure that the entire string matches the regex.
 */
const STORAGE_FORM_FACTOR_REGEX =
  /^(2.5"|3.5"|M.2 2280|M.2 22110|M.2 2242|M.2 2230|mSATA|U.2|Other)$/;

/**
 * - /^(SATA III|NVMe|PCIe|U.2|SATA-Express|M.2|mSATA|Other)$/
 * - matches the following storage interfaces: SATA III, NVMe, PCIe, U.2, SATA-Express, M.2, mSATA, Other
 * - ^ and $ ensure that the entire string matches the regex.
 */
const STORAGE_INTERFACE_REGEX = /^(SATA III|NVMe|PCIe|U.2|SATA-Express|M.2|mSATA|Other)$/;

/**
 * - /^(80\+|80\+ Bronze|80\+ Silver|80\+ Gold|80\+ Platinum|80\+ Titanium)$/
 * - matches the following PSU efficiency ratings: 80+, 80+ Bronze, 80+ Silver, 80+ Gold, 80+ Platinum, 80+ Titanium
 * - ^ and $ ensure that the entire string matches the regex.
 */
const PSU_EFFICIENCY_REGEX =
  /^(80\+|80\+ Bronze|80\+ Silver|80\+ Gold|80\+ Platinum|80\+ Titanium)$/;

/**
 * - /^(Full|Semi|None|Other)$/
 * - matches the following PSU modularity types: Full, Semi, None, Other
 * - ^ and $ ensure that the entire string matches the regex.
 */
const PSU_MODULARITY_REGEX = /^(Full|Semi|None|Other)$/;

/**
 * - /^(ATX|SFX|SFX-L|TFX|Flex ATX|Other)$/
 * - matches the following PSU form factors: ATX, SFX, SFX-L, TFX, Flex ATX, Other
 * - ^ and $ ensure that the entire string matches the regex.
 */
const PSU_FORM_FACTOR_REGEX = /^(ATX|SFX|SFX-L|TFX|Flex ATX|Other)$/;

/**
 * - /^(Mid Tower|Full Tower|Mini Tower|Cube|Slim|Desktop|Other)$/
 * - matches the following case types: Mid Tower, Full Tower, Mini Tower, Cube, Slim, Desktop, Other
 * - ^ and $ ensure that the entire string matches the regex.
 */
const CASE_TYPE_REGEX = /^(Mid Tower|Full Tower|Mini Tower|Cube|Slim|Desktop|Other)$/;

/**
 * - /^(Windowed|Solid)$/
 * - matches the following case side panel types: Windowed, Solid
 * - ^ and $ ensure that the entire string matches the regex.
 */
const CASE_SIDE_PANEL_REGEX = /^(Windowed|Solid)$/;

/**
 * - /^(IPS|TN|VA|OLED|QLED|Other)$/
 * - matches the following display panel types: IPS, TN, VA, OLED, QLED, Other
 * - ^ and $ ensure that the entire string matches the regex.
 */
const DISPLAY_PANEL_TYPE_REGEX = /^(IPS|TN|VA|OLED|QLED|Other)$/;

/**
 * - /^(Cherry MX Red|Cherry MX Blue|Cherry MX Brown|Cherry MX Silent Red|Cherry MX Black|Cherry MX Clear|Membrane|Other)$/
 * - matches the following keyboard switch types: Cherry MX Red, Cherry MX Blue, Cherry MX Brown, Cherry MX Silent Red, Cherry MX Black, Cherry MX Clear, Membrane, Other
 * - ^ and $ ensure that the entire string matches the regex.
 */
const KEYBOARD_SWITCH_REGEX =
  /^(Cherry MX Red|Cherry MX Blue|Cherry MX Brown|Cherry MX Silent Red|Cherry MX Black|Cherry MX Clear|Membrane|Other)$/;

/**
 * - /^(QWERTY|HHKB|Dvorak|Colemak|Workman|CARPALX|NORMAN|Other)$/
 * - matches the following keyboard layouts: QWERTY, HHKB, Dvorak, Colemak, Workman, CARPALX, NORMAN, Other
 * - ^ and $ ensure that the entire string matches the regex.
 */
const KEYBOARD_LAYOUT_REGEX =
  /^(QWERTY|HHKB|Dvorak|Colemak|Workman|CARPALX|NORMAN|Other)$/;

/**
 * - /^(RGB|Single Color|None)$/
 * - matches the following keyboard backlight types: RGB, Single Color, None
 * - ^ and $ ensure that the entire string matches the regex.
 */
const KEYBOARD_BACKLIGHT_REGEX = /^(RGB|Single Color|None)$/;

/**
 * - /^(Optical|Laser|Infrared|Other)$/
 * - matches the following mouse sensor types: Optical, Laser, Infrared, Other
 * - ^ and $ ensure that the entire string matches the regex.
 */
const MOUSE_SENSOR_REGEX = /^(Optical|Laser|Infrared|Other)$/;

/**
 * - /^(Over-ear|On-ear|In-ear|Other)$
 * - matches the following headphone types: Over-ear, On-ear, In-ear, Other
 * - ^ and $ ensure that the entire string matches the regex.
 */
const HEADPHONE_TYPE_REGEX = /^(Over-ear|On-ear|In-ear|Other)$/;

/**
 * - /^(USB|Bluetooth|3.5 mm|2.5 mm|MMCX|Other)$/
 * - matches the following headphone interfaces: USB, Bluetooth, 3.5 mm, 2.5 mm, MMCX, Other
 * - ^ and $ ensure that the entire string matches the regex.
 */
const HEADPHONE_INTERFACE_REGEX = /^(USB|Bluetooth|3.5 mm|2.5 mm|MMCX|Other)$/;

/**
 * - /^(2.0|2.1|3.1|4.1|5.1|7.1|Other)$/
 * - matches the following speaker types: 2.0, 2.1, 3.1, 4.1, 5.1, 7.1, Other
 * - ^ and $ ensure that the entire string matches the regex.
 */
const SPEAKER_TYPE_REGEX = /^(2.0|2.1|3.1|4.1|5.1|7.1|Other)$/;

/**
 * - /^(USB|Bluetooth|3.5 mm|2.5 mm|RCA|TRS|Wi-Fi|Other)$/
 * - matches the following speaker interfaces: USB, Bluetooth, 3.5 mm, 2.5 mm, RCA, TRS, Wi-Fi, Other
 * - ^ and $ ensure that the entire string matches the regex.
 */
const SPEAKER_INTERFACE_REGEX = /^(USB|Bluetooth|3.5 mm|2.5 mm|RCA|TRS|Wi-Fi|Other)$/;

/**
 * - /^(720p|1080p|1440p|4K|Other)$/
 * - matches the following webcam resolutions: 720p, 1080p, 1440p, 4K, Other
 * - ^ and $ ensure that the entire string matches the regex.
 */
const WEBCAM_RESOLUTION_REGEX = /^(720p|1080p|1440p|4K|Other)$/;

/**
 * - /^(30 fps|60 fps|120 fps|240 fps|Other)$/
 * - matches the following webcam frame rates: 30 fps, 60 fps, 120 fps, 240 fps, Other
 * - ^ and $ ensure that the entire string matches the regex.
 */
const WEBCAM_FRAME_RATE_REGEX = /^(30 fps|60 fps|120 fps|240 fps|Other)$/;

/**
 * - /^(USB|Bluetooth|Wi-Fi|Other)$/
 * - matches the following webcam interfaces: USB, Bluetooth, Wi-Fi, Other
 * - ^ and $ ensure that the entire string matches the regex.
 */
const WEBCAM_INTERFACE_REGEX = /^(USB|Bluetooth|Wi-Fi|Other)$/;

/**
 * - /^(Yes|No)$/
 * - matches the following webcam microphone options: Yes, No
 * - ^ and $ ensure that the entire string matches the regex.
 */
const WEBCAM_MICROPHONE_REGEX = /^(Yes|No)$/;

/**
 * - /^(Condenser|Dynamic|Ribbon|USB|Wireless|Other)$/
 * - matches the following microphone types: Condenser, Dynamic, Ribbon, USB, Wireless, Other
 * - ^ and $ ensure that the entire string matches the regex.
 */
const MICROPHONE_TYPE_REGEX = /^(Condenser|Dynamic|Ribbon|USB|Wireless|Other)$/;

/**
 * - /^(Cardioid|Supercardioid|Hypercardioid|Omnidirectional|Bidirectional|Other)$/
 * - matches the following microphone polar patterns: Cardioid, Supercardioid, Hypercardioid, Omnidirectional, Bidirectional, Other
 * - ^ and $ ensure that the entire string matches the regex.
 */
const MICROPHONE_POLAR_PATTERN_REGEX =
  /^(Cardioid|Supercardioid|Hypercardioid|Omnidirectional|Bidirectional|Other)$/;

/**
 * - /^(XLR|USB|3.5mm|Wireless|Other)$/
 * - matches the following microphone interfaces: XLR, USB, 3.5mm, Wireless, Other
 * - ^ and $ ensure that the entire string matches the regex.
 */
const MICROPHONE_INTERFACE_REGEX = /^(XLR|USB|3.5mm|Wireless|Other)$/;

/**
 * - /^(halfStar|oneStar|oneAndHalfStars|twoStars|twoAndHalfStars|threeStars|threeAndHalfStars|fourStars|fourAndHalfStars|fiveStars)$/
 * - matches the following rating kinds: halfStar, oneStar, oneAndHalfStars, twoStars, twoAndHalfStars, threeStars, threeAndHalfStars, fourStars, fourAndHalfStars, fiveStars
 * - ^ and $ ensure that the entire string matches the regex.
 */
const RATING_KIND_REGEX =
  /^(halfStar|oneStar|oneAndHalfStars|twoStars|twoAndHalfStars|threeStars|threeAndHalfStars|fourStars|fourAndHalfStars|fiveStars)$/;

/**
 * - /^(Pending|Shipped|Delivered|Returned|Cancelled|Received)$/
 * - matches the following order statuses: Pending, Shipped, Delivered, Returned, Cancelled, Received
 * - ^ and $ ensure that the entire string matches the regex.
 */
const ORDER_STATUS_REGEX = /^(Pending|Shipped|Delivered|Returned|Cancelled|Received)$/;

/**
 * - /^(Calgary|Edmonton|Vancouver)$/
 * - matches the following store locations: Calgary, Edmonton, Vancouver
 * - ^ and $ ensure that the entire string matches the regex.
 */
const STORE_LOCATION_REGEX = /^(Calgary|Edmonton|Vancouver)$/;

/**
 * - /^(Online|In-Store)$/
 * - matches the following purchase kinds: Online, In-Store
 * - ^ and $ ensure that the entire string matches the regex.
 */
const PURCHASE_KIND_REGEX = /^(Online|In-Store)$/;

/**
 * - /^(Accessory|Computer Component|Peripheral|Electronic Device|Mobile Device|Audio\/Video)$/
 * - matches the following repair categories: Accessory, Computer Component, Peripheral, Electronic Device, Mobile Device, Audio/Video
 * - ^ and $ ensure that the entire string matches the regex.
 */
const REPAIR_CATEGORY_REGEX =
  /^(Accessory|Computer Component|Peripheral|Electronic Device|Mobile Device|Audio\/Video)$/;

/**
 * - /^(Cleaning|Component replacement|Soldering|Testing|Calibration|Software update|Diagnostic evaluation|Internal inspection|External housing|Data recovery|Other)$/
 * - matches the following required repairs: Cleaning, Component replacement, Soldering, Testing, Calibration, Software update, Diagnostic evaluation, Internal inspection, External housing, Data recovery, Other
 * - ^ and $ ensure that the entire string matches the regex.
 */
const REQUIRED_REPAIRS_REGEX =
  /^(Cleaning|Component replacement|Soldering|Testing|Calibration|Software update|Diagnostic evaluation|Internal inspection|External housing|Data recovery|Other)$/;

/**
 * - /^(Other|CPU|GPU|Motherboard|RAM|Storage|PSU|Cooling|Connectors|Software)$/
 * - matches the following parts needed: Other, CPU, GPU, Motherboard, RAM, Storage, PSU, Cooling, Connectors, Software
 * - ^ and $ ensure that the entire string matches the regex.
 */
const PARTS_NEEDED_REGEX =
  /^(Other|CPU|GPU|Motherboard|RAM|Storage|PSU|Cooling|Connectors|Software)$/;

/**
 * - /^(In progress|Waiting for parts|Awaiting approval|Completed|Cancelled)$/
 * - matches the following repair statuses: In progress, Waiting for parts, Awaiting approval, Completed, Cancelled
 * - ^ and $ ensure that the entire string matches the regex.
 */
const REPAIR_STATUS_REGEX =
  /^(In progress|Waiting for parts|Awaiting approval|Completed|Cancelled)$/;

/**
 * - /^(Pending|Received|Cancelled)$/
 * - matches the following RMA statuses: Pending, Received, Cancelled
 * - ^ and $ ensure that the entire string matches the regex.
 */
const RMA_STATUS_REGEX = /^(Pending|Received|Cancelled)$/;

export {
  RMA_STATUS_REGEX,
  REPAIR_STATUS_REGEX,
  PARTS_NEEDED_REGEX,
  REQUIRED_REPAIRS_REGEX,
  REPAIR_CATEGORY_REGEX,
  PURCHASE_KIND_REGEX,
  STORE_LOCATION_REGEX,
  ORDER_STATUS_REGEX,
  RATING_KIND_REGEX,
  DIMENSIONS_REGEX,
  WEIGHT_REGEX,
  DIMENSION_UNIT_REGEX,
  WEIGHT_UNIT_REGEX,
  CPU_FREQUENCY_REGEX,
  OBJECT_KEY_REGEX,
  USER_DEFINED_VALUE_REGEX,
  MICROPHONE_INTERFACE_REGEX,
  MICROPHONE_POLAR_PATTERN_REGEX,
  MICROPHONE_TYPE_REGEX,
  WEBCAM_MICROPHONE_REGEX,
  WEBCAM_INTERFACE_REGEX,
  WEBCAM_FRAME_RATE_REGEX,
  WEBCAM_RESOLUTION_REGEX,
  SPEAKER_INTERFACE_REGEX,
  SPEAKER_TYPE_REGEX,
  HEADPHONE_INTERFACE_REGEX,
  HEADPHONE_TYPE_REGEX,
  MOUSE_SENSOR_REGEX,
  KEYBOARD_BACKLIGHT_REGEX,
  KEYBOARD_LAYOUT_REGEX,
  KEYBOARD_SWITCH_REGEX,
  DISPLAY_PANEL_TYPE_REGEX,
  CASE_SIDE_PANEL_REGEX,
  CASE_TYPE_REGEX,
  PSU_FORM_FACTOR_REGEX,
  PSU_MODULARITY_REGEX,
  PSU_EFFICIENCY_REGEX,
  STORAGE_INTERFACE_REGEX,
  STORAGE_FORM_FACTOR_REGEX,
  STORAGE_TYPE_REGEX,
  MOTHERBOARD_FORM_FACTOR_REGEX,
  MOBILE_OS_REGEX,
  PERIPHERALS_INTERFACE_REGEX,
  PRODUCT_CATEGORY_REGEX,
  MEMORY_UNIT_REGEX,
  MEMORY_TYPE_REGEX,
  PRODUCT_AVAILABILITY_REGEX,
  ACCESSORY_TYPE_REGEX,
  MOBILE_CAMERA_REGEX,
  TABLET_CHIPSET_REGEX,
  SMARTPHONE_CHIPSET_REGEX,
  FREQUENCY_RESPONSE_REGEX,
  DISPLAY_ASPECT_RATIO_REGEX,
  COLOR_VARIANT_REGEX,
  MOTHERBOARD_CHIPSET_REGEX,
  MOTHERBOARD_SOCKET_REGEX,
  GPU_CHIPSET_REGEX,
  CPU_SOCKET_REGEX,
  BRAND_REGEX,
  RAM_TIMING_REGEX,
  SMALL_INTEGER_REGEX,
  MEDIUM_INTEGER_REGEX,
  LARGE_INTEGER_REGEX,
  PREFERRED_PRONOUNS_REGEX,
  SURVEY_RESPONSE_INPUT_REGEX,
  SURVEY_RESPONSE_KIND_REGEX,
  SURVEY_RECIPIENT_REGEX,
  EVENT_KIND_REGEX,
  USER_ROLES_REGEX,
  ARTICLE_TITLE_REGEX,
  ARTICLE_CONTENT_REGEX,
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
