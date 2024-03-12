import type { Glue42 } from "@glue42/desktop"
import type { Glue42Web } from "@glue42/web"
import type { Glue42Workspaces } from "@glue42/workspaces-api"

export type GlueWorkspaceWindowT = Glue42Workspaces.WorkspaceWindow

export type GlueApiT =
  | Glue42.Glue
  | Glue42Web.API

export type GlueChannelContextT =
  | Glue42.ChannelContext
  | Glue42Web.Channels.ChannelContext

export type GlueInteropInstanceT =
  | Glue42.Interop.Instance
  | Glue42Web.Interop.Instance  

export type GlueMethodDefinitionT =
  | Glue42.Interop.MethodDefinition
  | Glue42Web.Interop.MethodDefinition

// Streams
export type GlueStreamT =
  | Glue42.Interop.Stream
  | Glue42Web.Interop.Stream

export type GlueStreamOptionsT =
  | Glue42.Interop.StreamOptions
  | Glue42Web.Interop.StreamOptions

export type GlueSubscriptionRequestT =
  | Glue42.Interop.SubscriptionRequest
  | Glue42Web.Interop.SubscriptionRequest

export type GlueStreamSubscriptionT =
  | Glue42.Interop.StreamSubscription
  | Glue42Web.Interop.StreamSubscription
