const ALLOWED_FILE_EXTENSIONS = ['.jpg', '.jpeg', '.png'];

const FIND_QUERY_OPTIONS_KEYWORDS = new Set([
  'tailable',
  'limit',
  'skip',
  'allowDiskUse',
  'batchSize',
  'readPreference',
  'hint',
  'comment',
  'lean',
  'populate',
  'maxTimeMS',
  'sort',
  'strict',
  'collation',
  'session',
  'explain',
]);

export { ALLOWED_FILE_EXTENSIONS, FIND_QUERY_OPTIONS_KEYWORDS };
