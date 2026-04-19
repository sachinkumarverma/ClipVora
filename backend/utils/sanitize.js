const sanitizeTitle = (title) =>
  title.replace(/[<>:"/\\|?*\n\r\t]+/g, '').replace(/[^\x20-\x7E]/g, '').replace(/\s+/g, ' ').trim().substring(0, 100);

module.exports = { sanitizeTitle };
