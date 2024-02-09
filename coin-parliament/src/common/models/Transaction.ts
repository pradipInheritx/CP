import firebase from "firebase/compat/app";
import {WSnap} from "./Snapshot";
import Timestamp = firebase.firestore.Timestamp;
import DocumentReference = firebase.firestore.DocumentReference;

export enum TransactionTypes {

}

export enum StatusTypes {

}

export type TransactionType = {
    typeId: number;
    typeName: string;
}

export type StatusType = {
    typeId: number;
    typeName: string;
}

export type Transaction = {
    transactionType: TransactionTypes;
    time: Timestamp;
    amount: number;
    user: DocumentReference;
    child?: boolean;
    balanceUpdate: number;
    status: StatusTypes;
}

export type TransactionSnap = Transaction & WSnap;