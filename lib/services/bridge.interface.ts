import { SchemaSource } from '../schema-sources/source.interface'

export const BridgeInterface = Symbol('BRIDGE-INTERFACE')

export interface BridgeInterface {
  sync: (from: SchemaSource, to: SchemaSource) => Promise<void>
}

export enum BridgeVerbosity {
  Quiet,
  Verbose,
  Normal
}

export const BridgeConfig = Symbol('BRIDGE-CONFIG')

export interface BridgeConfig {
  destructive: boolean
  verbosity: BridgeVerbosity
}
