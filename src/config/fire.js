import firebase from 'firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyBydGIcpkQZWWRzmVCEpdrb4TlxZHl5hlo',
  authDomain: 'touch-the-fire.firebaseapp.com',
  databaseURL: 'https://touch-the-fire.firebaseio.com',
  projectId: 'touch-the-fire',
  storageBucket: 'touch-the-fire.appspot.com',
  messagingSenderId: '731232144501',
  appId: '1:731232144501:web:c45dddd6bd3b4ac1c7fc3c',
};

const fbase = firebase.initializeApp(firebaseConfig);

export default fbase;
