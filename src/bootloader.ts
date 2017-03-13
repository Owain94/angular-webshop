export function bootloader (main): void {
  function domReadyHandler() {
    document.removeEventListener('DOMContentLoaded', domReadyHandler, false);
    main();
  }

  switch (document.readyState) {
    case 'loading':
      document.addEventListener('DOMContentLoaded', domReadyHandler, false);
      break;
    case 'interactive':
    case 'complete':
    // tslint:disable-next-line:no-switch-case-fall-through
    default:
      main();
  }
}
