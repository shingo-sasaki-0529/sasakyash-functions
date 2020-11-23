import * as admin from 'firebase-admin'

admin.initializeApp()
const db = admin.firestore()

const read = async (collectionName: string, key: string) => {
  const snapshot = await db.collection(collectionName).doc(key).get()
  const storedData = snapshot.data()
  return storedData?.result || null
}

const write = async (collectionName: string, key: string, resultValue: any) => {
  await db.collection(collectionName).doc(key).set({ result: resultValue })
}

export default { read, write }
