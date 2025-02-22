import type { MessageElem, MessageRet, MfaceElem, Quotable } from '@icqqjs/icqq';
import { Gender, GroupRole } from '@icqqjs/icqq/lib/common';
import { AtElem, FaceElem, ImageElem, PttElem, TextElem, VideoElem } from '@icqqjs/icqq/lib/message/elements';

// 全平台支持的 Elem
export type SendableElem = TextElem | FaceElem | ImageElem | AtElem | PttElem | VideoElem | MfaceElem;
export type Sendable = SendableElem | string | (SendableElem | string)[];

export interface QQEntity {
  readonly client: { uin: number };
  readonly dm: boolean;

  getForwardMsg(resid: string, fileName?: string): Promise<ForwardMessage[]>;

  getVideoUrl(fid: string, md5: string | Buffer): Promise<string>;

  recallMsg(seqOrMessageId: number, rand?: number, timeOrPktNum?: number): Promise<boolean>;

  sendMsg(content: Sendable, source?: Quotable): Promise<MessageRet>;

  getFileUrl(fid: string): Promise<string>;
}

export interface QQUser extends QQEntity {
  readonly uid: number;
}

export interface Friend extends QQUser {
  readonly nickname: string;
  readonly remark: string;
}

export interface Group extends QQEntity {
  readonly gid: number;
  readonly name: string;
  readonly is_owner: boolean;
  readonly is_admin: boolean;
  readonly fs: GroupFs;

  pickMember(uid: number, strict?: boolean): GroupMember;

  muteMember(uid: number, duration?: number): Promise<void>;

  setCard(uid: number, card?: string): Promise<boolean>;
}

export interface GroupFs {
  upload(file: string | Buffer | Uint8Array, pid?: string, name?: string, callback?: (percentage: string) => void): Promise<any>;
}

export interface GroupMember extends QQUser {
  renew(): Promise<GroupMemberInfo>;
}

export interface GroupMemberInfo {
  readonly user_id: number;
  readonly card: string;
  readonly nickname: string;
  readonly sex: Gender;
  readonly age: number;
  readonly join_time: number;
  readonly last_sent_time: number;
  readonly role: GroupRole;
  readonly title: string;
}

export interface ForwardMessage {
  user_id: number;
  nickname: string;
  group_id?: number;
  time: number;
  seq: number;
  message: MessageElem[];
  raw_message: string;
}
