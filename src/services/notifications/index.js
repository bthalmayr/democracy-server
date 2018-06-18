/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

import _ from 'lodash';
import apn from 'apn';
import gcm from 'node-gcm';
import util from 'util';

import apnProvider from './apn';
import gcmProvider from './gcm';
import UserModel from '../../models/User';
import ProcedureModel from '../../models/Procedure';
import CONFIG from '../../config/constants';

const sendNotifications = ({
  tokenObjects, title = 'DEMOCRACY', message, payload,
}) => {
  const androidNotificationTokens = [];
  tokenObjects.forEach(({ token, os }) => {
    switch (os) {
      case 'ios':
        {
          const note = new apn.Notification();

          note.alert = {
            title,
            body: message,
          };

          note.topic = CONFIG.APN_TOPIC;

          note.payload = payload;

          apnProvider.send(note, token).then((result) => {
            console.log('apnProvider.send', util.inspect(result, false, null));
          });
        }
        break;

      case 'android':
        // Prepare android notifications
        androidNotificationTokens.push(token);
        break;

      default:
        break;
    }
  });
  // send bulk send android notifications
  if (androidNotificationTokens.length > 0) {
    const gcmMessage = new gcm.Message({
      data: {
        title,
        body: message,
        payload,
      },
    });
    gcmProvider.send(
      gcmMessage,
      { registrationTokens: androidNotificationTokens },
      (err, response) => {
        if (err) console.error('gcmProvider', err);
        else console.log('gcmProvider', response);
      },
    );
  }
};

const newVote = async ({ procedureId }) => {
  const procedure = await ProcedureModel.findOne({ procedureId });
  const users = await UserModel.find({
    'notificationSettings.enabled': true,
    'notificationSettings.newVote': true,
  });
  const tokenObjects = users.reduce((array, { pushTokens }) => [...array, ...pushTokens], []);
  const title = 'Jetzt Abstimmen!';
  sendNotifications({
    tokenObjects,
    title,
    message: procedure.title,
    payload: {
      procedureId,
      action: 'procedureDetails',
      title,
      message: procedure.title,
    },
  });
};

const newVotes = async ({ procedureIds }) => {
  const users = await UserModel.find({
    'notificationSettings.enabled': true,
    'notificationSettings.newVote': true,
  });
  const tokenObjects = users.reduce((array, { pushTokens }) => [...array, ...pushTokens], []);
  const title = 'Jetzt Abstimmen!';
  sendNotifications({
    tokenObjects,
    title,
    message: `Es gibt ${procedureIds.length} neue Abstimmungen.`,
    payload: {
      procedureIds,
      title,
      message: `Es gibt ${procedureIds.length} neue Abstimmungen.`,
      action: 'procedureBulk',
      type: 'procedureBulk',
    },
  });
};
// newVote({ procedureId: 231079 });

const newPreperation = async ({ procedureId }) => {
  const procedure = await ProcedureModel.findOne({ procedureId });
  const users = await UserModel.find({
    'notificationSettings.enabled': true,
    'notificationSettings.newPreperation': true,
  });
  const tokenObjects = users.reduce((array, { pushTokens }) => [...array, ...pushTokens], []);
  let title;
  switch (procedure.type) {
    case 'Gesetzgebung':
      title = 'Neue Gesetzesinitiative!';
      break;
    case 'Antrag':
      title = 'Neuer Antrag!';
      break;
    default:
      title = 'Neu!';
      break;
  }
  sendNotifications({
    tokenObjects,
    title,
    message: procedure.title,
    payload: {
      procedureId,
      action: 'procedureDetails',
      title,
      message: procedure.title,
    },
  });
};

const newPreperations = async ({ procedureIds }) => {
  const users = await UserModel.find({
    'notificationSettings.enabled': true,
    'notificationSettings.newPreperation': true,
  });
  const tokenObjects = users.reduce((array, { pushTokens }) => [...array, ...pushTokens], []);
  sendNotifications({
    tokenObjects,
    title: 'Neu in Vorbereitung!',
    message: `${procedureIds.length} Elemente neu in Vorbereitung`,
    payload: {
      procedureIds,
      title: 'Neu in Vorbereitung!',
      message: `${procedureIds.length} Elemente neu in Vorbereitung`,
      action: 'procedureBulk',
      type: 'procedureBulk',
    },
  });
};
// newPreperation({ procedureId: 231079 });

const procedureUpdate = async ({ procedureId }) => {
  const procedure = await ProcedureModel.findOne({ procedureId });
  const users = await UserModel.find({
    'notificationSettings.enabled': true,
    'notificationSettings.procedures': procedure._id,
  });
  const tokenObjects = users.reduce((array, { pushTokens }) => [...array, ...pushTokens], []);
  const title = 'Update!';
  sendNotifications({
    tokenObjects,
    title,
    message: procedure.title,
    payload: {
      procedureId,
      action: 'procedureDetails',
      title,
      message: procedure.title,
    },
  });
};
// procedureUpdate({ procedureId: 231079 });

export { procedureUpdate, newVote, newVotes, newPreperation, newPreperations };

export default async ({
  title, message, user, payload,
}) => {
  let userId;
  if (_.isObject(user)) {
    userId = user._id;
  }
  const userObj = await UserModel.findById(userId);
  if (userObj) {
    const androidNotificationTokens = [];
    userObj.pushTokens.forEach(({ token, os }) => {
      switch (os) {
        case 'ios':
          {
            const note = new apn.Notification();

            note.alert = {
              title,
              body: message,
            };

            note.topic = CONFIG.APN_TOPIC;
            note.contentAvailable = 1;

            note.payload = payload;

            apnProvider.send(note, token).then((result) => {
              console.log('apnProvider.send', util.inspect(result, false, null));
            });
          }
          break;

        case 'android':
          // Prepare android notifications
          androidNotificationTokens.push(token);
          break;

        default:
          break;
      }
    });
    // send bulk send android notifications
    if (androidNotificationTokens.length > 0) {
      const gcmMessage = new gcm.Message({
        data: {
          title,
          body: message,
          payload,
        },
      });
      gcmProvider.send(
        gcmMessage,
        { registrationTokens: androidNotificationTokens },
        (err, response) => {
          if (err) console.error('gcmProvider', err);
          else console.log('gcmProvider', response);
        },
      );
    }
  }
};
