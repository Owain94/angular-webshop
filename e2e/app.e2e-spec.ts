import { AngularCliUniversalPage } from './app.po';

describe('angular-cli-universal App', () => {
  let page: AngularCliUniversalPage;

  beforeEach(() => {
    page = new AngularCliUniversalPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
