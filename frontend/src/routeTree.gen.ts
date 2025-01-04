/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as PublicImport } from './routes/_public'
import { Route as ProtectedImport } from './routes/_protected'
import { Route as PublicIndexImport } from './routes/_public/index'
import { Route as VerifyEmailTokenImport } from './routes/verify-email.$token'
import { Route as ProtectedVerifyEmailImport } from './routes/_protected/verify-email'
import { Route as PublicAuthIndexImport } from './routes/_public/auth/index'
import { Route as ProtectedSelectWorkspaceIndexImport } from './routes/_protected/select-workspace/index'
import { Route as PublicAuthLayoutImport } from './routes/_public/auth/_layout'
import { Route as ProtectedWorkspacesWorkspaceIdImport } from './routes/_protected/workspaces/$workspaceId'
import { Route as ProtectedUserSettingsImport } from './routes/_protected/user.settings'
import { Route as ProtectedBoardsBoardIdImport } from './routes/_protected/boards/$boardId'
import { Route as ProtectedWorkspacesWorkspaceIdIndexImport } from './routes/_protected/workspaces/$workspaceId.index'
import { Route as PublicAuthLayoutRegisterImport } from './routes/_public/auth/_layout.register'
import { Route as PublicAuthLayoutLoginImport } from './routes/_public/auth/_layout.login'
import { Route as ProtectedWorkspacesWorkspaceIdSettingsImport } from './routes/_protected/workspaces/$workspaceId.settings'
import { Route as ProtectedWorkspacesWorkspaceIdActivityImport } from './routes/_protected/workspaces/$workspaceId.activity'
import { Route as ProtectedWorkspacesWorkspaceIdSettingsIndexImport } from './routes/_protected/workspaces/$workspaceId.settings.index'
import { Route as ProtectedWorkspacesWorkspaceIdSettingsWorkspaceSettingsImport } from './routes/_protected/workspaces/$workspaceId.settings.workspace-settings'

// Create Virtual Routes

const PublicAuthImport = createFileRoute('/_public/auth')()

// Create/Update Routes

const PublicRoute = PublicImport.update({
  id: '/_public',
  getParentRoute: () => rootRoute,
} as any)

const ProtectedRoute = ProtectedImport.update({
  id: '/_protected',
  getParentRoute: () => rootRoute,
} as any)

const PublicAuthRoute = PublicAuthImport.update({
  id: '/auth',
  path: '/auth',
  getParentRoute: () => PublicRoute,
} as any)

const PublicIndexRoute = PublicIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => PublicRoute,
} as any)

const VerifyEmailTokenRoute = VerifyEmailTokenImport.update({
  id: '/verify-email/$token',
  path: '/verify-email/$token',
  getParentRoute: () => rootRoute,
} as any)

const ProtectedVerifyEmailRoute = ProtectedVerifyEmailImport.update({
  id: '/verify-email',
  path: '/verify-email',
  getParentRoute: () => ProtectedRoute,
} as any)

const PublicAuthIndexRoute = PublicAuthIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => PublicAuthRoute,
} as any)

const ProtectedSelectWorkspaceIndexRoute =
  ProtectedSelectWorkspaceIndexImport.update({
    id: '/select-workspace/',
    path: '/select-workspace/',
    getParentRoute: () => ProtectedRoute,
  } as any)

const PublicAuthLayoutRoute = PublicAuthLayoutImport.update({
  id: '/_layout',
  getParentRoute: () => PublicAuthRoute,
} as any)

const ProtectedWorkspacesWorkspaceIdRoute =
  ProtectedWorkspacesWorkspaceIdImport.update({
    id: '/workspaces/$workspaceId',
    path: '/workspaces/$workspaceId',
    getParentRoute: () => ProtectedRoute,
  } as any)

const ProtectedUserSettingsRoute = ProtectedUserSettingsImport.update({
  id: '/user/settings',
  path: '/user/settings',
  getParentRoute: () => ProtectedRoute,
} as any)

const ProtectedBoardsBoardIdRoute = ProtectedBoardsBoardIdImport.update({
  id: '/boards/$boardId',
  path: '/boards/$boardId',
  getParentRoute: () => ProtectedRoute,
} as any)

const ProtectedWorkspacesWorkspaceIdIndexRoute =
  ProtectedWorkspacesWorkspaceIdIndexImport.update({
    id: '/',
    path: '/',
    getParentRoute: () => ProtectedWorkspacesWorkspaceIdRoute,
  } as any)

const PublicAuthLayoutRegisterRoute = PublicAuthLayoutRegisterImport.update({
  id: '/register',
  path: '/register',
  getParentRoute: () => PublicAuthLayoutRoute,
} as any)

const PublicAuthLayoutLoginRoute = PublicAuthLayoutLoginImport.update({
  id: '/login',
  path: '/login',
  getParentRoute: () => PublicAuthLayoutRoute,
} as any)

const ProtectedWorkspacesWorkspaceIdSettingsRoute =
  ProtectedWorkspacesWorkspaceIdSettingsImport.update({
    id: '/settings',
    path: '/settings',
    getParentRoute: () => ProtectedWorkspacesWorkspaceIdRoute,
  } as any)

const ProtectedWorkspacesWorkspaceIdActivityRoute =
  ProtectedWorkspacesWorkspaceIdActivityImport.update({
    id: '/activity',
    path: '/activity',
    getParentRoute: () => ProtectedWorkspacesWorkspaceIdRoute,
  } as any)

const ProtectedWorkspacesWorkspaceIdSettingsIndexRoute =
  ProtectedWorkspacesWorkspaceIdSettingsIndexImport.update({
    id: '/',
    path: '/',
    getParentRoute: () => ProtectedWorkspacesWorkspaceIdSettingsRoute,
  } as any)

const ProtectedWorkspacesWorkspaceIdSettingsWorkspaceSettingsRoute =
  ProtectedWorkspacesWorkspaceIdSettingsWorkspaceSettingsImport.update({
    id: '/workspace-settings',
    path: '/workspace-settings',
    getParentRoute: () => ProtectedWorkspacesWorkspaceIdSettingsRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_protected': {
      id: '/_protected'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof ProtectedImport
      parentRoute: typeof rootRoute
    }
    '/_public': {
      id: '/_public'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof PublicImport
      parentRoute: typeof rootRoute
    }
    '/_protected/verify-email': {
      id: '/_protected/verify-email'
      path: '/verify-email'
      fullPath: '/verify-email'
      preLoaderRoute: typeof ProtectedVerifyEmailImport
      parentRoute: typeof ProtectedImport
    }
    '/verify-email/$token': {
      id: '/verify-email/$token'
      path: '/verify-email/$token'
      fullPath: '/verify-email/$token'
      preLoaderRoute: typeof VerifyEmailTokenImport
      parentRoute: typeof rootRoute
    }
    '/_public/': {
      id: '/_public/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof PublicIndexImport
      parentRoute: typeof PublicImport
    }
    '/_protected/boards/$boardId': {
      id: '/_protected/boards/$boardId'
      path: '/boards/$boardId'
      fullPath: '/boards/$boardId'
      preLoaderRoute: typeof ProtectedBoardsBoardIdImport
      parentRoute: typeof ProtectedImport
    }
    '/_protected/user/settings': {
      id: '/_protected/user/settings'
      path: '/user/settings'
      fullPath: '/user/settings'
      preLoaderRoute: typeof ProtectedUserSettingsImport
      parentRoute: typeof ProtectedImport
    }
    '/_protected/workspaces/$workspaceId': {
      id: '/_protected/workspaces/$workspaceId'
      path: '/workspaces/$workspaceId'
      fullPath: '/workspaces/$workspaceId'
      preLoaderRoute: typeof ProtectedWorkspacesWorkspaceIdImport
      parentRoute: typeof ProtectedImport
    }
    '/_public/auth': {
      id: '/_public/auth'
      path: '/auth'
      fullPath: '/auth'
      preLoaderRoute: typeof PublicAuthImport
      parentRoute: typeof PublicImport
    }
    '/_public/auth/_layout': {
      id: '/_public/auth/_layout'
      path: '/auth'
      fullPath: '/auth'
      preLoaderRoute: typeof PublicAuthLayoutImport
      parentRoute: typeof PublicAuthRoute
    }
    '/_protected/select-workspace/': {
      id: '/_protected/select-workspace/'
      path: '/select-workspace'
      fullPath: '/select-workspace'
      preLoaderRoute: typeof ProtectedSelectWorkspaceIndexImport
      parentRoute: typeof ProtectedImport
    }
    '/_public/auth/': {
      id: '/_public/auth/'
      path: '/'
      fullPath: '/auth/'
      preLoaderRoute: typeof PublicAuthIndexImport
      parentRoute: typeof PublicAuthImport
    }
    '/_protected/workspaces/$workspaceId/activity': {
      id: '/_protected/workspaces/$workspaceId/activity'
      path: '/activity'
      fullPath: '/workspaces/$workspaceId/activity'
      preLoaderRoute: typeof ProtectedWorkspacesWorkspaceIdActivityImport
      parentRoute: typeof ProtectedWorkspacesWorkspaceIdImport
    }
    '/_protected/workspaces/$workspaceId/settings': {
      id: '/_protected/workspaces/$workspaceId/settings'
      path: '/settings'
      fullPath: '/workspaces/$workspaceId/settings'
      preLoaderRoute: typeof ProtectedWorkspacesWorkspaceIdSettingsImport
      parentRoute: typeof ProtectedWorkspacesWorkspaceIdImport
    }
    '/_public/auth/_layout/login': {
      id: '/_public/auth/_layout/login'
      path: '/login'
      fullPath: '/auth/login'
      preLoaderRoute: typeof PublicAuthLayoutLoginImport
      parentRoute: typeof PublicAuthLayoutImport
    }
    '/_public/auth/_layout/register': {
      id: '/_public/auth/_layout/register'
      path: '/register'
      fullPath: '/auth/register'
      preLoaderRoute: typeof PublicAuthLayoutRegisterImport
      parentRoute: typeof PublicAuthLayoutImport
    }
    '/_protected/workspaces/$workspaceId/': {
      id: '/_protected/workspaces/$workspaceId/'
      path: '/'
      fullPath: '/workspaces/$workspaceId/'
      preLoaderRoute: typeof ProtectedWorkspacesWorkspaceIdIndexImport
      parentRoute: typeof ProtectedWorkspacesWorkspaceIdImport
    }
    '/_protected/workspaces/$workspaceId/settings/workspace-settings': {
      id: '/_protected/workspaces/$workspaceId/settings/workspace-settings'
      path: '/workspace-settings'
      fullPath: '/workspaces/$workspaceId/settings/workspace-settings'
      preLoaderRoute: typeof ProtectedWorkspacesWorkspaceIdSettingsWorkspaceSettingsImport
      parentRoute: typeof ProtectedWorkspacesWorkspaceIdSettingsImport
    }
    '/_protected/workspaces/$workspaceId/settings/': {
      id: '/_protected/workspaces/$workspaceId/settings/'
      path: '/'
      fullPath: '/workspaces/$workspaceId/settings/'
      preLoaderRoute: typeof ProtectedWorkspacesWorkspaceIdSettingsIndexImport
      parentRoute: typeof ProtectedWorkspacesWorkspaceIdSettingsImport
    }
  }
}

// Create and export the route tree

interface ProtectedWorkspacesWorkspaceIdSettingsRouteChildren {
  ProtectedWorkspacesWorkspaceIdSettingsWorkspaceSettingsRoute: typeof ProtectedWorkspacesWorkspaceIdSettingsWorkspaceSettingsRoute
  ProtectedWorkspacesWorkspaceIdSettingsIndexRoute: typeof ProtectedWorkspacesWorkspaceIdSettingsIndexRoute
}

const ProtectedWorkspacesWorkspaceIdSettingsRouteChildren: ProtectedWorkspacesWorkspaceIdSettingsRouteChildren =
  {
    ProtectedWorkspacesWorkspaceIdSettingsWorkspaceSettingsRoute:
      ProtectedWorkspacesWorkspaceIdSettingsWorkspaceSettingsRoute,
    ProtectedWorkspacesWorkspaceIdSettingsIndexRoute:
      ProtectedWorkspacesWorkspaceIdSettingsIndexRoute,
  }

const ProtectedWorkspacesWorkspaceIdSettingsRouteWithChildren =
  ProtectedWorkspacesWorkspaceIdSettingsRoute._addFileChildren(
    ProtectedWorkspacesWorkspaceIdSettingsRouteChildren,
  )

interface ProtectedWorkspacesWorkspaceIdRouteChildren {
  ProtectedWorkspacesWorkspaceIdActivityRoute: typeof ProtectedWorkspacesWorkspaceIdActivityRoute
  ProtectedWorkspacesWorkspaceIdSettingsRoute: typeof ProtectedWorkspacesWorkspaceIdSettingsRouteWithChildren
  ProtectedWorkspacesWorkspaceIdIndexRoute: typeof ProtectedWorkspacesWorkspaceIdIndexRoute
}

const ProtectedWorkspacesWorkspaceIdRouteChildren: ProtectedWorkspacesWorkspaceIdRouteChildren =
  {
    ProtectedWorkspacesWorkspaceIdActivityRoute:
      ProtectedWorkspacesWorkspaceIdActivityRoute,
    ProtectedWorkspacesWorkspaceIdSettingsRoute:
      ProtectedWorkspacesWorkspaceIdSettingsRouteWithChildren,
    ProtectedWorkspacesWorkspaceIdIndexRoute:
      ProtectedWorkspacesWorkspaceIdIndexRoute,
  }

const ProtectedWorkspacesWorkspaceIdRouteWithChildren =
  ProtectedWorkspacesWorkspaceIdRoute._addFileChildren(
    ProtectedWorkspacesWorkspaceIdRouteChildren,
  )

interface ProtectedRouteChildren {
  ProtectedVerifyEmailRoute: typeof ProtectedVerifyEmailRoute
  ProtectedBoardsBoardIdRoute: typeof ProtectedBoardsBoardIdRoute
  ProtectedUserSettingsRoute: typeof ProtectedUserSettingsRoute
  ProtectedWorkspacesWorkspaceIdRoute: typeof ProtectedWorkspacesWorkspaceIdRouteWithChildren
  ProtectedSelectWorkspaceIndexRoute: typeof ProtectedSelectWorkspaceIndexRoute
}

const ProtectedRouteChildren: ProtectedRouteChildren = {
  ProtectedVerifyEmailRoute: ProtectedVerifyEmailRoute,
  ProtectedBoardsBoardIdRoute: ProtectedBoardsBoardIdRoute,
  ProtectedUserSettingsRoute: ProtectedUserSettingsRoute,
  ProtectedWorkspacesWorkspaceIdRoute:
    ProtectedWorkspacesWorkspaceIdRouteWithChildren,
  ProtectedSelectWorkspaceIndexRoute: ProtectedSelectWorkspaceIndexRoute,
}

const ProtectedRouteWithChildren = ProtectedRoute._addFileChildren(
  ProtectedRouteChildren,
)

interface PublicAuthLayoutRouteChildren {
  PublicAuthLayoutLoginRoute: typeof PublicAuthLayoutLoginRoute
  PublicAuthLayoutRegisterRoute: typeof PublicAuthLayoutRegisterRoute
}

const PublicAuthLayoutRouteChildren: PublicAuthLayoutRouteChildren = {
  PublicAuthLayoutLoginRoute: PublicAuthLayoutLoginRoute,
  PublicAuthLayoutRegisterRoute: PublicAuthLayoutRegisterRoute,
}

const PublicAuthLayoutRouteWithChildren =
  PublicAuthLayoutRoute._addFileChildren(PublicAuthLayoutRouteChildren)

interface PublicAuthRouteChildren {
  PublicAuthLayoutRoute: typeof PublicAuthLayoutRouteWithChildren
  PublicAuthIndexRoute: typeof PublicAuthIndexRoute
}

const PublicAuthRouteChildren: PublicAuthRouteChildren = {
  PublicAuthLayoutRoute: PublicAuthLayoutRouteWithChildren,
  PublicAuthIndexRoute: PublicAuthIndexRoute,
}

const PublicAuthRouteWithChildren = PublicAuthRoute._addFileChildren(
  PublicAuthRouteChildren,
)

interface PublicRouteChildren {
  PublicIndexRoute: typeof PublicIndexRoute
  PublicAuthRoute: typeof PublicAuthRouteWithChildren
}

const PublicRouteChildren: PublicRouteChildren = {
  PublicIndexRoute: PublicIndexRoute,
  PublicAuthRoute: PublicAuthRouteWithChildren,
}

const PublicRouteWithChildren =
  PublicRoute._addFileChildren(PublicRouteChildren)

export interface FileRoutesByFullPath {
  '': typeof PublicRouteWithChildren
  '/verify-email': typeof ProtectedVerifyEmailRoute
  '/verify-email/$token': typeof VerifyEmailTokenRoute
  '/': typeof PublicIndexRoute
  '/boards/$boardId': typeof ProtectedBoardsBoardIdRoute
  '/user/settings': typeof ProtectedUserSettingsRoute
  '/workspaces/$workspaceId': typeof ProtectedWorkspacesWorkspaceIdRouteWithChildren
  '/auth': typeof PublicAuthLayoutRouteWithChildren
  '/select-workspace': typeof ProtectedSelectWorkspaceIndexRoute
  '/auth/': typeof PublicAuthIndexRoute
  '/workspaces/$workspaceId/activity': typeof ProtectedWorkspacesWorkspaceIdActivityRoute
  '/workspaces/$workspaceId/settings': typeof ProtectedWorkspacesWorkspaceIdSettingsRouteWithChildren
  '/auth/login': typeof PublicAuthLayoutLoginRoute
  '/auth/register': typeof PublicAuthLayoutRegisterRoute
  '/workspaces/$workspaceId/': typeof ProtectedWorkspacesWorkspaceIdIndexRoute
  '/workspaces/$workspaceId/settings/workspace-settings': typeof ProtectedWorkspacesWorkspaceIdSettingsWorkspaceSettingsRoute
  '/workspaces/$workspaceId/settings/': typeof ProtectedWorkspacesWorkspaceIdSettingsIndexRoute
}

export interface FileRoutesByTo {
  '': typeof ProtectedRouteWithChildren
  '/verify-email': typeof ProtectedVerifyEmailRoute
  '/verify-email/$token': typeof VerifyEmailTokenRoute
  '/': typeof PublicIndexRoute
  '/boards/$boardId': typeof ProtectedBoardsBoardIdRoute
  '/user/settings': typeof ProtectedUserSettingsRoute
  '/auth': typeof PublicAuthIndexRoute
  '/select-workspace': typeof ProtectedSelectWorkspaceIndexRoute
  '/workspaces/$workspaceId/activity': typeof ProtectedWorkspacesWorkspaceIdActivityRoute
  '/auth/login': typeof PublicAuthLayoutLoginRoute
  '/auth/register': typeof PublicAuthLayoutRegisterRoute
  '/workspaces/$workspaceId': typeof ProtectedWorkspacesWorkspaceIdIndexRoute
  '/workspaces/$workspaceId/settings/workspace-settings': typeof ProtectedWorkspacesWorkspaceIdSettingsWorkspaceSettingsRoute
  '/workspaces/$workspaceId/settings': typeof ProtectedWorkspacesWorkspaceIdSettingsIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/_protected': typeof ProtectedRouteWithChildren
  '/_public': typeof PublicRouteWithChildren
  '/_protected/verify-email': typeof ProtectedVerifyEmailRoute
  '/verify-email/$token': typeof VerifyEmailTokenRoute
  '/_public/': typeof PublicIndexRoute
  '/_protected/boards/$boardId': typeof ProtectedBoardsBoardIdRoute
  '/_protected/user/settings': typeof ProtectedUserSettingsRoute
  '/_protected/workspaces/$workspaceId': typeof ProtectedWorkspacesWorkspaceIdRouteWithChildren
  '/_public/auth': typeof PublicAuthRouteWithChildren
  '/_public/auth/_layout': typeof PublicAuthLayoutRouteWithChildren
  '/_protected/select-workspace/': typeof ProtectedSelectWorkspaceIndexRoute
  '/_public/auth/': typeof PublicAuthIndexRoute
  '/_protected/workspaces/$workspaceId/activity': typeof ProtectedWorkspacesWorkspaceIdActivityRoute
  '/_protected/workspaces/$workspaceId/settings': typeof ProtectedWorkspacesWorkspaceIdSettingsRouteWithChildren
  '/_public/auth/_layout/login': typeof PublicAuthLayoutLoginRoute
  '/_public/auth/_layout/register': typeof PublicAuthLayoutRegisterRoute
  '/_protected/workspaces/$workspaceId/': typeof ProtectedWorkspacesWorkspaceIdIndexRoute
  '/_protected/workspaces/$workspaceId/settings/workspace-settings': typeof ProtectedWorkspacesWorkspaceIdSettingsWorkspaceSettingsRoute
  '/_protected/workspaces/$workspaceId/settings/': typeof ProtectedWorkspacesWorkspaceIdSettingsIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | ''
    | '/verify-email'
    | '/verify-email/$token'
    | '/'
    | '/boards/$boardId'
    | '/user/settings'
    | '/workspaces/$workspaceId'
    | '/auth'
    | '/select-workspace'
    | '/auth/'
    | '/workspaces/$workspaceId/activity'
    | '/workspaces/$workspaceId/settings'
    | '/auth/login'
    | '/auth/register'
    | '/workspaces/$workspaceId/'
    | '/workspaces/$workspaceId/settings/workspace-settings'
    | '/workspaces/$workspaceId/settings/'
  fileRoutesByTo: FileRoutesByTo
  to:
    | ''
    | '/verify-email'
    | '/verify-email/$token'
    | '/'
    | '/boards/$boardId'
    | '/user/settings'
    | '/auth'
    | '/select-workspace'
    | '/workspaces/$workspaceId/activity'
    | '/auth/login'
    | '/auth/register'
    | '/workspaces/$workspaceId'
    | '/workspaces/$workspaceId/settings/workspace-settings'
    | '/workspaces/$workspaceId/settings'
  id:
    | '__root__'
    | '/_protected'
    | '/_public'
    | '/_protected/verify-email'
    | '/verify-email/$token'
    | '/_public/'
    | '/_protected/boards/$boardId'
    | '/_protected/user/settings'
    | '/_protected/workspaces/$workspaceId'
    | '/_public/auth'
    | '/_public/auth/_layout'
    | '/_protected/select-workspace/'
    | '/_public/auth/'
    | '/_protected/workspaces/$workspaceId/activity'
    | '/_protected/workspaces/$workspaceId/settings'
    | '/_public/auth/_layout/login'
    | '/_public/auth/_layout/register'
    | '/_protected/workspaces/$workspaceId/'
    | '/_protected/workspaces/$workspaceId/settings/workspace-settings'
    | '/_protected/workspaces/$workspaceId/settings/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  ProtectedRoute: typeof ProtectedRouteWithChildren
  PublicRoute: typeof PublicRouteWithChildren
  VerifyEmailTokenRoute: typeof VerifyEmailTokenRoute
}

const rootRouteChildren: RootRouteChildren = {
  ProtectedRoute: ProtectedRouteWithChildren,
  PublicRoute: PublicRouteWithChildren,
  VerifyEmailTokenRoute: VerifyEmailTokenRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_protected",
        "/_public",
        "/verify-email/$token"
      ]
    },
    "/_protected": {
      "filePath": "_protected.tsx",
      "children": [
        "/_protected/verify-email",
        "/_protected/boards/$boardId",
        "/_protected/user/settings",
        "/_protected/workspaces/$workspaceId",
        "/_protected/select-workspace/"
      ]
    },
    "/_public": {
      "filePath": "_public.tsx",
      "children": [
        "/_public/",
        "/_public/auth"
      ]
    },
    "/_protected/verify-email": {
      "filePath": "_protected/verify-email.tsx",
      "parent": "/_protected"
    },
    "/verify-email/$token": {
      "filePath": "verify-email.$token.tsx"
    },
    "/_public/": {
      "filePath": "_public/index.tsx",
      "parent": "/_public"
    },
    "/_protected/boards/$boardId": {
      "filePath": "_protected/boards/$boardId.tsx",
      "parent": "/_protected"
    },
    "/_protected/user/settings": {
      "filePath": "_protected/user.settings.tsx",
      "parent": "/_protected"
    },
    "/_protected/workspaces/$workspaceId": {
      "filePath": "_protected/workspaces/$workspaceId.tsx",
      "parent": "/_protected",
      "children": [
        "/_protected/workspaces/$workspaceId/activity",
        "/_protected/workspaces/$workspaceId/settings",
        "/_protected/workspaces/$workspaceId/"
      ]
    },
    "/_public/auth": {
      "filePath": "_public/auth",
      "parent": "/_public",
      "children": [
        "/_public/auth/_layout",
        "/_public/auth/"
      ]
    },
    "/_public/auth/_layout": {
      "filePath": "_public/auth/_layout.tsx",
      "parent": "/_public/auth",
      "children": [
        "/_public/auth/_layout/login",
        "/_public/auth/_layout/register"
      ]
    },
    "/_protected/select-workspace/": {
      "filePath": "_protected/select-workspace/index.tsx",
      "parent": "/_protected"
    },
    "/_public/auth/": {
      "filePath": "_public/auth/index.tsx",
      "parent": "/_public/auth"
    },
    "/_protected/workspaces/$workspaceId/activity": {
      "filePath": "_protected/workspaces/$workspaceId.activity.tsx",
      "parent": "/_protected/workspaces/$workspaceId"
    },
    "/_protected/workspaces/$workspaceId/settings": {
      "filePath": "_protected/workspaces/$workspaceId.settings.tsx",
      "parent": "/_protected/workspaces/$workspaceId",
      "children": [
        "/_protected/workspaces/$workspaceId/settings/workspace-settings",
        "/_protected/workspaces/$workspaceId/settings/"
      ]
    },
    "/_public/auth/_layout/login": {
      "filePath": "_public/auth/_layout.login.tsx",
      "parent": "/_public/auth/_layout"
    },
    "/_public/auth/_layout/register": {
      "filePath": "_public/auth/_layout.register.tsx",
      "parent": "/_public/auth/_layout"
    },
    "/_protected/workspaces/$workspaceId/": {
      "filePath": "_protected/workspaces/$workspaceId.index.tsx",
      "parent": "/_protected/workspaces/$workspaceId"
    },
    "/_protected/workspaces/$workspaceId/settings/workspace-settings": {
      "filePath": "_protected/workspaces/$workspaceId.settings.workspace-settings.tsx",
      "parent": "/_protected/workspaces/$workspaceId/settings"
    },
    "/_protected/workspaces/$workspaceId/settings/": {
      "filePath": "_protected/workspaces/$workspaceId.settings.index.tsx",
      "parent": "/_protected/workspaces/$workspaceId/settings"
    }
  }
}
ROUTE_MANIFEST_END */
