import * as admin from 'firebase-admin'

admin.initializeApp()
const firestore = admin.firestore()

export default class Store {
  constructor(private collectionName: string, private key: string) {}

  async read() {
    const snapshot = await firestore.collection(this.collectionName).doc(this.key).get()
    const storedData = snapshot.data()
    return storedData?.result || null
  }

  async write(resultValue: any) {
    await firestore.collection(this.collectionName).doc(this.key).set({ result: resultValue })
  }
}
