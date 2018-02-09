const commands = require('./commands');
const slack = require('./integrations/slack');

slack.bot.startRTM((error) => {
  if (error) {
    console.warn(`Failed to start RTM: ${error}`);
    return;
  }

  console.info('RTM started!');
});

// enables bot to hear from direct messages, direct mentions and mentions
slack.controller.hears('.*', ['direct_message', 'direct_mention', 'mention'], (botInstance, botMessage) => {
  const api = botInstance.api;

  // retrieves info from message sender
  api.users.info({ user: botMessage.user }, (error, usersInfoResponse) => {
    const user = usersInfoResponse.user;

    // retrieves info from bot channels
    api.channels.info({ channel: botMessage.channel }, (errorChannels, channelsInfoResponse) => {
      // retrieves info from bot groups
      api.groups.info({ channel: botMessage.channel }, (errorGroups, groupsInfoResponse) => {
        let channel; // channel is the variable verified by the command to check if it is allowed in that particular stream

        if (channelsInfoResponse.ok) { // check if it is a room that the bot is added
          channel = channelsInfoResponse.channel.name;
        } else if (groupsInfoResponse.ok) { // check if it is a group that the is added
          channel = groupsInfoResponse.group.name;
        } else if (botMessage.event === 'direct_message') { // check if it is a direct message (DM)
          channel = 'allow'; 
        } else { // exception
          channel = 'unknown';
        }

        // build message with all info gathered
        const message = {
          channel,
          userName: user.name,
          firstName: user.profile.first_name,
          lastName: user.profile.last_name,
          text: botMessage.text.replace(/\s+/g, ' ').trim(),
        };

        console.info(message);

        commands.parse(message)
          .then(response => botInstance.reply(botMessage, response))
          .catch(error => botInstance.reply(botMessage, error));
      });
    });
  });
});

