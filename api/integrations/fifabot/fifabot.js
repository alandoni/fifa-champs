// const variables = require('./variables');
const commands = require('./commands');
const slack = require('./integrations/slack');

slack.bot.startRTM((error) => {
  if (error) {
    console.warn(`Failed to start RTM: ${error}`);
    return;
  }

  console.info('RTM started!');
});

slack.controller.hears('.*', ['direct_message', 'direct_mention', 'mention'], (botInstance, botMessage) => {
  const api = botInstance.api;

  api.users.info({ user: botMessage.user }, (error, usersInfoResponse) => {
    const user = usersInfoResponse.user;

    api.channels.info({ channel: botMessage.channel }, (errorChannels, channelsInfoResponse) => {
      api.groups.info({ channel: botMessage.channel }, (errorGroups, groupsInfoResponse) => {
        let channel;

        if (channelsInfoResponse.ok) {
          channel = channelsInfoResponse.channel.name;
        } else if (groupsInfoResponse.ok) {
          channel = groupsInfoResponse.group.name;
        } else if (botMessage.event === 'direct_message') {
          channel = 'allow';
        } else {
          channel = 'unknown';
        }

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
          .catch(console.log);
      });
    });
  });
});

