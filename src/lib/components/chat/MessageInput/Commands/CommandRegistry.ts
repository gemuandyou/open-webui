import type { Writable } from 'svelte/store';

export interface CommandContext {
	history: {
		messages: Record<string, any>;
		currentId: string | null;
		newSession?: boolean;
		[key: string]: unknown;
	};
	chatId: string;
	selectedModels: string[];
	temporaryChatEnabled: boolean;
	contextCompactionEnabled: boolean;
	isActive: boolean;
	messageInput: any;
	toast: any;
	i18n: any;
	goto: (path: string) => Promise<void>;
	prompt?: Writable<string>;
	setPrompt?: (value: string) => void;
	insertTextHandler?: (text: string) => Promise<void>;
}

export interface SlashCommand {
	id: string;
	label: string;
	description: string;
	icon?: any;
	handler: (context: CommandContext) => void | Promise<void>;
	when?: (context: CommandContext) => boolean;
	disabled?: (context: CommandContext) => boolean;
}

type CommandEntry = SlashCommand & { registered: boolean };

export class CommandRegistry {
	private commands: Map<string, CommandEntry> = new Map();
	private dirty = true;

	register(command: SlashCommand): void {
		this.commands.set(command.id, { ...command, registered: true });
		this.dirty = true;
	}

	unregister(id: string): void {
		this.commands.delete(id);
		this.dirty = true;
	}

	get(id: string): SlashCommand | undefined {
		const entry = this.commands.get(id);
		return entry?.registered ? entry : undefined;
	}

	getAll(): SlashCommand[] {
		return Array.from(this.commands.values())
			.filter((entry) => entry.registered)
			.map(({ registered, ...cmd }) => cmd);
	}

	getVisible(context: CommandContext): SlashCommand[] {
		return this.getAll().filter((cmd) => (cmd.when ? cmd.when(context) : true));
	}

	isDisabled(id: string, context: CommandContext): boolean {
		const cmd = this.get(id);
		return cmd?.disabled ? cmd.disabled(context) : false;
	}
}

export const commandRegistry = new CommandRegistry();