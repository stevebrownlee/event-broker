const events = ["itemCreated", "itemEdited", "itemDeleted", "authenticated", "loggedOut", "itemsShown", "itemsHid", "itemsSorted", "itemsFiltered", "userBlocked", "userFollowed", "userViewed", "postViewed", "postBlocked"]

export const useEvents = () => events.slice()