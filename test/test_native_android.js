var expect = require('chai').expect;
var wd = require('wd'),
  driver = wd.promiseChainRemote({
    host: 'localhost',
    port: 4723
  });

var desiredCaps = {
  'deviceName': 'Android Emulator',
  'platformName': 'Android',
  'app': '/Users/mikapted/Documents/Projects/aws-codepipeline-devicefarm/app/build/outputs/apk/debug/app-debug.apk'
};

var assert = require('assert');
describe('AWSDeviceFarmAppTest', function () {

  before(function () {
    this.timeout(300 * 1000);
    return driver.init();
  });

  after(function () {
    console.log("quitting");
  });

  it('test_app_is_loaded', async function () {
    const textViewHelloWorld = await driver.elementById("com.example.myapplication:id/textViewHelloWorld");
    expect(textViewHelloWorld).to.exist;

    const textViewHelloWorldText = await textViewHelloWorld.text();
    expect(textViewHelloWorldText).to.eq('Hello World!');

    await new Promise(res => setTimeout(res, 1000));

  });

  it('test_enter_message_and_send', async function () {
    this.timeout(300 * 1000);

    const editText = await driver.elementById("com.example.myapplication:id/editText");
    expect(editText).to.exist;
    await editText.type('Test');

    await new Promise(res => setTimeout(res, 1000));

    const button = await driver.elementById("com.example.myapplication:id/button");
    expect(button).to.exist;
    await button.click();

    await new Promise(res => setTimeout(res, 2000));
  });

  it('test_check_sent_message', async function () {
    this.timeout(300 * 1000);

    const textViewOutput = await driver.elementById("com.example.myapplication:id/textViewOutput");
    expect(textViewOutput).to.exist;

    const textViewOutputText = await textViewOutput.text();
    expect(textViewOutputText).to.eq('Test');

    await new Promise(res => setTimeout(res, 1000));
  });

  it('test_back_to_home', async function () {
    this.timeout(300 * 1000);

    const element = await driver.elementByAccessibilityId("Navigate up");
    expect(element).to.exist;
    element.click();

    await new Promise(res => setTimeout(res, 2000));

    const textViewHelloWorld = await driver.elementById("com.example.myapplication:id/textViewHelloWorld");
    expect(textViewHelloWorld).to.exist;
  });
});