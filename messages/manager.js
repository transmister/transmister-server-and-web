import eventManager from '../socket/eventManager'

var events = new eventManager()

class manager {
    messages = {};

    add = (username, type, data) => {
        if (!this.messages[username]) { this.messages[username] = [] }
        this.messages[username].push({ type, data })
        events.trigger('add', { username })
    };

    get = username => this.messages[username];
}

var msgMgr = new manager()

export default msgMgr
export { msgMgr, events as msgMgrEvents }
