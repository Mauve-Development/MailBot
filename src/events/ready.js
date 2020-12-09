const BaseEvent = require('../structures/BaseEvent');

class ReadyEvent extends BaseEvent {
  constructor() {
    super('ready');
  }

  run(client) {
    console.log(`${client.user.tag} is ready.`);
    client.user.setPresence({
      status: 'online',
      activity: {
        name: 'people in my DMs 🎄',
        type: 'WATCHING'
      }
    });
  }
}

module.exports = ReadyEvent;
