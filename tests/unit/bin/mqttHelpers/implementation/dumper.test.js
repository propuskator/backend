jest.mock('docopt', () => ({
    docopt : jest.fn()
}));

const mockFsWriteFile = jest.fn();

jest.mock('fs', () => ({
    writeFile : mockFsWriteFile
}));

const EventEmitter = require('events');
const { docopt }   = require('docopt');
const mqtt         = require('mqtt');
const { main }     = require('../../../../../bin/mqttHelpers/implementation/dumper');

class MockMqttClient extends EventEmitter {}

MockMqttClient.prototype.subscribe = jest.fn();
MockMqttClient.prototype.end = jest.fn();

describe('Dumper', () => {
    describe('main', () => {
        const HELP_MESSAGE = 'fake help message';
        const DOCOPT_ARGS_URL = 'http://fake-url';
        const DOCOPT_ARGS_NAME = 'fake-name';
        const DOCOPT_ARGS_PASS = 'fake-pass';
        const DUMP_TIMEOUT = 15000;

        beforeEach(() => {
            jest.useRealTimers();

            process.exit = jest.fn();

            docopt.mockReturnValue({
                '<url>'             : DOCOPT_ARGS_URL,
                '<name>'            : DOCOPT_ARGS_NAME,
                '<pass>'            : DOCOPT_ARGS_PASS
            });
        });

        describe('POSITIVE', () => {
            it(
                'should successfully print help message, connect to MQTT, ' + 
                'collect and write dumped topics and exit a process', 
                async () => {
                    jest.useFakeTimers();

                    const mockMqttClient = new MockMqttClient();
                    const spyMockMqttClientOn = jest.spyOn(mockMqttClient, 'on');

                    mockMqttClient.subscribe.mockImplementation((_, cb) => cb());
                    mockFsWriteFile.mockImplementation((_, __, cb) => cb());

                    mqtt.connect = jest.fn().mockReturnValue(mockMqttClient);

                    const resultPromise = main({ helpMessage: HELP_MESSAGE, dumpTimeout: DUMP_TIMEOUT });

                    mockMqttClient.emit('connect');

                    jest.advanceTimersByTime(DUMP_TIMEOUT);

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
                        'message', expect.any(Function)
                    ]));
                    expect(spyMockMqttClientOn.mock.calls).toContainEqual(expect.arrayContaining([
                        'error', expect.any(Function)
                    ]));
                    expect(mockMqttClient.subscribe).toHaveBeenCalledWith(
                        expect.any(Array),
                        expect.any(Function)
                    );
                    expect(mockFsWriteFile).toHaveBeenCalledWith(
                        expect.any(String),
                        expect.any(String),
                        expect.any(Function)
                    );
                    expect(mockMqttClient.end).toHaveBeenCalled();
                    expect(process.exit).toHaveBeenCalledWith(0);
            });
        });

        describe('NEGATIVE', () => {
            it('should log the error and exit with non-zero exit code on MQTT client creation error', async () => {
                mqtt.connect = jest.fn().mockImplementation(() => {
                    throw new Error();
                });

                const spyConsoleError = jest.spyOn(console, 'error');

                await main({ helpMessage: HELP_MESSAGE, dumpTimeout: DUMP_TIMEOUT });

                expect(spyConsoleError).toHaveBeenCalled();
                expect(process.exit).toHaveBeenCalled();

                const exitCode = process.exit.mock.calls[0][0];

                expect(exitCode).toBeGreaterThan(0);
            });

            it('should log the error and exit with non-zero exit code on MQTT client error', async () => {
                const mockMqttClient = new MockMqttClient();
                const spyConsoleError = jest.spyOn(console, 'error');

                mqtt.connect = jest.fn().mockReturnValue(mockMqttClient);

                const resultPromise = main({ helpMessage: HELP_MESSAGE, dumpTimeout: DUMP_TIMEOUT });

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