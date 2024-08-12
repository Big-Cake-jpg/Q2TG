// 同一个人连续的一组消息，用于合并头像
import { ForwardMessage } from '@icqqjs/icqq';

type SenderGroup = {
  id: number
  username: string
  senderId: number | string
  messages: ForwardMessage[]
  avatar: string
}

export default SenderGroup
