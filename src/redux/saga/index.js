// import {fork, call, take, put} from 'redux-saga'

import {fork, take, put} from 'redux-saga/effects';
import { browserHistory } from 'react-router';

const TRULY = true;

import * as authModule from '../modules/auth';
import * as meModule from '../modules/me';
import * as meUpdateModule from '../modules/containers/MeUpdate';
import * as likeModule from '../modules/models/Like';
import * as paintingDetailModule from '../modules/models/PaintingDetail';
import * as PaintingModule from '../modules/models/Painting';
import * as homeModule from '../modules/containers/Home';
import * as userPaintingModule from '../modules/containers/UserPainting';
import * as tagPaintingModule from '../modules/models/TagDetail';
import * as tagPaintingModuleCon from '../modules/containers/TagDetail';
import * as userModule from '../modules/containers/User';
import * as depositModule from '../modules/containers/Deposit'
import * as getChargeModule from '../modules/models/Deposit';
import * as PaintingUploadModule from '../modules/paintingUpload';

//const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

function* initialApp() {
  yield take(authModule.INITIAL_APP);
  yield put(meModule.load());
}

function* loginSuccess() {
  while (TRULY) {
    const {result} = yield take(authModule.LOGIN_SUCCESS);
    localStorage.setItem('token', result.token);
    yield put(meModule.load());
    browserHistory.push('/me');

  }
}

function* paintingUploadSuccess() {
  while (TRULY) {
    const {result} =yield take(PaintingUploadModule.UPLOAD_SUCCESS);
    console.log('kk',result);
    browserHistory.push('/painting/'+result.id);
  }
}

function* updateAvatar() {
  while (TRULY) {
    yield take(meUpdateModule.UPLOAD_AVATAR_SUCCESS);
    yield put(meModule.load());
  }
}

function* updateMe() {
  while (TRULY) {
    const {result} = yield take( meUpdateModule.UPDATE_SUCCESS);
    yield put(meModule.load());
    browserHistory.push('/me');
  }
}

function* registerSuccess() {
  while (TRULY) {
    const {result} = yield take(authModule.REGISTER_SUCCESS);
    localStorage.setItem('token', result.token);
    yield put(meModule.load());
    browserHistory.push('/me');
  }
}

function* logout() {
  while (TRULY) {
    yield take(authModule.LOGOUT);
    localStorage.removeItem('token');
    yield put({type: authModule.LOGOUT_SUCCESS});
  }
}

function* logoutSuccess() {
  while (TRULY) {
    yield take(authModule.LOGOUT_SUCCESS);
    browserHistory.push('');
  }
}

function* homePageLoaded() {
  while (TRULY) {
    yield take(PaintingModule.LOAD_SUCCESS);
   // yield delay(2000);
    yield put({type: homeModule.GoNextPage});
  }
}

function* depositNextPageLoaded() {
  while (TRULY) {
    yield take(getChargeModule.GET_CHARGE_SUCCESS);
    // yield delay(2000);
    yield put({type: depositModule.GoDepositNextPage});
  }
}

function* depositLastPageLoaded() {
  while (TRULY) {
    const action = yield take(depositModule.GoDepositLastPage);
    // yield delay(2000);
    yield put(getChargeModule.getCharge(action.page-2));
  }
}

function* hotPageLoaded() {
  while (TRULY) {
    yield take(PaintingModule.LOAD_HOT_SUCCESS);
    // yield delay(2000);
    yield put({type: homeModule.GoNextPageHot});
  }
}
function* tagPageLoaded() {
  while (TRULY) {
    yield take([tagPaintingModule.LOAD_TAG_PAINTING_DETAIL_SUCCESS,tagPaintingModule.LOAD_TAG_PAINTING_HOT_DETAIL_SUCCESS]);
    // yield delay(2000);
    yield put({type: tagPaintingModuleCon.GoNextTagPage});
  }
}

function* userPaintingPageLoaded() {
  while (TRULY) {
    yield take([userPaintingModule.LOAD_USER_PAINTING_SUCCESS,userPaintingModule.LOAD_USER_PAINTING_HOT_SUCCESS]);
    // yield delay(2000);
    yield put({type: userPaintingModule.GoNextUserPage});
  }
}

function* getCaptcha() {
  while (TRULY) {
    const {result} = yield take([authModule.LOGIN_FAIL, authModule.REGISTER_FAIL]);
    yield put(authModule.getCaptcha());
  }
}

function* likeSuccess(action) {
  while (TRULY) {
    const paintingId = yield take(likeModule.LIKE_SUCCESS, action.result.id);
    yield put(paintingDetailModule.load(paintingId));
  }
}

function* loadHotUserPaintings(){
  while (TRULY) {
    const action = yield take(userModule.LOAD_USER_SUCCESS);
    yield (action.normalized.result.map( profileId =>
      put(userModule.loadUserPaintingHot(profileId))
    ))
  }
}

export default function* root() {
  yield fork(initialApp);
  yield fork(loginSuccess);
  yield fork(logout);
  yield fork(logoutSuccess);
  yield fork(getCaptcha);
  yield fork(registerSuccess);
  yield fork(homePageLoaded);
  yield fork(updateMe);
  yield fork(hotPageLoaded);
  yield fork(userPaintingPageLoaded);
  yield fork(tagPageLoaded);
  yield fork(loadHotUserPaintings);
  yield fork(depositNextPageLoaded);
  yield fork(depositLastPageLoaded);
  yield fork(paintingUploadSuccess);
  yield fork(updateAvatar);
}
