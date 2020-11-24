import { TxnTimestampsStore } from '../handlers/txnTimestamps'

const tnxTimestamps = (s): TxnTimestampsStore => s.txnTimestamps as TxnTimestampsStore

export default {
  tnxTimestamps
}
