const attachFastClick = require('fastclick');

export function bootloader (main): void {
  function domReadyHandler() {
    document.removeEventListener('DOMContentLoaded', domReadyHandler, false);
    main();
  }

  switch (document.readyState) {
    case 'loading':
      document.addEventListener('DOMContentLoaded', domReadyHandler, false);
      break;
    case 'complete':
      attachFastClick(document.body);
    // tslint:disable-next-line:no-switch-case-fall-through
    case 'interactive':
    default:
      main();
  }
}
