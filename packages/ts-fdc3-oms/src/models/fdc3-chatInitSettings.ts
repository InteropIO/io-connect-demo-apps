import { Fdc3ContactList } from './fdc3-contactList'

export interface Fdc3ChatInitSettings {
    type: 'fdc3.chat.initSettings'
    chatName?: string
    members?: Fdc3ContactList
    options?: {
        groupRecipients: boolean
        public: boolean
        allowHistoryBrowsing: boolean
        allowMessageCopy: boolean
        allowAddUser: boolean
    }
    initMessage?: string
}
