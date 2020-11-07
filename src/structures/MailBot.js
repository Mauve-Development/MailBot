const { Client } = require('discord.js');
const { PREFIX, MONGO_URL } = require('../../configs');
const { connect, connection } = require('mongoose');
const Registrator = require('../utils/Registrator');

class MailBot extends Client {
  constructor(options = {}) {
    super(options);

    this.Registrator = new Registrator(this);
  }

  get prefix() {
    return PREFIX || '!';
  }

  ready(token) {
    connect(MONGO_URL);
    connection.on('connected', () => {
      console.log('DB connected');
    });
    this.Registrator.loadCommands('../commands');
    this.Registrator.loadEvents('../events');
    super.login(token);
  }
}

module.exports = MailBot;