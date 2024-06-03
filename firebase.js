import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore'; // Firestore için ekledik
import 'firebase/compat/storage'; // Storage için ekledik

// Firebase konfigürasyonu
const firebaseConfig = {
};

// Firebase'i başlat
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Auth ve Firestore nesnelerini tanımla
const auth = firebase.auth();
const db = firebase.firestore(); // Firestore nesnesini oluşturduk
const storage = firebase.storage();

const generateRandomName = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomName = '';
  for (let i = 0; i < 20; i++) {
    randomName += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return randomName ;
};

const getUserAnonymousId = async () => {
  try {
    const user = firebase.auth().currentUser;
    if (user) {
      // Kullanıcının belgesini al
      const userDoc = await db.collection('users').doc(user.uid).get();
      if (userDoc.exists) {
        // Belge varsa, anonim kimliği al
        const data = userDoc.data();
        const anonymousId = data.newanonymousid;
        console.log('Kullanıcının anonim kimliği:', anonymousId);
        return anonymousId;
      } else {
        console.error('Kullanıcının belgesi bulunamadı.');
      }
    } else {
      console.error('Kullanıcı oturumu açmamış.');
    }
  } catch (error) {
    console.error('Anonim kimlik alınırken bir hata oluştu: ', error);
  }
}
const saveDailyforConfirm = async (user_id, userdaily, usercity) => {
  try {
    const user= auth.currentUser;
    // Kullanıcının oturum açmış olup olmadığını kontrol et
    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')
    }.${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    if (user) {
      const userid = user_id;
      const userAnonymousId = await getUserAnonymousId(); // getUserAnonymousId fonksiyonunun sonucunu bekleyin
      const daily = userdaily;
      const city = usercity;

      if (userAnonymousId) { // userAnonymousId'nin null veya undefined olmadığından emin olun
        const docRef = db.collection('ConfirmData').doc(); // Belge referansını oluştur
        const docId = docRef.id; // Belge ID'sini al

        await docRef.set({
          docId: docId, // Belge ID'sini belge verilerine ekleyin
          userid: userid,
          userAnonymousId: userAnonymousId,
          daily: daily,
          city: city,
          date: formattedDate, // Tarihi eski formatta kaydet
          confirmed: false,    // adminin kontrolü üzerine gözükebilir olacak
          banned: false        // admin onaylamazsa gösterim olmayacak, onaylanınca 
        },{ merge: true });

        console.log('Günlük başarıyla kaydedildi.');
      } else {
        console.error('Kullanıcının anonim kimliği bulunamadı.');
      }
    } else {
      console.error('Kullanıcı oturumu açmamış.');
    }
  } catch (error) {
    console.error('Günlük kaydedilirken bir hata oluştu: ', error);
  }
}

const createAnonymousid = async () => {
  try {
    // Kullanıcının oturum açmış olup olmadığını kontrol et
    const user = firebase.auth().currentUser;
    if (user) {
      const newanonymousid = generateRandomName();
      // Kullanıcı verilerini belgeye ekle
      await db.collection('users').doc(user.uid).set({
        newanonymousid: newanonymousid,
      },{ merge: true });
      console.log('Yeni Id başarıyla kaydedildi.');
      return newanonymousid;
    } else {
      console.error('Kullanıcı oturumu açmamış.');
    }
  } catch (error) {
    console.error('Yeni Id kaydedilirken bir hata oluştu: ', error);
  }
}

export { auth, db, storage, createAnonymousid, saveDailyforConfirm, getUserAnonymousId };