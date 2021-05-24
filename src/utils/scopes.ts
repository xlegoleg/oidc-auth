import _ from 'lodash';

export enum ScopesMode {
  and,
  or,
}

export interface Scope {
  list: string[];
  mode: ScopesMode;
}

const scopes: {
  [key: string]: Scope;
} = {
  accounts: {
    list: ['cloudAdmin', 'organizationAdmin', 'regionAdmin'],
    mode: ScopesMode.or,
  },
  appeals: {
    list: ['cloudAdmin'],
    mode: ScopesMode.or,
  },
  dashboard: {
    list: [
      'organizationAdmin',
      'regionAdmin',
      'statementOperator',
      'strManagerAccess',
      'risksManagerAccess',
      'uprDirAccess',
      'registrar',
      'specialist',
      'signedSpecialist',
    ],
    mode: ScopesMode.or,
  },
  envelopes: {
    list: ['cloudAdmin'],
    mode: ScopesMode.or,
  },
  microws: {
    list: ['openid', 'profile', 'ClientScope1', 'S3Client'],
    mode: ScopesMode.and,
  },
  organizations: {
    list: ['cloudAdmin', 'organizationAdmin', 'regionAdmin'],
    mode: ScopesMode.or,
  },
  printForms: {
    list: ['cloudAdmin'],
    mode: ScopesMode.or,
  },
  printTemplates: {
    list: ['cloudAdmin'],
    mode: ScopesMode.or,
  },
  processes: {
    list: ['cloudAdmin', 'camundaCockpitAccess'],
    mode: ScopesMode.or,
  },
  regions: {
    list: ['cloudAdmin', 'regionAdmin'],
    mode: ScopesMode.or,
  },
  reports: {
    list: ['reports'],
    mode: ScopesMode.or,
  },
  resources: {
    list: ['cloudAdmin'],
    mode: ScopesMode.or,
  },
  solutions: {
    list: ['cloudAdmin'],
    mode: ScopesMode.or,
  },
  statements: {
    list: [
      'cloudAdmin',
      'registrar',
      'specialist',
      'signedSpecialist',
      'allocatePermissionSpec',
      'allocatePermissionReg',
      'organizationAdmin',
      'regionAdmin',
      'observer',
      'regionObserver',
    ],
    mode: ScopesMode.or,
  },
  tasks: {
    list: ['cloudAdmin'],
    mode: ScopesMode.or,
  },
  userTasks: {
    list: ['cloudAdmin'],
    mode: ScopesMode.or,
  },
  requests: {
    list: ['cloudAdmin'],
    mode: ScopesMode.or,
  },
  territories: {
    list: ['cloudAdmin'],
    mode: ScopesMode.or,
  },
  creditPetitions: {
    list: [],
    mode: ScopesMode.or,
  },
  financingTasks: {
    list: [],
    mode: ScopesMode.or,
  },
  dictionaries: {
    list: ['cloudAdmin'],
    mode: ScopesMode.or,
  },
  registries: {
    list: ['resultRegistry'],
    mode: ScopesMode.or,
  },
  tickets: {
    list: ['preorder'],
    mode: ScopesMode.or,
  },
  services: {
    list: ['servicesConstruct'],
    mode: ScopesMode.or,
  },
  notifications: {
    list: ['cloudAdmin'],
    mode: ScopesMode.or,
  },
  all: {
    list: ['allOrgAdmin'],
    mode: ScopesMode.and,
  },
  personalReception: {
    list: ['personalReception'],
    mode: ScopesMode.or,
  },
  incidents: {
    list: ['cloudAdmin'],
    mode: ScopesMode.or,
  },
};

const paths: {
  [key: string]: string;
} = {
  statements: 'statements',
  'registry-object': 'registries',
  accounts: 'accounts',
  organizations: 'organizations',
  regions: 'regions',
  payments: 'payments',
  services: 'services',
  reports: 'reports',
  inter_requests: 'statements',
  solutions: 'solutions',
  tasks: 'tasks',
  notifications: 'notifications',
};

// export function comparePaths(path: string): boolean {
//   const listName: string = paths[path];
//   return matchScopes(scopes[listName].list, ScopesMode.or);
// }

// export function matchScopes(
//   list: string[] = [],
//   mode = ScopesMode.and
// ): boolean {
//   // eslint-disable-next-line @typescript-eslint/no-var-requires
//   const store = require('@state/store').default;
//   // Костыль, лечащий кейс с поломкой редиректа
//   // Если в src/router/cards/routes.js заимпорчен этот метот
//   // + в модуле глобально заимпорчен стор, то oidc ломается на вызове метода signinRedirect
//   const scopes = (store?.getters['oidcClient/currentUser']?.scope || '').split(
//     ' '
//   );
//   const difference = _.difference(list, scopes);
//   let isMatched = false;
//   switch (mode) {
//     case ScopesMode.and:
//       isMatched = !difference.length;

//       break;
//     case ScopesMode.or:
//       isMatched = difference.length < list.length;

//       break;
//   }

//   return isMatched;
// }

export default scopes;
