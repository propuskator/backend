jest.mock('docopt', () => ({
    docopt : jest.fn()
}));

const EventEmitter = require('events');
const { docopt }   = require('docopt');
const mqtt         = require('mqtt');
const { main }     = require('../../../../../bin/mqttHelpers/implementation/setter');

class MockMqttClient extends EventEmitter {}

MockMqttClient.prototype.publish = jest.fn();

describe('Setter', () => {
    describe('main', () => {
        const HELP_MESSAGE = 'fake help message';
        const DOCOPT_ARGS_URL = 'http://fake-url';
        const DOCOPT_ARGS_NAME = 'fake-name';
        const DOCOPT_ARGS_PASS = 'fake-pass';
        const DOCOPT_ARGS_FILE_PATH = '/fake/path';

        beforeEach(() => {
            process.exit = jest.fn();
        });

        describe('POSITIVE', () => {
            it(
                'should successfully print help message, connect to MQTT, ' + 
                'publish MQTT state and exit a process',
                async () => {
                    const mockMqttState = {
                        'fake/topic/1' : 'fake/value/1',
                        'fake/topic/2' : 'fake/value/2',
                        'fake/topic/3' : 'fake/value/3'
                    };

                    docopt.mockReturnValue({
                        '<url>'      : DOCOPT_ARGS_URL,
                        '<name>'     : DOCOPT_ARGS_NAME,
                        '<pass>'     : DOCOPT_ARGS_PASS,
                        '<filepath>' : DOCOPT_ARGS_FILE_PATH
                    });

                    const mockMqttClient = new MockMqttClient();
                    const spyMockMqttClientOn = jest.spyOn(mockMqttClient, 'on');

                    mockMqttClient.publish = jest.fn().mockImplementation((_, __, ___, cb) => cb());
                    mqtt.connect = jest.fn().mockReturnValue(mockMqttClient);

                    // to mock dynamically require
                    jest.doMock(DOCOPT_ARGS_FILE_PATH, () => mockMqttState, { virtual: true });

                    const resultPromise = main({ helpMessage: HELP_MESSAGE });

                    mockMqttClient.emit('connect');

                    await resultPromise;

                    expect(docopt).toHaveBeenCalledWith(HELP_MESSAGE);
                    expect(mqtt.connect).toHaveBeenCalledWith(DOCOPT_ARGS_URL, {
                        username           : DOCOPT_ARGS_NAME,
                        password           : DOCOPT_ARGS_PASS,
                        rejectUnauthorized : false
                    });
                    expect(spyMockMqttClientOn.mock.calls).toContainEqual(expect.arrayContaining([
                        'connect', expect.any(Function)
                    ]));
                    expect(spyMockMqttClientOn.mock.calls).toContainEqual(expect.arrayContaining([
                        'error', expect.any(Function)
                    ]));
                    
                    Object
                        .entries(mockMqttState)
                        .forEach(([ topic, value ]) => {
                            expect(mockMqttClient.publish).toHaveBeenCalledWith(
                                topic,
                                value,
                                { qos: 2, retain: true },
                                expect.any(Function)
                            );
                        });
                    
                    expect(process.exit).toHaveBeenCalledWith(0);
                }
            );

            it(
                'should publish MQTT state with empty values when --delete option is entered',
                async () => {
                    const DOCOPT_ARGS_IS_DELETE = 'true';
                    const mockMqttState = {
                        'fake/topic/1' : 'fake/value/1',
                        'fake/topic/2' : 'fake/value/2',
                        'fake/topic/3' : 'fake/value/3'
                    };
                    const EMPTY_VALUE = '';

                    docopt.mockReturnValue({
                        '--delete'   : DOCOPT_ARGS_IS_DELETE,
                        '<url>'      : DOCOPT_ARGS_URL,
                        '<name>'     : DOCOPT_ARGS_NAME,
                        '<pass>'     : DOCOPT_ARGS_PASS,
                        '<filepath>' : DOCOPT_ARGS_FILE_PATH
                    });

                    const mockMqttClient = new MockMqttClient();

                    mockMqttClient.publish = jest.fn().mockImplementation((_, __, ___, cb) => cb());
                    mqtt.connect = jest.fn().mockReturnValue(mockMqttClient);

                    // to mock dynamically require
                    jest.doMock(DOCOPT_ARGS_FILE_PATH, () => mockMqttState, { virtual: true });

                    const resultPromise = main({ helpMessage: HELP_MESSAGE });

                    mockMqttClient.emit('connect');

                    await resultPromise;

                    Object
                        .keys(mockMqttState)
                        .forEach(topic => {
                            expect(mockMqttClient.publish).toHaveBeenCalledWith(
                                topic,
                                EMPTY_VALUE,
                                { qos: 2, retain: true },
                                expect.any(Function)
                            );
                        });
                }
            )
        });

        describe('NEGATIVE', () => {
            it('should log the error and exit with non-zero exit code on MQTT client error', async () => {
                docopt.mockReturnValue({
                    '<url>'      : DOCOPT_ARGS_URL,
                    '<name>'     : DOCOPT_ARGS_NAME,
                    '<pass>'     : DOCOPT_ARGS_PASS,
                    '<filepath>' : DOCOPT_ARGS_FILE_PATH
                });

                const mockMqttClient = new MockMqttClient();
                const spyConsoleError = jest.spyOn(console, 'error');

                mqtt.connect = jest.fn().mockReturnValue(mockMqttClient);

                const resultPromise = main({ helpMessage: HELP_MESSAGE });

                mockMqttClient.emit('error', new Error());

                await resultPromise;

                expect(spyConsoleError).toHaveBeenCalled();
                expect(process.exit).toHaveBeenCalled();

                const exitCode = process.exit.mock.calls[0][0];

                expect(exitCode).toBeGreaterThan(0);
            });
        });
    });
});