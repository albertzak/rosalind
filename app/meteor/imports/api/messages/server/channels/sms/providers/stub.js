export const name = 'stub'

export const send = (message) => {
  console.log('[Messages] channels/sms/stub: Sending SMS', message._id)

  return new Promise((resolve, reject) => {
    if (Math.random() < 0.05) {
      setTimeout(() => reject(new Error({ error: 'something occured', code: 500 })), 8000 * Math.random())
    } else {
      setTimeout(() => resolve({ response: 'sent ok', code: 200 }), 4000 * Math.random())
    }
  })
}

export const receive = (payload) => {
  payload = payload || {
    messageType: 'text',
    notificationId: 'c27f015a2eade38ca85f',
    senderAddress: '436601111111',
    recipientAddress: '08289999999',
    recipientAddressType: 'national',
    senderAddressType: 'international',
    textMessageContent: 'NEIN'
  }

  const message = {
    type: 'inbound',
    channel: 'SMS',
    direction: 'inbound',
    status: 'unread',
    to: payload.recipientAddress,
    from: payload.senderAddress,
    text: payload.textMessageContent,
    external: {
      stub: {
        id: payload.notificationId,
        payload: payload
      }
    }
  }

  const response = {
    statusCode: 2000,
    statusMessage: 'OK, Thanks!'
  }

  return { response, message }
}

export default { send, receive, name }
