const { suite, test, before} = intern.getPlugin('interface.tdd');
const { assert } = intern.getPlugin('chai');
const { sleep } = require('@theintern/leadfoot/lib/util');

suite('PDP (Attraction)', ()=>{

  before(async function({remote}){
    await remote.setWindowSize(1200,900);
    await sleep(2000);
    await remote.get('https://pegasus.tiket.com/to-do/jatim-park-2');
    await sleep(3000);
  });

  test('Landing - header', async function({remote}){

    // must show header image
    const headerImgSrc = await remote
          .findByCssSelector('.header img')
          .getAttribute('src');
    assert.isOk(headerImgSrc);

    // must show "See More Photos" button
    const seeMorePhotosBtn = await remote.findByCssSelector('.header .see-more-btn');
    assert.isNotNull(seeMorePhotosBtn);

  });

  test('Landing - below header info', async function({remote}){

    const belowHeaderShortInfo = await remote.findByCssSelector('.below-header .short-info');

    // Title
    const titleEl = await belowHeaderShortInfo.findByTagName('h2');
    assert.equal(await titleEl.getVisibleText(), 'Jatim Park 2');

    // Location
    const location = await belowHeaderShortInfo.findByClassName('location');

    // assert that the icon is on the page
    assert.isOk(await location.findByClassName('icon-location-pin'));

    const addressEl = await belowHeaderShortInfo.findByCssSelector('.location span');
    assert.equal(await addressEl.getVisibleText(), 'Jl. Jatim Park II, TEMAS, JAKARTA SELATAN, JAKARTA, INDONESIA');

    // Date & time
    const dt = await belowHeaderShortInfo.findByCssSelector('.date-time .operational-hours');
    assert.isOk(await dt.findByClassName('icon-watch'));

    const dtEl = await dt.findByTagName('span');
    assert.equal(await dtEl.getVisibleText(), 'Jam Operasional');

    // features
    const features = await belowHeaderShortInfo.findByClassName('features');
    const durationEl = await features.findByCssSelector('div:first-child span');
    assert.equal(await durationEl.getVisibleText(), '4 jam');

    const langEl = await features.findByCssSelector('div:nth-child(2) > span');
    assert.equal(await langEl.getVisibleText(), 'Inggris, Indonesia');

    const confirmationEl = await features.findByCssSelector('div:nth-child(3) > span');
    assert.equal(await confirmationEl.getVisibleText(), 'Konfirmasi instan');
  });

  test('Landing - ticket info box', async function({remote}){

    const ticketInfo = await remote.findByCssSelector('.right-section .ticket-info');

    const priceLabel = await ticketInfo.findByClassName('price-label');
    assert.equal(await priceLabel.getVisibleText(),'Mulai Dari');

    const price = await ticketInfo.findByClassName('price');
    assert.equal(await price.getVisibleText(), 'IDR 70.000');

    const openDate = await ticketInfo.findByCssSelector('.open-date span');
    assert.equal(await openDate.getVisibleText(), 'Tiket Tersedia Sekarang');

    const bookBtn = await ticketInfo.findByTagName('button');
    assert.equal(await bookBtn.getVisibleText(), 'CARI TIKET');
  });

  test('Landing - Sticky section nav bar', async function({remote}){

    await remote.execute('window.scrollTo(0,900)');
    // wait for window to finish scrolling
    await sleep(2000);

    const sectionNavBar = await remote.findByClassName('section-nav-bar');
    assert.isOk(sectionNavBar);

    const anchors = await sectionNavBar.findByClassName('anchors');
    const overview = await anchors.findByCssSelector('a:first-child');
    assert.isOk(await overview.getAttribute('href'), '#overview');

    const tickets = await anchors.findByCssSelector('a:nth-child(2)');
    assert.isOk(await tickets.getAttribute('href'), '#tickets');

    const location = await anchors.findByCssSelector('a:nth-child(3)');
    assert.isOk(await location.getAttribute('href'), '#location');

    const additionalInfo = await anchors.findByCssSelector('a:nth-child(4)');
    assert.isOk(await additionalInfo.getAttribute('href'), '#additional-information');
  })

});
