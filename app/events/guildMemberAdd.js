const logmanager = require("../eventlogging.js");

module.exports = (client, member) => {
  member.guild.fetchInvites().then(guildInvites => {
    const ei = client.invites[member.guild.id];
    client.invites[member.guild.id] = guildInvites;
    const invite = guildInvites.find(i => ei.get(i.code).uses < i.uses);
    const inviter = client.users.cache.get(invite.inviter.id);

    logmanager.log(client, "New user", "**Invite** " + invite.code + " **by** " + inviter.tag, member.user)
  });
};