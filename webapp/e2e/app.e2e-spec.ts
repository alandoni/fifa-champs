import { FifaChampsPage } from './app.po';

describe('fifa-champs App', function() {
    let page : FifaChampsPage;

    beforeEach(() => {
        page = new FifaChampsPage();
    });

    it('should display message saying app works', () => {
        page.navigateTo();
        expect(page.getParagraphText()).toEqual('app works!');
    });
});
