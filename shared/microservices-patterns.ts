export const MicroservicePatterns = {
  TRANSACTIONS: {
    GET_ALL: 'get_transactions',
    GET_ONE: 'get_transaction',
    CREATE: 'create',
    PROCEED: 'proceed',
    GET_HISTORY: 'history',
  },
  USERS: {
    GROUPS: {
      GET_ALL: 'get_groups',
      CREATE: 'create_group',
      GET_ONE: 'get_group',
      ADD_USER: 'add_user',
      ADD_MONEY: 'add_money',
    },
    GET_ALL: 'get_users',
    GET_ONE: 'get_user',
    CREATE: 'create',
    SEND_MONEY: 'send_money',
  },
};
