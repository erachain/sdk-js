
describe('URL validation', () => {
  const regexURL = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/i;

  const url1 = 'zv sdfg dfg df https://www.mail.ru/images/123424';
  const url2 = 'https://www.mail.ru/images/123424 sdfgdgdfhfgh';
  const url3 = 'dsf sgdffghdh fg https://www.mail.ru/images/123424 sdfgdgdfhfgh';
  const url4 = 'https://www.mail.ru/images/123424';

  it('URL1 validation', () => {
    expect(false).toEqual(regexURL.test(url1));
  });

  it('URL2 validation', () => {
    expect(false).toEqual(regexURL.test(url2));
  });

  it('URL3 validation', () => {
    expect(false).toEqual(regexURL.test(url3));
  });

  it('URL4 validation', () => {
    expect(true).toEqual(regexURL.test(url4));
  });
});
