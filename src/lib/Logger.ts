export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'trace'

const LEVEL_PRIORITY: Record<LogLevel, number> = {
	'debug': 10,
	'info': 20,
	'warn': 30,
	'error': 40,
	'trace': 50,
}

const DEFAULT_LEVEL: LogLevel = 'error'

export class Logger {
	private readonly level: LogLevel
	private readonly sink: Console
	private readonly prefix?: string

	constructor({ level, sink }: { level?: LogLevel, sink?: Console }) {
		this.level = level ?? DEFAULT_LEVEL
		this.sink = sink ?? console
		this.prefix = '[Musical Components]'
	}

	public debug(...args: unknown[]): void {
		this.write('debug', args)
	}

	public info(...args: unknown[]): void {
		this.write('info', args)
	}

	public warn(...args: unknown[]): void {
		this.write('warn', args)
	}

	public error(...args: unknown[]): void {
		this.write('error', args)
	}

    public trace(...args: unknown[]): void {
        this.write('trace', args)
    }

	private write(level: LogLevel, args: unknown[]): void {
		if (LEVEL_PRIORITY[level] < LEVEL_PRIORITY[this.level]) {
			return
		}

		const withPrefix = this.prefix ? [this.prefix, ...args] : args

		switch (level) {
			case 'debug':
				this.sink.debug(...withPrefix)
				break
			case 'info':
				this.sink.info(...withPrefix)
				break
			case 'warn':
				this.sink.warn(...withPrefix)
				break
			case 'error':
				this.sink.error(...withPrefix)
				break
            case 'trace':
                this.sink.trace(...withPrefix)
                break
		}
	}

    private static _instance: Logger
    public static get instance (): Logger {
        if (!Logger._instance) {
            throw new Error('Logger not initialized')
        }
        return Logger._instance
    }

    public static initialize ({ level, sink }: { level?: LogLevel, sink?: Console } = {}): void {
        if (Logger._instance) {
            throw new Error('Logger already initialized')
        }
        Logger._instance = new Logger({ level, sink })
    }
}

Logger.initialize({ level: 'debug' })