import { commandRegistry } from './CommandRegistry';
import PlusAlt from '$lib/components/icons/PlusAlt.svelte';

commandRegistry.register({
	id: 'new',
	label: 'New Session',
	description: 'Start a fresh conversation. Messages stay in view but context is cleared.',
	icon: PlusAlt,
	when: (ctx) => !!ctx.history?.currentId,
	handler: (ctx) => {
		ctx.history.newSession = true;
		ctx.setPrompt?.('');
		ctx.toast?.message?.(ctx.i18n.t('New session started.'));
		document.getElementById('chat-input')?.focus();
	}
});
