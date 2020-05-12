import createChatInsertQueryValues from '../lib/createChatInsertQueryValues';

test('Run onad - twitch - Bot', (done) => {
  const now = new Date();
  const [query, queryArray] = createChatInsertQueryValues([
    {
      creatorId: 'asdf',
      time: now,
      name: 'name',
      userid: 'userid',
      subscriber: true,
      manager: true,
      badges: undefined,
      text: 'string',
    },
    {
      creatorId: 'asdf',
      time: now,
      name: 'name',
      userid: 'userid',
      subscriber: false,
      manager: false,
      badges: { broadcaster: '1', subscriber: '12' },
      text: 'string',
    }
  ]);

  expect(query).toBe(`
    INSERT INTO twitchChat
    ( creatorId, time, name, userId, subscriber, manager, badges, text )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?),
(?, ?, ?, ?, ?, ?, ?, ?)`);

  expect(queryArray).toStrictEqual([
    'asdf', now, 'name', 'userid', 1, 1, null, 'string',
    'asdf', now, 'name', 'userid', 0, 0, JSON.stringify({ broadcaster: '1', subscriber: '12' }), 'string',
  ]);
  done();
});
