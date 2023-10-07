class ChatAPI {
  static get RootAPIPath() {
    return 'https://chat-backend-a4d4.onrender.com';
  }

  async postNewUser(data) {
    try {
      const response = await fetch(`${ChatAPI.RootAPIPath}/new-user`, {
        method: 'POST',
        body: JSON.stringify(data),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default ChatAPI;
