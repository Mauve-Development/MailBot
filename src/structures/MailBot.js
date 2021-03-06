const { Client, Collection } = require('discord.js');
const { PREFIX, MONGO_URL, OWNERS, STAFFSERVER, MIANPARENT } = require('../../configs');
const { connect, connection } = require('mongoose');
const Registrator = require('../utils/Registrator');
const serverSchema = require('../models/serverSchema');

class MailBot extends Client {
  constructor(options = {}) {
    super(options);

    this.commands = new Collection();

    this.aliases = new Collection();

    this.dmCache = new Collection();

    this.Registrator = new Registrator(this);

    this.currentlyOpenTickets = new Map();
  }

  get prefix() {
    if (PREFIX.length > 0) {
      return PREFIX;
    }
    return '!';
  }

  get mainParent() {
    if (MIANPARENT.length > 0) {
      return MIANPARENT;
    }
    return null;
  }

  get owners() {
    if (OWNERS.length > 0) {
      return OWNERS;
    }
    return null;
  }

  isOwner(user) {
    if (!this.owners) return false;
    user = this.users.resolve(user);
    if (this.owners.includes(user.id)) return true;
    return false;
  }

  async staffServer() {
    if (this.guilds.cache.has(STAFFSERVER)) {
      return this.guilds.cache.get(STAFFSERVER);
    }
    return await this.guilds.fetch(STAFFSERVER, true, true);
  }

  async database() {
    return await this._getMaster();
  }

  ready(token) {
    connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    connection.on('connected', async () => {
      console.log('DB connected');
      await this._getMaster();
    });
    this.Registrator.loadCommands('../commands');
    this.Registrator.loadEvents('../events');
    super.login(token);
  }

  /** @private */
  async _getMaster() {
    const master = await serverSchema.findOne({ main: 'master' });
    if (!master) {
      const masterCreated = new serverSchema();
      await masterCreated.save();
      return masterCreated;
    }
    return master;
  }
}

module.exports = MailBot;
