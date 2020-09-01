import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyD3_y86cNgPL8t7MAYh81rqZBQDcjUSSyI',
  authDomain: 'touch-the-fire-auth.firebaseapp.com',
  databaseURL: 'https://touch-the-fire-auth.firebaseio.com',
  projectId: 'touch-the-fire-auth',
  storageBucket: 'touch-the-fire-auth.appspot.com',
  messagingSenderId: '595560193456',
  appId: '1:595560193456:web:3718b09d84b45319280a75',
};

const fbase = firebase.initializeApp(firebaseConfig);

export default fbase;
